"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["homeowner", "technician"] as const)
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "homeowner"
    }
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      try {
        signUp(data.name, data.email, data.phone, data.role);
        setLoading(false);
        if (data.role === "technician") {
          router.push("/technician");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        setLoading(false);
        setError("An error occurred during registration. Please try again.");
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand logo header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SmartNest <span className="text-indigo-400">AI</span></span>
          </Link>
          <h2 className="mt-2 text-2xl font-extrabold text-white tracking-tight">Create your account</h2>
          <p className="mt-1 text-sm text-slate-400">
            Join the intelligent home automation revolution
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Role Switcher */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Join As
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setValue("role", "homeowner")}
                  className={`py-2.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    selectedRole === "homeowner"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Homeowner
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "technician")}
                  className={`py-2.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    selectedRole === "technician"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Technician
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  placeholder="(512) 555-0100"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  {...register("phone")}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
              {errors.password && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Switch back link */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
