"use client"

import type React from "react"

import { useState } from "react"
import { Search, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<null | {
    airQuality: string
    prediction: string
    recommendations: string[]
    pollutants: {
      pm25: number
      pm10: number
      no2: number
      o3: number
    }
  }>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data - in a real app, this would come from your AI backend
      setResults({
        airQuality: "Moderate",
        prediction:
          "Based on current trends and weather patterns, air quality in Sheffield city center is expected to improve over the next 24 hours as wind speeds increase from the west.",
        recommendations: [
          "Consider using public transport instead of driving",
          "Vulnerable individuals should limit outdoor activities during peak traffic hours",
          "Keep windows closed during morning rush hour (7-9am)",
        ],
        pollutants: {
          pm25: 12.3,
          pm10: 24.7,
          no2: 38.2,
          o3: 42.1,
        },
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Sheffield Air<span className="text-emerald-400">Quality</span>AI
          </h1>
          <p className="text-gray-300">Ask about pollution in Sheffield and get AI-powered insights and predictions</p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Ask about air quality in Sheffield..."
                className="pl-10 py-6 bg-gray-800 border-gray-700 text-white w-full rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-6"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Ask AI"}
              {!isLoading && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Try: "How is the air quality in Sheffield city center today?" or "What's the pollution forecast for
            tomorrow?"
          </p>
        </form>

        {/* Results Section */}
        {results && (
          <Card className="bg-gray-800 border-gray-700 w-full">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-400">AI Response</CardTitle>
              <CardDescription>
                Based on your query: <span className="text-emerald-300">"{query}"</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prediction */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                <p className="text-gray-300">{results.prediction}</p>
              </div>

              {/* Current Status */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span>Air Quality Index:</span>
                    <span
                      className={`font-bold ${
                        results.airQuality === "Good"
                          ? "text-green-400"
                          : results.airQuality === "Moderate"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {results.airQuality}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">PM2.5</div>
                      <div className="text-xl font-bold">{results.pollutants.pm25}</div>
                      <div className="text-xs text-gray-500">µg/m³</div>
                    </div>

                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">PM10</div>
                      <div className="text-xl font-bold">{results.pollutants.pm10}</div>
                      <div className="text-xs text-gray-500">µg/m³</div>
                    </div>

                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">NO₂</div>
                      <div className="text-xl font-bold">{results.pollutants.no2}</div>
                      <div className="text-xs text-gray-500">µg/m³</div>
                    </div>

                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">O₃</div>
                      <div className="text-xl font-bold">{results.pollutants.o3}</div>
                      <div className="text-xs text-gray-500">µg/m³</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-2 bg-gray-700/50 p-4 rounded-lg">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-emerald-500/20 text-emerald-500 p-1 rounded-full mt-0.5 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Source */}
              <div className="text-xs text-gray-500 italic">
                Data sourced from Sheffield City Council's air quality monitoring stations and the UK's Department for
                Environment, Food and Rural Affairs (DEFRA).
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
