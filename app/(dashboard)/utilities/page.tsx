"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import {
  Zap,
  Droplets,
  Trash2,
  TrendingDown,
  TrendingUp,
  Calendar,
  Clock,
  Lightbulb,
  Waves,
  Recycle,
} from "lucide-react"
import {
  getEnergyUsage,
  getWaterUsage,
  getUtilitySchedules,
} from "@/lib/mock-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']

export default function UtilitiesPage() {
  const { emergencyMode } = useTheme()
  const [energy, setEnergy] = React.useState(getEnergyUsage())
  const [water, setWater] = React.useState(getWaterUsage())
  const [schedules, setSchedules] = React.useState(getUtilitySchedules())
  const [isWaterDialogOpen, setIsWaterDialogOpen] = React.useState(false)
  const [todayWaterInput, setTodayWaterInput] = React.useState({
    Bathroom: 0,
    Kitchen: 0,
    Laundry: 0,
    Garden: 0,
  })
  const handleWaterChange = (category: string, value: number) => {
    setTodayWaterInput(prev => ({
      ...prev,
      [category]: value
    }))
  }
  // Average conversion factors (approximate)
const KG_CO2_PER_KWH = 0.385; // Electricity
const KG_CO2_PER_LITER = 0.0003; // Water (treatment/transport)
const KG_CO2_PER_KG_WASTE = 0.5; // Waste landfill average
  const todayTotal = Object.values(todayWaterInput).reduce((a, b) => a + b, 0)
  const scheduleIcons = {
    electricity: Zap,
    water: Droplets,
    waste: Trash2,
  }
  const updatedBreakdown = water.breakdown.map(item => {
    const todayValue = todayWaterInput[item.category] || 0
    return {
      ...item,
      usage: item.usage + (todayValue / (todayTotal || 1)) * 100
    }
  })
  const predictedWater = water.monthly + todayTotal

const waterTrend =
  todayTotal > water.daily
    ? "up"
    : todayTotal < water.daily
    ? "down"
    : "same"
  const scheduleColors = {
    electricity: "text-chart-1 bg-chart-1/20",
    water: "text-chart-2 bg-chart-2/20",
    waste: "text-chart-3 bg-chart-3/20",
  }

  const statusColors = {
    scheduled: "text-primary bg-primary/20",
    "in-progress": "text-warning bg-warning/20",
    completed: "text-success bg-success/20",
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className={cn(
            "w-6 h-6",
            emergencyMode ? "text-emergency" : "text-chart-1"
          )} />
          Utilities
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor and manage your electricity, water, and waste services
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Power */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-chart-1/20 text-chart-1">
              <Zap className="w-5 h-5" />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              energy.trend === 'down' ? "text-success bg-success/20" : "text-warning bg-warning/20"
            )}>
              {energy.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              12%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Current Power</p>
          <p className="text-3xl font-bold">{energy.current} <span className="text-sm font-normal text-muted-foreground">kWh</span></p>
        </GlassCard>

        {/* Daily Energy */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-chart-4/20 text-chart-4">
              <Lightbulb className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Daily Energy</p>
          <p className="text-3xl font-bold">{energy.daily} <span className="text-sm font-normal text-muted-foreground">kWh</span></p>
        </GlassCard>

        {/* Water Usage */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-chart-2/20 text-chart-2">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full text-muted-foreground bg-secondary">
              Stable
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Today&apos;s Water</p>
          <p className="text-3xl font-bold">
  {todayTotal || water.daily}{" "}
  <span className="text-sm font-normal text-muted-foreground">L</span>
</p>
        </GlassCard>


        {/* Monthly Cost Estimate */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-success/20 text-success">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Est. Monthly Bill</p>
          <p className="text-3xl font-bold">$142 <span className="text-sm font-normal text-success">-8%</span></p>
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Usage Chart */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Energy Usage (24h)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energy.hourlyData}>
                <defs>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis
                  dataKey="hour"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Usage']}
                />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--chart-1)"
                  fill="url(#energyGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Energy Breakdown Pie Chart */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Energy Breakdown
          </h3>
          <div className="h-[250px] flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energy.breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="usage"
                  >
                    {energy.breakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, 'Usage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2">
              {energy.breakdown.map((item, index) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm flex-1">{item.category}</span>
                  <span className="text-sm font-medium">{item.usage}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Water & Schedules Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Breakdown */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Water Breakdown
            </div>

            <button
              onClick={() => setIsWaterDialogOpen(true)}
              className="text-xs px-3 py-1 rounded bg-chart-2/20 text-chart-2 hover:bg-chart-2/30 transition"
            >
              + Add
            </button>
          </h3>
          <div className="space-y-4">
            {updatedBreakdown.map((item, index) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">{item.usage}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.usage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-secondary/30">
            <p className="text-sm text-muted-foreground">Monthly Usage</p>
            <p className="text-2xl font-bold">
              {water.monthly + todayTotal} L
            </p>
          </div>
        </GlassCard>
      {isWaterDialogOpen && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/30">

    <div className="relative bg-background border border-border rounded-xl p-6 w-[320px] space-y-4 shadow-xl animate-fade-up">
      
      <h2 className="font-semibold text-lg">Add Today's Water Usage</h2>

      {Object.keys(todayWaterInput).map((category) => (
        <div key={category} className="flex items-center justify-between">
          <span className="text-sm">{category}</span>
          <input
            type="number"
            placeholder="Liters"
            className="w-24 px-2 py-1 rounded bg-secondary/50 text-sm outline-none"
            onChange={(e) =>
              handleWaterChange(category, Number(e.target.value))
            }
          />
        </div>
      ))}

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setIsWaterDialogOpen(false)}
          className="text-sm px-3 py-1 rounded bg-secondary"
        >
          Cancel
        </button>

        <button
          onClick={() => setIsWaterDialogOpen(false)}
          className="text-sm px-3 py-1 rounded bg-chart-2 text-white"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

        {/* Utility Schedules */}
        <GlassCard className={cn("lg:col-span-2", emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Service Schedules
          </h3>
          <div className="space-y-3">
            {schedules.map((schedule, index) => {
              const Icon = scheduleIcons[schedule.type]
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn("p-3 rounded-lg", scheduleColors[schedule.type])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{schedule.type} Service</p>
                    <p className="text-sm text-muted-foreground">{schedule.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{schedule.nextDate}</p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full capitalize",
                      statusColors[schedule.status]
                    )}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
{/* Carbon Footprint Section */}
<GlassCard className={cn(
  "border-t-4", 
  emergencyMode ? "border-t-emergency" : "border-t-chart-3"
)}>
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div>
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Recycle className="w-5 h-5 text-chart-3" />
        Environmental Impact
      </h3>
      <p className="text-sm text-muted-foreground">Live carbon footprint based on your current utility usage</p>
    </div>
    <button 
      onClick={() => alert("Generating detailed sustainability report...")}
      className="px-4 py-2 bg-chart-3 hover:bg-chart-3/80 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 w-fit"
    >
      <Waves className="w-4 h-4" />
      Download Eco-Report
    </button>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Large Display */}
    <div className="flex flex-col justify-center items-center p-6 bg-chart-3/5 rounded-2xl border border-chart-3/10">
      <span className="text-sm font-medium text-chart-3 uppercase tracking-wider">Total Monthly Est.</span>
      <div className="flex items-baseline gap-1 mt-2">
        <h2 className="text-5xl font-bold">
          {((892 * KG_CO2_PER_KWH) + (predictedWater * KG_CO2_PER_LITER) + (48 * KG_CO2_PER_KG_WASTE)).toFixed(1)}
        </h2>
        <span className="text-xl font-semibold text-muted-foreground">kg</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 font-mono">CO2 EQUIVALENT</p>
    </div>

    {/* Breakdown Progress */}
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Electricity Impact</span>
            <span className="font-medium">{(892 * KG_CO2_PER_KWH).toFixed(1)} kg</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-chart-1" style={{ width: '75%' }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Water Impact</span>
            <span className="font-medium">{(predictedWater * KG_CO2_PER_LITER).toFixed(1)} kg</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-chart-2" style={{ width: '15%' }} />
          </div>
        </div>
      </div>

      {/* Comparison Insight */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Eco-Champion Status</h4>
          <p className="text-sm text-muted-foreground">
            Your footprint is <span className="text-success font-bold">14% lower</span> than the neighborhood average. 
            Planting 2 trees this month would completely offset your water usage!
          </p>
        </div>
      </div>
    </div>
  </div>
</GlassCard>
      {/* Usage Predictions */}
      <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Usage Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-chart-1" />
              <span className="font-medium">Electricity</span>
            </div>
            <p className="text-2xl font-bold">892 kWh</p>
            <p className="text-sm text-muted-foreground">Predicted monthly usage</p>
            <div className="mt-2 flex items-center gap-1 text-sm text-success">
              <TrendingDown className="w-3 h-3" />
              4% lower than last month
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-chart-2" />
              <span className="font-medium">Water</span>
            </div>
           <p className="text-2xl font-bold">{predictedWater} L</p>
<p className="text-sm text-muted-foreground">Predicted monthly usage</p>

<div
  className={cn(
    "mt-2 flex items-center gap-1 text-sm",
    waterTrend === "down"
      ? "text-success"
      : waterTrend === "up"
      ? "text-warning"
      : "text-muted-foreground"
  )}
>
  {waterTrend === "down" && (
    <>
      <TrendingDown className="w-3 h-3" />
      Lower than yesterday
    </>
  )}
  {waterTrend === "up" && (
    <>
      <TrendingUp className="w-3 h-3" />
      Higher than yesterday
    </>
  )}
  {waterTrend === "same" && <>Similar to yesterday</>}
</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Recycle className="w-4 h-4 text-chart-3" />
              <span className="font-medium">Waste</span>
            </div>
            <p className="text-2xl font-bold">48 kg</p>
            <p className="text-sm text-muted-foreground">Predicted monthly waste</p>
            <div className="mt-2 flex items-center gap-1 text-sm text-success">
              <TrendingDown className="w-3 h-3" />
              8% reduction in waste
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
