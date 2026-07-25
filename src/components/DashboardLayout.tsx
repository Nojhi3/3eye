"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Home,
  Cpu,
  Calendar,
  Wrench,
  Bot,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Activity,
  Layers,
  Settings,
  HelpCircle
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, login, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // If user is not logged in, show a prompt or redirect
  React.useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-905 text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-slate-400 font-medium">Redirecting to Login...</p>
        </div>
      </div>
    );
  }

  // Navigation config based on user role
  const homeownerNavigation = [
    { name: "Overview Dashboard", href: "/dashboard", icon: Home },
    { name: "Automation Packages", href: "/packages", icon: Layers },
    { name: "Device Management", href: "/devices", icon: Cpu },
    { name: "Appointments & Setup", href: "/appointments", icon: Calendar },
    { name: "Predictive Maintenance", href: "/maintenance", icon: Wrench },
    { name: "AI Nest Consultant", href: "/ai-assistant", icon: Bot },
    { name: "My Profile Details", href: "/profile", icon: User }
  ];

  const technicianNavigation = [
    { name: "Technician Jobs", href: "/technician", icon: Activity },
    { name: "Predictive Maintenance", href: "/maintenance", icon: Wrench },
    { name: "AI Nest Consultant", href: "/ai-assistant", icon: Bot },
    { name: "My Profile Details", href: "/profile", icon: User }
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
    { name: "Automation Packages", href: "/packages", icon: Layers },
    { name: "Device Directory", href: "/devices", icon: Cpu },
    { name: "Appointment logs", href: "/appointments", icon: Calendar },
    { name: "Predictive Maintenance", href: "/maintenance", icon: Wrench },
    { name: "AI Nest Consultant", href: "/ai-assistant", icon: Bot },
    { name: "Admin Profile", href: "/profile", icon: User }
  ];

  const navigation =
    user.role === "admin"
      ? adminNavigation
      : user.role === "technician"
      ? technicianNavigation
      : homeownerNavigation;

  const handleRoleChange = (newRole: "homeowner" | "technician" | "admin") => {
    login("", newRole); // Login sets a dummy user with the corresponding role
    setShowRoleMenu(false);
    
    // Redirect to default page for that role
    if (newRole === "admin") {
      router.push("/admin");
    } else if (newRole === "technician") {
      router.push("/technician");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Section */}
          <div className="flex items-center h-16 px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center cursor-pointer">
              <span className="font-bold text-base tracking-tight text-white">SmartNest</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 gap-3 group ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                      active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 font-bold text-indigo-400 uppercase">
                {user.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize truncate">{user.role}</p>
              </div>
              <button
                onClick={() => logout()}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:pl-64 h-full">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-white tracking-tight hidden sm:block">
              {navigation.find((n) => n.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Role: <span className="text-indigo-400 capitalize">{user.role}</span></span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowRoleMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-xl z-30">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Switch Demo Persona
                    </div>
                    <button
                      onClick={() => handleRoleChange("homeowner")}
                      className={`flex w-full items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                        user.role === "homeowner"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      Homeowner (John Doe)
                    </button>
                    <button
                      onClick={() => handleRoleChange("technician")}
                      className={`flex w-full items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                        user.role === "technician"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      Technician (Alex Smith)
                    </button>
                    <button
                      onClick={() => handleRoleChange("admin")}
                      className={`flex w-full items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                        user.role === "admin"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      Administrator (Sarah J.)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center cursor-pointer">
                <span className="font-bold text-base text-white tracking-tight">SmartNest</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl gap-3 ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-indigo-400 font-bold uppercase">
                  {user.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize truncate">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
