"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  TrendingUp,
  Wrench,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  Star,
  Zap,
  Lock,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      title: "AI Startup Architect",
      description: "Chat with our local Gemini-powered architect to get customized plant layouts, machinery budgets, and feasibility scores suited for your business model.",
      icon: Bot,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "AI Capital Estimator",
      description: "Model your machinery costs and initial cash flow metrics. Our engine builds plant projections and amortization setups to estimate clear ROI indices.",
      icon: TrendingUp,
      color: "from-emerald-400 to-teal-600"
    },
    {
      title: "Feasibility Diagnostics",
      description: "Real-time facility audits that track machinery health indexes, log operating hours, check material load drops, and schedule dispatches automatically.",
      icon: Wrench,
      color: "from-amber-400 to-orange-600"
    },
    {
      title: "Expert Consultant Network",
      description: "Skip configuration hurdles. Book certified industrial setup consultants who handle floor zoning, safety checks, conveyor sync, and staff training.",
      icon: Cpu,
      color: "from-indigo-400 to-purple-600"
    }
  ];

  const packages = [
    {
      name: "Eco-Friendly Blueprint",
      price: "$499",
      period: "one-time",
      desc: "Ideal for small operations in recycled goods, organic packaging, or bio-plastics.",
      features: [
        "IdeaForge Central Controller",
        "2x Production Line Sensor Nodes",
        "1x Automated Equipment Relay Switch",
        "1x Quality Assurance Telemetry Sensor",
        "AI financial payback & operational efficiency audit",
        "Remote consultant setup guidance"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Premium Setup",
      price: "$1,299",
      period: "one-time",
      desc: "Our most popular setup for automated custom packaging or local assembly plants.",
      features: [
        "IdeaForge Central Controller (Pro Edition)",
        "4x Production Sensors & 2x Automated Calibrators",
        "1x AI Climate & Temperature Heat Venting Module",
        "1x High-Definition Assembly Line Monitor Cam",
        "1x Central Safety Shut-off Control Gateway",
        "Full AI metrics & raw materials supply insights",
        "Professional expert consultant setup included"
      ],
      cta: "Buy Premium",
      popular: true
    },
    {
      name: "Luxury Smart Plant",
      price: "$2,999",
      period: "one-time",
      desc: "Enterprise-grade complete machinery integration and production-flow automation.",
      features: [
        "IdeaForge Central Gateway (Enterprise)",
        "10x Production Line Sensors & 4x Calibrators",
        "2x AI Smart Thermal Regulators (Venting & Cooling)",
        "2x Biometric Facility Entrance Access Nodes",
        "1x 2K Quality Inspection Monitor Camera",
        "3x Assembly Monitor cams for floor managers",
        "1x Whole-Plant Grid Power Optimizer Logger",
        "1x Automated Safety Shut-off Material Feed Valve",
        "Priority expert assistance & lifetime layout warranty",
        "Custom floor script automations & scale modules"
      ],
      cta: "Go Unlimited",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does the AI Feasibility Engine work?",
      a: "Our recommendation engine takes inputs about your industry sector, target capacity, capital budget, and top operational priorities (e.g. ESG compliance, speed, high margins). It runs these through a custom prompt architecture using Google's Gemini model to produce tailored plant recommendations, estimated setup costs, and ROI payback metrics."
    },
    {
      q: "Does IdeaForge require expert consultant setup?",
      a: "The Starter package is optimized for easy self-assembly. The Premium and Luxury packages include complete professional setup by certified consultants in our network. You can schedule audits and view checkouts directly inside the app."
    },
    {
      q: "What is Feasibility Diagnostics?",
      a: "Feasibility Diagnostics continuously tracks operational telemetry like sensor logs, material fill capacities, machinery age, and maintenance logs. Using this, the AI predicts potential failures before they block lines (e.g. flagging extruder nozzle degradation) and lets you dispatch expert calibrators instantly."
    },
    {
      q: "Can I use existing manufacturing machinery?",
      a: "Yes! The IdeaForge Central Gateway is built on industry-standard IoT and industrial protocols (Modbus, OPC UA, Zigbee), letting you connect existing devices from Creality, Yale, Philips, and other providers seamlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center cursor-pointer">
            <span className="text-lg font-bold text-white tracking-tight">IdeaForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center justify-center px-4 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/15 active:scale-95 transition-all"
            >
              Demo Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Spacing spacer */}
          <div className="pt-2" />

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Architect and Optimize Your Manufacturing Plans with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">
              Intelligent AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            IdeaForge merges predictive machinery diagnostics, dynamic resource planning, 
            and professional setup consultant networks into a single, cohesive industrial planning ecosystem.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/login"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 group transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center px-8 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Launch Live Demo
            </Link>
          </div>

          {/* Interactive Screen Mockup */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/20 p-2 shadow-2xl backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-emerald-500/5 rounded-3xl pointer-events-none" />
              <div className="rounded-2xl border border-slate-850 overflow-hidden bg-slate-950 aspect-[16/9] relative group">
                <img
                  src="/image.png"
                  alt="IdeaForge Operating Core Dashboard"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <Link
                    href="/auth/login"
                    className="inline-flex h-11 items-center justify-center px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Enter Dashboard Workspace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">AI Startup & Manufacturing Suite</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              We leverage AI analytics to provide capital feasibility diagnostics, predictive machinery repair warnings, and automated factory resource optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-slate-900/30 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 hover:border-slate-800 hover:bg-slate-900/50 transition-all group"
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  <feat.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Workflow & Delivery</h2>
            <p className="text-sm text-slate-400 font-medium">
              From automated startup idea discovery to certified setup consultant deployment—we guide you in 4 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                label: "AI Feasibility Audit",
                desc: "Describe your industry sector, budget, and scale target. Gemini builds recommendations, cost projections, and ROI metrics."
              },
              {
                step: "02",
                label: "Select Plant Blueprint",
                desc: "Choose from Eco-Friendly, Premium, or Luxury options with comparative machinery inventories and buy blueprint setups."
              },
              {
                step: "03",
                label: "Consultant Floor Mapping",
                desc: "Certified consultants assist on-site, verify layout permissions, test extruder calibration, and train operators."
              },
              {
                step: "04",
                label: "Track & Scale",
                desc: "Monitor raw materials, review diagnostics warnings, toggle machinery operational statuses, and query the AI architect."
              }
            ].map((item, index) => (
              <div key={item.step} className="space-y-4 relative">
                <div className="text-4xl font-extrabold text-indigo-500/20 tracking-wider">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-white">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Machinery & Setup Pricing</h2>
            <p className="text-sm text-slate-400 font-medium">
              Choose the blueprint and equipment package that fits your business. Complete factory setups with transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-3xl border p-8 flex flex-col relative transition-all ${
                  pkg.popular
                    ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "bg-slate-900/30 border-slate-900 hover:border-slate-800"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 min-h-[32px]">{pkg.desc}</p>
                  <div className="mt-4 flex items-baseline gap-1 text-white">
                    <span className="text-3xl font-extrabold tracking-tight">{pkg.price}</span>
                    <span className="text-xs text-slate-500 font-medium capitalize">/{pkg.period}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 mb-8 flex-1">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/login"
                  className={`w-full h-11 inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    pkg.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/15"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-200"
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Loved by Homeowners</h2>
            <p className="text-sm text-slate-400 font-medium">
              Read how families have achieved lower electricity bills and improved home security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "The AI energy optimizer predicted I would save $35 a month. Six months in, my bills are down almost $45 monthly! The automated thermostat setbacks work completely in the background.",
                name: "Marcus Vane",
                role: "Homeowner, Austin, TX",
                stars: 5
              },
              {
                text: "Predictive maintenance saved us! The app flagged a warning card that our front lock battery was at 10% and starting to jam. I booked a tech repair from my dashboard with one click.",
                name: "Clara Oswald",
                role: "Homeowner, Denver, CO",
                stars: 5
              },
              {
                text: "Admin suite tracking is fantastic for managing our portfolio of three smart properties. The revenue reports, technician checkouts, and device health audits are clean and extremely premium.",
                name: "Sarah Jenkins",
                role: "Property Manager, Miami, FL",
                stars: 5
              }
            ].map((test, index) => (
              <div key={test.name} className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{test.text}&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-900 flex flex-col">
                  <span className="text-xs font-bold text-white">{test.name}</span>
                  <span className="text-[10px] text-slate-500">{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section id="faqs" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400 font-medium">
              Got questions? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors"
                >
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      activeFaq === index ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-slate-900/60 text-xs text-slate-400 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer Panel */}
      <section className="py-20 border-t border-slate-900 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 p-8 md:p-12 text-center space-y-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
            <h2 className="text-3xl font-extrabold text-white tracking-tight max-w-md mx-auto">
              Ready to design your setup blueprint?
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Register a free account, simulate factory capital configurations, and book expert consulting audits instantly.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex h-11 items-center justify-center px-8 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/15"
              >
                Launch Demo Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <Link href="/" className="flex items-center cursor-pointer">
            <span className="text-sm font-bold text-white tracking-tight">IdeaForge</span>
          </Link>
          <p className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
          </p>
          <div className="flex gap-4 text-[11px] font-bold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
