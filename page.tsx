"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, RotateCcw, Share2 } from "lucide-react"
import Link from "next/link"

interface PersonalityScores {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

interface AnalysisData {
  inputText: string
  model: string
  language: string
  timestamp: string
  scores: PersonalityScores
  confidence: number
}

const traitDescriptions = {
  openness: {
    name: "Openness to Experience",
    description: "Reflects imagination, creativity, and willingness to try new things.",
    high: "You are creative, curious, and open to new experiences and ideas.",
    low: "You prefer routine and familiar experiences over novel ones.",
  },
  conscientiousness: {
    name: "Conscientiousness",
    description: "Indicates organization, responsibility, and goal-directed behavior.",
    high: "You are organized, disciplined, and reliable in your commitments.",
    low: "You tend to be more spontaneous and flexible in your approach.",
  },
  extraversion: {
    name: "Extraversion",
    description: "Measures sociability, assertiveness, and energy in social situations.",
    high: "You are outgoing, energetic, and enjoy socializing with others.",
    low: "You prefer quieter environments and smaller social gatherings.",
  },
  agreeableness: {
    name: "Agreeableness",
    description: "Reflects cooperation, trust, and concern for others.",
    high: "You are cooperative, trusting, and considerate of others' needs.",
    low: "You tend to be more competitive and skeptical in your interactions.",
  },
  neuroticism: {
    name: "Neuroticism",
    description: "Indicates emotional stability and stress management.",
    high: "You may experience emotions more intensely and be sensitive to stress.",
    low: "You tend to be emotionally stable and resilient under pressure.",
  },
}

export default function ResultsPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem("personalityAnalysis")
    if (data) {
      setAnalysisData(JSON.parse(data))
    }
    setLoading(false)
  }, [])

  const getTraitLevel = (score: number) => {
    if (score >= 70) return "High"
    if (score >= 40) return "Moderate"
    return "Low"
  }

  const getTraitColor = (score: number) => {
    if (score >= 70) return "bg-green-500"
    if (score >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const generateInsights = (scores: PersonalityScores) => {
    const insights = []

    if (scores.extraversion > 60) {
      insights.push("You likely enjoy social interactions and feel energized by being around others.")
    }

    if (scores.conscientiousness > 65) {
      insights.push("You demonstrate strong organizational skills and attention to detail.")
    }

    if (scores.openness > 70) {
      insights.push("You show high creativity and openness to new experiences and ideas.")
    }

    if (scores.agreeableness > 60) {
      insights.push("You tend to be cooperative and considerate in your relationships.")
    }

    if (scores.neuroticism < 40) {
      insights.push("You appear to handle stress well and maintain emotional stability.")
    }

    return insights.length > 0 ? insights : ["Your personality profile shows a balanced combination of traits."]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h1>
            <p className="text-lg text-gray-600 mb-8">Please run a personality analysis first to see results.</p>
            <Link href="/predict">
              <Button size="lg">Start Analysis</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Personality Analysis Results</h1>
            <p className="text-lg text-gray-600">Based on your social media content analysis</p>
          </div>

          {/* Confidence Score */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle>Analysis Confidence</CardTitle>
              <CardDescription>How reliable is this personality prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${analysisData.confidence}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{analysisData.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Big Five Traits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Big Five Personality Traits (OCEAN)</CardTitle>
              <CardDescription>
                Your personality breakdown based on the scientifically validated Big Five model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(analysisData.scores).map(([trait, score]) => {
                  const traitInfo = traitDescriptions[trait as keyof PersonalityScores]
                  const level = getTraitLevel(score)

                  return (
                    <div key={trait} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{traitInfo.name}</h3>
                          <Badge
                            variant={level === "High" ? "default" : level === "Moderate" ? "secondary" : "outline"}
                          >
                            {level}
                          </Badge>
                        </div>
                        <span className="text-2xl font-bold text-primary">{score}%</span>
                      </div>
                      <Progress value={score} className="h-3" />
                      <p className="text-sm text-gray-600">{traitInfo.description}</p>
                      <p className="text-sm font-medium text-gray-800">
                        {score >= 50 ? traitInfo.high : traitInfo.low}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Behavioral Insights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Behavioral Insights</CardTitle>
              <CardDescription>Key personality patterns identified from your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateInsights(analysisData.scores).map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analyzed Content Preview</CardTitle>
              <CardDescription>Sample of the text that was analyzed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 italic">"{analysisData.inputText}"</p>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>Model: {analysisData.model}</span>
                <span>Language: {analysisData.language}</span>
                <span>Analyzed: {new Date(analysisData.timestamp).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Link href="/predict">
              <Button className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
