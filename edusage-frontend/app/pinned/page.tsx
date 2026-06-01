"use client";

import { useState } from "react";
import NotebookRow from "@/components/dashboard/NotebookRow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Pin, 
  Bookmark, 
  FileText, 
  PlusCircle,
  Search,
  Filter,
  SortAsc,
  Clock,
  TrendingUp
} from "lucide-react";

export default function PinnedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const pinnedNotebooks = [
    { id: 1, title: "SEPM Notes", documents: 4, updatedAt: "2 days ago", pinned: true },
    { id: 2, title: "AI & ML Revision", documents: 6, updatedAt: "5 hours ago", pinned: true },
    { id: 3, title: "Database Systems", documents: 8, updatedAt: "1 week ago", pinned: true }
  ];

  const pinnedDocuments = [
    { id: 1, title: "Chapter 5 - Software Engineering", type: "PDF", notebook: "SEPM Notes", pinned: true },
    { id: 2, title: "Machine Learning Algorithms", type: "PDF", notebook: "AI & ML Revision", pinned: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-white to-[#f0f7f7]">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#4f8a8b]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#9cc7c7]/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        {/* Professional Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4f8a8b]/10 border border-[#4f8a8b]/20 mb-6">
            <div className="h-2 w-2 rounded-full bg-[#4f8a8b] animate-pulse" />
            <span className="text-sm font-medium text-[#2f5f60]">Quick Access</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-[#4f8a8b]">Pinned</span> Items
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Keep your most important notebooks and documents at your fingertips. 
            Pin frequently used materials for instant access and streamlined workflow.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
            <div className="text-3xl font-bold text-[#4f8a8b]">{pinnedNotebooks.length}</div>
            <div className="text-sm text-gray-600 mt-1">Pinned Notebooks</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
            <div className="text-3xl font-bold text-[#4f8a8b]">{pinnedDocuments.length}</div>
            <div className="text-sm text-gray-600 mt-1">Pinned Documents</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
            <div className="text-3xl font-bold text-[#4f8a8b]">⚡</div>
            <div className="text-sm text-gray-600 mt-1">Quick Access</div>
          </div>
        </div>

        {/* Pinned Overview Section */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-xl">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/3 via-transparent to-[#9cc7c7]/3 opacity-60" />
            
            {/* Content */}
            <div className="relative z-10 p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left side - Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4f8a8b] to-[#3e6f70] flex items-center justify-center text-white shadow-lg">
                      <Star size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Smart Organization</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Pin your most important notebooks and documents for instant access. 
                    Reduce search time and focus on what matters most with intelligent organization.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      Quick Access
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Priority Items
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      Smart Search
                    </div>
                  </div>
                </div>
                
                {/* Right side - Actions */}
                <div className="flex-1 w-full max-w-md">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#4f8a8b]/10 to-[#4f8a8b]/5 flex items-center justify-center mx-auto mb-4">
                        <Pin size={32} className="text-[#2f5f60]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Pin More Items</h3>
                      <p className="text-gray-600 mb-4">
                        Navigate to any notebook or document and click the pin icon to add it here.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4f8a8b]/10 border border-[#4f8a8b]/20">
                        <span className="text-sm font-medium text-[#2f5f60]">
                          Start Pinning →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search pinned items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-[#4f8a8b]/60 focus:ring-2 focus:ring-[#4f8a8b]/20 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-[#4f8a8b]/60 transition-all duration-200"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Alphabetical</option>
                <option value="docs">Most Documents</option>
              </select>
              
              <Button variant="outline" className="rounded-xl">
                <Filter size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Pinned Notebooks */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pinned Notebooks</h2>
              <p className="text-gray-600 mt-1">Your most important study materials</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#4f8a8b]/10 border border-[#4f8a8b]/20">
                <Star size={16} />
                <span className="text-sm font-medium text-[#2f5f60]">
                  {pinnedNotebooks.length} pinned
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedNotebooks.map((notebook, index) => (
              <div
                key={notebook.id}
                className="animate-scale-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Pin indicator */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="h-8 w-8 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-lg">
                      <Pin size={16} />
                    </div>
                  </div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#4f8a8b]/10 to-[#4f8a8b]/5 flex items-center justify-center group-hover:from-[#4f8a8b]/15 group-hover:to-[#4f8a8b]/8 transition-all duration-300">
                        <Bookmark size={24} className="text-[#2f5f60]" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {notebook.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{notebook.documents} docs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{notebook.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4f8a8b]/0 via-[#4f8a8b]/60 to-[#4f8a8b]/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Documents */}
        <div className="animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pinned Documents</h2>
              <p className="text-gray-600 mt-1">Important documents at your fingertips</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#4f8a8b]/10 border border-[#4f8a8b]/20">
                <FileText size={16} />
                <span className="text-sm font-medium text-[#2f5f60]">
                  {pinnedDocuments.length} pinned
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedDocuments.map((doc, index) => (
              <div
                key={doc.id}
                className="animate-scale-in"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Pin indicator */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="h-8 w-8 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-lg">
                      <Pin size={16} />
                    </div>
                  </div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
                        <FileText size={24} className="text-red-600" />
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                        {doc.type}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Bookmark size={14} />
                      <span>{doc.notebook}</span>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4f8a8b]/0 via-[#4f8a8b]/60 to-[#4f8a8b]/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State for Future */}
        {pinnedNotebooks.length === 0 && pinnedDocuments.length === 0 && (
          <div className="text-center py-20 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4f8a8b]/10 mb-6">
              <span className="text-3xl">📌</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No pinned items yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start pinning your important notebooks and documents for quick access to your most frequently used materials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}