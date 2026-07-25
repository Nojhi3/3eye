"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Homes
  homes: Home[];
  activeHome: Home | null;
  registerHome: (home: Omit<Home, "id" | "user_id">) => void;
  updateHome: (home: Home) => void;

  // Devices
  devices: Device[];
  addDevice: (device: Omit<Device, "id">) => void;
  updateDevice: (device: Device) => void;
  deleteDevice: (deviceId: string) => void;
  toggleDevice: (deviceId: string) => void;

  // Packages & Orders
  packages: Package[];
  orders: Order[];
  purchasePackage: (packageId: string) => boolean;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (technicianId: string, date: string, timeSlot: string, description: string, packageId?: string) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, timeSlot: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  updateAppointmentChecklist: (id: string, checklist: Appointment["checklist"]) => void;

  // Technicians
  technicians: User[];

  // Maintenance
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

// SEED DATA
const defaultPackages: Package[] = [
  {
    id: "starter",
    name: "Starter Nest Package",
    description: "Ideal for apartments or small condos to begin your smart home journey.",
    price: 499,
    features: [
      "SmartNest Central Bridge",
      "2x Smart Energy Bulbs (RGBW)",
      "1x Smart Power Plug with energy monitoring",
      "1x Smart Motion Sensor",
      "Basic AI energy optimization recommendations",
      "Self-installation or remote technician guidance"
    ]
  },
  {
    id: "premium",
    name: "Premium Automation Package",
    description: "The most popular suite of devices for single-family homes seeking safety and efficiency.",
    price: 1299,
    features: [
      "SmartNest Central Bridge (Pro)",
      "4x Smart Energy Bulbs & 2x Dimmer Switches",
      "1x AI Smart Thermostat (Multi-zone support)",
      "1x Secure Smart Deadbolt with keypad",
      "1x Video Doorbell (1080p HD, AI motion alerts)",
      "1x Outdoor Security Camera",
      "Full AI energy & safety insights dashboard",
      "Professional technician installation included"
    ]
  },
  {
    id: "luxury",
    name: "Luxury Smart Haven",
    description: "Enterprise-grade automation and safety configuration for complete peace of mind.",
    price: 2999,
    features: [
      "SmartNest Central Bridge (Enterprise, offline backup)",
      "10x Smart Energy Bulbs & 4x Smart Dimmer Switches",
      "2x AI Smart Thermostats (Multi-zone climate sync)",
      "2x Secure Smart Deadbolts (Biometric / Keyless)",
      "1x Video Doorbell Pro (2K HDR, face recognition)",
      "3x Indoor/Outdoor Floodlight Cameras",
      "1x Whole-Home Smart Energy Metering system",
      "1x Smart Water Shut-off Valve (Leak detector)",
      "Priority Technician support & lifetime warranty",
      "Custom routine scripting & voice control setup"
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

  // Simulated Technicians (available for booking/assignments)
  const technicians: User[] = [
    { id: "tech-1", name: "Alex Smith", email: "tech1@smartnest.ai", role: "technician", phone: "+1 (512) 555-0192", created_at: "2025-01-10" },
    { id: "tech-2", name: "Jordan Brooks", email: "tech2@smartnest.ai", role: "technician", phone: "+1 (512) 555-0143", created_at: "2025-03-22" },
    { id: "tech-3", name: "Elena Rostova", email: "tech3@smartnest.ai", role: "technician", phone: "+1 (512) 555-0177", created_at: "2025-05-18" }
  ];

  // Initialize DB with seed data if localStorage is empty
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("sn_user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedHomes = localStorage.getItem("sn_homes");
      const storedDevices = localStorage.getItem("sn_devices");
      const storedOrders = localStorage.getItem("sn_orders");
      const storedAppointments = localStorage.getItem("sn_appointments");
      const storedMaintenance = localStorage.getItem("sn_maintenance");
      const storedReports = localStorage.getItem("sn_reports");
      const storedChat = localStorage.getItem("sn_chat");

      if (storedHomes) setHomes(JSON.parse(storedHomes));
      else {
        const seedHome: Home = {
          id: "home-1",
          user_id: "user-1", // John Doe (Homeowner)
          house_type: "Single Family",
          rooms: 5,
          address: "1248 Nesting Lane",
          city: "Austin",
          state: "TX",
          zipcode: "78704"
        };
        setHomes([seedHome]);
        localStorage.setItem("sn_homes", JSON.stringify([seedHome]));
      }

      if (storedDevices) setDevices(JSON.parse(storedDevices));
      else {
        const seedDevices: Device[] = [
          {
            id: "dev-1",
            home_id: "home-1",
            device_name: "Ecobee Smart Thermostat",
            category: "climate",
            manufacturer: "Ecobee",
            status: "active",
            battery: -1, // Wired
            firmware: "v4.7.12",
            health: 98,
            last_service: "2026-04-12",
            location: "Living Room hallway",
            warranty_expires: "2027-10-15",
            age_months: 18,
            value: 249
          },
          {
            id: "dev-2",
            home_id: "home-1",
            device_name: "Yale Assure Lock 2",
            category: "security",
            manufacturer: "Yale",
            status: "warning", // Warning status
            battery: 12, // Needs replacement soon!
            firmware: "v1.18.2",
            health: 84,
            last_service: "2026-03-01",
            location: "Front Door",
            warranty_expires: "2026-11-20",
            age_months: 20,
            value: 220
          },
          {
            id: "dev-3",
            home_id: "home-1",
            device_name: "Ring Video Doorbell Pro 2",
            category: "security",
            manufacturer: "Ring",
            status: "active",
            battery: 88,
            firmware: "v5.2.1",
            health: 95,
            last_service: "2026-02-15",
            location: "Front Porch",
            warranty_expires: "2027-02-15",
            age_months: 12,
            value: 250
          },
          {
            id: "dev-4",
            home_id: "home-1",
            device_name: "Philips Hue Bridge",
            category: "bridge",
            manufacturer: "Philips",
            status: "active",
            battery: -1, // Wired
            firmware: "v1.55.0",
            health: 100,
            last_service: "2026-05-10",
            location: "Network Closet",
            warranty_expires: "2028-05-10",
            age_months: 2,
            value: 60
          },
          {
            id: "dev-5",
            home_id: "home-1",
            device_name: "Hue Living Room Lightbar",
            category: "lighting",
            manufacturer: "Philips",
            status: "active",
            battery: -1, // Wired
            firmware: "v1.55.2",
            health: 99,
            last_service: "2026-05-10",
            location: "Living Room",
            warranty_expires: "2028-05-10",
            age_months: 2,
            value: 80
          }
        ];
        setDevices(seedDevices);
        localStorage.setItem("sn_devices", JSON.stringify(seedDevices));
      }

      if (storedOrders) setOrders(JSON.parse(storedOrders));
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
        localStorage.setItem("sn_orders", JSON.stringify(seedOrders));
      }

      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
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
            description: "Install & calibrate Outdoor Smart Cameras and set up automated routines.",
            address: "1248 Nesting Lane, Austin, TX 78704",
            checklist: [
              { item: "Mount front garage outdoor floodlight camera", done: false },
              { item: "Wire power to backyard pathway sensor bridge", done: false },
              { item: "Configure Zigbee network signals across hallways", done: false },
              { item: "Train homeowner on the SmartNest local app", done: false }
            ]
          }
        ];
        setAppointments(seedAppointments);
        localStorage.setItem("sn_appointments", JSON.stringify(seedAppointments));
      }

      if (storedMaintenance) setMaintenanceLogs(JSON.parse(storedMaintenance));
      else {
        const seedMaintenance: Maintenance[] = [
          {
            id: "maint-1",
            device_id: "dev-2",
            device_name: "Yale Assure Lock 2",
            technician_id: "tech-1",
            technician_name: "Alex Smith",
            report: "Cleaned internal gears and recalibrated lock strike plate. Checked connection to Nest Central Bridge. Updated firmware to v1.18.2. Reminded customer that batteries will need replacement in roughly 3 months.",
            service_date: "2026-03-01",
            next_service: "2026-09-01"
          }
        ];
        setMaintenanceLogs(seedMaintenance);
        localStorage.setItem("sn_maintenance", JSON.stringify(seedMaintenance));
      }

      if (storedReports) setAiReports(JSON.parse(storedReports));
      else {
        const seedReport: AIReport = {
          id: "rep-1",
          user_id: "user-1",
          recommendation: "Increase smart lighting automations and replace lock batteries.",
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
              "Schedule thermostat setback from 8 AM to 5 PM (-15% heating/cooling bills)",
              "Configure Motion-activated lights in garages and corridors to auto-turnoff after 2 minutes",
              "Install Smart Blinds on south-facing windows to lower active cooling costs during peak sunlight"
            ]
          },
          maintenance_prediction: [
            {
              deviceId: "dev-2",
              deviceName: "Yale Assure Lock 2",
              failureProbability: 92,
              predictedFailureDate: "2026-08-05",
              reason: "Battery capacity under 15% and motor drawing elevated current.",
              recommendation: "Replace 4x AA batteries immediately. Clean latch friction surfaces."
            }
          ],
          created_at: "2026-07-20"
        };
        setAiReports([seedReport]);
        localStorage.setItem("sn_reports", JSON.stringify([seedReport]));
      }

      if (storedChat) setChatHistory(JSON.parse(storedChat));
      else {
        const seedChat: ChatMessage[] = [
          { id: "chat-1", sender: "ai", text: "Hello! I am your SmartNest AI Consultant. How can I help you automate and secure your home today?", timestamp: new Date().toLocaleTimeString() }
        ];
        setChatHistory(seedChat);
        localStorage.setItem("sn_chat", JSON.stringify(seedChat));
      }
    }
  }, []);

  // Save changes wrapper
  const saveState = (key: string, data: any, stateSetter: Function) => {
    stateSetter(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Auth Operations
  const login = (email: string, role: User["role"]): boolean => {
    let dummyUser: User;
    if (email.includes("admin") || role === "admin") {
      dummyUser = { id: "user-admin", name: "Sarah Jenkins", email: email || "admin@smartnest.ai", role: "admin", phone: "+1 (512) 555-0901", created_at: "2026-01-01" };
    } else if (email.includes("tech") || role === "technician") {
      dummyUser = { id: "tech-1", name: "Alex Smith", email: email || "tech@smartnest.ai", role: "technician", phone: "+1 (512) 555-0192", created_at: "2026-01-10" };
    } else {
      dummyUser = { id: "user-1", name: "John Doe", email: email || "homeowner@smartnest.ai", role: "homeowner", phone: "+1 (512) 555-0100", created_at: "2026-02-01" };
    }
    setUser(dummyUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("sn_user", JSON.stringify(dummyUser));
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sn_user");
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
      localStorage.setItem("sn_user", JSON.stringify(newUser));
    }
    
    // Create matching initial home if homeowner
    if (role === "homeowner") {
      const newHome: Home = {
        id: `home-${Date.now()}`,
        user_id: newUser.id,
        house_type: "Single Family",
        rooms: 4,
        address: "Enter Address",
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
      localStorage.setItem("sn_user", JSON.stringify(updatedUser));
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

  // Devices Operations
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

    // Auto-create booking for installation
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
      description: `Installation of SmartNest ${pkg.name}. Professional setup of smart systems, configuration of routines and optimization algorithms.`,
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
      address: activeHome ? `${activeHome.address}, ${activeHome.city}, ${activeHome.state} ${activeHome.zipcode}` : "Main Home Address",
      checklist: [
        { item: "Initial hardware assessment", done: false },
        { item: "Device deployment and installation", done: false },
        { item: "Firmware setup & hub sync", done: false },
        { item: "Post-install safety and energy audit", done: false }
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
              device_name: `${pkg.name.split(" ")[0]} Hub Controller`,
              category: "bridge",
              manufacturer: "SmartNest",
              status: "active",
              battery: -1,
              firmware: "v5.0.0",
              health: 100,
              last_service: apt.appointment_date,
              location: "Main hallway",
              warranty_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              age_months: 0,
              value: pkg.price * 0.25
            },
            {
              id: `dev-pkg-2-${Date.now()}`,
              home_id: homeId,
              device_name: "SmartNest Secure Deadbolt",
              category: "security",
              manufacturer: "SmartNest",
              status: "active",
              battery: 100,
              firmware: "v2.0.1",
              health: 100,
              last_service: apt.appointment_date,
              location: "Front Door",
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

    // Also update device last service date and restore battery/health
    const updatedDevices = devices.map(d => {
      if (d.id === logData.device_id) {
        return {
          ...d,
          battery: d.battery === -1 ? -1 : 100, // Refilled battery
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
      `Set Smart Thermostat ECO mode during peak rate hours (expected savings: $${Math.round(monthlySavings * 0.4)}/mo)`,
      `Configure Smart Bulbs to dim 25% after 9 PM (expected savings: $${Math.round(monthlySavings * 0.15)}/mo)`,
      `Add Smart Outlets with automatic load shedding for standby appliances (expected savings: $${Math.round(monthlySavings * 0.15)}/mo)`
    ];

    // Predict warnings based on device age or battery
    const predictions = devices
      .filter(d => d.battery > 0 && d.battery < 30 || d.health < 90)
      .map(d => ({
        deviceId: d.id,
        deviceName: d.device_name,
        failureProbability: d.battery > 0 && d.battery < 15 ? 95 : 75,
        predictedFailureDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        reason: d.battery < 15 ? "Critical battery state" : "Device firmware outdated & health index low.",
        recommendation: d.battery < 15 ? "Schedule routine battery replacement." : "Reflash firmware and reset device controller."
      }));

    const newReport: AIReport = {
      id: `rep-${Date.now()}`,
      user_id: user.id,
      recommendation: `Recommended implementation: Deploy a SmartNest Premium Package to lower heating/cooling loads. Configure schedules for ${appliances} appliances.`,
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
        localStorage.setItem("sn_chat", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearChat = () => {
    const initialChat = [
      { id: "chat-1", sender: "ai" as const, text: "Hello! I am your SmartNest AI Consultant. How can I help you automate and secure your home today?", timestamp: new Date().toLocaleTimeString() }
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
