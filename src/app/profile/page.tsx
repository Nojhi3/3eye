"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { User, Home, Bell, Shield, CheckCircle, Save, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const { user, activeHome, updateProfile, updateHome } = useApp();

  // Personal Info Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Home Info Form State
  const [houseType, setHouseType] = useState(activeHome?.house_type || "Single Family");
  const [rooms, setRooms] = useState(activeHome?.rooms || 5);
  const [address, setAddress] = useState(activeHome?.address || "");
  const [city, setCity] = useState(activeHome?.city || "");
  const [state, setState] = useState(activeHome?.state || "");
  const [zipcode, setZipcode] = useState(activeHome?.zipcode || "");

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [maintAlerts, setMaintAlerts] = useState(true);

  // Success notifications
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [homeSuccess, setHomeSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, phone);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleHomeSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeHome) {
      updateHome({
        ...activeHome,
        house_type: houseType,
        rooms: Number(rooms),
        address,
        city,
        state,
        zipcode
      });
      setHomeSuccess(true);
      setTimeout(() => setHomeSuccess(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Profile Details</h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage your personal contact credentials, physical address endpoints, and notifications preferences.
          </p>
        </div>

        {/* Profile Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Col 1: Personal Details */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-indigo-400" />
              Personal Credentials
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              {profileSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Personal credentials updated!
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-95"
              >
                <Save className="h-3.5 w-3.5" /> Save Credentials
              </button>
            </form>
          </div>

          {/* Col 2: Home Information details */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Home className="h-4.5 w-4.5 text-emerald-400" />
              Physical Home Details
            </h3>

            <form onSubmit={handleHomeSave} className="space-y-4">
              {homeSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Physical Home parameters saved!
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    House Type
                  </label>
                  <select
                    value={houseType}
                    onChange={(e) => setHouseType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condominium">Condominium</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Rooms Count
                  </label>
                  <input
                    type="number"
                    required
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Physical Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 1248 Nesting Lane"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-95"
              >
                <Save className="h-3.5 w-3.5" /> Save Address
              </button>
            </form>
          </div>
        </div>

        {/* Lower Row Split: Notifications vs Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Notifications Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-amber-400" />
              Smart Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Email Service Summary</span>
                  <span className="text-[10px] text-slate-500 block">Weekly updates on energy saved, costs shaven, and hub firmware status.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    emailAlerts ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <span className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${
                    emailAlerts ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">SMS Immediate Alerts</span>
                  <span className="text-[10px] text-slate-500 block">Immediate SMS alerts when security nodes or floodlights log intruder warnings.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    smsAlerts ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <span className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${
                    smsAlerts ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">AI Predictor Diagnostics</span>
                  <span className="text-[10px] text-slate-500 block">Receive notification flags 15 days before forecasted hardware battery drops.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintAlerts(!maintAlerts)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    maintAlerts ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <span className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${
                    maintAlerts ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Security details Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-indigo-400" />
              SaaS API & Security Access
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Connected Matter Bridge Token
                </span>
                <div className="flex gap-2">
                  <input
                    type="password"
                    disabled
                    value="********************************"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => alert("Simulated API Token regenerated successfully.")}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                  >
                    Regenerate Token
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Password Rotation
                </span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Password last changed 3 months ago.</span>
                  <button
                    onClick={() => alert("Password reset link dispatched to your verified email.")}
                    className="text-[10px] font-bold text-indigo-400 hover:underline"
                  >
                    Rotate Password
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
