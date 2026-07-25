"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Device } from "@/context/AppContext";
import {
  TrendingUp,
  Cpu,
  Calendar,
  Wrench,
  Sparkles,
  ArrowRight,
  Battery,
  AlertTriangle,
  Play,
  Zap,
  Activity,
  Plus,
  HelpCircle,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Settings
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function HomeownerDashboard() {
  const {
    user,
    devices,
    appointments,
    aiReports,
    generateAIReport,
    automationScore,
    securityScore,
    efficiencyScore,
    energySavedKwh,
    energySavedCost,
    packages,
    purchasePackage,
    maintenanceLogs
  } = useApp();

  // Energy Optimizer Inputs
  const [bill, setBill] = useState("180");
  const [appliances, setAppliances] = useState("12");
  const [usage, setUsage] = useState("6");
  const [optimizationLoading, setOptimizationLoading] = useState(false);

  // Active AI Report (default to first or seeded report)
  const activeReport = aiReports.find(r => r.user_id === user?.id) || aiReports[0];

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    setOptimizationLoading(true);
    setTimeout(() => {
      generateAIReport(Number(bill), Number(appliances), Number(usage));
      setOptimizationLoading(false);
    }, 800);
  };

  // Safe device filters for current user home
  const userDevices = devices;
  const warningDevices = userDevices.filter(d => d.status === "warning" || (d.battery > 0 && d.battery < 25));
  const activeApts = appointments.filter(a => a.status === "scheduled" || a.status === "in-progress");

  // Chart Data Mapper
  const chartData = activeReport?.energy_prediction.chartData || [
    { month: "Jan", before: 180, after: 130 },
    { month: "Feb", before: 165, after: 120 },
    { month: "Mar", before: 150, after: 110 },
    { month: "Apr", before: 140, after: 100 },
    { month: "May", before: 195, after: 140 },
    { month: "Jun", before: 240, after: 175 }
  ];

  return (
    <DashboardLayout>
      {/* Header section with summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome home, {user?.name || "Homeowner"}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Your smart home network is active. Energy efficiency is currently optimized.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3.5 py-2 rounded-xl">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span>SmartNest Engine: Active</span>
        </div>
      </div>

      {/* Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Energy Saved */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-800 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
            <Zap className="h-16 w-16" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Energy Savings
          </span>
          <div className="flex items-baseline gap-1.5 mb-1 text-white">
            <span className="text-3xl font-extrabold">${energySavedCost}</span>
            <span className="text-xs font-semibold text-slate-500">Saved</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {energySavedKwh} kWh conserved
          </p>
        </div>

        {/* Metric 2: Devices Connected */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-800 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
            <Cpu className="h-16 w-16" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Devices Installed
          </span>
          <div className="flex items-baseline gap-1.5 mb-1 text-white">
            <span className="text-3xl font-extrabold">{userDevices.length}</span>
            <span className="text-xs font-semibold text-slate-500">Active Nodes</span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            {userDevices.filter(d => d.status === "active").length} online • {userDevices.filter(d => d.status === "offline").length} offline
          </p>
        </div>

        {/* Metric 3: Upcoming Setup */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-800 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
            <Calendar className="h-16 w-16" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Appointments
          </span>
          <div className="flex items-baseline gap-1.5 mb-1 text-white">
            <span className="text-3xl font-extrabold">{activeApts.length}</span>
            <span className="text-xs font-semibold text-slate-500">Pending Setup</span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold truncate">
            {activeApts.length > 0
              ? `Next: ${activeApts[0].appointment_date}`
              : "No upcoming visits"}
          </p>
        </div>

        {/* Metric 4: Health Alerts */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-800 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
            <Wrench className="h-16 w-16" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Maintenance Alerts
          </span>
          <div className="flex items-baseline gap-1.5 mb-1 text-white">
            <span className={`text-3xl font-extrabold ${warningDevices.length > 0 ? "text-amber-500" : "text-white"}`}>
              {warningDevices.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Attention Needed</span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            {warningDevices.length > 0
              ? `${warningDevices[0].device_name} battery low`
              : "All hardware is healthy"}
          </p>
        </div>
      </div>

      {/* Main Row: Energy Optimizer vs charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Interactive AI Energy Optimizer */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
              <Zap className="h-3 w-3" />
              AI Simulation
            </span>
            <h3 className="text-base font-extrabold text-white">Energy Optimizer</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Input your utility metrics. SmartNest AI calculates potential seasonal adjustments and payback durations.
            </p>
          </div>

          <form onSubmit={handleOptimize} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Monthly Utility Cost ($)
              </label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Number of Heavy Appliances
              </label>
              <input
                type="number"
                value={appliances}
                onChange={(e) => setAppliances(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Avg. Daily Active Hours / Appliance
              </label>
              <input
                type="number"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={optimizationLoading}
              className="w-full flex items-center justify-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
            >
              {optimizationLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Optimize Utility Load"
              )}
            </button>
          </form>

          {/* AI Metrics Outputs */}
          {activeReport && (
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                  Est. Annual Saved
                </span>
                <span className="text-base font-extrabold text-emerald-400">
                  ${activeReport.energy_prediction.annualSavings}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                  Payback Period
                </span>
                <span className="text-base font-extrabold text-white">
                  {activeReport.energy_prediction.paybackYears} Years
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col (2 spans): Recharts Graph */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">Savings Projection</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of energy expenditure before and after AI automation.
              </p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Before</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Optimized</span>
            </div>
          </div>

          <div className="flex-1 min-h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barBefore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#312e81" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="barAfter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#064e3b" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "11px", color: "#f8fafc" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Bar dataKey="before" fill="url(#barBefore)" radius={[4, 4, 0, 0]} name="Before Automation ($)" />
                <Bar dataKey="after" fill="url(#barAfter)" radius={[4, 4, 0, 0]} name="Optimized Nest ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Predictions Warnings Cards & Rec Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recs & Predictions List (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Predictive Maintenance Alerts */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
              AI Predictive Maintenance warnings
            </h3>

            {activeReport?.maintenance_prediction.length > 0 ? (
              <div className="space-y-3">
                {activeReport.maintenance_prediction.map((pred) => (
                  <div
                    key={pred.deviceId}
                    className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{pred.deviceName}</span>
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          {pred.failureProbability}% Failure Risk
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {pred.reason} <span className="text-indigo-400 font-semibold">{pred.recommendation}</span>
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        Predicted failure date: {pred.predictedFailureDate}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        purchasePackage("starter"); // Mock action to trigger technician schedule
                        alert("Technician dispatched! An appointment has been scheduled for battery replacement.");
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                    >
                      Dispatch Technician
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-950/40 border border-dashed border-slate-850 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-medium">All connected smart appliances are reporting healthy statuses.</p>
              </div>
            )}
          </div>

          {/* AI Recommendation Engine Cards */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
              AI Recommendation Engine
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Recommended Package</span>
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">88% Match</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Premium Automation Suite</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Selected for your 5-room family home to secure structural entrypoints (lock/doorbell) and establish climate optimization schedules.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-900/60 mt-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">$1,299</span>
                  <button
                    onClick={() => {
                      purchasePackage("premium");
                      alert("Premium package ordered successfully! Check appointments for scheduled installation.");
                    }}
                    className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    Deploy Setup <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Efficiency Upgrade</span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">94% Savings Match</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Luxury Haven Upgrade</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Selected to add whole-home energy metering and biometric locks, reducing cooling leaks during Texas summer peak rates.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-900/60 mt-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">$2,999</span>
                  <button
                    onClick={() => {
                      purchasePackage("luxury");
                      alert("Luxury package ordered successfully! Check appointments for scheduled installation.");
                    }}
                    className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    Deploy Setup <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Side Column: AI Scores & Recent Activity */}
        <div className="space-y-6">
          {/* AI Scores Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-extrabold text-white">AI Automation Scores</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Automation Score</span>
                  <span className="text-indigo-400">{automationScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${automationScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Security Score</span>
                  <span className="text-emerald-400">{securityScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${securityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Efficiency Score</span>
                  <span className="text-amber-400">{efficiencyScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${efficiencyScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-4 flex-1">
            <h3 className="text-base font-extrabold text-white">Recent Activity</h3>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
              <div className="flex gap-3 items-start relative pl-6">
                <span className="absolute left-0.5 top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-950" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Premium Package Purchased</p>
                  <p className="text-[10px] text-slate-500">Order #ord-1 dispatched and delivered.</p>
                </div>
              </div>

              {maintenanceLogs.length > 0 && (
                <div className="flex gap-3 items-start relative pl-6">
                  <span className="absolute left-0.5 top-1.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-slate-950" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">Device Maintenance Completed</p>
                    <p className="text-[10px] text-slate-500">Yale Assure Lock serviced by Alex Smith.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 items-start relative pl-6">
                <span className="absolute left-0.5 top-1.5 h-3 w-3 rounded-full border-2 border-amber-500 bg-slate-950" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Yale Deadbolt Battery Warning</p>
                  <p className="text-[10px] text-slate-500">Battery capacity dropped under 15% threshold.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
