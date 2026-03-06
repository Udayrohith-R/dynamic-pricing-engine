import pandas as pd
import numpy as np
import lightgbm as lgb
import joblib

def generate_synthetic_data(days=365):
    """Generates baseline data with seasonality and cross-price elasticity."""
    np.random.seed(42)
    dates = pd.date_range(start='2024-01-01', periods=days)
    
    # Base inputs
    price_alpha = np.random.normal(70, 5, days)  
    price_beta = np.random.normal(100, 8, days)  
    seasonality = np.where(dates.month >= 10, 1.5, 1.0) # Q4 bump
    
    # Demand formulation with cannibalization (Alpha demand drops if Beta price drops)
    demand_alpha = (500 * seasonality) - (3.5 * price_alpha) + (1.2 * price_beta)
    
    df = pd.DataFrame({
        'Date': dates,
        'Price_Alpha': np.round(price_alpha, 2), 
        'Price_Beta': np.round(price_beta, 2), 
        'Demand_Alpha': np.maximum(0, demand_alpha + np.random.normal(0, 20, days)).astype(int),
    })
    return df

def train_demand_model():
    """Trains a LightGBM regressor to predict demand."""
    print("Generating data and engineering features...")
    df = generate_synthetic_data()
    
    # Feature Engineering
    df['Price_Ratio'] = df['Price_Alpha'] / df['Price_Beta']
    df['Month'] = df['Date'].dt.month
    df['Is_Q4'] = df['Month'].isin([10, 11, 12]).astype(int)
    
    features = ['Price_Alpha', 'Price_Beta', 'Price_Ratio', 'Is_Q4']
    X = df[features]
    y = df['Demand_Alpha']
    
    print("Training LightGBM Regressor...")
    model = lgb.LGBMRegressor(n_estimators=100, learning_rate=0.05, random_state=42)
    model.fit(X, y)
    
    # Save model for the FastAPI backend to use
    joblib.dump(model, 'lgbm_demand_model.pkl')
    print("Model saved to lgbm_demand_model.pkl")

if __name__ == "__main__":
    train_demand_model()
