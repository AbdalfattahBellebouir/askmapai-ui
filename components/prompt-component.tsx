"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import type { PromptComponentProps } from "@/types"

const MAX_PROMPT_LENGTH = 500


// const PROCESSING_DELAY = 2000
// const RESPONSE_TEMPLATES = [
//   `> NEURAL SCAN COMPLETE
// > QUERY: "{prompt}"
// > FOUND 4 CYBERPUNK LOCATIONS
// > MARKERS UPDATED ON MAP
// > CLICK MARKERS TO VIEW DETAILS`,
//   `> PROCESSING COMMAND: "{prompt}"
// > NEURAL NETWORK ACTIVATED
// > SCANNING DIGITAL LANDSCAPE...
// > LOCATIONS IDENTIFIED AND MAPPED
// > READY FOR EXPLORATION`,
//   `> COMMAND ACKNOWLEDGED: "{prompt}"
// > ACCESSING NEURAL DATABASE...
// > NODES LOCATED
// > MAP INTERFACE SYNCHRONIZED`,
// ]

export function PromptComponent({ isProcessing, prompt, setPrompt, onPromptSubmit, answer }: PromptComponentProps) {
  
  const [response, setResponse] = useState("")

  const handleSubmit = (isDeepThinking: boolean): void => {
    if (!prompt.trim()) return
    setResponse("")
    onPromptSubmit(prompt, isDeepThinking)
  }

  const handleClear = (): void => {
    setPrompt("")
    setResponse("")
  }

  const handlePromptChange = (value: string): void => {
    if (value.length <= MAX_PROMPT_LENGTH) {
      setPrompt(value)
    }
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <span className="text-xs font-mono text-primary">{"COMMAND INTERFACE"}</span>
      </div>
    </div>
  )

  const renderInputSection = () => (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="> Ask your question here"
          className="min-h-[100px] bg-input border-primary/30 text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:ring-primary resize-none"
          disabled={isProcessing}
        />
        <div className="absolute bottom-2 right-2 text-xs font-mono text-muted-foreground">
          {prompt.length}/{MAX_PROMPT_LENGTH}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => handleSubmit(false)}
          disabled={!prompt.trim() || isProcessing}
          className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono neon-glow flex-1"
        >

          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              {"SCANNING MAP..."}
            </div>
          ) : (
            "> Normal Scan"
          )}
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={!prompt.trim() || isProcessing}
          className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono neon-glow flex-1"
        >

          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              {"SCANNING MAP..."}
            </div>
          ) : (
            "> Deep Scan"
          )}
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 font-mono bg-transparent"
          disabled={isProcessing}
        >
          {"CLEAR"}
        </Button>
      </div>
    </div>
  )

  const renderResponseSection = () => {
    const hasAnswer = Boolean(answer && answer.trim().length > 0)
    if (!hasAnswer && !response && !isProcessing) return null

    return (
      <div className="mt-4">
        <label className="block text-sm font-mono text-accent mb-1.5">{"> SYSTEM RESPONSE:"}</label>
        <div className="bg-secondary border border-primary/30 rounded-lg p-3 min-h-[80px]">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-muted-foreground font-mono">
              <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
              {"NEURAL NETWORK PROCESSING..."}
            </div>
          ) : (
            <pre className="text-sm font-mono text-accent whitespace-pre-wrap">{hasAnswer ? answer : response}</pre>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-card border-2 border-primary/30 neon-glow p-4">
      {renderHeader()}
      {renderInputSection()}
      {renderResponseSection()}
    </Card>
  )
}
