"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { 
  Hospital, 
  Shield, 
  Flame, 
  Car, 
  Fuel, 
  ParkingCircle,
  MapPin,
  Navigation
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/providers/theme-provider"

// 📍 Bandra Fort (User Location)
const USER_LOCATION = {
  lat: 19.0425,
  lng: 72.8193,
}

// ✅ REAL NEARBY DATA (within ~2km)
const realNearbyServices = [
  { id: "1", type: "hospital", name: "Lilavati Hospital", lat: 19.0509, lng: 72.8266, available: true },
  { id: "2", type: "hospital", name: "Bhabha Hospital Bandra", lat: 19.0556, lng: 72.8275, available: true },
  { id: "3", type: "police", name: "Bandra Police Station", lat: 19.0550, lng: 72.8286, available: true },
  { id: "4", type: "parking", name: "Mount Mary Parking", lat: 19.0455, lng: 72.8208, available: true },
  { id: "5", type: "petrol", name: "HP Petrol Pump Bandra West", lat: 19.0495, lng: 72.8245, available: true },
  { id: "6", type: "ev", name: "Jio-BP EV Charging Bandra", lat: 19.0525, lng: 72.8300, available: true },
]

// 📏 Distance calculator (Haversine formula)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}

// 🧭 Navigation
const openNavigation = (lat: number, lng: number) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&origin=${USER_LOCATION.lat},${USER_LOCATION.lng}&destination=${lat},${lng}&travelmode=driving`,
    "_blank"
  )
}

const iconMap = {
  hospital: Hospital,
  police: Shield,
  fire: Flame,
  ev: Car,
  petrol: Fuel,
  parking: ParkingCircle,
}

const colorMap = {
  hospital: "text-destructive bg-destructive/20",
  police: "text-chart-3 bg-chart-3/20",
  fire: "text-warning bg-warning/20",
  ev: "text-success bg-success/20",
  petrol: "text-chart-4 bg-chart-4/20",
  parking: "text-primary bg-primary/20",
}

export function NearbyServices() {
  const { emergencyMode } = useTheme()
  const [selectedType, setSelectedType] = React.useState<string | null>(null)

  // 🔥 Attach distance dynamically
  const services = realNearbyServices.map((s) => ({
    ...s,
    distance: getDistance(USER_LOCATION.lat, USER_LOCATION.lng, s.lat, s.lng),
  }))

  const filteredServices = selectedType
    ? services.filter((s) => s.type === selectedType)
    : services

  const types = [...new Set(services.map((s) => s.type))]

  return (
    <GlassCard className={cn(
      emergencyMode && "border-emergency/30"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className={cn(
            "w-4 h-4",
            emergencyMode && "text-emergency"
          )} />
          Nearby Services
        </h3>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType(null)}
          className="text-xs"
        >
          All
        </Button>

        {types.map((type) => {
          const Icon = iconMap[type]
          return (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="text-xs gap-1"
            >
              <Icon className="w-3 h-3" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          )
        })}
      </div>

      {/* List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredServices.map((service, index) => {
          const Icon = iconMap[service.type]

          return (
            <div
              key={service.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 cursor-pointer group animate-fade-up",
                emergencyMode &&
                  (service.type === "hospital" || service.type === "police") &&
                  "bg-emergency/10 border border-emergency/30"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("p-2 rounded-lg", colorMap[service.type])}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{service.name}</p>
                <p className="text-xs text-muted-foreground">
                  {service.distance} km away
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    service.available ? "bg-success" : "bg-destructive"
                  )}
                />

                {/* 🔥 REAL NAVIGATION */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openNavigation(service.lat, service.lng)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}