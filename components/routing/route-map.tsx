"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import { Route } from "@/lib/mock-data"
import { Car, Bus, Train, Footprints, Hospital, Shield, MapPin } from "lucide-react"

interface RouteMapProps {
  routes: Route[]
  selectedRoute: Route | null
  travelMode: string
  onSelectRoute: (route: Route) => void
}

const modeIcons = {
  car: Car,
  bus: Bus,
  train: Train,
  walk: Footprints,
}

// SVG path data for routes
const routePaths = {
  fastest: "M 50 380 Q 80 300 120 250 Q 180 180 280 150 Q 380 120 450 100",
  healthy: "M 50 380 Q 100 350 150 300 Q 200 250 220 200 Q 280 150 380 130 Q 440 115 450 100",
  emergency: "M 50 380 L 120 280 L 280 150 L 450 100",
}

// Locations on the map
const locations = {
  start: { x: 50, y: 380, label: "Current Location" },
  end: { x: 450, y: 100, label: "Destination" },
  hospital: { x: 320, y: 280, label: "City Hospital" },
  police: { x: 180, y: 320, label: "Police Station" },
  busStop1: { x: 120, y: 300, label: "Bus Stop A" },
  busStop2: { x: 280, y: 180, label: "Central Station" },
  trainStation: { x: 150, y: 250, label: "Metro Station" },
}

