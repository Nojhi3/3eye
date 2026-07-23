"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, User, Wrench, Shield, Lock, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["homeowner", "technician", "admin"] as const)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "homeowner"
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      const success = login(data.email, data.role);
      setLoading(false);
      if (success) {
        if (data.role === "admin") router.push("/admin");
        else if (data.role === "technician") router.push("/technician");
        else router.push("/dashboard");
      } else {
        setError("Invalid credentials. Try using one-click demo login below!");
      }
    }, 800);
  };

  const handleQuickLogin = (role: "homeowner" | "technician" | "admin") => {
    setLoading(true);
    let email = "homeowner@smartnest.ai";
    if (role === "technician") email = "tech@smartnest.ai";
    if (role === "admin") email = "admin@smartnest.ai";

    setValue("email", email);
    setValue("password", "password");
    setValue("role", role);

    setTimeout(() => {
      login(email, role);
      setLoading(false);
      if (role === "admin") router.push("/admin");
      else if (role === "technician") router.push("/technician");
      else router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Brand logo header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SmartNest <span className="text-indigo-400">AI</span></span>
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Securely sign in to manage your automated home
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Role selection tab pills */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(["homeowner", "technician", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue("role", r)}
                    className="py-2 text-[11px] font-bold rounded-lg capitalize transition-all duration-200"
                    {...register("role")}
                    style={{
                      backgroundColor:
                        errors.role?.message === undefined &&
                        r === (document.querySelector('input[name="role"]:checked') as HTMLInputElement)?.value
                          ? "#312E81"
                          : ""
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex justify-around mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" value="homeowner" {...register("role")} className="sr-only" />
                  <span className="text-xs font-medium text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 checked:bg-indigo-600 select-none capitalize">
                    Homeowner
                  </span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" value="technician" {...register("role")} className="sr-only" />
                  <span className="text-xs font-medium text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 checked:bg-indigo-600 select-none capitalize">
                    Technician
                  </span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" value="admin" {...register("role")} className="sr-only" />
                  <span className="text-xs font-medium text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 checked:bg-indigo-600 select-none capitalize">
                    Admin
                  </span>
                </label>
              </div>
              {errors.role && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.role.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password.message}</p>}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign In to SmartNest"
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-3">
              One-Click Demo Personas
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin("homeowner")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all text-center group"
              >
                <User className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-300">Homeowner</span>
              </button>
              <button
                onClick={() => handleQuickLogin("technician")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all text-center group"
              >
                <Wrench className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-300">Technician</span>
              </button>
              <button
                onClick={() => handleQuickLogin("admin")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all text-center group"
              >
                <Shield className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-300">Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Switch Link */}
        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
