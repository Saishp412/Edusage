"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import NotebookRow from "@/components/dashboard/NotebookRow";
import API from "@/services/api";
import { 
  FileText, 
  MoreVertical, 
  Trash2 
} from "lucide-react";

interface Notebook {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadNotebooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/notebooks");
      const list: Notebook[] = res.data || [];
      setNotebooks(list);

      // Load document counts per notebook
      const countsEntries = await Promise.all(
        list.map(async (nb) => {
          try {
            const docsRes = await API.get(`/documents/${nb._id}`);
            const docs = docsRes.data || [];
            return [nb._id, Array.isArray(docs) ? docs.length : 0] as const;
          } catch {
            return [nb._id, 0] as const;
          }
        })
      );

      const counts: Record<string, number> = {};
      for (const [id, count] of countsEntries) {
        counts[id] = count;
      }
      setDocCounts(counts);
    } catch (err) {
      setError("Failed to load notebooks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotebooks();
  }, []);

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await API.delete(`/notebooks/${id}`);
      await loadNotebooks();
    } catch (err) {
      setError("Failed to delete notebook");
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await API.post("/notebooks", { title });
      setTitle("");
      await loadNotebooks();
    } catch (err) {
      setError("Failed to create notebook");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-slide-up">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60 backdrop-blur-sm mb-8">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-700">Study Workspace</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">Notebooks</span>
          </h1>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Organize your learning materials with dedicated AI workspaces. 
            Each notebook keeps your questions focused and your knowledge structured.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-emerald-700">AI Powered</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-bold text-blue-700">Organized Learning</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-300/60">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-bold text-amber-700">Smart Search</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-700 mb-2">{notebooks.length}</div>
            <div className="text-sm text-purple-600 font-medium">Total Notebooks</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {Object.values(docCounts).reduce((sum, count) => sum + count, 0)}
            </div>
            <div className="text-sm text-blue-600 font-medium">Documents</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-emerald-700 mb-2">AI</div>
            <div className="text-sm text-emerald-600 font-medium">Powered Learning</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Create Notebook Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200/60 shadow-xl p-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Left side - Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                      <FileText size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Create New Notebook</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed font-medium text-sm">
                    Start organizing your study materials by creating a dedicated workspace. 
                    Each notebook provides focused AI assistance for your specific subject area.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-bold text-emerald-700">AI-Powered</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-sm font-bold text-blue-700">Organized Learning</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-sm font-bold text-purple-700">Smart Search</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Form */}
                <div className="flex-1 w-full max-w-sm">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/60">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Notebook Title
                        </label>
                        <Input
                          placeholder="e.g. SEPM Unit 3, AI & ML Revision"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                          suppressHydrationWarning
                        />
                      </div>
                      
                      <Button
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={handleCreate}
                        disabled={creating}
                        suppressHydrationWarning
                      >
                        {creating ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating Notebook...
                          </div>
                        ) : (
                          "Create Notebook"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="animate-slide-up">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-3">
                <span className="text-red-600 text-lg">!</span>
              </div>
              <h3 className="text-base font-semibold text-red-900 mb-2">Something went wrong</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Notebooks Grid */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Notebooks</h2>
                    <p className="text-gray-600 text-sm">Access and manage your study materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm font-bold text-purple-700">
                      {notebooks.length} {notebooks.length === 1 ? 'notebook' : 'notebooks'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-20">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-purple-500" />
                      <span className="text-lg font-medium">Loading your notebooks...</span>
                    </div>
                  </div>
                ) : notebooks.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                      <FileText size={32} className="text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No notebooks yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto text-sm">
                      Create your first notebook to start organizing your learning materials and get AI-powered assistance.
                    </p>
                  </div>
                ) : (
                  notebooks.map((nb, index) => (
                    <div
                      key={nb._id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div
                        className="group cursor-pointer"
                        onClick={() => router.push(`/notebooks/${nb._id}`)}
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          {/* Hover gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          
                          {/* Status indicator */}
                          <div className="absolute top-4 right-4 z-20">
                            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                          </div>
                          
                          <div className="relative z-10 p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                                <FileText size={20} className="text-purple-600" />
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                                    onClick={(e) => e.stopPropagation()}
                                    suppressHydrationWarning
                                  >
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="rounded-lg border border-gray-200 shadow-lg"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const confirmed = window.confirm(
                                        "Delete this notebook and all of its documents? This action cannot be undone."
                                      );
                                      if (confirmed) {
                                        handleDelete(nb._id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete notebook
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2">
                              {nb.title}
                            </h3>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
                                <FileText size={14} className="text-blue-600" />
                                <span className="text-sm font-bold text-blue-700">{docCounts[nb._id] ?? 0} docs</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                Updated {new Date(nb.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Bottom accent */}
                          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}