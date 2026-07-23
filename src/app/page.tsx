"use client";

import React, { useState } from "react";
import Link from "next/link";
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
      title: "AI Smart Home Consultant",
      description: "Chat with our local Gemini-powered consultant to get custom device audits, ROI metrics, and package recommendations suited for your exact floor plan.",
      icon: Bot,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Intelligent Energy Optimizer",
      description: "Model your electric bills and utility load profiles. Our engine builds local thermostat setbacks and schedules to shave up to 28% off peak usage.",
      icon: TrendingUp,
      color: "from-emerald-400 to-teal-600"
    },
    {
      title: "AI Predictive Maintenance",
      description: "Real-time health audits that calculate failure probabilities, track battery wear, log device ages, and dispatch technician visits automatically.",
      icon: Wrench,
      color: "from-amber-400 to-orange-600"
    },
    {
      title: "Certified Technician Network",
      description: "Skip complex configuration. Book certified smart home technicians who handle structural wiring, setup, mesh tuning, and local training.",
      icon: Cpu,
      color: "from-indigo-400 to-purple-600"
    }
  ];

  const packages = [
    {
      name: "Starter Nest",
      price: "$499",
      period: "one-time",
      desc: "Ideal for apartments or small condos to begin your smart home journey.",
      features: [
        "SmartNest Central Bridge",
        "2x Smart Energy Bulbs (RGBW)",
        "1x Smart Power Plug (Energy monitor)",
        "1x Smart Motion Sensor",
        "AI Energy Recommendation Engine",
        "Remote Technician setup guidance"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Premium Automation",
      price: "$1,299",
      period: "one-time",
      desc: "The most popular suite of devices for single-family homes seeking safety and efficiency.",
      features: [
        "SmartNest Central Bridge (Pro)",
        "4x Smart Bulbs & 2x Dimmer Switches",
        "1x AI Smart Thermostat (Multi-zone)",
        "1x Secure Smart Deadbolt (Keypad)",
        "1x Ring Video Doorbell (1080p HD)",
        "1x Outdoor Security Camera",
        "Full AI dashboard insights suite",
        "Professional Technician Installation"
      ],
      cta: "Buy Premium",
      popular: true
    },
    {
      name: "Luxury Smart Haven",
      price: "$2,999",
      period: "one-time",
      desc: "Enterprise-grade automation and safety configuration for complete peace of mind.",
      features: [
        "Enterprise Hub (Offline storage)",
        "10x Smart Bulbs & 4x Dimmer Switches",
        "2x AI Smart Thermostats (Zone climate)",
        "2x Secure Deadbolts (Biometric)",
        "1x Video Doorbell Pro (2K HDR)",
        "3x Floodlight Cameras",
        "Whole-Home Smart Energy Metering",
        "Smart Leak Detector & Water Valve",
        "Lifetime Warranty & Tech Support",
        "Professional Technician Installation"
      ],
      cta: "Go Unlimited",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does the AI Recommendation Engine work?",
      a: "Our recommendation engine takes inputs about your home layout, family size, budget, and top priorities (e.g. security, energy efficiency, comfort). It runs these through a custom prompt architecture using Google's Gemini model to produce custom package recommendations, estimated installation costs, and specific monthly energy payback metrics."
    },
    {
      q: "Does SmartNest AI require professional installation?",
      a: "The Starter package is optimized for easy self-installation. The Premium and Luxury packages include complete white-glove professional installation by certified technicians in our network. You can schedule, reschedule, and view checklists for your appointments directly inside the app."
    },
    {
      q: "What is Predictive Maintenance?",
      a: "Predictive Maintenance continuously tracks telemetry like battery levels, device age, firmware logs, and service history. Using this data, the AI predicts potential failures before they occur (e.g. warning cards for dead deadbolt batteries or camera offline warnings) and lets you schedule technician repairs with one click."
    },
    {
      q: "Can I use existing smart home devices?",
      a: "Yes! The SmartNest Central Bridge is built on Matter and Zigbee protocols, letting you connect existing devices from Apple Home, Google Nest, Philips Hue, Yale, and Ring seamlessly."
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
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-md shadow-indigo-500/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SmartNest <span className="text-indigo-400">AI</span></span>
          </div>

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
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" />
            Empowered by Gemini AI
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Automate and Secure Your Home with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">
              Intelligent AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            SmartNest AI merges predictive device maintenance, dynamic energy savings, 
            and white-glove professional installation into a single, cohesive automation platform.
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
              <div className="rounded-2xl border border-slate-850 overflow-hidden bg-slate-950 aspect-[16/9] flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
                <div className="z-10 text-center space-y-4 px-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 shadow-lg">
                    <Cpu className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white">SmartNest Operating Core</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Interactive homeowner dashboard. Generates real-time device health schedules, smart routines, and utility charts.
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 group"
                  >
                    Enter dashboard workspace
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
            <h2 className="text-3xl font-extrabold text-white tracking-tight">AI Smart Home Suite</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              We leverage local and cloud intelligence to provide security diagnostics, predictive repairs, and billing optimization that standard providers cannot support.
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
              From automated device discovery to certified technician deployment—we guide you in 4 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                label: "AI Audit & Consultation",
                desc: "Describe your home type, appliances, and goals. Gemini builds recommendations, budgets, and savings reports."
              },
              {
                step: "02",
                label: "Select Automation Package",
                desc: "Choose from Starter, Premium, or Luxury options with comparative summaries and buy instantly."
              },
              {
                step: "03",
                label: "Technician Installation",
                desc: "Certified technicians visit, handle mountings, wiring, set up the Central Bridge, and train your family."
              },
              {
                step: "04",
                label: "Optimize & Save",
                desc: "Monitor energy, review predictions, toggle device states, and chat with AI in real time."
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
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Automation Pricing</h2>
            <p className="text-sm text-slate-400 font-medium">
              Choose the package that fits your home. Complete setups with transparent pricing.
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
                {activeFaq === index && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-900/60 text-xs text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
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
              Ready to build your SmartNest?
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Register a free account, test out the custom energy optimization modeling, and book local setup services instantly.
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
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">SmartNest <span className="text-indigo-400">AI</span></span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} SmartNest AI Inc. All rights reserved. Created with Next.js 15, TailwindCSS, & Gemini AI.
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
