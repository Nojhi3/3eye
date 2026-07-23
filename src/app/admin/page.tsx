"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, User, Appointment, Package } from "@/context/AppContext";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
  Package as PkgIcon,
  DollarSign,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const {
    user: adminUser,
    appointments,
    technicians,
    packages,
    orders,
    updateAppointmentStatus,
    rescheduleAppointment
  } = useApp();

  // Admin Mock Database state
  const [usersDb, setUsersDb] = useState<User[]>([
    { id: "user-1", name: "John Doe", email: "homeowner@smartnest.ai", role: "homeowner", phone: "+1 (512) 555-0100", created_at: "2026-02-01" },
    { id: "tech-1", name: "Alex Smith", email: "tech1@smartnest.ai", role: "technician", phone: "+1 (512) 555-0192", created_at: "2026-01-10" },
    { id: "tech-2", name: "Jordan Brooks", email: "tech2@smartnest.ai", role: "technician", phone: "+1 (512) 555-0143", created_at: "2026-03-22" },
    { id: "tech-3", name: "Elena Rostova", email: "tech3@smartnest.ai", role: "technician", phone: "+1 (512) 555-0177", created_at: "2025-05-18" },
    { id: "user-admin", name: "Sarah Jenkins", email: "admin@smartnest.ai", role: "admin", phone: "+1 (512) 555-0901", created_at: "2026-01-01" }
  ]);

  const [activeTab, setActiveTab] = useState<"users" | "packages" | "appointments">("users");

  // Package prices state
  const [prices, setPrices] = useState<Record<string, number>>({
    starter: 499,
    premium: 1299,
    luxury: 2999
  });

  const handlePriceUpdate = (pkgId: string, newPrice: number) => {
    setPrices((prev) => ({ ...prev, [pkgId]: newPrice }));
    alert(`Price updated successfully for package ID: ${pkgId}`);
  };

  const handleRoleUpdate = (userId: string, newRole: User["role"]) => {
    setUsersDb((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    alert(`Role updated to ${newRole}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Delete this user persona from system?")) {
      setUsersDb((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => (o.payment_status === "paid" ? sum + o.amount : sum), 0);
  const adminReports = [
    { month: "Jan", revenue: 4500, appointments: 12 },
    { month: "Feb", revenue: 5800, appointments: 15 },
    { month: "Mar", revenue: 7200, appointments: 18 },
    { month: "Apr", revenue: 6400, appointments: 16 },
    { month: "May", revenue: 8900, appointments: 22 },
    { month: "Jun", revenue: 10400, appointments: 26 },
    { month: "Jul", revenue: 12800, appointments: 32 }
  ];

  return (
    <DashboardLayout>
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Console</h2>
          <p className="text-xs text-slate-400 font-medium">
            Review service analytics, manage user roles, edit package prices, and assign technician jobs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="h-4 w-4" />
          <span>Operator Mode: Sarah Jenkins</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* KPI 1 */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Revenue
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 flex items-baseline">
            <DollarSign className="h-5 w-5 shrink-0 self-center" />
            <span>{totalRevenue + 12800}</span>
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Include legacy seeds</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Registered Users
          </span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {usersDb.length}
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">5 active personas</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Technicians
          </span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-400">
            {technicians.length}
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">3 dispatch-ready nodes</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Install Orders
          </span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {orders.length}
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">100% payout checkouts</span>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending visits
          </span>
          <div className="mt-2 text-2xl font-extrabold text-amber-500">
            {appointments.filter(a => a.status === "scheduled" || a.status === "in-progress").length}
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Needs staffing checks</span>
        </div>
      </div>

      {/* Recharts Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col space-y-4">
          <h3 className="text-sm font-extrabold text-white">Revenue Growth ($)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col space-y-4">
          <h3 className="text-sm font-extrabold text-white">Monthly Setup Audits</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px" }} />
                <Bar dataKey="appointments" fill="#6366f1" radius={[4, 4, 0, 0]} name="Scheduled Installations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabbed Suite: User Manager vs Package Manager vs Job Assigner */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
        <div className="flex border-b border-slate-800">
          {(["users", "packages", "appointments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-[2px] ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "users"
                ? "User Manager"
                : tab === "packages"
                ? "Packages & Inventory"
                : "Appointment Log"}
            </button>
          ))}
        </div>

        {/* Tab 1: Users Manager */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {usersDb.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.phone}</td>
                    <td className="py-3.5 px-4 capitalize">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleUpdate(u.id, e.target.value as User["role"])}
                        className="bg-slate-950 border border-slate-850 text-[10px] font-bold rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none"
                      >
                        <option value="homeowner">Homeowner</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{u.created_at}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === adminUser?.id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Package Inventory Price modifier */}
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-white">{pkg.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">SKU ID: {pkg.id}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Price Setting ($)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={prices[pkg.id]}
                      onChange={(e) =>
                        setPrices((prev) => ({ ...prev, [pkg.id]: Number(e.target.value) }))
                      }
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handlePriceUpdate(pkg.id, prices[pkg.id])}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-all shadow-sm active:scale-95"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                    Package Inventory levels
                  </span>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Active Hub Stock:</span>
                    <span className="text-emerald-400">22 Units</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Appointments Technician Assigner */}
        {activeTab === "appointments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service Details</th>
                  <th className="py-3 px-4">Assigned Tech</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4 text-right">Job Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{apt.user_name}</td>
                    <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">{apt.description}</td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-400">
                      {apt.technician_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{apt.appointment_date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as Appointment["status"])}
                        className="bg-slate-950 border border-slate-850 text-[10px] font-bold rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
