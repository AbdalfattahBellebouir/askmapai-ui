"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import { Plus, Minus } from "lucide-react"
import type { MapComponentProps, LeafletComponents, Location } from "@/types"

export function MapComponent({
  locations,
  selectedLocation,
  onLocationSelect,
  hasPromptBeenSubmitted,
  isProcessing
}: MapComponentProps) {
  const [isMapReady, setIsMapReady] = useState(false)
  const mapRef = useRef<any>(null)
  const [leafletComponents, setLeafletComponents] = useState<LeafletComponents | null>(null)

  const loadLeafletComponents = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      try {
        // Load Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Dynamically import react-leaflet components
        const [{ MapContainer }, { TileLayer }, { Marker }, { Popup }, L] = await Promise.all([
          import("react-leaflet").then((mod) => ({ MapContainer: mod.MapContainer })),
          import("react-leaflet").then((mod) => ({ TileLayer: mod.TileLayer })),
          import("react-leaflet").then((mod) => ({ Marker: mod.Marker })),
          import("react-leaflet").then((mod) => ({ Popup: mod.Popup })),
          import("leaflet"),
        ])

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        const cyberpunkIcons = createCyberpunkIcons(L)

        setLeafletComponents({ MapContainer, TileLayer, Marker, Popup, cyberpunkIcons })
        setIsMapReady(true)
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
      }
    }
  }

  const createCyberpunkIcons = (L: any) => {
    const createCyberpunkIcon = (color: string) => {
      return L.divIcon({
        className: "cyberpunk-marker",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 2px solid #00ffff;
            border-radius: 50%;
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color};
            animation: marker-pulse 2s infinite;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 8px;
              height: 8px;
              background: #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 5px #ffffff;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      })
    }

    const markerColors = ["#00eaff", "#00bfff", "#4d79ff", "#8c9eff", "#a0a0a0"]
    return markerColors.map((color) => createCyberpunkIcon(color))
  }

  useEffect(() => {
    loadLeafletComponents()
  }, [])

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 15, {
        duration: 2,
      })
    }
  }, [selectedLocation])

  // Fit map to show all markers when locations change
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return
    if (!hasPromptBeenSubmitted) return
    if (!locations || locations.length === 0) return

    if (locations.length === 1) {
      const only = locations[0]!
      mapRef.current.flyTo([only.lat, only.lng], 13, { duration: 1.2 })
      return
    }

    const lats = locations.map((l) => l.lat)
    const lngs = locations.map((l) => l.lng)
    const south = Math.min(...lats)
    const west = Math.min(...lngs)
    const north = Math.max(...lats)
    const east = Math.max(...lngs)

    // LatLngBoundsLiteral: [[south, west], [north, east]]
    const bounds: any = [[south, west], [north, east]]
    try {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] })
    } catch (err) {
      // no-op: ensure app doesn't crash on invalid bounds
      console.error("Failed to fit bounds", err)
    }
  }, [locations, hasPromptBeenSubmitted, isMapReady])

  const handleMarkerClick = (location: Location): void => {
    onLocationSelect(location)
  }

  const handleZoomIn = (): void => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = (): void => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const renderMapHeader = () => (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-card/90 backdrop-blur-sm border-b border-primary/30 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <h2 className="text-xl font-mono font-bold text-primary neon-text">AskMapAI</h2>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {selectedLocation
              ? `${selectedLocation.lat.toFixed(3)} | ${selectedLocation.lng.toFixed(3)}`
              : ""}
          </div>
        </div>
      </div>
    </div>
  )

  const renderZoomControls = () => (
    <div className="absolute top-14 right-2 flex flex-col gap-1 z-[1000]">
      <button
        onClick={handleZoomIn}
        className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-primary/30 rounded flex items-center justify-center hover:bg-primary/20 transition-colors neon-glow group"
        title="Zoom In"
      >
        <Plus className="w-4 h-4 text-primary group-hover:text-primary/80" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-primary/30 rounded flex items-center justify-center hover:bg-primary/20 transition-colors neon-glow group"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4 text-primary group-hover:text-primary/80" />
      </button>
    </div>
  )

  const renderStatusIndicators = () => (
    <div className="absolute bottom-2 left-2 flex gap-2 z-[1000]">
      <div className="flex items-center gap-1">
        <div
          className={`w-1.5 h-1.5 rounded-full animate-pulse delay-500 ${hasPromptBeenSubmitted ? "bg-green-400" : "bg-yellow-400"}`}
        ></div>
        <span className={`text-xs font-mono ${hasPromptBeenSubmitted ? "text-green-400" : "text-yellow-400"}`}>
          {hasPromptBeenSubmitted ? `${locations.length} NODES` : "STANDBY"}
        </span>
      </div>
    </div>
  )

  const renderSelectedLocationInfo = () => {
    if (!selectedLocation) return null

    return (
      <div className="absolute top-12 right-12 bg-card/90 backdrop-blur-sm border border-primary/30 rounded p-2 max-w-xs z-[1000] neon-glow">
        <h4 className="text-xs font-mono text-primary neon-text mb-1">{selectedLocation.name}</h4>
        <blockquote className="text-xs italic text-accent-foreground border-l-2 border-accent pl-1">
          "{selectedLocation.info}"
        </blockquote>
      </div>
    )
  }

  return (
    <Card className="relative h-[400px] md:h-[450px] lg:h-[500px] bg-card border-2 border-primary/30 neon-glow overflow-hidden">
      {renderMapHeader()}

      <div className="absolute inset-0 pt-12">
        {isMapReady && leafletComponents ? (
          <leafletComponents.MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="cyberpunk-map"
            ref={mapRef}
            zoomControl={false}
          >
            <leafletComponents.TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {hasPromptBeenSubmitted &&
              locations.map((location, index) => (
                <leafletComponents.Marker
                  key={index}
                  position={[location.lat, location.lng]}
                  icon={leafletComponents.cyberpunkIcons[index % leafletComponents.cyberpunkIcons.length]}
                  eventHandlers={{
                    click: () => handleMarkerClick(location),
                  }}
                >
                  <leafletComponents.Popup className="cyberpunk-popup">
                    <div className="bg-card border border-primary/30 rounded-lg p-2 min-w-[200px]">
                      <h3 className="text-sm font-mono text-primary neon-text mb-1">{location.orderNum}. {location.name}</h3>
                      <blockquote className="border-l-2 border-accent pl-2 italic text-xs text-accent-foreground">
                        "{location.info}"
                      </blockquote>
                    </div>
                  </leafletComponents.Popup>
                </leafletComponents.Marker>
              ))}
          </leafletComponents.MapContainer>
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-card via-secondary to-card">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-mono text-primary/20 mb-2">{"◉"}</div>
                <div className="text-xs font-mono text-muted-foreground">{"INITIALIZING NEURAL MAP..."}</div>
                <div className="text-xs font-mono text-primary mt-1">{"> LOADING INTERFACE"}</div>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse pointer-events-none z-[500]"></div>
        )}

        {isMapReady && !hasPromptBeenSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/10 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-mono text-primary/40 mb-2">{"⟨ ⟩"}</div>
              <div className="text-sm font-mono text-muted-foreground">{"AWAITING NEURAL INPUT..."}</div>
              <div className="text-xs font-mono text-primary/60 mt-1">{"> SUBMIT PROMPT TO ACTIVATE"}</div>
            </div>
          </div>
        )}
      </div>

      {renderZoomControls()}
      {renderStatusIndicators()}
      {renderSelectedLocationInfo()}
    </Card>
  )
}
