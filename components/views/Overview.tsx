"use client";

import React from "react";
import { useDashboard } from "../../context/DashboardContext";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  ShoppingCart,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";

export default function Overview({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  const { products, orders, trafficData } = useDashboard();

  // Financial Summaries
  const totalSales = orders.reduce((acc, order) => acc + order.totalUSD, 0);
  const totalCost = orders.reduce((acc, order) => acc + order.costUSD, 0);
  const netProfit = totalSales - totalCost;
  
  // Total Traffic Summary
  const totalTraffic = trafficData.reduce((acc, data) => acc + data.visitors, 0);

  // Profit Margin calculation
  const profitMarginPercent = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : "0";

  // SVG Chart Dimensions & Computations
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 10;
  
  // Plotting points for the mini SVG area chart of traffic visitors
  const maxVisitors = Math.max(...trafficData.map(d => d.visitors), 1);
  const points = trafficData.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (trafficData.length - 1);
    const y = chartHeight - padding - ((d.visitors / maxVisitors) * (chartHeight - padding * 2));
    return { x, y, label: d.date, visitors: d.visitors };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const fillD = pathD ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` : "";

  return (
    <div className="space-y-6">


      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Income</span>
            <h3 className="text-2xl font-black text-slate-800">৳{totalSales.toFixed(2)}</h3>
            <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
              <TrendingUp size={10} />
              <span>Includes simulated orders</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-primary">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Net Profit (Buying vs selling price calculations) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit</span>
            <h3 className="text-2xl font-black text-slate-800">৳{netProfit.toFixed(2)}</h3>
            <p className="text-[10px] text-slate-500 font-semibold">
              Margin: <span className="text-brand-primary font-bold">{profitMarginPercent}%</span> (Sell - Buy Cost)
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Traffic Count */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traffic Visitors</span>
            <h3 className="text-2xl font-black text-slate-800">{totalTraffic}</h3>
            <p className="text-[10px] text-indigo-600 flex items-center gap-1 font-semibold">
              <Users size={10} />
              <span>Page views: {trafficData.reduce((a, b) => a + b.pageViews, 0)}</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users size={20} />
          </div>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Inventory</span>
            <h3 className="text-2xl font-black text-slate-800">{products.length} Items</h3>
            <p className="text-[10px] text-amber-600 font-semibold">
              Stock: {products.reduce((acc, p) => acc + p.stock, 0)} units available
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {/* Graphs & Analytics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mini Traffic Graph Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Weekly Traffic Trend</h4>
              <p className="text-[10px] text-slate-400">Total daily visitors timeline (last 7 updates)</p>
            </div>
            <button
              onClick={() => setCurrentView("analytics")}
              className="text-xs text-brand-primary hover:text-brand-primary-hover font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Detailed view</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* SVG Line Graph */}
          <div className="w-full h-32 relative overflow-hidden flex items-center">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Gradient background fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#740108" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#740108" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1={chartHeight - padding} x2={chartWidth} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1" />

              {/* Area path */}
              {fillD && <path d={fillD} fill="url(#areaGradient)" />}

              {/* Line path */}
              {pathD && <path d={pathD} fill="none" stroke="#740108" strokeWidth="2.5" strokeLinecap="round" />}

              {/* Dot points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    fill="#ffffff" 
                    stroke="#740108" 
                    strokeWidth="2" 
                    className="transition-all hover:r-6 cursor-pointer"
                  />
                  {/* Tooltip text for last element or on hover (mocked simply here) */}
                  {idx === points.length - 1 && (
                    <text 
                      x={p.x - 20} 
                      y={p.y - 12} 
                      fill="#740108" 
                      fontSize="9" 
                      fontWeight="bold"
                    >
                      {p.visitors} visitors
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
          
          {/* X Axis Dates */}
          <div className="flex justify-between mt-3 px-1 text-[9px] text-slate-400 font-bold border-t border-slate-100 pt-2">
            {trafficData.map((d, idx) => (
              <span key={idx}>{d.date}</span>
            ))}
          </div>
        </div>

        {/* Quick Simulated Product Stock Level Alerts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">Inventory Level Check</h4>
            <p className="text-[10px] text-slate-400 mb-4">Stock alert statuses of listing collections</p>
            
            <div className="space-y-3.5">
              {products.slice(0, 4).map((p) => {
                const stockPercent = Math.min(100, Math.max(0, (p.stock / 100) * 100));
                let stockColor = "bg-emerald-500";
                let textClass = "text-emerald-600 bg-emerald-50";
                
                if (p.stock <= 15) {
                  stockColor = "bg-red-500 animate-pulse";
                  textClass = "text-red-600 bg-red-50 animate-pulse";
                } else if (p.stock <= 40) {
                  stockColor = "bg-amber-500";
                  textClass = "text-amber-600 bg-amber-50";
                }

                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]">{p.nameEn}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${textClass}`}>
                        {p.stock} left
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${stockColor}`} style={{ width: `${stockPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={() => setCurrentView("products")}
            className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Manage Inventory</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* Recent Purchases List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Recent Customer Purchases</h4>
            <p className="text-[10px] text-slate-400">Latest online simulated product acquisitions</p>
          </div>
          <button
            onClick={() => setCurrentView("orders")}
            className="text-xs text-brand-primary hover:text-brand-primary-hover font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View all transactions</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">OrderID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Purchased</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Sell Price</th>
                <th className="py-3 px-4">Profit</th>
                <th className="py-3 px-4 text-center">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => {
                const orderItem = order.items[0];
                // Profit calculation
                const orderProfit = order.totalUSD - order.costUSD;
                const profitPercent = order.totalUSD > 0 ? ((orderProfit / order.totalUSD) * 100).toFixed(0) : "0";

                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{order.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400">{order.customerAddress.split(",")[0]}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      <span className="font-medium text-slate-700">{orderItem ? orderItem.nameEn : "N/A"}</span>
                      {order.items.length > 1 && <span className="text-[10px] text-slate-400 block">+ {order.items.length - 1} other items</span>}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-500">
                      ৳{order.costUSD.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ৳{order.totalUSD.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-600">৳{orderProfit.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-400 ml-1">({profitPercent}%)</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] inline-block ${
                        order.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        order.status === "Shipped" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
