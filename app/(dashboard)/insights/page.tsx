"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { 
  Wind, Car, Zap, Clock, TrendingUp, Calendar, LayoutDashboard, Sparkles, ArrowRight, Activity
} from "lucide-react"
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from "recharts"

// --- BANDRA SPECIFIC DATA GENERATORS ---
const getBandraData = (view: string) => {
  if (view === "Day") {
    return {
      metrics: [
        { label: "Air Quality", value: "112", unit: "AQI", sub: "vs 98 yesterday", trend: "+14%", icon: Wind, color: "text-amber-400" },
        { label: "Avg Traffic", value: "24", unit: "km/h", sub: "vs 30 km/h yesterday", trend: "-20%", icon: Car, color: "text-rose-400" },
        { label: "Energy Used", value: "12", unit: "kWh", sub: "vs 10 kWh yesterday", trend: "+20%", icon: Zap, color: "text-emerald-400" },
        { label: "Travel Time", value: "45", unit: "min", sub: "vs 38 min yesterday", trend: "+18%", icon: Clock, color: "text-rose-400" },
      ],
      chart: Array.from({ length: 24 }, (_, i) => ({ 
        label: `${i}:00`, 
        current: 80 + Math.sin(i / 3) * 40 + Math.random() * 20,
        last: 70 + Math.sin(i / 3) * 30 
      })),
      traffic: Array.from({ length: 24 }, (_, i) => ({ 
        label: `${i}:00`, 
        value: (i > 8 && i < 11) || (i > 17 && i < 20) ? 90 : 30 + Math.random() * 20 
      }))
    }
  }
  if (view === "Week") {
    return {
      metrics: [
        { label: "Air Quality", value: "88", unit: "AQI", sub: "vs 105 last week", trend: "-16%", icon: Wind, color: "text-emerald-400" },
        { label: "Avg Traffic", value: "32", unit: "km/h", sub: "vs 28 km/h last week", trend: "+14%", icon: Car, color: "text-emerald-400" },
        { label: "Energy Used", value: "184", unit: "kWh", sub: "vs 210 kWh last week", trend: "-12%", icon: Zap, color: "text-emerald-400" },
        { label: "Travel Time", value: "28", unit: "min", sub: "vs 35 min last week", trend: "-20%", icon: Clock, color: "text-emerald-400" },
      ],
      chart: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ 
        label: d, current: 70 + Math.random() * 40, last: 80 + Math.random() * 30 
      })),
      traffic: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ 
        label: d, value: d === "Sun" ? 40 : 85 
      }))
    }
  }
  // Month View (Default)
  return {
    metrics: [
      { label: "Air Quality", value: "72", unit: "AQI", sub: "vs 85 AQI last month", trend: "-15%", icon: Wind, color: "text-emerald-400" },
      { label: "Avg Traffic", value: "38", unit: "km/h", sub: "vs 42 km/h last month", trend: "-10%", icon: Car, color: "text-amber-400" },
      { label: "Energy Used", value: "740", unit: "kWh", sub: "vs 810 kWh last month", trend: "-8%", icon: Zap, color: "text-emerald-400" },
      { label: "Travel Time", value: "22", unit: "min", sub: "vs 28 min last month", trend: "-21%", icon: Clock, color: "text-emerald-400" },
    ],
    chart: ["W1", "W2", "W3", "W4"].map(w => ({ 
      label: w, current: 60 + Math.random() * 30, last: 70 + Math.random() * 20 
    })),
    traffic: ["W1", "W2", "W3", "W4"].map(w => ({ 
      label: w, value: 60 + Math.random() * 30 
    }))
  }
}

export default function InsightsPage() {
  const [view, setView] = React.useState<"Day" | "Week" | "Month">("Month")
  const data = React.useMemo(() => getBandraData(view), [view])

  return (
    <div className="space-y-6 animate-fade-up p-6 text-slate-200">
      
      {/* 1. AI Summary Header */}
      <div className="bg-[#062d2a] border border-[#0d4d47] rounded-xl p-4 flex gap-4 items-start shadow-lg">
        <div className="bg-[#0f766e] p-2 rounded-lg text-white"><Sparkles className="w-5 h-5" /></div>
        <div>
          <h4 className="text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider mb-1">AI Daily Summary • Bandra West</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {view === "Day" ? "Morning haze at SV Road is clearing. Traffic at Kalanagar Junction is heavy." : 
             view === "Week" ? "Air quality improved significantly after Wednesday's sea breeze." : 
             "Overall pollution is down 15% this month compared to the pre-monsoon average."}
          </p>
        </div>
      </div>

      {/* 2. Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" /> Insights
          </h1>
          <p className="text-slate-400 text-sm">Bandra-Kurla Complex & Residential Hubs</p>
        </div>
        <div className="flex bg-[#111827] p-1 rounded-lg border border-slate-800">
          {["Day", "Week", "Month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                view === v ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.metrics.map((m, i) => (
          <GlassCard key={i} className="p-4 bg-[#111827]/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1", 
                m.trend.startsWith('+') ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400")}>
                <TrendingUp className={cn("w-3 h-3", m.trend.startsWith('-') && "rotate-180")} /> {m.trend}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{m.value}</span>
              <span className="text-xs text-slate-500">{m.unit}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{m.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* 4. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 bg-[#111827]/50 border-slate-800">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2"><Wind className="w-4 h-4 text-emerald-400" /> Air Quality Trend</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chart}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="current" stroke="#10b981" fillOpacity={1} fill="url(#colorAqi)" strokeWidth={2} />
                <Area type="monotone" dataKey="last" stroke="#6366f1" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 bg-[#111827]/50 border-slate-800">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2"><Car className="w-4 h-4 text-cyan-400" /> Traffic Patterns</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.traffic}>
                <XAxis dataKey="label" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* 5. Weekly Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {[
          { label: "Best Commute Day", val: "Wednesday", sub: "Sea-Link avg: 14 min", icon: Calendar, iconCol: "text-emerald-400" },
          { label: "Peak Traffic Hour", val: "6:15 PM", sub: "BKC to Bandra Station", icon: Clock, iconCol: "text-cyan-400" },
          { label: "Cleanest Air Time", val: "5:00 AM", sub: "Bandstand Promenade", icon: Wind, iconCol: "text-emerald-400" },
          { label: "Energy Peak", val: "9:00 PM", sub: "High residential AC load", icon: Zap, iconCol: "text-cyan-400" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col">
             <div className="flex items-center gap-2 text-slate-500 mb-1">
               <item.icon className={cn("w-3.5 h-3.5", item.iconCol)} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
             </div>
             <p className="text-lg font-bold text-slate-100">{item.val}</p>
             <p className="text-[11px] text-slate-500">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}