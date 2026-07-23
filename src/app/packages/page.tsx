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
      alert(`Successfully purchased: ${name}! An installation appointment has been automatically scheduled for you in 2 days. View the Appointments page to see details.`);
    } else {
      alert("Purchase failed. Please sign in again.");
    }
  };

  const comparisonRows = [
    { spec: "Central Hub", starter: "Standard Bridge", premium: "Nest Pro Hub", luxury: "Nest Enterprise Hub" },
    { spec: "Smart RGBW Bulbs", starter: "2 Included", premium: "4 Included + 2 Switches", luxury: "10 Included + 4 Switches" },
    { spec: "AI Climate Thermostat", starter: "❌ No", premium: "1 Included (Multi-zone)", luxury: "2 Included (Climate Sync)" },
    { spec: "Secure Deadbolt", starter: "❌ No", premium: "1 Included (Keypad)", luxury: "2 Included (Biometric)" },
    { spec: "Video Surveillance", starter: "❌ No", premium: "Doorbell + 1 Outdoor Camera", luxury: "Doorbell Pro + 3 Floodlight Cameras" },
    { spec: "Energy Metering", starter: "1 Smart Plug", premium: "Full Hub Dashboard", luxury: "Whole-Home Metering + Leak Valve" },
    { spec: "Installation Services", starter: "Self-Install / Guidance", premium: "Professional Included", luxury: "Priority Professional Included" },
    { spec: "Warranty", starter: "1 Year Limited", premium: "2 Year Full Coverage", luxury: "Lifetime Replacement" },
    { spec: "AI Assistance Level", starter: "Basic Recommendations", premium: "Full Predictive Suite", luxury: "Priority Local & Scripted AI" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Automation Packages</h2>
          <p className="text-xs text-slate-400 font-medium">
            Discover and purchase intelligent, pre-configured smart home suites with certified professional installation.
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
                      Currently Active in Home
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
                      Purchase Package
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
