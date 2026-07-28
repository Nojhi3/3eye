"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Device } from "@/context/AppContext";
import {
  Cpu,
  Search,
  Plus,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  SlidersHorizontal,
  X,
  Play,
  RotateCcw,
  Sparkles
} from "lucide-react";

export default function DevicesPage() {
  const { devices, addDevice, updateDevice, deleteDevice, toggleDevice, activeHome } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("device_name");
  
  // Add Device Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newCategory, setNewCategory] = useState<Device["category"]>("lighting");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newBattery, setNewBattery] = useState("100");

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newManufacturer || !newLocation) {
      alert("Please fill in all details.");
      return;
    }

    addDevice({
      home_id: activeHome?.id || "home-1",
      device_name: newDeviceName,
      category: newCategory,
      manufacturer: newManufacturer,
      status: "active",
      battery: newCategory === "bridge" || newCategory === "climate" ? -1 : Number(newBattery),
      firmware: "v1.0.0",
      health: 100,
      last_service: new Date().toISOString().split("T")[0],
      location: newLocation,
      warranty_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      age_months: 0
    });

    // Reset Form
    setNewDeviceName("");
    setNewManufacturer("");
    setNewLocation("");
    setNewBattery("100");
    setShowAddModal(false);
  };

  // Filtered & Sorted Devices
  const filteredDevices = devices
    .filter((d) => {
      const matchesSearch = d.device_name.toLowerCase().includes(search.toLowerCase()) ||
        d.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortField === "health") return b.health - a.health;
      if (sortField === "battery") return b.battery - a.battery;
      return a.device_name.localeCompare(b.device_name);
    });

  const getBatteryStyle = (bat: number) => {
    if (bat === -1) return { text: "Wired", color: "text-slate-400 bg-slate-950" };
    if (bat < 20) return { text: `${bat}%`, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    if (bat < 50) return { text: `${bat}%`, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { text: `${bat}%`, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  };

  const getStatusBadge = (status: Device["status"]) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">● Online</span>;
      case "inactive":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2.5 py-0.5 rounded-full">○ Paused</span>;
      case "warning":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">⚠️ Warning</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">■ Offline</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Machinery & Equipment Assets</h2>
            <p className="text-xs text-slate-400 font-medium">
              Manage your plant machinery, review raw material capacities, and calibrate active automation nodes.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" /> Provision Machinery
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search machinery by name, brand, or floor section..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
              {["all", "climate", "security", "lighting", "bridge"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors ${
                    categoryFilter === cat
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {cat === "climate" ? "Processing" : cat === "security" ? "Safety" : cat === "lighting" ? "Assembly" : cat === "bridge" ? "Controller" : "All"}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-[10px] font-bold rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="device_name">Sort: Name</option>
                <option value="health">Sort: Calibration</option>
                <option value="battery">Sort: Material Capacity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Devices List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => {
            const batData = getBatteryStyle(device.battery);

            return (
              <div
                key={device.id}
                className="bg-slate-900/30 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-800 transition-colors"
              >
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-white">{device.device_name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {device.manufacturer} • {device.category === "climate" ? "Processing" : device.category === "security" ? "Safety" : device.category === "lighting" ? "Assembly" : device.category === "bridge" ? "Controller" : device.category}
                      </p>
                    </div>
                    {getStatusBadge(device.status)}
                  </div>

                  {/* Device Specs list */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Floor Zone:</span>
                      <span className="text-slate-300 font-semibold">{device.location}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Calibration Index:</span>
                      <span className={`font-semibold ${device.health > 85 ? "text-emerald-400" : "text-amber-400"}`}>
                        {device.health}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Material Capacity:</span>
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${batData.color}`}>
                        {device.battery === -1 ? "Continuous Feed" : `${device.battery}%`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Firmware Node:</span>
                      <span className="text-slate-400 font-mono text-[10px]">{device.firmware}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-5 border-t border-slate-850 mt-5 flex items-center justify-between">
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                      device.status === "active"
                        ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        : "bg-indigo-600 border-transparent text-white hover:bg-indigo-500"
                    }`}
                  >
                    {device.status === "active" ? "Pause Node" : "Resume Node"}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to decommission this machinery asset?")) {
                        deleteDevice(device.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredDevices.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl">
              <AlertTriangle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">No devices match your filter query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Device Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-white">Provision Machinery Asset</h3>
              <p className="text-[11px] text-slate-400">
                Register a new hardware component to the factory manufacturing floor.
              </p>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Injection Mold Extruder A"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Device["category"])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="lighting">Assembly Line</option>
                    <option value="climate">Processing</option>
                    <option value="security">Safety</option>
                    <option value="sensors">Quality Telemetry</option>
                    <option value="bridge">Integration Controller</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Equipment Brand
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creality or Haas"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Floor Section / Zone
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Line B"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {newCategory !== "bridge" && newCategory !== "climate" && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Initial Material Level (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newBattery}
                    onChange={(e) => setNewBattery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-95"
              >
                Provision Machinery Node
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
