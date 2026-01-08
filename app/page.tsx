"use client"

import { MapComponent } from "@/components/map-component"
import { PromptComponent } from "@/components/prompt-component"
import { useState } from "react"
import type { Location, HomePageState } from "@/types"
import { useAnswerLocations } from "@/hooks/queries"

// const DEMO_LOCATIONS: Location[] = [
//   {
//     orderNum: 1,
//     lat: 37.7749,
//     lng: -122.4194,
//     name: "Neo-Tokyo District",
//     info: "The future is not some place we are going, but one we are creating. The paths are not to be found, but made.",
//   },
//   {
//     orderNum: 2,
//     lat: 37.7849,
//     lng: -122.4094,
//     name: "Cyber Plaza",
//     info: "In the matrix of reality, we are both the programmers and the code.",
//   },
//   {
//     orderNum: 3,
//     lat: 37.7649,
//     lng: -122.4294,
//     name: "Data Haven",
//     info: "Information is the currency of the future, and privacy is its vault.",
//   },
//   {
//     orderNum: 4,
//     lat: 37.7949,
//     lng: -122.4394,
//     name: "Neural Bridge",
//     info: "Where human consciousness meets digital infinity.",
//   },
// ]

export default function HomePage() {
  const [pageState, setPageState] = useState<HomePageState>({
    locations: [],
    selectedLocation: null,
    hasPromptBeenSubmitted: false,
  })

  const [prompt, setPrompt] = useState("")
  const [pending, setPending] = useState(false)
  const [answer, setAnswer] = useState("")

  const answerLocationsMutation = useAnswerLocations()

  const handleLocationSelect = (location: Location): void => {
    setPageState((prev) => ({
      ...prev,
      selectedLocation: location,
    }))
  }

  const handlePromptSubmit = async (prompt: string, isDeepThinking: boolean): Promise<void> => {
    setPending(true)
    setAnswer("")
    try {
      const data = await answerLocationsMutation.mutateAsync({ prompt, isDeepThinking })
      setPageState((prev) => ({
        ...prev,
        locations: data.locations,
        hasPromptBeenSubmitted: true,
      }))
      if (!data.locations || data.locations.length === 0) {
        setAnswer(data.answer || "")
      } else {
        setAnswer("")
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-2 cyber-grid">
      <div className="mx-auto max-w-7xl space-y-3">
        <MapComponent
          locations={pageState.locations}
          selectedLocation={pageState.selectedLocation}
          onLocationSelect={handleLocationSelect}
          hasPromptBeenSubmitted={pageState.hasPromptBeenSubmitted}
          isProcessing={pending}
        />

        <PromptComponent isProcessing={pending} prompt={prompt} setPrompt={setPrompt} onPromptSubmit={handlePromptSubmit} answer={answer} />
      </div>
    </main>
  )
}
