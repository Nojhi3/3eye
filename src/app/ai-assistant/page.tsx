"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Bot, Send, Sparkles, AlertTriangle, Trash2, ArrowUpRight, HelpCircle, User } from "lucide-react";

export default function AIAssistantPage() {
  const { chatHistory, addChatMessage, clearChat } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What smart home package matches my 3-room home and $1500 budget?",
    "How can I set up thermostat schedules to lower my summer electric bills?",
    "Review the predictive maintenance risks for my Yale Deadbolt battery.",
    "Explain the payback period of the Luxury Smart Haven package."
  ];

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    addChatMessage("user", textToSend);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      const data = await response.json();
      setLoading(false);
      if (data && data.response) {
        addChatMessage("ai", data.response);
      } else {
        addChatMessage("ai", "I'm sorry, I encountered an error communicating with the Gemini core. Please check your environment variables or try again later!");
      }
    } catch (err) {
      setLoading(false);
      // Fallback helper in case of network issues - gives an intelligent mockup reply
      let mockReply = "Hello! I am simulating a response because the local API route is offline. Let me know if you would like me to explain packages or check device health warnings.";
      if (textToSend.toLowerCase().includes("budget") || textToSend.toLowerCase().includes("package")) {
        mockReply = "Based on your budget, I recommend the Premium Automation Package ($1,299). It includes a multi-zone thermostat which shaves roughly 20-28% off electric bills, plus security coverage with a Deadbolt keypad, Ring Video Doorbell, and an outdoor camera. Professional installation is fully included in the price!";
      } else if (textToSend.toLowerCase().includes("thermostat") || textToSend.toLowerCase().includes("electric") || textToSend.toLowerCase().includes("bill")) {
        mockReply = "To lower your bills: \n1. Enable ECO mode setbacks (78°F in summer, 68°F in winter) when geofencing marks you as 'Away'.\n2. Integrate smart blinds to lower active solar heat load during peak solar hours.\n3. Configure Philips Hue lighting bridges to dim 25% after 9 PM. This collectively lowers your monthly bills by an average of $38.50.";
      } else if (textToSend.toLowerCase().includes("yale") || textToSend.toLowerCase().includes("lock") || textToSend.toLowerCase().includes("battery")) {
        mockReply = "Your Yale Assure Lock 2 is reporting a critical battery capacity of 12%. The motor current draws indicate elevated friction. I recommend dispatching a technician to swap the 4x AA batteries and clean the lock latch gears. You can schedule this in the Appointments dashboard with one click!";
      }
      
      addChatMessage("ai", mockReply);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)] min-h-[480px]">
        {/* Left Column: Suggested Prompts Sidebar */}
        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                <Sparkles className="h-3 w-3" />
                Gemini AI Consultant
              </span>
              <h3 className="text-sm font-extrabold text-white">Suggested Prompts</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Click any prompt pill to quickly query the SmartNest AI model.
              </p>
            </div>

            <div className="space-y-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full p-3.5 text-left text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl transition-all group flex items-start gap-1.5"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="leading-normal">{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm("Reset conversation logs?")) clearChat();
            }}
            className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-[10px] font-bold text-slate-400 hover:text-white transition-all bg-slate-950 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear History
          </button>
        </div>

        {/* Right Column (3 spans): Chat Area */}
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between overflow-hidden h-full relative">
          
          {/* Chat History Panel */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-3 max-w-[85%] ${
                  chat.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md ${
                    chat.sender === "user"
                      ? "bg-slate-800 border border-slate-700"
                      : "bg-gradient-to-tr from-indigo-500 to-violet-600"
                  }`}
                >
                  {chat.sender === "user" ? <User className="h-4 w-4 text-indigo-400" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble Content */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      chat.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-slate-950 text-slate-200 border border-slate-850 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {chat.text}
                  </div>
                  <span className={`text-[9px] text-slate-500 font-bold block ${chat.sender === "user" ? "text-right" : ""}`}>
                    {chat.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Thinking Indicator */}
            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="rounded-2xl px-4 py-3 bg-slate-950 text-slate-400 border border-slate-850 rounded-tl-none flex items-center gap-2 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="ml-1 text-[10px] text-slate-500 uppercase tracking-wider">SmartNest is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Container */}
          <form onSubmit={handleFormSubmit} className="flex gap-3 pt-4 border-t border-slate-850">
            <input
              type="text"
              placeholder="Ask SmartNest AI about budget fits, device alerts, or thermostat setback setups..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      </div>
    </DashboardLayout>
  );
}
