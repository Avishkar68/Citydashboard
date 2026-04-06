"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import {
  Leaf,
  Wind,
  Droplets,
  Sun,
  Thermometer,
  Cloud,
  CloudRain,
  Eye,
  Heart,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

// Configuration - Replace these with your actual values or env variables
const API_KEY = "4e23cb9813238f7af6d02bfa74182010"
const LAT = "19.0544" 
const LON = "72.8406"

// Generate hourly AQI data (Keeping as mock as standard free APIs usually don't provide 24h history in one call)
const hourlyAQI = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  aqi: Math.floor(50 + Math.sin(i / 4) * 30 + Math.random() * 20),
  pm25: Math.floor(15 + Math.sin(i / 3) * 10 + Math.random() * 10),
}))

export default function EnvironmentPage() {
  const { emergencyMode } = useTheme()
  
  // State for Real Data
  const [airQuality, setAirQuality] = React.useState<any>(null)
  const [weather, setWeather] = React.useState<any>(null)
  const [heatmap, setHeatmap] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch Logic Integration
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 1. Air Quality API
        const airRes = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`
        )
        const airData = await airRes.json()

        const aqiMap: any = {
          1: 40,  // Good
          2: 80,  // Moderate
          3: 120, // Unhealthy for Sensitive
          4: 180, // Unhealthy
          5: 300, // Hazardous
        }

        const air = airData.list[0]
        setAirQuality({
          aqi: aqiMap[air.main.aqi],
          pm25: air.components.pm2_5,
          pm10: air.components.pm10,
          o3: air.components.o3,
          no2: air.components.no2,
        })

        // 2. Weather API
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`
        )
        const weatherData = await weatherRes.json()

        const conditionMap: any = {
          Clear: "sunny",
          Clouds: "cloudy",
          Rain: "rainy",
          Thunderstorm: "stormy",
          Drizzle: "rainy",
          Mist: "cloudy",
        }

        setWeather({
          temp: Math.round(weatherData.main.temp),
          condition: conditionMap[weatherData.weather[0].main] || "cloudy",
          humidity: weatherData.main.humidity,
          wind: Math.round(weatherData.wind.speed * 3.6),
          uvIndex: 5, // OpenWeather requires a separate call for UV, defaulting to 5
        })

        // 3. Heatmap Mock (As per requirements)
        const grid = []
        for (let i = 0; i < 8; i++) {
          const row = []
          for (let j = 0; j < 8; j++) {
            row.push({
              value: Math.floor(Math.random() * 100),
              area: `Zone ${String.fromCharCode(65 + i)}${j + 1}`,
            })
          }
          grid.push(row)
        }
        setHeatmap(grid)

      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-success bg-success/20"
    if (aqi <= 100) return "text-warning bg-warning/20"
    if (aqi <= 150) return "text-destructive bg-destructive/20"
    return "text-destructive bg-destructive/30"
  }

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    return "Unhealthy"
  }

  const getHeatmapColor = (value: number) => {
    if (value <= 30) return "bg-success"
    if (value <= 50) return "bg-chart-2"
    if (value <= 70) return "bg-warning"
    return "bg-destructive"
  }

  if (loading || !airQuality || !weather) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Fetching environmental data...</p>
      </div>
    )
  }

  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    stormy: CloudRain,
  }

  const WeatherIcon = weatherIcons[weather.condition as keyof typeof weatherIcons] || Cloud

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className={cn(
            "w-6 h-6",
            emergencyMode ? "text-emergency" : "text-success"
          )} />
          Environment
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time air quality, weather conditions, and pollution monitoring
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* AQI Card */}
        <GlassCard className={cn(
          "relative overflow-hidden",
          emergencyMode && "border-emergency/30"
        )}>
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20",
            airQuality.aqi <= 50 ? "bg-success" :
            airQuality.aqi <= 100 ? "bg-warning" : "bg-destructive"
          )} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2 rounded-lg", getAQIColor(airQuality.aqi))}>
                <Wind className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                getAQIColor(airQuality.aqi)
              )}>
                {getAQILabel(airQuality.aqi)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Air Quality Index</p>
            <p className="text-4xl font-bold">{airQuality.aqi}</p>
          </div>
        </GlassCard>

        {/* Temperature */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-chart-4/20 text-chart-4">
              <Thermometer className="w-5 h-5" />
            </div>
            <WeatherIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Temperature</p>
          <p className="text-4xl font-bold">{weather.temp}<span className="text-lg">°C</span></p>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{weather.condition}</p>
        </GlassCard>

        {/* Humidity */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-chart-1/20 text-chart-1">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Humidity</p>
          <p className="text-4xl font-bold">{weather.humidity}<span className="text-lg">%</span></p>
          <p className="text-sm text-muted-foreground mt-1">Wind: {weather.wind} km/h</p>
        </GlassCard>

        {/* UV Index */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <div className="flex items-center justify-between mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              weather.uvIndex <= 2 ? "bg-success/20 text-success" :
              weather.uvIndex <= 5 ? "bg-warning/20 text-warning" :
              "bg-destructive/20 text-destructive"
            )}>
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">UV Index</p>
          <p className="text-4xl font-bold">{weather.uvIndex}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {weather.uvIndex <= 2 ? "Low" : weather.uvIndex <= 5 ? "Moderate" : "High"}
          </p>
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Trend Chart */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wind className="w-4 h-4" />
            AQI Trend (24h)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyAQI}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
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
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="var(--chart-2)"
                  fill="url(#aqiGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pollutant Levels */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Pollutant Levels
          </h3>
          <div className="space-y-4">
            {[
              { name: "PM2.5", value: airQuality.pm25, max: 50, unit: "μg/m³" },
              { name: "PM10", value: airQuality.pm10, max: 100, unit: "μg/m³" },
              { name: "Ozone (O₃)", value: airQuality.o3, max: 100, unit: "ppb" },
              { name: "Nitrogen Dioxide (NO₂)", value: airQuality.no2, max: 50, unit: "ppb" },
            ].map((pollutant) => (
              <div key={pollutant.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{pollutant.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {pollutant.value.toFixed(1)} {pollutant.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      pollutant.value / pollutant.max < 0.5 ? "bg-success" :
                      pollutant.value / pollutant.max < 0.75 ? "bg-warning" : "bg-destructive"
                    )}
                    style={{ width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className={cn("lg:col-span-2", emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pollution Heatmap
          </h3>
          <div className="grid grid-cols-8 gap-1">
            {heatmap.flat().map((cell, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded transition-all duration-200 hover:scale-110 cursor-pointer",
                  getHeatmapColor(cell.value),
                  "opacity-70 hover:opacity-100"
                )}
                title={`${cell.area}: AQI ${cell.value}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-success" /> Good
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-chart-2" /> Moderate
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-warning" /> Unhealthy
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive" /> Hazardous
            </span>
          </div>
        </GlassCard>

        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            Health Suggestions
          </h3>
          <div className="space-y-3">
            {[
              {
                title: "Outdoor Activities",
                description: airQuality.aqi <= 50 ? "Perfect weather for a run or outdoor activities." : "Sensitive groups should limit prolonged outdoor exertion.",
                status: airQuality.aqi <= 50 ? "good" : "moderate",
              },
              {
                title: "Exercise",
                description: airQuality.aqi > 100 ? "Consider indoor workouts today." : "Great day for outdoor sports.",
                status: airQuality.aqi <= 100 ? "good" : "moderate",
              },
              {
                title: "Ventilation",
                description: airQuality.aqi > 100 ? "Keep windows closed. Use air purifiers." : "Good time to ventilate your home.",
                status: airQuality.aqi <= 100 ? "good" : "moderate",
              },
              {
                title: "Hydration",
                description: "Stay well-hydrated. Drink at least 8 glasses of water today.",
                status: "good",
              },
            ].map((suggestion, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-secondary/30 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    suggestion.status === "good" ? "bg-success" : "bg-warning"
                  )} />
                  <span className="font-medium text-sm">{suggestion.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}