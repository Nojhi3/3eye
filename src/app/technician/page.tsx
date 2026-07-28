"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Appointment } from "@/context/AppContext";
import {
  Wrench,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Camera,
  Activity,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  Play,
  Save,
  Check
} from "lucide-react";

export default function TechnicianDashboard() {
  const {
    appointments,
    updateAppointmentStatus,
    updateAppointmentChecklist,
    addMaintenanceLog,
    user
  } = useApp();

  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Completion Form states
  const [techReport, setTechReport] = useState("");
  const [nextService, setNextService] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Filter appointments assigned to this technician (tech-1 is default dummy tech)
  const assignedJobs = appointments.filter(
    (a) => a.technician_id === "tech-1" && (a.status === "scheduled" || a.status === "in-progress")
  );

  const completedJobs = appointments.filter(
    (a) => a.technician_id === "tech-1" && a.status === "completed"
  );

  const activeJob = assignedJobs.find((j) => j.id === activeJobId) || assignedJobs[0] || null;

  const handleToggleChecklist = (jobId: string, itemIdx: number) => {
    const job = appointments.find((a) => a.id === jobId);
    if (!job || !job.checklist) return;

    const newChecklist = job.checklist.map((c, i) =>
      i === itemIdx ? { ...c, done: !c.done } : c
    );
    updateAppointmentChecklist(jobId, newChecklist);
  };

  const handleStartJob = (jobId: string) => {
    updateAppointmentStatus(jobId, "in-progress");
    setActiveJobId(jobId);
    alert("Job started! Checklist is now active.");
  };

  const handleUploadMock = () => {
    setUploadingImage(true);
    setTimeout(() => {
      setUploadingImage(false);
      setUploadedImageUrl("/assets/mock-mount-audit.jpg");
      alert("Mock installation verification photo uploaded successfully!");
    }, 800);
  };

  const handleCompleteJob = (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    if (!techReport || !nextService) {
      alert("Please fill in the diagnostics notes and schedule the next service date.");
      return;
    }

    const job = appointments.find((a) => a.id === jobId);
    if (!job) return;

    // 1. Add Maintenance Log to Database
    addMaintenanceLog({
      device_id: "dev-2", // Mocking extruder calibration or package hub gateway calibration
      device_name: job.package_id ? "IdeaForge Pro Gateway" : "Plastic Extruder & Molder Node",
      technician_id: "tech-1",
      technician_name: user?.name || "Alex Smith",
      report: techReport,
      next_service: nextService,
      photo_url: uploadedImageUrl || undefined
    });

    // 2. Mark Appointment status completed (which auto-provisions devices to homeowner)
    updateAppointmentStatus(jobId, "completed");

    // Reset Forms
    setTechReport("");
    setNextService("");
    setUploadedImageUrl(null);
    setActiveJobId(null);

    alert("Job completed! Verification reports registered and smart devices deployed to homeowner profile.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Consultant Dashboard</h2>
            <p className="text-xs text-slate-400 font-medium">
              Manage your assigned factory floor audits, review feasibility checklists, and publish diagnostics reports.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-xl">
            <Wrench className="h-4 w-4 text-emerald-400" />
            <span>Expert Consultant: {user?.name || "Alex Smith"}</span>
          </div>
        </div>

        {assignedJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (1 span): Job List selector */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Assigned Consultations ({assignedJobs.length})
              </h3>
              
              <div className="space-y-3">
                {assignedJobs.map((job) => {
                  const isActive = activeJob?.id === job.id;
                  return (
                    <button
                      key={job.id}
                      onClick={() => setActiveJobId(job.id)}
                      className={`w-full p-5 text-left rounded-3xl border flex flex-col gap-3 transition-colors ${
                        isActive
                          ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/5"
                          : "bg-slate-900/30 border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          job.status === "in-progress" ? "bg-amber-500/10 text-amber-400" : "bg-slate-800 text-slate-400"
                        }`}>
                          {job.status === "in-progress" ? "In Progress" : "Scheduled"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{job.appointment_date}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-white truncate">{job.user_name}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{job.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{job.address}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column (2 spans): Inspector & Checklist Panel */}
            {activeJob && (
              <div className="lg:col-span-2 space-y-6">
                
                {/* Active Job Inspector */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 space-y-6">
                  
                  {/* Inspector Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-950 pb-4">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                          Complete Feasibility Audit Inspector
                      </span>
                      <h3 className="text-base font-extrabold text-white">{activeJob.user_name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{activeJob.address}</p>
                    </div>

                    {activeJob.status === "scheduled" ? (
                      <button
                        onClick={() => handleStartJob(activeJob.id)}
                        className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md active:scale-95 shrink-0"
                      >
                        <Play className="h-4 w-4" /> Start Feasibility Audit
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full animate-pulse">
                        ● Audit Active
                      </span>
                    )}
                  </div>

                  {activeJob.status === "in-progress" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* Checklist Columns */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                          <Activity className="h-4.5 w-4.5 text-indigo-400" />
                          Feasibility Checklist
                        </h4>
                        
                        <div className="space-y-2 bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                          {activeJob.checklist?.map((c, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleToggleChecklist(activeJob.id, idx)}
                              className="w-full flex items-center gap-3 py-2 text-left text-xs text-slate-300 hover:text-white"
                            >
                              <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-colors ${
                                c.done ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-800"
                              }`}>
                                {c.done && <Check className="h-3 w-3" />}
                              </div>
                              <span className={c.done ? "line-through text-slate-500" : ""}>{c.item}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Work Checkout Form */}
                      <form
                        onSubmit={(e) => handleCompleteJob(e, activeJob.id)}
                        className="space-y-4"
                      >
                        <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                          <FileText className="h-4.5 w-4.5 text-emerald-400" />
                          Audit Checkout
                        </h4>

                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Consultant Notes
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Detail completed factory layout assessments, extruder calibrations, and zoning configurations..."
                            value={techReport}
                            onChange={(e) => setTechReport(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Next Recommended Audit
                            </label>
                            <input
                              type="date"
                              required
                              value={nextService}
                              onChange={(e) => setNextService(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Onsite Photos
                            </label>
                            <button
                              type="button"
                              onClick={handleUploadMock}
                              disabled={uploadingImage}
                              className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                            >
                              <Camera className="h-4 w-4" />
                              {uploadedImageUrl ? "Uploaded!" : "Upload Photo"}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Save className="h-4 w-4" /> Complete Job Audit
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl">
                      <AlertTriangle className="h-8 w-8 text-indigo-500/30 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-semibold">
                        This consultation visit has not started yet. Click the Start Feasibility Audit button above to view checklist diagnostics.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl">
            <AlertTriangle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-semibold">You have no active feasibility or maintenance assignments today.</p>
          </div>
        )}

        {/* Completed Jobs History */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white">Completed History ({completedJobs.length})</h3>

          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Entrepreneur</th>
                    <th className="py-3 px-4">Consultation Scope</th>
                    <th className="py-3 px-4">Completion Date</th>
                    <th className="py-3 px-4 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 text-slate-300">
                  {completedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{job.user_name}</td>
                      <td className="py-3.5 px-4 text-slate-400 truncate max-w-sm">{job.description}</td>
                      <td className="py-3.5 px-4 text-slate-400">{job.appointment_date}</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold uppercase tracking-wide">
                        COMPLETED
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {completedJobs.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 font-medium">
                 No completed consultations found in records.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
