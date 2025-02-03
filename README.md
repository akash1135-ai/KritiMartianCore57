# Seismic Data Analysis & Regression Model Comparison

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
