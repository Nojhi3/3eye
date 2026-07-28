"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { readLocalState, removeLocalState, writeLocalState } from "@/lib/local-db";

// Types corresponding to Database Schema
export interface User {
  id: string;
  name: string;
  email: string;
  role: "homeowner" | "technician" | "admin";
  phone: string;
  created_at: string;
}

export interface Home {
  id: string;
  user_id: string;
  house_type: string;
  rooms: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface Device {
  id: string;
  home_id: string;
  device_name: string;
  category: "lighting" | "security" | "climate" | "sensors" | "bridge";
  manufacturer: string;
  status: "active" | "inactive" | "warning" | "offline";
  battery: number; // 0-100, or -1 for wired
  firmware: string;
  health: number; // 0-100
  last_service: string;
  location: string;
  warranty_expires: string;
  age_months: number;
  value?: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface Order {
  id: string;
  user_id: string;
  package_id: string;
  payment_status: "paid" | "pending" | "failed";
  order_status: "processing" | "shipped" | "delivered";
  amount: number;
  date: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  user_name: string;
  technician_id: string;
  technician_name: string;
  appointment_date: string;
  time_slot: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  package_id?: string;
  description: string;
  address: string;
  checklist?: { item: string; done: boolean }[];
}

export interface Maintenance {
  id: string;
  device_id: string;
  device_name: string;
  technician_id: string;
  technician_name: string;
  report: string;
  service_date: string;
  next_service: string;
  photo_url?: string;
}

export interface AIReport {
  id: string;
  user_id: string;
  recommendation: string;
  energy_prediction: {
    monthlySavings: number;
    annualSavings: number;
    paybackYears: number;
    automationScore: number;
    securityScore: number;
    efficiencyScore: number;
    chartData: { month: string; before: number; after: number }[];
    recommendedAutomations: string[];
  };
  maintenance_prediction: {
    deviceId: string;
    deviceName: string;
    failureProbability: number;
    predictedFailureDate: string;
    reason: string;
    recommendation: string;
  }[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface AppContextType {
  // Authentication
  user: User | null;
  login: (email: string, role: User["role"]) => boolean;
  logout: () => void;
  signUp: (name: string, email: string, phone: string, role: User["role"]) => void;
  updateProfile: (name: string, phone: string) => void;

  // Homes (Project Plants)
  homes: Home[];
  activeHome: Home | null;
  registerHome: (home: Omit<Home, "id" | "user_id">) => void;
  updateHome: (home: Home) => void;

  // Devices (Machinery)
  devices: Device[];
  addDevice: (device: Omit<Device, "id">) => void;
  updateDevice: (device: Device) => void;
  deleteDevice: (deviceId: string) => void;
  toggleDevice: (deviceId: string) => void;

  // Packages & Orders (Blueprints)
  packages: Package[];
  orders: Order[];
  purchasePackage: (packageId: string) => boolean;

  // Appointments (Consultations)
  appointments: Appointment[];
  bookAppointment: (technicianId: string, date: string, timeSlot: string, description: string, packageId?: string) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, timeSlot: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  updateAppointmentChecklist: (id: string, checklist: Appointment["checklist"]) => void;

  // Technicians (Consultants)
  technicians: User[];

  // Maintenance (Audits)
  maintenanceLogs: Maintenance[];
  addMaintenanceLog: (log: Omit<Maintenance, "id" | "service_date">) => void;

  // AI & Reports
  aiReports: AIReport[];
  generateAIReport: (bill: number, appliances: number, usage: number) => AIReport;
  chatHistory: ChatMessage[];
  addChatMessage: (sender: "user" | "ai", text: string) => void;
  clearChat: () => void;
  
  // App Theme/State Helpers
  automationScore: number;
  securityScore: number;
  efficiencyScore: number;
  energySavedKwh: number;
  energySavedCost: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// SEED DATA: Refactored to represent Startup and Manufacturing Blueprints
const defaultPackages: Package[] = [
  {
    id: "starter",
    name: "Eco-Friendly Manufacturing Blueprint",
    description: "Ideal for small operations in recycled goods, organic packaging, or bio-plastics.",
    price: 499,
    features: [
      "IdeaForge Central Controller",
      "2x Production Line Sensor Nodes (Temperature/Throughput)",
      "1x Automated Equipment Relay Switch",
      "1x Quality Assurance Telemetry Sensor",
      "AI financial payback & operational efficiency audit",
      "Self-implementation or remote consultant walkthrough"
    ]
  },
  {
    id: "premium",
    name: "Premium Manufacturing Setup",
    description: "Our most popular setup for automated custom packaging or local assembly plants.",
    price: 1299,
    features: [
      "IdeaForge Central Controller (Pro Edition)",
      "4x Production Sensors & 2x Automated Calibrators",
      "1x AI Climate & Temperature Heat Venting Module",
      "1x High-Definition Assembly Line Monitor Cam",
      "1x Central Safety Shut-off Control Gateway",
      "Full AI metrics & raw materials supply insights",
      "Professional expert consultant setup included"
    ]
  },
  {
    id: "luxury",
    name: "Luxury Smart Plant Integration",
    description: "Enterprise-grade complete machinery integration and production-flow automation.",
    price: 2999,
    features: [
      "IdeaForge Central Gateway (Enterprise, offline redundant)",
      "10x Production Line Sensors & 4x Calibrators",
      "2x AI Smart Thermal Regulators (Venting & Cooling)",
      "2x Biometric Facility Entrance Access Nodes",
      "1x 2K Quality Inspection Monitor Camera",
      "3x Assembly Monitor cams for floor managers",
      "1x Whole-Plant Grid Power Optimizer Logger",
      "1x Automated Safety Shut-off Material Feed Valve",
      "Priority expert assistance & lifetime layout warranty",
      "Custom floor script automations & scale modules"
    ]
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Authentication & Users
  const [user, setUser] = useState<User | null>(null);
  
  // All tables in local state (loaded from localstorage or initialized)
  const [homes, setHomes] = useState<Home[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<Maintenance[]>([]);
  const [aiReports, setAiReports] = useState<AIReport[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Simulated Consultants
  const technicians: User[] = [
    { id: "tech-1", name: "Alex Smith", email: "tech1@ideaforge.com", role: "technician", phone: "+1 (512) 555-0192", created_at: "2025-01-10" },
    { id: "tech-2", name: "Jordan Brooks", email: "tech2@ideaforge.com", role: "technician", phone: "+1 (512) 555-0143", created_at: "2025-03-22" },
    { id: "tech-3", name: "Elena Rostova", email: "tech3@ideaforge.com", role: "technician", phone: "+1 (512) 555-0177", created_at: "2025-05-18" }
  ];

  // Initialize DB with seed data if localStorage is empty
  // This effect intentionally hydrates the client store from browser storage once.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hydrate = async () => {
      const storedUser = await readLocalState<User>("sn_user");
      if (storedUser) setUser(storedUser);

      const storedHomes = await readLocalState<Home[]>("sn_homes");
      const storedDevices = await readLocalState<Device[]>("sn_devices");
      const storedOrders = await readLocalState<Order[]>("sn_orders");
      const storedAppointments = await readLocalState<Appointment[]>("sn_appointments");
      const storedMaintenance = await readLocalState<Maintenance[]>("sn_maintenance");
      const storedReports = await readLocalState<AIReport[]>("sn_reports");
      const storedChat = await readLocalState<ChatMessage[]>("sn_chat");

      if (storedHomes) setHomes(storedHomes);
      else {
        const seedHome: Home = {
          id: "home-1",
          user_id: "user-1", // John Doe (Entrepreneur)
          house_type: "CleanTech Manufacturing",
          rooms: 5,
          address: "Plant Site B, Industrial Area 4",
          city: "Austin",
          state: "TX",
          zipcode: "78744"
        };
        setHomes([seedHome]);
        void writeLocalState("sn_homes", [seedHome]);
      }

      if (storedDevices) setDevices(storedDevices);
      else {
        const seedDevices: Device[] = [
          {
            id: "dev-1",
            home_id: "home-1",
            device_name: "Custom 3D Printer Farm Array",
            category: "climate",
            manufacturer: "Creality",
            status: "active",
            battery: -1, // Wired
            firmware: "v4.7.12",
            health: 98,
            last_service: "2026-04-12",
            location: "Section A - Material Processing",
            warranty_expires: "2027-10-15",
            age_months: 18,
            value: 249
          },
          {
            id: "dev-2",
            home_id: "home-1",
            device_name: "Plastic Extruder & Molder Node",
            category: "security",
            manufacturer: "IdeaForge",
            status: "warning",
            battery: 12, // Material Level: 12%
            firmware: "v1.18.2",
            health: 84,
            last_service: "2026-03-01",
            location: "Section B - Injection Molding",
            warranty_expires: "2026-11-20",
            age_months: 20,
            value: 220
          },
          {
            id: "dev-3",
            home_id: "home-1",
            device_name: "CNC Laser Cutter & Engraver",
            category: "security",
            manufacturer: "IdeaForge",
            status: "active",
            battery: 88,
            firmware: "v5.2.1",
            health: 95,
            last_service: "2026-02-15",
            location: "Section C - Cutting",
            warranty_expires: "2027-02-15",
            age_months: 12,
            value: 250
          },
          {
            id: "dev-4",
            home_id: "home-1",
            device_name: "Plant Integration Gateway",
            category: "bridge",
            manufacturer: "IdeaForge",
            status: "active",
            battery: -1,
            firmware: "v1.55.0",
            health: 100,
            last_service: "2026-05-10",
            location: "Main Office - Central Server",
            warranty_expires: "2028-05-10",
            age_months: 2,
            value: 60
          },
          {
            id: "dev-5",
            home_id: "home-1",
            device_name: "Assembly Conveyor Belt Node",
            category: "lighting",
            manufacturer: "IdeaForge",
            status: "active",
            battery: -1,
            firmware: "v1.55.2",
            health: 99,
            last_service: "2026-05-10",
            location: "Section D - Assembly",
            warranty_expires: "2028-05-10",
            age_months: 2,
            value: 80
          }
        ];
        setDevices(seedDevices);
        void writeLocalState("sn_devices", seedDevices);
      }

      if (storedOrders) setOrders(storedOrders);
      else {
        const seedOrders: Order[] = [
          {
            id: "ord-1",
            user_id: "user-1",
            package_id: "premium",
            payment_status: "paid",
            order_status: "delivered",
            amount: 1299,
            date: "2026-02-10"
          }
        ];
        setOrders(seedOrders);
        void writeLocalState("sn_orders", seedOrders);
      }

      if (storedAppointments) setAppointments(storedAppointments);
      else {
        const seedAppointments: Appointment[] = [
          {
            id: "apt-1",
            user_id: "user-1",
            user_name: "John Doe",
            technician_id: "tech-1",
            technician_name: "Alex Smith",
            appointment_date: "2026-07-26",
            time_slot: "09:00 AM - 12:00 PM",
            status: "scheduled",
            description: "Assess factory floor layout, calibrate sensor arrays, and verify material supply lines.",
            address: "Plant Site B, Industrial Area 4, Austin, TX 78744",
            checklist: [
              { item: "Zoning registration & legal startup paperwork approval", done: false },
              { item: "Set up and sync plant integration gateway controller", done: false },
              { item: "Calibrate high-temperature plastic extruder molding strike", done: false },
              { item: "Train plant operator on the IdeaForge dashboard tracking", done: false }
            ]
          }
        ];
        setAppointments(seedAppointments);
        void writeLocalState("sn_appointments", seedAppointments);
      }

      if (storedMaintenance) setMaintenanceLogs(storedMaintenance);
      else {
        const seedMaintenance: Maintenance[] = [
          {
            id: "maint-1",
            device_id: "dev-2",
            device_name: "Plastic Extruder & Molder Node",
            technician_id: "tech-1",
            technician_name: "Alex Smith",
            report: "Realigned screw feeder shafts and recalibrated strike plate. Checked connection to gateway hub. Updated firmware. Notified customer that extruder nozzle tip will need replacement in roughly 3 months due to wear.",
            service_date: "2026-03-01",
            next_service: "2026-09-01"
          }
        ];
        setMaintenanceLogs(seedMaintenance);
        void writeLocalState("sn_maintenance", seedMaintenance);
      }

      if (storedReports) setAiReports(storedReports);
      else {
        const seedReport: AIReport = {
          id: "rep-1",
          user_id: "user-1",
          recommendation: "Optimize extruder idle periods to conserve power, and replace worn nozzles to prevent lines down.",
          energy_prediction: {
            monthlySavings: 38.5,
            annualSavings: 462.0,
            paybackYears: 2.8,
            automationScore: 78,
            securityScore: 82,
            efficiencyScore: 72,
            chartData: [
              { month: "Jan", before: 180, after: 145 },
              { month: "Feb", before: 165, after: 130 },
              { month: "Mar", before: 150, after: 115 },
              { month: "Apr", before: 140, after: 105 },
              { month: "May", before: 195, after: 150 },
              { month: "Jun", before: 240, after: 185 }
            ],
            recommendedAutomations: [
              "Schedule automatic extruder temperature setbacks during off-shift hours (saves $120/mo)",
              "Calibrate conveyer speed cycles with sensor throughput to lower motor load under low supply",
              "Install auto-cutoff safety valve on main chemical raw material container lines to prevent spill leakage"
            ]
          },
          maintenance_prediction: [
            {
              deviceId: "dev-2",
              deviceName: "Plastic Extruder & Molder Node",
              failureProbability: 92,
              predictedFailureDate: "2026-08-05",
              reason: "Feed material capacity under 15% and extruder motor drawing elevated current.",
              recommendation: "Refill raw materials immediately. Calibrate shaft bearings and clean gears."
            }
          ],
          created_at: "2026-07-20"
        };
        setAiReports([seedReport]);
        void writeLocalState("sn_reports", [seedReport]);
      }

      if (storedChat) setChatHistory(storedChat);
      else {
        const seedChat: ChatMessage[] = [
          { id: "chat-1", sender: "ai", text: "Hello! I am your IdeaForge Consultant. How can I help you discover, evaluate, and build your startup or manufacturing idea today?", timestamp: new Date().toLocaleTimeString() }
        ];
        setChatHistory(seedChat);
        void writeLocalState("sn_chat", seedChat);
      }
      };

      void hydrate();
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save changes wrapper
  const saveState = <T,>(
    key: string,
    data: T,
    stateSetter: React.Dispatch<React.SetStateAction<T>>,
  ) => {
    stateSetter(data);
    if (typeof window !== "undefined") {
      void writeLocalState(key, data);
    }
  };

  // Auth Operations
  const login = (email: string, role: User["role"]): boolean => {
    let dummyUser: User;
    if (email.includes("admin") || role === "admin") {
      dummyUser = { id: "user-admin", name: "Sarah Jenkins", email: email || "admin@ideaforge.com", role: "admin", phone: "+1 (512) 555-0901", created_at: "2026-01-01" };
    } else if (email.includes("tech") || role === "technician") {
      dummyUser = { id: "tech-1", name: "Alex Smith", email: email || "consultant@ideaforge.com", role: "technician", phone: "+1 (512) 555-0192", created_at: "2026-01-10" };
    } else {
      dummyUser = { id: "user-1", name: "John Doe", email: email || "entrepreneur@ideaforge.com", role: "homeowner", phone: "+1 (512) 555-0100", created_at: "2026-02-01" };
    }
    setUser(dummyUser);
    if (typeof window !== "undefined") {
      void writeLocalState("sn_user", dummyUser);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      void removeLocalState("sn_user");
    }
  };

  const signUp = (name: string, email: string, phone: string, role: User["role"]) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      created_at: new Date().toISOString().split("T")[0]
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      void writeLocalState("sn_user", newUser);
    }
    
    // Create matching initial home if entrepreneur (homeowner role internally)
    if (role === "homeowner") {
      const newHome: Home = {
        id: `home-${Date.now()}`,
        user_id: newUser.id,
        house_type: "CleanTech Manufacturing",
        rooms: 4,
        address: "Enter Factory Site Address",
        city: "City",
        state: "State",
        zipcode: "00000"
      };
      saveState("sn_homes", [...homes, newHome], setHomes);
    }
  };

  const updateProfile = (name: string, phone: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, phone };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      void writeLocalState("sn_user", updatedUser);
    }
  };

  // Homes Operations
  const activeHome = homes.find(h => h.user_id === user?.id) || homes[0] || null;

  const registerHome = (homeData: Omit<Home, "id" | "user_id">) => {
    if (!user) return;
    const newHome: Home = {
      ...homeData,
      id: `home-${Date.now()}`,
      user_id: user.id
    };
    saveState("sn_homes", [...homes, newHome], setHomes);
  };

  const updateHome = (updatedHome: Home) => {
    const newHomes = homes.map(h => h.id === updatedHome.id ? updatedHome : h);
    saveState("sn_homes", newHomes, setHomes);
  };

  // Devices Operations (Machinery)
  const addDevice = (deviceData: Omit<Device, "id">) => {
    const newDevice: Device = {
      ...deviceData,
      id: `dev-${Date.now()}`
    };
    saveState("sn_devices", [...devices, newDevice], setDevices);
  };

  const updateDevice = (updatedDevice: Device) => {
    const newDevices = devices.map(d => d.id === updatedDevice.id ? updatedDevice : d);
    saveState("sn_devices", newDevices, setDevices);
  };

  const deleteDevice = (deviceId: string) => {
    const newDevices = devices.filter(d => d.id !== deviceId);
    saveState("sn_devices", newDevices, setDevices);
  };

  const toggleDevice = (deviceId: string) => {
    const newDevices = devices.map(d => {
      if (d.id === deviceId) {
        const nextStatus: Device["status"] = d.status === "active" ? "inactive" : "active";
        return { ...d, status: nextStatus };
      }
      return d;
    });
    saveState("sn_devices", newDevices, setDevices);
  };

  // Packages & Orders Operations
  const purchasePackage = (packageId: string): boolean => {
    if (!user) return false;
    const pkg = defaultPackages.find(p => p.id === packageId);
    if (!pkg) return false;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      user_id: user.id,
      package_id: packageId,
      payment_status: "paid",
      order_status: "processing",
      amount: pkg.price,
      date: new Date().toISOString().split("T")[0]
    };
    saveState("sn_orders", [newOrder, ...orders], setOrders);

    // Auto-create booking for setup audit
    const techIdx = Math.floor(Math.random() * technicians.length);
    const tech = technicians[techIdx];
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      technician_id: tech.id,
      technician_name: tech.name,
      appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
      time_slot: "01:00 PM - 04:00 PM",
      status: "scheduled",
      package_id: packageId,
      description: `Feasibility study and system setup for manufacturing blueprint ${pkg.name}. Deployment of production control modules and sensor telemetry.`,
      address: activeHome ? `${activeHome.address}, ${activeHome.city}, ${activeHome.state} ${activeHome.zipcode}` : "Register a home to proceed",
      checklist: pkg.features.map(feat => ({ item: `Install / configure: ${feat.slice(0, 50)}...`, done: false }))
    };
    saveState("sn_appointments", [newApt, ...appointments], setAppointments);
    return true;
  };

  // Appointment operations
  const bookAppointment = (technicianId: string, date: string, timeSlot: string, description: string, packageId?: string) => {
    if (!user) return;
    const tech = technicians.find(t => t.id === technicianId) || technicians[0];
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      technician_id: tech.id,
      technician_name: tech.name,
      appointment_date: date,
      time_slot: timeSlot,
      status: "scheduled",
      description,
      package_id: packageId,
      address: activeHome ? `${activeHome.address}, ${activeHome.city}, ${activeHome.state} ${activeHome.zipcode}` : "Main Plant Site B",
      checklist: [
        { item: "Initial hardware assessment", done: false },
        { item: "Device deployment and installation", done: false },
        { item: "Firmware setup & gateway sync", done: false },
        { item: "Post-install safety and efficiency audit", done: false }
      ]
    };
    saveState("sn_appointments", [newApt, ...appointments], setAppointments);
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: "cancelled" as const } : a);
    saveState("sn_appointments", updated, setAppointments);
  };

  const rescheduleAppointment = (id: string, date: string, timeSlot: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, appointment_date: date, time_slot: timeSlot } : a);
    saveState("sn_appointments", updated, setAppointments);
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    const updated = appointments.map(a => {
      if (a.id === id) {
        return { ...a, status };
      }
      return a;
    });
    saveState("sn_appointments", updated, setAppointments);
    
    // Auto-create devices and maintenance when marked "completed"
    if (status === "completed") {
      const apt = appointments.find(a => a.id === id);
      if (apt && apt.package_id) {
        // Mock deployment of packages
        const pkg = defaultPackages.find(p => p.id === apt.package_id);
        const homeId = activeHome?.id || "home-1";
        if (pkg) {
          const installedDevices: Device[] = [
            {
              id: `dev-pkg-1-${Date.now()}`,
              home_id: homeId,
              device_name: `${pkg.name.split(" ")[0]} Gateway Hub`,
              category: "bridge",
              manufacturer: "IdeaForge",
              status: "active",
              battery: -1,
              firmware: "v5.0.0",
              health: 100,
              last_service: apt.appointment_date,
              location: "Section A - Central",
              warranty_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              age_months: 0,
              value: pkg.price * 0.25
            },
            {
              id: `dev-pkg-2-${Date.now()}`,
              home_id: homeId,
              device_name: "IdeaForge QC Calibrator",
              category: "security",
              manufacturer: "IdeaForge",
              status: "active",
              battery: 100,
              firmware: "v2.0.1",
              health: 100,
              last_service: apt.appointment_date,
              location: "Section B - Outflow",
              warranty_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              age_months: 0,
              value: 199
            }
          ];
          saveState("sn_devices", [...devices, ...installedDevices], setDevices);
        }
      }
    }
  };

  const updateAppointmentChecklist = (id: string, checklist: Appointment["checklist"]) => {
    const updated = appointments.map(a => a.id === id ? { ...a, checklist } : a);
    saveState("sn_appointments", updated, setAppointments);
  };

  // Maintenance Operations
  const addMaintenanceLog = (logData: Omit<Maintenance, "id" | "service_date">) => {
    const newLog: Maintenance = {
      ...logData,
      id: `maint-${Date.now()}`,
      service_date: new Date().toISOString().split("T")[0]
    };
    saveState("sn_maintenance", [newLog, ...maintenanceLogs], setMaintenanceLogs);

    // Also update device last service date and restore battery/health (material capacity)
    const updatedDevices = devices.map(d => {
      if (d.id === logData.device_id) {
        return {
          ...d,
          battery: d.battery === -1 ? -1 : 100, // Refilled capacity
          health: 100, // Restored health
          status: "active" as const, // Cleared warning
          last_service: newLog.service_date
        };
      }
      return d;
    });
    saveState("sn_devices", updatedDevices, setDevices);
  };

  // AI & Reports Operations
  const generateAIReport = (bill: number, appliances: number, usage: number): AIReport => {
    if (!user) throw new Error("Authentication required");

    const monthlySavings = Math.round(bill * 0.28 * 100) / 100; // ~28% average savings
    const annualSavings = Math.round(monthlySavings * 12 * 100) / 100;
    const paybackYears = Math.round((1299 / annualSavings) * 10) / 10; // payback on premium pkg
    const automationScore = Math.min(100, Math.round(35 + appliances * 4 + usage * 2));
    const efficiencyScore = Math.min(100, Math.round(40 + (100 - bill / 4)));
    const securityScore = 80;

    const chartData = [
      { month: "Jan", before: bill, after: Math.round(bill * 0.72) },
      { month: "Feb", before: Math.round(bill * 0.9), after: Math.round(bill * 0.9 * 0.72) },
      { month: "Mar", before: Math.round(bill * 0.8), after: Math.round(bill * 0.8 * 0.72) },
      { month: "Apr", before: Math.round(bill * 0.75), after: Math.round(bill * 0.75 * 0.72) },
      { month: "May", before: Math.round(bill * 1.1), after: Math.round(bill * 1.1 * 0.72) },
      { month: "Jun", before: Math.round(bill * 1.3), after: Math.round(bill * 1.3 * 0.72) }
    ];

    const recommendedAutomations = [
      `Schedule automatic extruder temperature setbacks during off-shift hours (expected savings: $${Math.round(monthlySavings * 0.4)}/mo)`,
      `Calibrate conveyer speed cycles with sensor throughput to lower motor load under low supply (expected savings: $${Math.round(monthlySavings * 0.15)}/mo)`,
      `Install auto-cutoff safety valve on main chemical raw material container lines to prevent spill leakage (expected savings: $${Math.round(monthlySavings * 0.15)}/mo)`
    ];

    // Predict warnings based on device age or battery (capacity level)
    const predictions = devices
      .filter(d => d.battery > 0 && d.battery < 30 || d.health < 90)
      .map(d => ({
        deviceId: d.id,
        deviceName: d.device_name,
        failureProbability: d.battery > 0 && d.battery < 15 ? 95 : 75,
        predictedFailureDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        reason: d.battery < 15 ? "Critical raw material capacity state" : "Device firmware outdated & health index low.",
        recommendation: d.battery < 15 ? "Refill chemical container immediately." : "Reflash firmware and reset device controller."
      }));

    const newReport: AIReport = {
      id: `rep-${Date.now()}`,
      user_id: user.id,
      recommendation: `Recommended implementation: Deploy a Premium Setup Package to optimize heating/cooling loads. Configure schedules for ${appliances} machinery sections.`,
      energy_prediction: {
        monthlySavings,
        annualSavings,
        paybackYears,
        automationScore,
        securityScore,
        efficiencyScore,
        chartData,
        recommendedAutomations
      },
      maintenance_prediction: predictions,
      created_at: new Date().toISOString().split("T")[0]
    };

    saveState("sn_reports", [newReport, ...aiReports], setAiReports);
    return newReport;
  };

  // Chat Operations
  const addChatMessage = (sender: "user" | "ai", text: string) => {
    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory((prev: ChatMessage[]) => {
      const updated = [...prev, newMessage];
      if (typeof window !== "undefined") {
        void writeLocalState("sn_chat", updated);
      }
      return updated;
    });
  };

  const clearChat = () => {
    const initialChat: ChatMessage[] = [
      { id: "chat-1", sender: "ai" as const, text: "Hello! I am your IdeaForge Consultant. How can I help you discover, evaluate, and build your startup or manufacturing idea today?", timestamp: new Date().toLocaleTimeString() }
    ];
    saveState("sn_chat", initialChat, setChatHistory);
  };

  // Calculations for dashboard
  const userDevices = devices.filter(d => activeHome ? d.home_id === activeHome.id : true);
  
  // Scoring logic based on devices
  const activeReport = aiReports.find(r => r.user_id === user?.id) || aiReports[0];
  const automationScore = activeReport?.energy_prediction.automationScore || Math.min(100, Math.round(40 + userDevices.length * 8));
  const securityScore = activeReport?.energy_prediction.securityScore || Math.min(100, Math.round(50 + userDevices.filter(d => d.category === "security").length * 15));
  const efficiencyScore = activeReport?.energy_prediction.efficiencyScore || Math.min(100, Math.round(45 + userDevices.filter(d => d.battery === -1).length * 10));

  const energySavedKwh = Math.round((automationScore * 4.2 + efficiencyScore * 2.1) * 10) / 10;
  const energySavedCost = Math.round(energySavedKwh * 0.14 * 100) / 100; // $0.14 per kWh

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        signUp,
        updateProfile,
        homes,
        activeHome,
        registerHome,
        updateHome,
        devices,
        addDevice,
        updateDevice,
        deleteDevice,
        toggleDevice,
        packages: defaultPackages,
        orders,
        purchasePackage,
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        updateAppointmentChecklist,
        technicians,
        maintenanceLogs,
        addMaintenanceLog,
        aiReports,
        generateAIReport,
        chatHistory,
        addChatMessage,
        clearChat,
        automationScore,
        securityScore,
        efficiencyScore,
        energySavedKwh,
        energySavedCost
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
