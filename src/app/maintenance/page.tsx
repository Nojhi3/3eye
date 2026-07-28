"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Activity,
  FileText,
  Camera,
  Battery,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export default function MaintenancePage() {
  const { maintenanceLogs, devices, aiReports } = useApp();

  // Active AI Report (default to first or seeded report)
  const activeReport = aiReports[0];

  const warningDevices = devices.filter(d => d.status === "warning" || d.health < 90 || (d.battery > 0 && d.battery < 25));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Feasibility Diagnostics</h2>
          <p className="text-xs text-slate-400 font-medium">
            Monitor machinery calibration telemetries, review failure probabilities, and inspect completed consultant audits.
          </p>
        </div>

        {/* Warning Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Predictor Models (Left, 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-time Warnings */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                Active Equipment Warnings
              </h3>

              {warningDevices.length > 0 ? (
                <div className="space-y-3">
                  {warningDevices.map((device) => (
                    <div
                      key={device.id}
                      className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between hover:border-slate-800 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">{device.device_name}</h4>
                        <p className="text-[11px] text-slate-400">
                          Located in <span className="text-slate-200 font-semibold">{device.location}</span>. 
                          Manufacturer: <span className="text-slate-200 font-semibold">{device.manufacturer}</span>.
                        </p>
                        <p className="text-[10px] text-amber-500 font-semibold">
                          Health score: {device.health}% • Material level: {device.battery === -1 ? "Continuous Feed" : `${device.battery}%`}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        Attention Needed
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-950/40 border border-dashed border-slate-850 rounded-2xl text-center">
                  <p className="text-xs text-slate-500 font-medium">All machinery assets are fully optimized and calibrated.</p>
                </div>
              )}
            </div>

            {/* Completed Technician Reports */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-indigo-400" />
                Consultant Feasibility Logs
              </h3>

              <div className="space-y-4">
                {maintenanceLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 hover:border-slate-800 transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{log.device_name} Feasibility Audit</h4>
                        <p className="text-[10px] text-slate-500">Log ID: {log.id}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1"><User className="h-3 w-3 text-emerald-400" /> {log.technician_name}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-indigo-400" /> Audited: {log.service_date}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Consultant Notes & Diagnostics
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {log.report}
                      </p>
                    </div>

                    {/* Photos Attachment Mock */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <Camera className="h-3.5 w-3.5" />
                        Feasibility Layout Schematics
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="aspect-[4/3] rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
                          <Activity className="h-5 w-5 text-indigo-400 animate-pulse mb-1" />
                          <span className="text-[9px] text-slate-400 font-semibold block">Venting Node Calibration</span>
                          <span className="text-[8px] text-slate-500 font-mono">100% Calibrated</span>
                        </div>
                        <div className="aspect-[4/3] rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none" />
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-1" />
                          <span className="text-[9px] text-slate-400 font-semibold block">Hopper Intake Fitting</span>
                          <span className="text-[8px] text-slate-500 font-mono">Calibrated</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Service Date */}
                    <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Next recommended audit</span>
                      <span className="text-slate-300">{log.next_service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Telemetry Insights (Right, 1 column) */}
          <div className="space-y-6">
            {/* Predictive Model Telemetry */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                  <Sparkles className="h-3 w-3" />
                  AI Predictor
                </span>
                <h3 className="text-sm font-extrabold text-white">Telemetry Models</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Calculated using material wear cycles, operating ages, and active layout processing loads.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Metric 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Mean Operating Time Between Calibrations</span>
                    <span className="text-indigo-400">22.4 Months</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Average Material Capacity Level</span>
                    <span className="text-emerald-400">-4.2% / Month</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Average Firmware Health</span>
                    <span className="text-amber-400">v4.7.12 Stable</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Predictions Warnings Cards */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-extrabold text-white">Failure Risk Matrix</h3>
              
              {activeReport?.maintenance_prediction.map((pred) => (
                <div key={pred.deviceId} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{pred.deviceName}</span>
                    <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                      CRITICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {pred.reason}
                  </p>
                  <div className="pt-2 border-t border-slate-900/80 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Forecast recalibration</span>
                    <span className="text-rose-400">{pred.predictedFailureDate}</span>
                  </div>
                </div>
              ))}
              
              {(!activeReport || activeReport.maintenance_prediction.length === 0) && (
                <p className="text-xs text-slate-500 text-center font-medium py-2">No high-risk failures forecasted.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
