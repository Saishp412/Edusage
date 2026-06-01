"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import API from "@/services/api";

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  position: number;
  displayLink?: string;
  formattedUrl?: string;
}

interface WebSearchProps {
  onAddSource?: (result: SearchResult, searchQuery: string) => void;
  className?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
  provider: string;
  searchTime?: number;
  success: boolean;
}

export default function WebSearch({ onAddSource, className }: WebSearchProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchInfo, setSearchInfo] = useState<{
    provider: string;
    searchTime?: number;
    totalResults: number;
  } | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearching(true);
    setError(null);
    setHasSearched(true);
    setSearchInfo(null);

    try {
      const res = await API.post<SearchResponse>("/websearch", { query: trimmed });
      const data = res.data;
      
      setResults(data.results || []);
      setSearchInfo({
        provider: data.provider,
        searchTime: data.searchTime,
        totalResults: data.totalResults
      });
      
      console.log(`[WEB SEARCH] Found ${data.results.length} results using ${data.provider}`);
    } catch (err: any) {
      console.error("[WEB SEARCH] Error:", err);
      setError(err.response?.data?.message || "Failed to search. Please try again.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !searching) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleAddSource = (result: SearchResult) => {
    if (onAddSource) {
      onAddSource(result, query);
    }
  };

  return (
    <Card className={`border border-border/60 bg-gradient-to-br from-[#f8fafb] via-card to-[#ecf4f4] shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4f8a8b] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#4f8a8b]"></span>
          </span>
          Search the web for sources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search the web for relevant sources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Badge variant="outline" className="border-[#4f8a8b]/40 bg-[#4f8a8b]/5 text-xs font-medium text-[#2f5f60]">
              Web
            </Badge>
            <Badge variant="outline" className="border-[#4f8a8b]/40 bg-[#4f8a8b]/5 text-xs font-medium text-[#2f5f60]">
              Fast Research
            </Badge>
          </div>
          <Button
            className="bg-[#4f8a8b] hover:bg-[#3e6f70] text-white transition-transform hover:-translate-y-0.5"
            disabled={searching || !query.trim()}
            onClick={handleSearch}
          >
            {searching ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!hasSearched && !error && (
          <p className="text-sm text-muted-foreground">
            Enter keywords to search the web for relevant sources. Results can be added to your notebook.
          </p>
        )}

        {hasSearched && results.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">
            No results found for your search. Try different keywords.
          </p>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {results.length} results
              </p>
              {searchInfo && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {searchInfo.provider}
                  </Badge>
                  {searchInfo.searchTime && (
                    <span className="text-xs text-muted-foreground">
                      {searchInfo.searchTime}s
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="max-h-[400px] space-y-3 overflow-y-auto rounded-xl border border-border/60 bg-background/70 p-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/40 bg-card/50 p-3 transition-colors hover:border-[#4f8a8b]/50 hover:bg-[#f3f8f8]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          #{result.position}
                        </span>
                        {result.displayLink && (
                          <Badge variant="secondary" className="text-xs">
                            {result.displayLink}
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-[#2f5f60] mb-1">
                        {result.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {result.snippet}
                      </p>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 truncate block mb-2"
                      >
                        {result.formattedUrl || result.url}
                      </a>
                    </div>
                    {onAddSource && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-[#4f8a8b]/40 bg-[#4f8a8b]/5 hover:bg-[#4f8a8b]/10 text-xs text-[#2f5f60]"
                        onClick={() => handleAddSource(result)}
                      >
                        Add Source
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {searchInfo && (
              <div className="text-xs text-muted-foreground text-center">
                Search powered by {searchInfo.provider} • {searchInfo.totalResults} total results available
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
