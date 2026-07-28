"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";

export default function PackagesPage() {
  const { packages, purchasePackage, orders } = useApp();

  const handlePurchase = (id: string, name: string) => {
    const success = purchasePackage(id);
    if (success) {
      alert(`Successfully provisioned: ${name}! A feasibility and setup consultation has been automatically scheduled for you in 2 days. View the Consulting page to see details.`);
    } else {
      alert("Selection failed. Please sign in again.");
    }
  };

  const comparisonRows = [
    { spec: "Integration Gateway", starter: "IdeaForge Bridge", premium: "IdeaForge Pro Gateway", luxury: "IdeaForge Enterprise Server" },
    { spec: "Production Sensor Nodes", starter: "2 Included", premium: "4 Included + 2 Calibrators", luxury: "10 Included + 4 Calibrators" },
    { spec: "AI Thermal Regulator", starter: "❌ No", premium: "1 Included (Auto-vent)", luxury: "2 Included (Venting & Cooling)" },
    { spec: "Biometric Security", starter: "❌ No", premium: "1 Access Node (Keypad)", luxury: "2 Access Nodes (Biometrics)" },
    { spec: "QC Surveillance", starter: "❌ No", premium: "1 HD Assembly Line Monitor", luxury: "1 QC 2K Monitor + 3 Floor Cams" },
    { spec: "Resource Metering", starter: "1 Smart Switch", premium: "Full Production Dashboard", luxury: "Plant Grid Logger + Safety Valve" },
    { spec: "Feasibility Consulting", starter: "Self-Assembly Guidance", premium: "Certified Setup Audit", luxury: "Priority On-Site Audits" },
    { spec: "Equipment Warranty", starter: "1 Year Limited", premium: "2 Year Full Coverage", luxury: "Lifetime Replacement" },
    { spec: "AI Architect Access", starter: "Basic Feasibility", premium: "Full Plant Diagnostics", luxury: "Custom Floor Automation Scripts" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Machinery & Setup Catalog</h2>
          <p className="text-xs text-slate-400 font-medium">
            Discover and select startup templates and pre-configured industrial setup blueprints with certified expert audits.
          </p>
        </div>

        {/* Package Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isPurchased = orders.some(o => o.package_id === pkg.id);
            const isPremium = pkg.id === "premium";

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl border p-8 flex flex-col justify-between relative transition-all ${
                  isPremium
                    ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "bg-slate-900/40 border-slate-900 hover:border-slate-800"
                }`}
              >
                {isPremium && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 px-3.5 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Recommended Spec
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1.5">{pkg.name}</h3>
                    <p className="text-xs text-slate-400 min-h-[36px]">{pkg.description}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white tracking-tight">${pkg.price}</span>
                      <span className="text-xs text-slate-500 font-semibold">one-time</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5 border-t border-slate-800/80 pt-6">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  {isPurchased ? (
                    <div className="w-full py-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center text-xs font-bold text-emerald-400">
                      Currently Active Blueprint
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(pkg.id, pkg.name)}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                        isPremium
                          ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/10"
                          : "bg-slate-800 text-slate-200 hover:bg-slate-750 hover:text-white"
                      }`}
                    >
                      Select Blueprint
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Spec Comparison Grid */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-white">Spec Comparison</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side technical evaluation of hardware components, audits, and support coverage.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Package Specifications</th>
                  <th className="py-3 px-4 font-bold">Starter Suite</th>
                  <th className="py-3 px-4 font-bold text-indigo-400">Premium Suite</th>
                  <th className="py-3 px-4 font-bold">Luxury Haven</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-300">{row.spec}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.starter}</td>
                    <td className="py-3.5 px-4 text-slate-200 font-medium">{row.premium}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.luxury}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
