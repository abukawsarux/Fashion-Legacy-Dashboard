"use client";

import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  PieChart, 
  Activity,
  Calendar
} from "lucide-react";

export default function Analytics() {
  const { orders, trafficData, products, categories } = useDashboard();
  const [activeChart, setActiveChart] = useState<"financial" | "traffic">("financial");

  // Financial calculations
  const totalSales = orders.reduce((acc, order) => acc + order.totalUSD, 0);
  const totalCost = orders.reduce((acc, order) => acc + order.costUSD, 0);
  const netProfit = totalSales - totalCost;
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
  const conversionRate = trafficData.reduce((acc, d) => acc + d.visitors, 0) > 0 
    ? (trafficData.reduce((acc, d) => acc + d.conversions, 0) / trafficData.reduce((acc, d) => acc + d.visitors, 0)) * 100 
    : 0;

  // Compute category distributions
  const categorySales: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      // Find item category
      const prod = products.find(p => p.id === item.productId);
      const categories = Array.isArray(prod?.category) ? prod.category : (prod?.category ? [prod.category] : ["other"]);
      categories.forEach(catId => {
        categorySales[catId] = (categorySales[catId] || 0) + (item.priceUSD * item.quantity);
      });
    });
  });

  const categoryProfit: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const prod = products.find(p => p.id === item.productId);
      const categories = Array.isArray(prod?.category) ? prod.category : (prod?.category ? [prod.category] : ["other"]);
      const cost = (prod?.costUSD || 0) * item.quantity;
      const sales = item.priceUSD * item.quantity;
      categories.forEach(catId => {
        categoryProfit[catId] = (categoryProfit[catId] || 0) + (sales - cost);
      });
    });
  });

  // SVG dimensions
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  // Chart plotting helper for Financial graph
  // We'll plot Sales vs Cost vs Profit over the last updates (simulated dates or transaction indices)
  // Let's create dummy historical timeline points from the orders list to look realistic
  const timelinePoints = orders.slice().reverse().map((o, idx) => {
    return {
      label: o.id.split("-")[1] || `T-${orders.length - idx}`,
      sales: o.totalUSD,
      cost: o.costUSD,
      profit: o.totalUSD - o.costUSD
    };
  });

  // If there are no orders, create fallback points
  const displayTimeline = timelinePoints.length >= 3 ? timelinePoints : [
    { label: "ORD-001", sales: 50, cost: 20, profit: 30 },
    { label: "ORD-002", sales: 120, cost: 50, profit: 70 },
    { label: "ORD-003", sales: 85, cost: 40, profit: 45 },
    { label: "ORD-004", sales: 180, cost: 80, profit: 100 },
  ];

  const maxVal = Math.max(...displayTimeline.map(t => Math.max(t.sales, t.cost)), 100);

  // Compute Coordinates for SVG Financial
  const getCoordinates = (val: number, idx: number, total: number) => {
    const x = paddingX + (idx * (width - paddingX * 2)) / (total - 1);
    const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
    return { x, y };
  };

  const salesPoints = displayTimeline.map((t, idx) => getCoordinates(t.sales, idx, displayTimeline.length));
  const costPoints = displayTimeline.map((t, idx) => getCoordinates(t.cost, idx, displayTimeline.length));
  const profitPoints = displayTimeline.map((t, idx) => getCoordinates(t.profit, idx, displayTimeline.length));

  const makePath = (coords: {x: number, y: number}[]) => {
    return coords.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  };

  // Plotting Traffic details
  const maxTrafficVal = Math.max(...trafficData.map(d => d.visitors), 1);
  const trafficPointsCoords = trafficData.map((d, idx) => {
    const x = paddingX + (idx * (width - paddingX * 2)) / (trafficData.length - 1);
    const y = height - paddingY - (d.visitors / maxTrafficVal) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  return (
    <div className="space-y-6">
      {/* KPI summaries row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Order Value</span>
          <div className="text-2xl font-black text-slate-800">৳{avgOrderValue.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-semibold">Total of {orders.length} transactions</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
          <div className="text-2xl font-black text-slate-800">{conversionRate.toFixed(2)}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp size={10} />
            <span>Target benchmark: 2.5%</span>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cost of Goods Sold (COGS)</span>
          <div className="text-2xl font-black text-slate-800">৳{totalCost.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-semibold">Acquisition / Buy value of items</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Revenue Earnings</span>
          <div className="text-2xl font-black text-[#D4A017]">৳{netProfit.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Net margin: {totalSales > 0 ? ((netProfit/totalSales)*100).toFixed(0) : 0}%</div>
        </div>
      </div>

      {/* Main detailed graph card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Toggle headers */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Timeline Analytics Graph</h3>
            <p className="text-[10px] text-slate-400">Interactive SVG render of shop growth performance</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveChart("financial")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChart === "financial" ? "bg-white text-[#D4A017] shadow-sm" : "text-slate-600"
              }`}
            >
              Financial (Buy vs Sell vs Profit)
            </button>
            <button
              onClick={() => setActiveChart("traffic")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChart === "traffic" ? "bg-white text-[#D4A017] shadow-sm" : "text-slate-600"
              }`}
            >
              User Traffic (Weekly Visitors)
            </button>
          </div>
        </div>

        {/* Dynamic SVG Graphs */}
        <div className="relative w-full overflow-hidden flex items-center justify-center p-2 bg-slate-50 border border-slate-100 rounded-2xl">
          {activeChart === "financial" ? (
            <div className="w-full">
              {/* Legend indicators */}
              <div className="flex gap-4 justify-end mb-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-slate-800" />
                  <span>Selling Price (Revenue)</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span>Buying Price (Cost)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>Net Profit</span>
                </span>
              </div>
              
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto overflow-visible"
              >
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const yVal = paddingY + ratio * (height - paddingY * 2);
                  const displayValue = (maxVal - ratio * maxVal).toFixed(0);
                  return (
                    <g key={idx}>
                      <line x1={paddingX} y1={yVal} x2={width - paddingX} y2={yVal} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
                      <text x={10} y={yVal + 3} fill="#94a3b8" fontSize="8" fontWeight="bold">৳{displayValue}</text>
                    </g>
                  );
                })}

                {/* Sales path */}
                <path d={makePath(salesPoints)} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                {/* Cost path */}
                <path d={makePath(costPoints)} fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3" />
                {/* Profit path */}
                <path d={makePath(profitPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                {/* Draw dot markers */}
                {salesPoints.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="3.5" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
                    <circle cx={costPoints[i].x} cy={costPoints[i].y} r="3.5" fill="#94a3b8" stroke="#fff" strokeWidth="1.5" />
                    <circle cx={profitPoints[i].x} cy={profitPoints[i].y} r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                    {/* Order labels */}
                    <text x={p.x - 10} y={height - 10} fill="#94a3b8" fontSize="8" fontWeight="bold">
                      {displayTimeline[i].label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex gap-4 justify-end mb-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  <span>Daily Visitors</span>
                </span>
              </div>

              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto overflow-visible"
              >
                {/* Area Gradient */}
                <defs>
                  <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const yVal = paddingY + ratio * (height - paddingY * 2);
                  const displayValue = Math.round(maxTrafficVal - ratio * maxTrafficVal);
                  return (
                    <g key={idx}>
                      <line x1={paddingX} y1={yVal} x2={width - paddingX} y2={yVal} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
                      <text x={10} y={yVal + 3} fill="#94a3b8" fontSize="8" fontWeight="bold">{displayValue}</text>
                    </g>
                  );
                })}

                {/* Area path */}
                <path 
                  d={`${makePath(trafficPointsCoords)} L ${trafficPointsCoords[trafficPointsCoords.length - 1].x} ${height - paddingY} L ${trafficPointsCoords[0].x} ${height - paddingY} Z`} 
                  fill="url(#indigoGradient)" 
                />
                
                {/* Line path */}
                <path d={makePath(trafficPointsCoords)} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />

                {trafficPointsCoords.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                    <text x={p.x - 10} y={height - 10} fill="#94a3b8" fontSize="8" fontWeight="bold">
                      {p.date}
                    </text>
                    <text x={p.x - 8} y={p.y - 10} fill="#4f46e5" fontSize="8" fontWeight="black">
                      {p.visitors}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Category Performance split charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Revenue Contribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Category Sales Revenue Performance</h4>
            <p className="text-[10px] text-slate-400">Total gross receipts generated per collection category</p>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat) => {
              const sales = categorySales[cat.id] || 0;
              const percent = totalSales > 0 ? (sales / totalSales) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.nameEn} ({cat.nameBn})</span>
                    <div className="flex gap-2">
                      <span className="font-bold text-slate-800">৳{sales.toFixed(2)}</span>
                      <span className="text-slate-400 font-bold">({percent.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Net Profit contribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Category Net Profit Margins</h4>
            <p className="text-[10px] text-slate-400">Actual profit yields (Selling Price minus Buying Price) per category</p>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat) => {
              const profit = categoryProfit[cat.id] || 0;
              const percent = netProfit > 0 ? (profit / netProfit) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.nameEn}</span>
                    <div className="flex gap-2">
                      <span className="font-bold text-emerald-600">৳{profit.toFixed(2)}</span>
                      <span className="text-slate-400 font-bold">({percent.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
