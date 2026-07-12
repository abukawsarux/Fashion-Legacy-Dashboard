"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { 
  Menu, 
  Bell, 
  LogOut, 
  User, 
  ChevronDown
} from "lucide-react";

interface HeaderProps {
  currentView: string;
  toggleMobileMenu: () => void;
}

export default function Header({ currentView, toggleMobileMenu }: HeaderProps) {
  const { 
    adminUser, 
    logout
  } = useDashboard();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const viewTitles: Record<string, string> = {
    overview: "Dashboard Overview",
    products: "Category-wise Products",
    orders: "Purchases & Orders",
    analytics: "Financial & Traffic Analytics",
    profile: "Admin Settings",
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between">
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          {viewTitles[currentView] || "Dashboard"}
        </h1>
      </div>

      {/* Action Utilities */}
      <div className="flex items-center gap-2 md:gap-4">
        


        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
              adminUser.avatar === "avatar_men" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
            }`}>
              {adminUser.name.charAt(0)}
            </div>
            <span className="hidden md:inline text-xs font-bold text-slate-700 pr-1">
              {adminUser.name}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <>
              {/* Overlay Backdrop to close */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileDropdownOpen(false)}
              />
              
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                  <p className="font-bold text-slate-800">{adminUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{adminUser.email}</p>
                </div>
                <button
                  onClick={() => { setProfileDropdownOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
