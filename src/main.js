// Import necessary modules from Three.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import marsquakeData from "./assets/data.json";

// Three.js Setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.pointerEvents = "auto"; // Enable pointer events

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 12); // Set initial camera position

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Smooth rotation
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

// Restrict zooming
controls.minDistance = 5.1; // Prevent zooming too close
controls.maxDistance = 25; // Prevent zooming too far

// Mars Sphere setup
const textureLoader = new THREE.TextureLoader();
import marsImage from "./assets/mars.jpg"; // Ensure this path is correct
const marsTexture = textureLoader.load(marsImage, undefined, undefined, (error) => {
    console.error("Error loading Mars texture:", error);
});
const marsGeometry = new THREE.SphereGeometry(5, 64, 64);
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Add Skybox (Cube Texture for Stars)
const cubeTextureLoader = new THREE.CubeTextureLoader();
import sky_px from "./assets/stars_px.png"; // Ensure these paths are correct
const skybox = cubeTextureLoader.load([
    sky_px,
    new URL("./assets/stars_nx.png", import.meta.url).href,
    new URL("./assets/stars_py.png", import.meta.url).href,
    new URL("./assets/stars_ny.png", import.meta.url).href,
    new URL("./assets/stars_pz.png", import.meta.url).href,
    new URL("./assets/stars_nz.png", import.meta.url).href
], undefined, undefined, (error) => {
    console.error("Error loading skybox textures:", error);
});
scene.background = skybox; // Set the skybox as the scene background

// Convert Latitude and Longitude to 3D Coordinates
function latLonToXYZ(latitude, longitude, radius) {
    const latRad = THREE.MathUtils.degToRad(latitude);
    const lonRad = THREE.MathUtils.degToRad(longitude);

    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.cos(latRad) * Math.sin(lonRad);
    const z = radius * Math.sin(latRad);

    return new THREE.Vector3(x, z, y);
}

// Function to determine color based on magnitude
function getColorByMagnitude(magnitude) {
    if (magnitude < 3.0) return 0x00FF00; // Green
    if (magnitude >= 3.0 && magnitude <= 5.0) return 0xFFFF00; // Yellow
    return 0xFF0000; // Red
}

let marker; // Store reference to the marker

// Function to add a marker on Mars
function addMarker(latitude, longitude, magnitude) {
    // Remove the previous marker if it exists
    if (marker) mars.remove(marker);

    // Convert latitude and longitude to 3D coordinates
    const position = latLonToXYZ(latitude, longitude, 5); // Radius of Mars is 5 units
    const color = getColorByMagnitude(magnitude); // Determine color based on magnitude

    // Create a small circular marker
    const markerGeometry = new THREE.CircleGeometry(0.1, 32); // Small circle
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: color, // Set color based on magnitude
        side: THREE.DoubleSide, // Render both sides
        transparent: true,
        opacity: 1.0, // Fully visible
    });

    marker = new THREE.Mesh(markerGeometry, markerMaterial);

    // Get normal vector from Mars center to this point
    const normal = position.clone().normalize();

    // Offset marker slightly above the surface to avoid blending with the patch
    const markerOffset = normal.clone().multiplyScalar(0.02); // Small lift above the patch
    marker.position.set(position.x + markerOffset.x,
        position.y + markerOffset.y,
        position.z + markerOffset.z);

    // Rotate the marker to align with the Mars surface
    marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

    // Add the marker to Mars
    mars.add(marker);
}

// Array to store active wave animations
const activeWaves = [];
let lastPatch = null; // Store reference to the last patch

// Function to create a quake wave
let activeWaveInterval = null; // To track the wave generation loop

function createQuakeWave(latitude, longitude, magnitude) {
    // Clear previous waves
    if (activeWaveInterval) {
        clearInterval(activeWaveInterval);
        activeWaves.forEach(wave => mars.remove(wave.mesh));
        activeWaves.length = 0; // Reset waves array
    }

    const position = latLonToXYZ(latitude, longitude, 5);
    const color = getColorByMagnitude(magnitude);

    function generateWave() {
        const waveGeometry = new THREE.RingGeometry(0.5, 0.55, 70);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.set(position.x, position.y, position.z);
        wave.lookAt(new THREE.Vector3(0, 0, 0));
        mars.add(wave);

        activeWaves.push({
            mesh: wave,
            scale: 0.3, // Adjusted initial scale
            opacity: 0.8,
            maxScale: 10,
        });
    }

    // Generate waves every 1 second (adjust timing if needed)
    activeWaveInterval = setInterval(generateWave, 1000); // Slower wave generation
}

