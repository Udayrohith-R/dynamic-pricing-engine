# 📈 Dynamic Pricing & Demand Forecasting Engine

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a67d.svg)
![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)
![LightGBM](https://img.shields.io/badge/LightGBM-4.0+-orange.svg)
![OR-Tools](https://img.shields.io/badge/OR--Tools-9.7+-blue.svg)

## 📌 Overview
An end-to-end AI system that bridges the gap between predictive machine learning and prescriptive mathematical optimization. This project functions as an intelligent pricing agent that forecasts product demand and mathematically optimizes price points to maximize total revenue while strictly adhering to business margin constraints.

This repository demonstrates a complete, production-ready pipeline combining time-series forecasting, mixed-integer programming (MIP), and a full-stack web application for interactive scenario testing.

## 🏗️ System Architecture
The architecture is divided into three core layers:

1. **The Predictive Layer (LightGBM):** Ingests historical sales data, engineering temporal features and cross-price elasticity metrics to predict future demand ($Q$). It specifically accounts for product cannibalization effects across different SKUs.
2. **The Prescriptive Layer (Google OR-Tools):** Acts as the constraint solver. It takes the predicted demand curves and formulates a Mixed-Integer Programming (MIP) model to maximize the objective function $\sum(P_i \times Q_i)$ subject to $\frac{P_i - C_i}{P_i} \ge \text{Target Margin}$.
3. **The Application Layer (FastAPI + React):** A decoupled frontend and backend that allows business stakeholders to interact with the underlying models, visualize the "Feasible Region" of pricing, and perform manual override scenario testing.

## 🚀 Key Features
* **Cannibalization-Aware Forecasting:** Time-series feature engineering that maps the substitution effects between competing product lines.
* **Margin-Constrained Optimization:** Guaranteed adherence to financial rules using deterministic solvers, preventing the ML model from suggesting unprofitable growth.
* **Interactive Scenario Testing:** A React dashboard featuring dynamic sliders to adjust target margins and unit costs in real-time.
* **Agentic API Design:** A cleanly abstracted FastAPI backend that orchestrates the data flow between the ML models and the frontend UI.
* **Observability Ready:** Designed with MLflow integration points to track Mean Absolute Percentage Error (MAPE) against real-world metrics.

## 💻 Tech Stack
* **Machine Learning & Math:** `LightGBM`, `pandas`, `numpy`, `google-ortools`
* **Backend API:** `FastAPI`, `uvicorn`, `pydantic`
* **Frontend:** `React`, `Recharts`, `Tailwind CSS`

## 📂 Project Structure
```text
dynamic-pricing-engine/
│
├── backend/
│   ├── main.py              # FastAPI application routing
│   ├── engine.py            # Core DynamicPricingEngine class (LightGBM + OR-Tools)
│   ├── model_training.py    # Script to engineer features and train LightGBM
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component & Dashboard UI
│   │   ├── components/      # Recharts visualizers
│   │   └── api.js           # Axios/Fetch calls to FastAPI
│   └── package.json
│
└── data/
    └── historical_sales.csv # Synthetic dataset with Q4 seasonality & cannibalization
