"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Appointment } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  CalendarDays,
  X
} from "lucide-react";

export default function AppointmentsPage() {
  const {
    appointments,
    technicians,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    user
  } = useApp();

  const [showBookModal, setShowBookModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState<string | null>(null);

  // Form states for booking
  const [techId, setTechId] = useState("tech-1");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 12:00 PM");
  const [desc, setDesc] = useState("");

  // Form states for reschedule
  const [reschedDate, setReschedDate] = useState("");
  const [reschedSlot, setReschedSlot] = useState("09:00 AM - 12:00 PM");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !desc) {
      alert("Please fill in the appointment date and details.");
      return;
    }
    bookAppointment(techId, date, timeSlot, desc);
    setShowBookModal(false);
    setDate("");
    setDesc("");
    alert("Appointment booked successfully! Our technician will arrive as scheduled.");
  };

  const handleRescheduleSubmit = (e: React.FormEvent, aptId: string) => {
    e.preventDefault();
    if (!reschedDate) {
      alert("Please select a new date.");
      return;
    }
    rescheduleAppointment(aptId, reschedDate, reschedSlot);
    setShowRescheduleModal(null);
    setReschedDate("");
    alert("Appointment rescheduled successfully!");
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">Scheduled</span>;
      case "in-progress":
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full animate-pulse">● In Progress</span>;
      case "completed":
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">Completed</span>;
      default:
        return <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">Cancelled</span>;
    }
  };

  // Divide appointments
  const activeApts = appointments.filter((a) => a.status === "scheduled" || a.status === "in-progress");
  const pastApts = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Appointments & Setup</h2>
            <p className="text-xs text-slate-400 font-medium">
              Schedule smart home hardware configuration audits and request certified technician repair dispatches.
            </p>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" /> Book New Setup
          </button>
        </div>

        {/* Active Appointments Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-white">Active Appointments</h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {activeApts.map((apt) => (
              <div
                key={apt.id}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-800 transition-colors space-y-6"
              >
                {/* Header Metadata */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Order Ref: {apt.id.slice(0, 8)}</span>
                      {getStatusBadge(apt.status)}
                    </div>
                    <p className="text-sm font-extrabold text-white">{apt.description}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarDays className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{apt.appointment_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{apt.time_slot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Technician: {apt.technician_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 col-span-2">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{apt.address}</span>
                  </div>
                </div>

                {/* Checklist (if any) */}
                {apt.checklist && apt.checklist.length > 0 && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Installation checklist
                    </span>
                    <ul className="space-y-1.5">
                      {apt.checklist.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-relaxed">
                          <span className="text-indigo-400 shrink-0 select-none">-</span>
                          <span className={c.done ? "line-through text-slate-500" : ""}>{c.item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-850">
                  <button
                    onClick={() => {
                      setReschedDate(apt.appointment_date);
                      setReschedSlot(apt.time_slot);
                      setShowRescheduleModal(apt.id);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-[10px] font-bold text-slate-200 hover:text-white transition-all bg-slate-950"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to cancel this appointment?")) {
                        cancelAppointment(apt.id);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 text-[10px] font-bold text-rose-400 transition-all"
                  >
                    Cancel Setup
                  </button>
                </div>
              </div>
            ))}

            {activeApts.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl">
                <AlertTriangle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-semibold">No active scheduled installations.</p>
              </div>
            )}
          </div>
        </div>

        {/* History / Past Installations list */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-white">Past Installations</h3>

          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Details</th>
                    <th className="py-3 px-4 font-bold">Technician</th>
                    <th className="py-3 px-4 font-bold">Service Date</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {pastApts.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {apt.description}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{apt.technician_name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{apt.appointment_date}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(apt.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pastApts.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 font-medium border-t border-slate-850">
                No past appointment history available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal Dialog */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative animate-scale-up">
            <button onClick={() => setShowBookModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-white">Book SmartNest Setup</h3>
              <p className="text-[11px] text-slate-400">
                Select a technician and schedule hardware deployment audits.
              </p>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Certified Technician
                </label>
                <select
                  value={techId}
                  onChange={(e) => setTechId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Specialist in security/mesh config)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Select Hours Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                    <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Scope of work
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your device setup requests..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-95"
              >
                Schedule Installation Audit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal Dialog */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button onClick={() => setShowRescheduleModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-white">Reschedule Visit</h3>
              <p className="text-[11px] text-slate-400">
                Select a new timestamp for this setup appointment.
              </p>
            </div>

            <form onSubmit={(e) => handleRescheduleSubmit(e, showRescheduleModal)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    New Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reschedDate}
                    onChange={(e) => setReschedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Hours Slot
                  </label>
                  <select
                    value={reschedSlot}
                    onChange={(e) => setReschedSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                    <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md active:scale-95"
              >
                Apply Reschedule
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
