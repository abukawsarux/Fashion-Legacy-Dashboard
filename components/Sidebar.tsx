"use client";

import React from "react";
import Image from "next/image";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  BarChart3, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  collapsed, 
  setCollapsed 
}: SidebarProps) {
  
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "categories", label: "Categories CRUD", icon: Layers },
    { id: "products", label: "Products CRUD", icon: ShoppingBag },
    { id: "orders", label: "Purchases & Orders", icon: ShoppingCart },
    { id: "analytics", label: "Detailed Analytics", icon: BarChart3 },
    { id: "profile", label: "Admin Profile", icon: User },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-30 h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/20 relative bg-white">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "justify-center w-full" : ""}`}>
          {!collapsed ? (
            <div className="relative h-20 w-48 ">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-8 w-8 relative flex items-center justify-center overflow-hidden rounded-lg bg-transparent p-0">
              <img
                src="/favicon.ico"
                alt="Favicon"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
        
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-6 h-6 w-6 rounded-full bg-brand-primary border border-slate-700 text-white items-center justify-center cursor-pointer hover:bg-brand-primary-hover shadow-md hover:scale-105 transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Decorative Brand Tag */}
      {!collapsed && (
        <div className="m-4 p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-800 flex items-start gap-3 shadow-inner">
          <Sparkles className="text-yellow-500 flex-shrink-0 animate-pulse" size={16} />
          <div className="text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-200">Fashion Legacy</span>
            <br />
            Management System v1.0. Premium Edition.
          </div>
        </div>
      )}

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-center">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs uppercase text-slate-200">
            AD
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">System Manager</p>
              <p className="text-[10px] text-slate-500 truncate">Fashion Legacy</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
