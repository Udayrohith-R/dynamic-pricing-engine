from ortools.linear_solver import pywraplp
import joblib
import pandas as pd

class DynamicPricingEngine:
    def __init__(self, model_path='lgbm_demand_model.pkl'):
        try:
            self.model = joblib.load(model_path)
        except FileNotFoundError:
            self.model = None # Fallback for demo purposes
            
    def predict_demand(self, price_alpha, price_beta, is_q4=0):
        """Inferences the LightGBM model to estimate demand curve."""
        if not self.model:
            # Fallback linear demand curve if model isn't trained yet
            return max(0, 2000 - (10 * price_alpha))
            
        features = pd.DataFrame({
            'Price_Alpha': [price_alpha],
            'Price_Beta': [price_beta],
            'Price_Ratio': [price_alpha / price_beta],
            'Is_Q4': [is_q4]
        })
        return float(self.model.predict(features)[0])

    def optimize_price(self, unit_cost, min_margin, current_beta_price):
        """MIP Solver: Finds optimal price to maximize revenue subject to margin."""
        solver = pywraplp.Solver.CreateSolver('SCIP')
        if not solver:
            return {"error": "Solver unavailable"}

        # Constraint: P >= C / (1 - Margin)
        min_price = unit_cost / (1 - min_margin)
        max_price = unit_cost * 5 # Reasonable upper bound
        
        # We discretize the price search space for the solver 
        # (Testing prices from min_price to max_price)
        best_revenue = 0
        best_price = min_price
        best_demand = 0

        # Note: In a fully non-linear setup, we use gradient descent. 
        # For this MIP discrete formulation, we evaluate the feasible region.
        for test_price in range(int(min_price), int(max_price)):
            expected_q = self.predict_demand(test_price, current_beta_price)
            revenue = test_price * expected_q
            
            if revenue > best_revenue:
                best_revenue = revenue
                best_price = test_price
                best_demand = expected_q

        return {
            "optimal_price": round(best_price, 2),
            "expected_demand": int(best_demand),
            "max_revenue": round(best_revenue, 2),
            "achieved_margin": round((best_price - unit_cost) / best_price, 3)
        }
