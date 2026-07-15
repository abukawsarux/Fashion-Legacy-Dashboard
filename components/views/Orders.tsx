"use client";

import React, { useState } from "react";
import { useDashboard, Order } from "../../context/DashboardContext";
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Mail, 
  DollarSign, 
  Search,
  RefreshCw
} from "lucide-react";

export default function Orders() {
  const { orders, updateOrderStatus } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock className="text-amber-500" size={14} />;
      case "Shipped":
        return <Truck className="text-blue-500" size={14} />;
      case "Delivered":
        return <CheckCircle className="text-emerald-500" size={14} />;
    }
  };

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Shipped":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    }
  };

  // Helper date formatter
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Order stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</div>
            <div className="text-xl font-black text-slate-800 mt-1">{orders.length}</div>
          </div>
          <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600">
            <ShoppingCart size={16} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Pending Review</div>
            <div className="text-xl font-black text-slate-800 mt-1">
              {orders.filter(o => o.status === "Pending").length}
            </div>
          </div>
          <div className="h-9 w-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
            <Clock size={16} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">In Transit</div>
            <div className="text-xl font-black text-slate-800 mt-1">
              {orders.filter(o => o.status === "Shipped").length}
            </div>
          </div>
          <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <Truck size={16} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Fulfillment Completed</div>
            <div className="text-xl font-black text-slate-800 mt-1">
              {orders.filter(o => o.status === "Delivered").length}
            </div>
          </div>
          <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
            <CheckCircle size={16} />
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "Pending"
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("Shipped")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "Shipped"
                ? "bg-blue-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setStatusFilter("Delivered")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "Delivered"
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List Content */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const orderProfit = order.totalUSD - order.costUSD;
            const profitPercent = order.totalUSD > 0 ? ((orderProfit / order.totalUSD) * 100).toFixed(0) : "0";

            return (
              <div 
                key={order.id} 
                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Left: General Order Info & Customer details */}
                <div className="space-y-4 flex-1">
                  {/* Order header tag */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-black text-slate-800 text-sm">{order.id}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{formatDate(order.createdAt)}</span>
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[9px] ${getStatusBadgeClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </div>

                  {/* Customer Information cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Customer */}
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Customer Details</div>
                      <div className="font-bold text-slate-700">{order.customerName}</div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" />
                        <span>{order.customerEmail}</span>
                      </div>
                    </div>
                    {/* Destination Address */}
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Shipping Destination</div>
                      <div className="text-slate-600 flex items-start gap-1">
                        <MapPin size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{order.customerAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-table items list */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-50 px-3.5 py-2 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Purchased Items ({order.items.reduce((a, b) => a + b.quantity, 0)})
                    </div>
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="px-4 py-2.5 flex items-center justify-between gap-4 bg-white">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-700">{item.nameEn}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Size: {item.size} | Color: {item.colorEn}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="font-medium text-slate-500 mr-4">{item.quantity}x</span>
                            <span className="font-bold text-slate-700">৳{item.priceUSD.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Profit Margin & Fulfillment Status Tool */}
                <div className="md:w-60 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-between gap-4">
                  {/* Financial outputs */}
                  <div className="p-4 rounded-xl bg-[#D4A017]/5 border border-[#D4A017]/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Total Revenue:</span>
                      <span className="font-bold text-slate-800">৳{order.totalUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Cost Price (Buy):</span>
                      <span className="font-semibold text-slate-600">৳{order.costUSD.toFixed(2)}</span>
                    </div>
                    <hr className="border-slate-200/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-700 uppercase">Gross profit:</span>
                      <div className="text-right">
                        <div className="font-black text-sm text-emerald-600">৳{orderProfit.toFixed(2)}</div>
                        <div className="text-[9px] font-bold text-slate-400">Margin: {profitPercent}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Change fulfillment status tool */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Update Order Status</label>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(order.id, "Pending")}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-wider uppercase border transition-colors cursor-pointer text-center ${
                          order.status === "Pending"
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "Shipped")}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-wider uppercase border transition-colors cursor-pointer text-center ${
                          order.status === "Shipped"
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Ship
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "Delivered")}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-wider uppercase border transition-colors cursor-pointer text-center ${
                          order.status === "Delivered"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Deliver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 font-medium text-xs">
            No orders found matching the filter criteria. Try changing filters or simulate a new order.
          </div>
        )}
      </div>
    </div>
  );
}
