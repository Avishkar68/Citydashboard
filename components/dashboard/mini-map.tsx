"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "@/lib/fix-leaflet-icons"

const userLocation: [number, number] = [19.0425, 72.8193] // Bandra Fort

// ✅ REAL NEARBY PLACES (ALL WITHIN ~2KM)
export const nearbyPlaces = [
  {
    id: "1",
    name: "Lilavati Hospital",
    lat: 19.0509,
    lng: 72.8266,
    type: "hospital",
  },
  {
    id: "2",
    name: "Bhabha Hospital Bandra",
    lat: 19.0556,
    lng: 72.8275,
    type: "hospital",
  },
  {
    id: "3",
    name: "Bandra Police Station",
    lat: 19.0550,
    lng: 72.8286,
    type: "police",
  },
  {
    id: "4",
    name: "Mount Mary Parking",
    lat: 19.0455,
    lng: 72.8208,
    type: "parking",
  },
  {
    id: "5",
    name: "HP Petrol Pump Bandra West",
    lat: 19.0495,
    lng: 72.8245,
    type: "petrol",
  },
  {
    id: "6",
    name: "Jio-BP EV Charging Bandra",
    lat: 19.0525,
    lng: 72.8300,
    type: "ev",
  },
]

export function MiniMap() {
  return (
    <div className="h-[320px] rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={userLocation}
        zoom={15} // 🔥 closer zoom for realism
        className="h-full w-full"
      >
        {/* DARK CLEAN MAP */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* USER */}
        <Marker position={userLocation}>
          <Popup>📍 You (Bandra Fort)</Popup>
        </Marker>

        {/* NEARBY */}
        {nearbyPlaces.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}