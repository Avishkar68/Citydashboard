"use client"

import * as React from "react"
import { Wind, Car, Cloud, Zap, TrendingDown, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import dynamic from "next/dynamic"

const MiniMap = dynamic(() => import("@/components/dashboard/mini-map").then(mod => mod.MiniMap), {
  ssr: false,
})
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { NearbyServices } from "@/components/dashboard/nearby-services"
import { PlanMyDay } from "@/components/dashboard/plan-my-day"
import {
  getAirQuality,
  getWeather,
  getTrafficStatus,
  getEnergyUsage,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const [airQuality, setAirQuality] = React.useState(getAirQuality())
  const [weather, setWeather] = React.useState(getWeather())
  const [traffic, setTrafficStatus] = React.useState(getTrafficStatus())
  const [energy, setEnergy] = React.useState(getEnergyUsage())

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAirQuality(getAirQuality())
      setWeather(getWeather())
      setTrafficStatus(getTrafficStatus())
      setEnergy(getEnergyUsage())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "good"
    if (aqi <= 100) return "moderate"
    if (aqi <= 150) return "warning"
    return "danger"
  }

  const getTrafficStatusColor = (level: string) => {
    switch (level) {
      case "low":
        return "good"
      case "moderate":
        return "moderate"
      case "heavy":
        return "warning"
      default:
        return "danger"
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Alerts Banner */}
      <AlertsPanel />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Air Quality Index"
          value={airQuality.aqi}
          unit="AQI"
          icon={Wind}
          status={getAQIStatus(airQuality.aqi)}
          description={airQuality.recommendation}
        />
        <StatCard
          title="Traffic Status"
          value={traffic.avgSpeed}
          unit="km/h avg"
          icon={Car}
          status={getTrafficStatusColor(traffic.level)}
          description={`${traffic.incidents} incidents reported. ${traffic.congestionAreas[0]} is congested.`}
        />
        <StatCard
          title="Weather"
          value={weather.temp}
          unit="°C"
          icon={Cloud}
          status="good"
          description={`${weather.condition}, ${weather.humidity}% humidity, UV index ${weather.uvIndex}`}
        />
        <StatCard
          title="Energy Usage"
          value={energy.current}
          unit="kWh"
          icon={Zap}
          trend={energy.trend === "down" ? "down" : energy.trend === "up" ? "up" : "stable"}
          trendValue={energy.trend === "down" ? "12% below avg" : "5% above avg"}
          status={energy.trend === "down" ? "good" : "moderate"}
          description="Current power consumption at home"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map & Services */}
        <div className="lg:col-span-2 space-y-6">
          <MiniMap />
          <NearbyServices />
        </div>

        {/* Plan My Day */}
        <div className="space-y-6">
          <PlanMyDay />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="PM2.5"
              value={airQuality.pm25}
              unit="μg/m³"
              icon={Wind}
              status={airQuality.pm25 < 35 ? "good" : "warning"}
            />
            <StatCard
              title="Daily Energy"
              value={energy.daily}
              unit="kWh"
              icon={Zap}
              trend="down"
              trendValue="8%"
              status="good"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
