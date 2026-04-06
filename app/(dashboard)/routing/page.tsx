"use client"

import * as React from "react"
import dynamic from "next/dynamic"

const RouteMap = dynamic(() => import("@/components/routing/route-map").then(m => m.RouteMap), {
  ssr: false,
})
import { RouteControls } from "@/components/routing/route-controls"
import { RouteSteps } from "@/components/routing/route-steps"
import { PanicButton } from "@/components/routing/panic-button"
import { GlassCard } from "@/components/ui/glass-card"
import { getRoutes, Route } from "@/lib/mock-data"
import { useTheme } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"
import { Clock, MapPin, Wind, Car } from "lucide-react"

export default function RoutingPage() {
  const { emergencyMode } = useTheme()
  const [fromLocation, setFromLocation] = React.useState("123 Residential Street")
  const [toLocation, setToLocation] = React.useState("Tech Park Building A")
  const [travelMode, setTravelMode] = React.useState("car")
  const [priority, setPriority] = React.useState("fastest")
  const [isSearching, setIsSearching] = React.useState(false)
  const [routes, setRoutes] = React.useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = React.useState<Route | null>(null)

  // Auto-search on load
  React.useEffect(() => {
    handleSearch()
  }, [])

  // Update routes when mode/priority changes
  React.useEffect(() => {
    if (routes.length > 0) {
      const newRoutes = getRoutes(travelMode, priority)
      setRoutes(newRoutes)
      // Keep the same route type selected
      if (selectedRoute) {
        const matchingRoute = newRoutes.find(r => r.type === selectedRoute.type)
        setSelectedRoute(matchingRoute || newRoutes[0])
      }
    }
  }, [travelMode, priority])

  const handleSearch = () => {
    if (!fromLocation || !toLocation) return
    
    setIsSearching(true)
    
    // Simulate API delay
    setTimeout(() => {
      const newRoutes = getRoutes(travelMode, priority)
      setRoutes(newRoutes)
      // Auto-select based on priority
      const preferredRoute = priority === 'fastest' 
        ? newRoutes.find(r => r.type === 'fastest')
        : priority === 'healthy'
        ? newRoutes.find(r => r.type === 'healthy')
        : newRoutes[0]
      setSelectedRoute(preferredRoute || newRoutes[0])
      setIsSearching(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className={cn(
              "w-6 h-6",
              emergencyMode ? "text-emergency" : "text-primary"
            )} />
            Smart Routing
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered route planning with real-time traffic and air quality data
          </p>
        </div>
      </div>

      {/* Route Options Summary (when routes exist) */}
      {routes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {routes.filter(r => !emergencyMode || r.type === 'emergency' || r.type === 'fastest').map((route) => (
            <GlassCard
              key={route.id}
              hover
              className={cn(
                "cursor-pointer transition-all duration-300",
                selectedRoute?.id === route.id && (
                  emergencyMode
                    ? "ring-2 ring-emergency glow"
                    : "ring-2 ring-primary glow"
                ),
                route.type === 'emergency' && emergencyMode && "border-emergency/50"
              )}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-semibold capitalize"
                  style={{ color: route.color }}
                >
                  {route.type}
                </span>
                {selectedRoute?.id === route.id && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    Selected
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{route.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{route.distance} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span className={cn(
                    route.aqi < 50 && "text-success",
                    route.aqi >= 50 && route.aqi < 100 && "text-warning",
                    route.aqi >= 100 && "text-destructive"
                  )}>
                    AQI {route.aqi}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{route.traffic}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <RouteControls
            fromLocation={fromLocation}
            toLocation={toLocation}
            travelMode={travelMode}
            priority={priority}
            onFromChange={setFromLocation}
            onToChange={setToLocation}
            onModeChange={setTravelMode}
            onPriorityChange={setPriority}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
          
          {/* Route Steps */}
          <RouteSteps route={selectedRoute} travelMode={travelMode} />
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-2">
          <RouteMap
            routes={routes}
            selectedRoute={selectedRoute}
            travelMode={travelMode}
            onSelectRoute={setSelectedRoute}
          />
        </div>
      </div>

      {/* Panic Button */}
      <PanicButton />
    </div>
  )
}
