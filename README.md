# Seismic Data Analysis & Regression Model Comparison

## Page Live At : https://dox6174.github.io/KritiMartianCore57/

# Data Simulation and Classification

## Overview
This project processes and classifies shadow and non-shadow regions from simulated seismic data. The dataset is obtained from the [IRIS Syngine Data Simulation](https://ds.iris.edu/ds/products/syngine/).

## Developers

Pratyush Kumar Swain : [Github](https://github.com/Pratyush439), [LinkedIn](https://www.linkedin.com/in/pratyush-kumar-swain-2313482a5/) <br/>
Sanidhya Srivastava : [Github](https://github.com/diffused-orbital), [LinkedIn](https://www.linkedin.com/in/sanidhya-srivastava-a991a2210/) <br/>
Vijay Kumar : [Github](https://github.com/vijay-kumar-79), [LinkedIn](https://www.linkedin.com/in/gvijaykumar79/)



## Data Preparation
The dataset consists of the following columns:

```
['Time', 'displacement1', 'displacement2', 'displacement3',
 'Class', 'dom_freq1', 'dom_freq2', 'dom_freq3', 'rms1', 'rms2', 'rms3',
 'max1', 'min1', 'range1', 'mean1', 'max2', 'min2', 'range2', 'mean2',
 'max3', 'min3', 'range3', 'mean3']
```

The following scalers are applied to prepare the data:
- `MinMaxScaler`
- `StandardScaler`
- `MaxAbsScaler`
- `RobustScaler`
- `QuantileTransformer`

## Installation
Ensure you have Python installed along with the required libraries.

```sh
pip install numpy pandas scikit-learn
```

## Usage
Run the Python script to process and classify the data:

```sh
python classify_shadow.py
```

## Expected Output
The program predicts and classifies shadow and non-shadow regions from the simulated data based on the preprocessed features.


## Dataset Information
The dataset contains four columns representing geophysical properties:

| *Column Number* | *Description* |
|------------------|----------------|
| *Column 1* | *Core Radius (km)* (Target Variable) |
| *Column 2* | *P-wave Velocity (km/s)* |
| *Column 3* | *S-wave Velocity (km/s)* |
| *Column 4* | *Density (g/cm³)* |

## Algorithm Used
The *Linear Regression* algorithm is used to predict the *Core Radius* using *P-wave velocity, S-wave velocity, and Density* as input features.

## Data Preprocessing
- The *input features* and *target variable* have been *scaled* using the StandardScaler function from scikit-learn.
- *Standardization* ensures that the *mean of the dataset is 0* and the *standard deviation is 1*, improving model performance.

## Model Performance
Applying *Linear Regression* to the dataset results in:
- *Very low Mean Squared Error (MSE)*
- *R² score close to 1* (indicating high accuracy)

## Model Comparison
The *Linear Regression model* has been compared with three other regression models:
1. *Support Vector Regression (SVR)*
2. *Decision Tree Regression*
3. *Polynomial Regression (Degree 3)*

*Key Finding:*  
The *Linear Regression model* produces the most accurate results, outperforming the other models.

## Installation
To run the notebook, install the necessary dependencies:

```bash
pip install numpy pandas scikit-learn jupyter
jupyter notebook Module_7.ipynb
```


## Input
The program requires a zip folder as input. The zip folder should consist of .SAC (Seismic Analysis Code) files in either of the following forms:

- MXE
- MXN

Ensure that the correct file type is provided depending on the program requirements.

## Running the Code
1. Open the file on any of the following platforms:
   - [Kaggle](https://www.kaggle.com/)
   - [Jupyter Notebook](https://jupyter.org/)
   - [Google Colab](https://colab.research.google.com/)

2. Execute each cell sequentially by pressing Shift + Enter or using the platform-specific run option.

## Output
The program generates a plot highlighting the anomalies in the data.

---

*Note:* For optimal performance, ensure that all required dependencies are installed and up-to-date on your platform of choice.
