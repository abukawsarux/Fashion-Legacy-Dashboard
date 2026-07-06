"use client";

import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Calendar,
  LogOut,
  CheckCircle,
  Database,
  History
} from "lucide-react";

export default function Profile() {
  const { adminUser, updateAdminProfile, logout, recentLogs } = useDashboard();
  const [name, setName] = useState(adminUser.name);
  const [email, setEmail] = useState(adminUser.email);
  const [avatar, setAvatar] = useState(adminUser.avatar);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(name, email, avatar);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Profile Display & Signout */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="space-y-4 w-full">
            {/* Avatar block */}
            <div className={`h-24 w-24 rounded-full mx-auto flex items-center justify-center font-black text-3xl uppercase border-4 border-slate-100 ${
              avatar === "avatar_men" 
                ? "bg-blue-50 text-blue-600 border-blue-200" 
                : "bg-pink-50 text-pink-600 border-pink-200"
            }`}>
              {name.charAt(0)}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-black text-slate-800 text-lg">{name}</h3>
              <p className="text-xs text-brand-primary font-bold">{adminUser.role}</p>
            </div>
            
            {/* System Info Cards */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Email Address:</span>
                <span className="text-slate-600 font-semibold">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Access Authority:</span>
                <span className="text-slate-600 font-semibold">Root Level Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Last Login Session:</span>
                <span className="text-slate-500 font-medium truncate max-w-[120px]" title={adminUser.lastLogin}>
                  {new Date(adminUser.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-6 w-full py-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-xs font-bold text-red-600 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Middle Card: Edit Profile Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1">Update Administrator Credentials</h4>
          <p className="text-[10px] text-slate-400 mb-6">Modify details for system authorization labels</p>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <User size={11} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Mail size={11} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Avatar Select */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Select Profile Theme</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAvatar("avatar_men")}
                  className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    avatar === "avatar_men"
                      ? "border-blue-500 bg-blue-50/50 text-blue-600 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Blue Palette
                </button>
                <button
                  type="button"
                  onClick={() => setAvatar("avatar_women")}
                  className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    avatar === "avatar_women"
                      ? "border-pink-500 bg-pink-50/50 text-pink-600 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Pink Palette
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#740108] hover:bg-[#5c0006] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security & Action Audit Logs list */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <History size={16} className="text-slate-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">Security & Operational Logs</h4>
            <p className="text-[10px] text-slate-400">Chronological list of system operations performed by admin</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {recentLogs.length > 0 ? (
            recentLogs.map((log, idx) => {
              const date = new Date(log.timestamp);
              const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              
              const isCrud = log.action.toLowerCase().includes("product");
              const isOrder = log.action.toLowerCase().includes("order");
              const isSecurity = log.action.toLowerCase().includes("auth") || log.action.toLowerCase().includes("login");

              return (
                <div key={idx} className="flex justify-between items-start gap-4 text-xs py-1 border-b border-slate-50 last:border-0">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                      isCrud ? "bg-amber-500" :
                      isOrder ? "bg-emerald-500" :
                      isSecurity ? "bg-indigo-500" :
                      "bg-slate-400"
                    }`} />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 block leading-tight">{log.action}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">{log.details}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold flex-shrink-0 text-right leading-relaxed">
                    {dateStr}
                    <br />
                    {timeStr}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-slate-400 text-center py-4 font-semibold">No operational logs recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
