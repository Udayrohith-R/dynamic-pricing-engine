import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PricingDashboard() {
  const [margin, setMargin] = useState(0.20);
  const [cost, setCost] = useState(50);
  const [data, setData] = useState([]);
  const [optimal, setOptimal] = useState({ price: 0, revenue: 0, demand: 0 });

  // Update document title for professional presentation
  useEffect(() => {
    document.title = "Dynamic Pricing Engine";
  }, []);

  // Simulate the demand curve calculation and feasible region mapping
  useEffect(() => {
    const minPrice = cost / (1 - margin);
    const curveData = [];
    let currentBestRev = 0;
    let currentBestPrice = minPrice;
    let currentBestDemand = 0;

    for (let p = 40; p <= 120; p++) {
      const q = Math.max(0, 2000 - (10 * p)); // Mock demand function
      const rev = p * q;
      
      curveData.push({
        price: p,
        revenue: rev,
        demand: q,
        isFeasible: p >= minPrice
      });

      if (p >= minPrice && rev > currentBestRev) {
        currentBestRev = rev;
        currentBestPrice = p;
        currentBestDemand = q;
      }
    }
    
    setData(curveData);
    setOptimal({ price: currentBestPrice, revenue: currentBestRev, demand: currentBestDemand });
  }, [margin, cost]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">PRICING OPTIMIZER</h1>
          <p className="text-gray-500 mt-1">Product: Alpha | Pipeline: Optimization Active</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">Optimization Parameters</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Target Margin: {(margin * 100).toFixed(0)}%</label>
              <input 
                type="range" min="0.05" max="0.60" step="0.05" 
                value={margin} onChange={(e) => setMargin(parseFloat(e.target.value))}
                className="w-full accent-gray-800"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Unit Cost: ${cost}</label>
              <input 
                type="range" min="30" max="80" step="5" 
                value={cost} onChange={(e) => setCost(parseInt(e.target.value))}
                className="w-full accent-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded border">
                <p className="text-xs text-gray-500 uppercase">Optimal Price</p>
                <p className="text-2xl font-bold">${optimal.price.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border">
                <p className="text-xs text-gray-500 uppercase">Max Revenue</p>
                <p className="text-2xl font-bold">${optimal.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">Revenue Curve & Feasible Region</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="price" tickFormatter={(tick) => `$${tick}`} stroke="#9ca3af" />
                  <YAxis yAxisId="left" tickFormatter={(tick) => `$${tick/1000}k`} stroke="#9ca3af" />
                  <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value, name.toUpperCase()]} />
                  
                  {/* The red infeasible region line */}
                  <ReferenceLine x={cost / (1 - margin)} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Min Margin Limit', fill: '#ef4444', fontSize: 12 }} />
                  
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#1f2937" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}