export function RouteMap({
  routes,
  selectedRoute,
  travelMode,
  onSelectRoute,
}: RouteMapProps) {
  const { emergencyMode } = useTheme()
  const [animationProgress, setAnimationProgress] = React.useState(0)
  const [vehiclePosition, setVehiclePosition] = React.useState({ x: 50, y: 380 })

  // Animate vehicle along the path
  React.useEffect(() => {
    if (!selectedRoute) return

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 0.5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [selectedRoute])

  // Calculate vehicle position based on animation progress
  React.useEffect(() => {
    if (!selectedRoute) return

    const progress = animationProgress / 100
    const pathType = selectedRoute.type as keyof typeof routePaths

    // Simplified bezier calculation for demo
    if (pathType === "emergency") {
      // Linear interpolation for emergency route
      const points = [
        { x: 50, y: 380 },
        { x: 120, y: 280 },
        { x: 280, y: 150 },
        { x: 450, y: 100 },
      ]
      const segment = Math.floor(progress * 3)
      const segmentProgress = (progress * 3) % 1
      const start = points[Math.min(segment, 2)]
      const end = points[Math.min(segment + 1, 3)]
      setVehiclePosition({
        x: start.x + (end.x - start.x) * segmentProgress,
        y: start.y + (end.y - start.y) * segmentProgress,
      })
    } else {
      // Quadratic bezier approximation
      const t = progress
      const x = 50 + (450 - 50) * t
      const y = 380 - 280 * t + Math.sin(t * Math.PI) * -50
      setVehiclePosition({ x, y })
    }
  }, [animationProgress, selectedRoute])

  const ModeIcon = modeIcons[travelMode as keyof typeof modeIcons] || Car

  return (
    <div
      className={cn(
        "relative w-full h-[450px] rounded-xl overflow-hidden glass",
        emergencyMode && "border-emergency/30"
      )}
    >
      {/* Background Grid */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern
            id="mapGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/30"
            />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapGrid)" />

        {/* Route Paths */}
        {routes.map((route) => (
          <g key={route.id}>
            {/* Shadow/Glow effect */}
            <path
              d={routePaths[route.type as keyof typeof routePaths]}
              fill="none"
              stroke={route.color}
              strokeWidth={selectedRoute?.id === route.id ? "12" : "6"}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
              filter="url(#glow)"
            />
            {/* Main path */}
            <path
              d={routePaths[route.type as keyof typeof routePaths]}
              fill="none"
              stroke={route.color}
              strokeWidth={selectedRoute?.id === route.id ? "4" : "2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={selectedRoute?.id === route.id ? "none" : "8 4"}
              opacity={selectedRoute?.id === route.id ? 1 : 0.5}
              className="cursor-pointer transition-all duration-300"
              onClick={() => onSelectRoute(route)}
            />
            {/* Animated dashes for selected route */}
            {selectedRoute?.id === route.id && (
              <path
                d={routePaths[route.type as keyof typeof routePaths]}
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="20 40"
                className="animate-[route-dash_2s_linear_infinite]"
                style={{ strokeDashoffset: `${100 - animationProgress}%` }}
              />
            )}
          </g>
        ))}

        {/* Emergency locations (visible in emergency mode) */}
        {emergencyMode && (
          <>
            <circle
              cx={locations.hospital.x}
              cy={locations.hospital.y}
              r="20"
              fill="var(--emergency)"
              opacity="0.2"
              className="animate-ping"
            />
            <circle
              cx={locations.police.x}
              cy={locations.police.y}
              r="20"
              fill="var(--emergency)"
              opacity="0.2"
              className="animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}

        {/* Transit stops (visible for bus/train modes) */}
        {(travelMode === "bus" || travelMode === "train") && (
          <>
            {travelMode === "bus" && (
              <>
                <circle
                  cx={locations.busStop1.x}
                  cy={locations.busStop1.y}
                  r="8"
                  fill="var(--chart-2)"
                />
                <circle
                  cx={locations.busStop2.x}
                  cy={locations.busStop2.y}
                  r="8"
                  fill="var(--chart-2)"
                />
              </>
            )}
            {travelMode === "train" && (
              <circle
                cx={locations.trainStation.x}
                cy={locations.trainStation.y}
                r="10"
                fill="var(--chart-3)"
              />
            )}
          </>
        )}
      </svg>

      {/* Location Markers */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: locations.start.x,
          top: locations.start.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={cn(
            "p-3 rounded-full glow-sm",
            emergencyMode ? "bg-emergency" : "bg-primary"
          )}
        >
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{
          left: locations.end.x,
          top: locations.end.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="p-3 rounded-full bg-accent glow-sm">
          <MapPin className="w-5 h-5 text-accent-foreground" />
        </div>
      </div>

      {/* Emergency Service Markers */}
      {emergencyMode && (
        <>
          <div
            className="absolute flex flex-col items-center animate-fade-up"
            style={{
              left: locations.hospital.x,
              top: locations.hospital.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="p-2 rounded-full bg-destructive animate-pulse">
              <Hospital className="w-4 h-4 text-destructive-foreground" />
            </div>
            <span className="text-xs mt-1 text-destructive font-medium whitespace-nowrap">
              Hospital
            </span>
          </div>
          <div
            className="absolute flex flex-col items-center animate-fade-up"
            style={{
              left: locations.police.x,
              top: locations.police.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="p-2 rounded-full bg-chart-3 animate-pulse">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs mt-1 text-chart-3 font-medium whitespace-nowrap">
              Police
            </span>
          </div>
        </>
      )}

      {/* Animated Vehicle */}
      {selectedRoute && (
        <div
          className="absolute transition-all duration-100 ease-linear z-10"
          style={{
            left: vehiclePosition.x,
            top: vehiclePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={cn(
              "p-2 rounded-full shadow-lg",
              emergencyMode ? "bg-emergency animate-pulse" : "bg-foreground"
            )}
          >
            <ModeIcon
              className={cn(
                "w-4 h-4",
                emergencyMode ? "text-white" : "text-background"
              )}
            />
          </div>
        </div>
      )}

      {/* Route Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded bg-[#3b82f6]" />
          <span>Fastest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded bg-[#22c55e]" />
          <span>Healthiest (Low AQI)</span>
        </div>
        {emergencyMode && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded bg-[#ef4444]" />
            <span>Emergency</span>
          </div>
        )}
      </div>

      {/* Selected Route Info Overlay */}
      {selectedRoute && (
        <div className="absolute top-4 right-4 glass rounded-lg p-4 animate-fade-up min-w-[180px]">
          <h4 className="font-semibold capitalize mb-2">
            {selectedRoute.type} Route
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{selectedRoute.duration} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-medium">{selectedRoute.distance} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AQI:</span>
              <span
                className={cn(
                  "font-medium",
                  selectedRoute.aqi < 50 && "text-success",
                  selectedRoute.aqi >= 50 && selectedRoute.aqi < 100 && "text-warning",
                  selectedRoute.aqi >= 100 && "text-destructive"
                )}
              >
                {selectedRoute.aqi}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Traffic:</span>
              <span className="font-medium capitalize">{selectedRoute.traffic}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
