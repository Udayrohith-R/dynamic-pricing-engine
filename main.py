from fastapi import FastAPI
from pydantic import BaseModel
from engine import DynamicPricingEngine

app = FastAPI(title="Dynamic Pricing Engine API")
pricing_engine = DynamicPricingEngine()

class OptimizationRequest(BaseModel):
    unit_cost: float
    target_margin: float
    competitor_price: float = 100.0

@app.post("/api/optimize")
def optimize(request: OptimizationRequest):
    result = pricing_engine.optimize_price(
        unit_cost=request.unit_cost,
        min_margin=request.target_margin,
        current_beta_price=request.competitor_price
    )
    return result