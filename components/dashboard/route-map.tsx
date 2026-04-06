"use client"

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "@/lib/fix-leaflet-icons"

const USER_LOCATION: [number, number] = [19.0425, 72.8193]

interface Props {
  destination: {
    name: string
    lat: number
    lng: number
  }
  onBack: () => void
}

export function RouteMap({ destination, onBack }: Props) {
  const route: [number, number][] = [
    USER_LOCATION,
    [destination.lat, destination.lng],
  ]

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-[1000] px-3 py-1 bg-black/60 text-white rounded-lg text-xs"
      >
        ← Back
      </button>

      {/* Map */}
      <div className="h-[320px] rounded-xl overflow-hidden">
        <MapContainer
          center={USER_LOCATION}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {/* Start */}
          <Marker position={USER_LOCATION} />

          {/* Destination */}
          <Marker position={[destination.lat, destination.lng]} />

          {/* Route Line */}
          <Polyline positions={route} color="#00f5ff" weight={4} />
        </MapContainer>
      </div>

      {/* Info */}
      <div className="mt-3 text-sm text-muted-foreground">
        Route to <span className="text-white font-medium">{destination.name}</span>
      </div>
    </div>
  )
}