// Function to animate waves
function animateWaves() {
    for (let i = activeWaves.length - 1; i >= 0; i--) {
        const wave = activeWaves[i];

        // Expand the wave
        wave.scale += 0.01; // Slower expansion
        wave.mesh.scale.set(wave.scale, wave.scale, wave.scale);

        // Reduce opacity
        wave.opacity -= 0.0025; // Slower fading
        wave.mesh.material.opacity = wave.opacity;

        // Remove wave when fully faded
        if (wave.opacity <= 0) {
            mars.remove(wave.mesh);
            activeWaves.splice(i, 1);
        }
    }
}

// Populate Dropdown Menu
let dropdown = document.querySelectorAll(".quake-dropdown");

// Function to move the camera to focus on the marker
function moveCameraTo(targetPosition) {
    const startPosition = camera.position.clone();
    const endPosition = targetPosition.clone().multiplyScalar(2.5); // Move the camera farther away
    let progress = 0;

    function animateCamera() {
        progress += 0.01; // Reduce the increment to slow down the animation
        if (progress > 1) progress = 1;

        // Easing function (easeOutCubic)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const interpolatedPosition = new THREE.Vector3().lerpVectors(startPosition, endPosition, easedProgress);
        camera.position.copy(interpolatedPosition);

        camera.lookAt(targetPosition);

        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();
}

// Handle Dropdown Selection
dropdown.forEach((menu, dropdownIndex) => {
    menu.addEventListener("change", (event) => {
        const selectedIndex = event.target.value;
        if (selectedIndex !== "") {
            const selectedQuake = marsquakeData[selectedIndex];
            const markerPosition = latLonToXYZ(selectedQuake.latitude, selectedQuake.longitude, 5);

            // Reset Mars rotation
            mars.rotation.set(0, 0, 0);

            // Add marker
            addMarker(selectedQuake.latitude, selectedQuake.longitude, selectedQuake.magnitude);

            // Start continuous wave generation
            createQuakeWave(selectedQuake.latitude, selectedQuake.longitude, selectedQuake.magnitude);

            // Create circular patch
            const patchRadius = 1;
            createCircularPatch(selectedQuake.latitude, selectedQuake.longitude, patchRadius);

            // Move camera to focus on the marker
            moveCameraTo(markerPosition);

            // Display quake information
            const quakeInfoDiv = document.getElementById("quake-info");
            quakeInfoDiv.innerHTML = `
                <strong>Name: ${selectedQuake.name}</strong><br>
                <p>Latitude: ${selectedQuake.latitude}</p>
                <p>Longitude: ${selectedQuake.longitude}</p>
                <p>Magnitude: ${(selectedQuake.magnitude != "") ? selectedQuake.magnitude : "Not Available"}</p>
                <p>Depth: ${(selectedQuake.depth != "") ? selectedQuake.depth + "km" : "Not Available"}
            `;
            quakeInfoDiv.style.display = "block";

            // Reset all other dropdowns
            dropdown.forEach((otherDropdown, otherIndex) => {
                if (otherIndex !== dropdownIndex) {
                    otherDropdown.selectedIndex = 0;
                }
            });
        }
    });
});

// No Animation Loop
// Flag to control Mars rotation
let isRotating = false;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Mars only if the flag is true
    if (isRotating) {
        mars.rotation.y += 0.001; // Rotate Mars
    }

    controls.update(); // Update OrbitControls
    animateWaves(); // Animate quake waves
    renderer.render(scene, camera); // Render the Scene
}
animate();

// Enable rotation when user interacts with OrbitControls
controls.addEventListener("start", () => {
    isRotating = true; // Start rotating Mars
});

controls.addEventListener("end", () => {
    isRotating = false; // Stop rotating Mars
});

// Handle Window Resize
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Function to create a circular patch on Mars
function createCircularPatch(latitude, longitude, radius) {
    // Remove the previous patch if it exists
    if (lastPatch) {
        mars.remove(lastPatch);
    }

    // Convert latitude and longitude to 3D coordinates
    const markerPosition = latLonToXYZ(latitude, longitude, 5); // Get marker position

    // Compute the opposite position (invert across origin)
    const patchPosition = markerPosition.clone().negate(); // Flip x, y, z

    // Create a circle geometry
    const circleGeometry = new THREE.CircleGeometry(radius, 64); // Radius and segments
    const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Red color for the patch
        side: THREE.DoubleSide, // Render both sides of the circle
        transparent: true,
        opacity: 0.5, // Semi-transparent
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    // Position the circle exactly opposite to the marker
    circle.position.set(patchPosition.x, patchPosition.y, patchPosition.z);

    // Rotate the patch to align with Mars' surface
    const normal = patchPosition.clone().normalize(); // Get normal vector
    circle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

    // Add the circle to Mars
    mars.add(circle);

    lastPatch = circle; // Store reference to the patch

    return circle; // Return the patch for further manipulation
}

