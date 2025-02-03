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
