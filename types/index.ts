import { Dispatch, SetStateAction } from "react"

export interface Location {
  orderNum: number
  lat: number
  lng: number
  name: string
  info: string
}

export interface MapComponentProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  hasPromptBeenSubmitted: boolean
  isProcessing: boolean
}

export interface PromptComponentProps {
  isProcessing: boolean
  prompt: string
  setPrompt: Dispatch<SetStateAction<string>>
  onPromptSubmit: (prompt: string, isDeepThinking: boolean) => Promise<void>
  answer: string
}

export interface LeafletComponents {
  MapContainer: any
  TileLayer: any
  Marker: any
  Popup: any
  cyberpunkIcons: any[]
}

export interface HomePageState {
  locations: Location[]
  selectedLocation: Location | null
  hasPromptBeenSubmitted: boolean
}

export type AskMapAIResponse = {
    locations: Location[]
    answer: string
}