// Smooth zoom function
function smoothZoom(targetDistance) {
    let startDistance = camera.position.length(); // Get current camera distance
    let progress = 0;

    function animateZoom() {
        progress += 0.05; // Adjust speed of zooming
        if (progress > 1) progress = 1;

        let easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out effect
        let newDistance = THREE.MathUtils.lerp(startDistance, targetDistance, easedProgress); // Smooth transition

        camera.position.setLength(newDistance); // Apply new zoom level

        if (progress < 1) {
            requestAnimationFrame(animateZoom);
        }
    }

    animateZoom();
}

// Zoom-in and Zoom-out controls
document.getElementById("zoom-in").addEventListener("click", () => {
    let zoomFactor = 0.9; // Scale factor for zoom-in
    let newDistance = camera.position.length() * zoomFactor;

    if (newDistance > controls.minDistance) {
        smoothZoom(newDistance);
    }
});

document.getElementById("zoom-out").addEventListener("click", () => {
    let zoomFactor = 1.1; // Scale factor for zoom-out
    let newDistance = camera.position.length() * zoomFactor;

    if (newDistance < controls.maxDistance) {
        smoothZoom(newDistance);
    }
});

// Function to smoothly align Mars back to its original rotation
function alignMarsSmoothly() {
    let startRotation = mars.rotation.clone(); // Current rotation
    let targetRotation = new THREE.Quaternion().identity(); // Default rotation (no rotation)
    let progress = 0;

    function animateAlignment() {
        progress += 0.05; // Adjust speed of alignment
        if (progress > 1) progress = 1;

        mars.quaternion.slerp(targetRotation, progress); // Smoothly interpolate rotation

        if (progress < 1) {
            requestAnimationFrame(animateAlignment);
        }
    }

    animateAlignment();
}

// Align button event listener
document.getElementById("align-mars").addEventListener("click", () => {
    alignMarsSmoothly();
});

// Function to mark all points from data.json
function markAllPoints() {
    marsquakeData.forEach((quake) => {
        const position = latLonToXYZ(quake.latitude, quake.longitude, 5); // Radius of Mars is 5 units
        const color = getColorByMagnitude(quake.magnitude); // Determine color based on magnitude

        // Create a small circular marker
        const markerGeometry = new THREE.CircleGeometry(0.1, 32); // Small circle
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: color, // Set color based on magnitude
            side: THREE.DoubleSide, // Render both sides
            transparent: true,
            opacity: 1.0, // Fully visible
        });

        const marker = new THREE.Mesh(markerGeometry, markerMaterial);

        // Get normal vector from Mars center to this point
        const normal = position.clone().normalize();

        // Offset marker slightly above the surface to avoid blending with the patch
        const markerOffset = normal.clone().multiplyScalar(0.02); // Small lift above the patch
        marker.position.set(position.x + markerOffset.x,
            position.y + markerOffset.y,
            position.z + markerOffset.z);

        // Rotate the marker to align with the Mars surface
        marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

        // Add the marker to Mars
        mars.add(marker);
    });
}

// Call the function to mark all points when the scene is initialized
// markAllPoints();

// Media queries
function myFunction(x) {
    if (x.matches) { // If media query matches
        marsquakeData.forEach((quake, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = quake.name;
            dropdown[0].appendChild(option);
        });
        camera.position.set(0, 0, 16);
    } else {
        marsquakeData.forEach((quake, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = quake.name;
            // dropdown.appendChild(option);
            if (quake.name[6] === "9") {
                dropdown[0].appendChild(option);
            }
            else if (quake.name[6] === "0") {
                dropdown[1].appendChild(option);
            }
            else if (quake.name[6] === "1") {
                dropdown[2].appendChild(option);
            }
            else if (quake.name[6] === "2") {
                dropdown[3].appendChild(option);
            }
        });
    }
}

// Create a MediaQueryList object
var x = window.matchMedia("(max-width: 1400px)")

// Call listener function at run time
myFunction(x);

// Attach listener function on state changes
x.addEventListener("change", function () {
    myFunction(x);
});