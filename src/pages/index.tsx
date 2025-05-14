"use client";

import type React from "react";
import { useState } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define a more specific type for the expected successful response
interface PollutionResponse {
  summary: string;
  // Add other potential fields if known
}

// Define a type for an error response
interface ErrorResponse {
  error: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Use a union type for results: successful response, error, or null
  const [results, setResults] = useState<
    PollutionResponse | ErrorResponse | null
  >(null);
  const [submittedQuery, setSubmittedQuery] = useState<string>(""); // To store the query that was actually submitted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuery = query.trim();
    if (!currentQuery) return;

    setIsLoading(true);
    setResults(null); // Clear previous results
    setSubmittedQuery(currentQuery); // Store the query that's being submitted

    try {
      const response = await fetch("http://127.0.0.1:8000/pollution-forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: currentQuery }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${
            errorText || response.statusText
          }`
        );
      }

      const data = await response.json();
      // Check if the response has the expected 'summary' field
      if (data && typeof data.summary === "string") {
        setResults(data as PollutionResponse);
      } else {
        // If 'summary' is missing, treat it as an unexpected response format
        console.warn(
          "API response is missing the 'summary' field or is not in the expected format:",
          data
        );
        setResults({
          error: "Received an unexpected response format from the server.",
        });
      }
    } catch (error) {
      console.error("Failed to fetch pollution data:", error);
      setResults({
        error:
          (error as Error).message ||
          "An unknown error occurred while fetching data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if the result is an error
  const isErrorResult = (res: any): res is ErrorResponse => {
    return res && typeof res.error === "string";
  };

  // Helper function to check if the result is a successful pollution response
  const isPollutionResult = (res: any): res is PollutionResponse => {
    return res && typeof res.summary === "string";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Sheffield Air<span className="text-emerald-400">Quality</span>AI
          </h1>
          <p className="text-gray-300">
            Ask about pollution in Sheffield and get AI-powered insights and
            predictions
          </p>
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
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-6"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Processing..." : "Ask AI"}
              {!isLoading && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Try: "How is the air quality in Sheffield city center today?" or
            "What's the pollution forecast for tomorrow?"
          </p>
        </form>

        {/* Loading Spinner Section */}
        {isLoading && (
          <div className="text-center mt-8 text-white">
            <svg
              className="animate-spin h-10 w-10 text-emerald-400 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-3 text-lg">Fetching AI insights...</p>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && results && (
          <Card className="bg-gray-800 border-gray-700 w-full mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-400">
                Response
              </CardTitle>{" "}
              {/* Changed title */}
              {submittedQuery && (
                <CardDescription>
                  For query:{" "}
                  <span className="text-emerald-300">"{submittedQuery}"</span>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isPollutionResult(results) ? (
                // Display the summary, preserving line breaks
                <div className="text-gray-300 whitespace-pre-line">
                  {results.summary}
                </div>
              ) : isErrorResult(results) ? (
                // Display error message
                <div className="text-red-400">
                  <p className="font-semibold">Error:</p>
                  <p>{results.error}</p>
                </div>
              ) : (
                // Fallback for unexpected result structure (though should be caught by handleSubmit)
                <pre className="text-sm whitespace-pre-wrap break-all bg-gray-900 p-4 rounded-md text-gray-300">
                  {JSON.stringify(results, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
