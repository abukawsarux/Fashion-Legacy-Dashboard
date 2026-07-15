"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Overview from "./views/Overview";
import Products from "./views/Products";
import Categories from "./views/Categories";
import Orders from "./views/Orders";
import Analytics from "./views/Analytics";
import Profile from "./views/Profile";
import Image from "next/image";
import { Lock, Eye, EyeOff, ShieldCheck, Key, CheckCircle, Info, X } from "lucide-react";

export default function Layout() {
  const { 
    isAuthenticated, 
    login, 
    loginError, 
    notification, 
    clearNotification 
  } = useDashboard();
  const [currentView, setCurrentView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Login Lock Screen states
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Auto clear notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(password);
  };

  // Render active component
  const renderActiveView = () => {
    switch (currentView) {
      case "overview":
        return <Overview setCurrentView={setCurrentView} />;
      case "categories":
        return <Categories />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      default:
        return <Overview setCurrentView={setCurrentView} />;
    }
  };

  // 1. RENDER AUTHENTICATION WALL (If not logged in)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Absolute design backdrops */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-[#D4A017]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Brand header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative h-12 w-48 mb-2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                priority
                sizes="192px"
                className="object-contain"
              />
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Lock size={18} className="text-red-600 animate-pulse" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Management Portal Lock
            </h2>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Access restricted to authorized personnel. Please verify password credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Portal Password</label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system access pin..."
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl text-xs outline-none focus:border-brand-primary transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl animate-shake">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#D4A017] hover:bg-[#5c0006] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/10 hover:scale-[1.01] transition-all cursor-pointer"
            >
              Authenticate Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. RENDER MAIN AUTHENTICATED DASHBOARD PORTAL
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Panel Navigation */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        className="hidden md:flex"
      />

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative z-50 flex">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={(view) => {
                setCurrentView(view);
                setMobileMenuOpen(false);
              }}
              collapsed={false}
              setCollapsed={() => {}}
              className="flex"
            />
          </div>
        </div>
      )}

      {/* Main View Area Container */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top Navigation Utilities Header */}
        <Header 
          currentView={currentView} 
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />

        {/* View Component Workspace */}
        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-500">
          {renderActiveView()}
        </main>
      </div>

      {/* Real-time Order Purchase Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex gap-3">
            <div className="mt-0.5">
              {notification.type === "success" ? (
                <CheckCircle size={18} className="text-green-400 animate-bounce" />
              ) : (
                <Info size={18} className="text-blue-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200">
                {notification.type === "success" ? "System Event: Order Triggered" : "System Notification"}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={clearNotification}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
