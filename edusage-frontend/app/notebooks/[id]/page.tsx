"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WebSearch from "@/components/ui/websearch";
import StudioSidebar from "@/components/studio/StudioSidebar";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import AccuracyMetricsModal from "@/components/ui/AccuracyMetricsModal";
import API from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  Upload, 
  Search, 
  MessageCircle, 
  Brain, 
  Zap, 
  Sparkles, 
  Globe, 
  BookOpen, 
  Send, 
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Bot,
  User,
  BarChart3
} from "lucide-react";

// Client-side component wrapper to prevent hydration issues
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return <React.Fragment key="client-only">{children}</React.Fragment>;
}

// Client-side time display component
function TimeDisplay({ createdAt }: { createdAt: string }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient || !createdAt) {
    return null;
  }
  
  return (
    <span className="text-xs text-gray-400">
      {new Date(createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}
    </span>
  );
}

interface Notebook {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface SourceItem {
  filename?: string;
  displayName?: string;
  pages?: string;
  chunks?: string;
  topic?: string;
  chunkTypes?: string;
  confidence?: number;
}

interface DocumentItem {
  _id: string;
  filename: string;
  fileType: string;
  createdAt: string;
}

interface AccuracyMetrics {
  pdfGrounding: number | null;
  answerCompleteness: number | null;
  contextRelevance: number | null;
  retrievalConfidence: number | null;
  hallucinationRisk: number | null;
  overallScore: number | null;
  modelUsed: string | null;
  chunksRetrieved: number | null;
  avgChunkDistance: number | null;
  evaluatedAt: string | null;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  relevantImages?: RelevantImage[];
  accuracyMetrics?: AccuracyMetrics;
}

interface RelevantImage {
  id: string;
  heading: string;
  pageNumber: number;
  imageUrl: string;
  imageType: string;
  confidence: number;
  relevanceScore: number;
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  position: number;
}

interface WebSource {
  _id: string;
  title: string;
  url: string;
  snippet?: string;
  searchQuery?: string;
  sourceType: string;
  createdAt: string;
}

export default function NotebookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const notebookId = params?.id as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);



  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showWebSearch, setShowWebSearch] = useState(false);
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [showStudio, setShowStudio] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [metricsModalMessageId, setMetricsModalMessageId] = useState<string | null>(null);

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const load = async () => {
      try {
        const res = await API.get("/notebooks");
        const all: Notebook[] = res.data || [];
        const found = all.find((n) => n._id === notebookId) || null;
        setNotebook(found);

        if (notebookId) {
          const docsRes = await API.get(`/documents/${notebookId}`);
          setDocuments((docsRes.data || []) as DocumentItem[]);
          
          // Load chat history
          try {
            console.log('Loading chat history for notebook:', notebookId);
            const chatRes = await API.get(`/chat/${notebookId}`);
            console.log('Raw chat response:', chatRes.data);
            
            const backendMessages = chatRes.data?.messages || [];
            console.log('Backend messages:', backendMessages);
            
            // Map backend message format to frontend format
            const mappedMessages = backendMessages.map((msg: any) => ({
              id: msg._id || `${msg.role}-${msg.createdAt}`,
              role: msg.role,
              content: msg.message, // Backend uses 'message', frontend expects 'content'
              createdAt: msg.createdAt,
              // Include relevantImages from database for diagram persistence
              relevantImages: msg.relevantImages && msg.relevantImages.length > 0 
                ? msg.relevantImages.map((img: any) => ({
                    id: img.id || img._id,
                    heading: img.heading,
                    pageNumber: img.pageNumber,
                    imageUrl: img.imageUrl,
                    imageType: img.imageType,
                    confidence: img.confidence,
                    relevanceScore: img.relevanceScore
                  }))
                : undefined,
              // Include accuracy metrics from database
              accuracyMetrics: msg.accuracyMetrics || undefined
            }));
            
            console.log('Mapped messages:', mappedMessages);
            setMessages(mappedMessages);
          } catch (chatErr) {
            console.error("Failed to load chat history:", chatErr);
            // Keep empty messages if chat history fails to load
          }
          
          // Load web sources
          try {
            const webSourcesRes = await API.get(`/websearch/${notebookId}/sources`);
            setWebSources((webSourcesRes.data || []) as WebSource[]);
          } catch (webErr) {
            console.error("Failed to load web sources:", webErr);
            // Keep empty web sources if loading fails
          }
        }
      } catch (err) {
        // keep a simple error for now
      } finally {
        setLoading(false);
      }
    };

    if (notebookId) {
      load();
    }
  }, [notebookId, isLoading, isAuthenticated]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
    } else {
      setFiles([]);
    }
    setUploadMessage(null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !notebookId) return;

    setUploading(true);
    setUploadMessage(null);
    setUploadError(null);

    try {
      if (files.length === 1) {
        // Single file — use existing endpoint for backward compatibility
        const formData = new FormData();
        formData.append("file", files[0]);

        await API.post(`/documents/${notebookId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadMessage("Document uploaded and indexed successfully.");
      } else {
        // Multiple files — use batch endpoint
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));

        const res = await API.post(`/documents/${notebookId}/batch`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data = res.data;
        if (data.totalFailed > 0) {
          setUploadMessage(`${data.totalProcessed} of ${data.totalProcessed + data.totalFailed} documents uploaded successfully.`);
          setUploadError(`${data.totalFailed} file(s) failed: ${data.errors?.map((e: any) => e.filename).join(', ')}`);
        } else {
          setUploadMessage(`All ${data.totalProcessed} documents uploaded and indexed successfully.`);
        }
      }

      setFiles([]);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Reload documents list
      try {
        const docsRes = await API.get(`/documents/${notebookId}`);
        setDocuments((docsRes.data || []) as DocumentItem[]);
      } catch {
        // ignore
      }
    } catch (err: any) {
      setUploadError(err.response?.data?.message || "Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const handleAddWebSource = async (result: SearchResult, searchQuery: string) => {
    if (!notebookId) return;
    
    try {
      const res = await API.post(`/websearch/${notebookId}/sources`, {
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        searchQuery: searchQuery
      });
      
      // Refresh web sources list
      const webSourcesRes = await API.get(`/websearch/${notebookId}/sources`);
      setWebSources((webSourcesRes.data || []) as WebSource[]);
      
      console.log("Web source added:", res.data);
    } catch (err) {
      console.error("Failed to add web source:", err);
    }
  };

  const handleDeleteWebSource = async (sourceId: string) => {
    try {
      await API.delete(`/websearch/sources/${sourceId}`);
      
      // Refresh web sources list
      const webSourcesRes = await API.get(`/websearch/${notebookId}/sources`);
      setWebSources((webSourcesRes.data || []) as WebSource[]);
    } catch (err) {
      console.error("Failed to delete web source:", err);
    }
  };

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed || !notebookId) return;

    const timestamp = new Date().toISOString();

    const userMessage: ChatMessage = {
      id: `user-${timestamp}`,
      role: "user",
      content: trimmed,
      createdAt: timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setAsking(true);
    setChatError(null);

    try {
    // NOTE: use /query/${notebookId} instead of /query
    const res = await API.post(`/query/${notebookId}`, {
      question: trimmed,
    });

      const answer: string = res.data?.answer || "No answer returned.";
      const rawSources = (res.data?.sources || []) as SourceItem[];
      // Handle both field names: relevantImages or images
      const relevantImages = (res.data?.relevantImages || res.data?.images || []) as RelevantImage[];
      const accuracyMetrics = res.data?.accuracyMetrics || undefined;

      console.log('Response data:', res.data);
      console.log('Relevant images found:', relevantImages);

      let answerText = answer;
      if (rawSources.length > 0) {
        const formattedSources = rawSources
          .map((s) => `- ${s.filename || s.displayName || 'Unknown Source'}`)
          .join("\n");
        answerText += `\n\nSources:\n${formattedSources}`;
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${timestamp}`,
        role: "assistant",
        content: answerText,
        createdAt: timestamp,
        relevantImages: relevantImages.length > 0 ? relevantImages : undefined,
        accuracyMetrics,
      };

      console.log('Assistant message created:', assistantMessage);
      console.log('Has relevant images:', !!assistantMessage.relevantImages);

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Note: The query controller already saves both user and assistant messages
      // to the Chat database with relevantImages. We do NOT double-save here.
      // The backend handles persistence in query.controller.js processQueryResults/processOriginalQuery.
    } catch (err) {
      setChatError("Failed to get an answer. Please try again.");
    } finally {
      setAsking(false);
    }
  };

  const handleClearChat = async () => {
    if (!notebookId) return;
    
    try {
      await API.delete(`/chat/${notebookId}`);
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      // Could show a toast message here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading notebook...</p>
    );
  }

  if (!notebook) {
    return (
      <p className="text-sm text-muted-foreground">Notebook not found.</p>
    );
  }

  return (
    <div className="w-full space-y-8 animate-slide-up">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60 backdrop-blur-sm mb-8">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-700">AI Learning Space</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {notebook.title}
          </h1>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Upload PDFs or documents here and then ask focused questions below. 
            EduSage will answer using only the material in this notebook.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-emerald-700">AI Powered</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-bold text-blue-700">{documents.length} Documents</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-300/60">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-bold text-amber-700">{messages.length} Questions</span>
            </div>
          </div>
        </div>

        {/* Enhanced Upload Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-200/60 shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Add Sources to Your Notebook</h2>
                    <p className="text-gray-600 text-sm">Upload documents and search web sources</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/60 hover:from-purple-500/30 hover:to-pink-500/30"
                    onClick={() => setShowStudio(!showStudio)}
                  >
                    <Brain size={16} />
                    {showStudio ? "Hide" : "Show"} Studio
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-300/60 hover:from-blue-500/30 hover:to-cyan-500/30"
                    onClick={() => setShowWebSearch(!showWebSearch)}
                  >
                    <Search size={16} />
                    {showWebSearch ? "Hide" : "Search"} Web Sources
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Area */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <FileText size={16} className="text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">Upload Documents</h3>
                      </div>
                      
                      <Input
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        multiple
                        onChange={handleFileChange}
                        className="h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      />

                      {files.length > 0 && (
                        <div className="text-xs text-gray-500 px-1">
                          {files.length} file{files.length > 1 ? 's' : ''} selected: {files.map(f => f.name).join(', ')}
                        </div>
                      )}
                      
                      <Button
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        disabled={files.length === 0 || uploading}
                        onClick={handleUpload}
                      >
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Uploading {files.length} file{files.length > 1 ? 's' : ''}...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload size={16} />
                            Upload {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : 'to this notebook'}
                          </div>
                        )}
                      </Button>
                      
                      {uploadMessage && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                          <CheckCircle size={16} />
                          {uploadMessage}
                        </div>
                      )}
                      {uploadError && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                          <AlertCircle size={16} />
                          {uploadError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drop Zone Info */}
                  <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl p-6 border border-blue-200/60">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Globe size={16} className="text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">Supported Formats</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-center text-sm text-gray-600 border-t border-blue-200/40 pt-3">
                        Drop your files: PDF, images, docs, audio, and more
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60">
                          <div className="h-2 w-2 rounded-full bg-purple-400" />
                          <span className="text-gray-700">PDF Files</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60">
                          <div className="h-2 w-2 rounded-full bg-blue-400" />
                          <span className="text-gray-700">Documents</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60">
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-gray-700">Images</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60">
                          <div className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="text-gray-700">Audio</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Enhanced Web Sources Section */}
        {showWebSearch && (
          <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>
              <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-200/60 shadow-2xl p-2">
                <WebSearch
                  onAddSource={(result: SearchResult, searchQuery: string) => {
                    handleAddWebSource(result, searchQuery);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Web Sources Card */}
        {webSources.length > 0 && (
          <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>
              <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-emerald-200/60 shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Web Sources ({webSources.length})</h2>
                    <p className="text-gray-600">Web sources added for AI reference</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {webSources.map((source) => (
                    <div
                      key={source._id}
                      className="flex items-start justify-between rounded-2xl border border-emerald-200/60 bg-white/60 backdrop-blur-sm p-4 hover:bg-white/80 transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <p className="font-bold text-gray-900 truncate">
                            {source.title}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {source.snippet}
                        </p>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 truncate block font-medium"
                        >
                          {source.url}
                        </a>
                        {source.searchQuery && (
                          <p className="text-xs text-gray-500 mt-2">
                            Searched for: <span className="font-medium">"{source.searchQuery}"</span>
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="shrink-0 ml-4 rounded-xl bg-red-50 border-red-200 hover:bg-red-100 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteWebSource(source._id)}
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Documents Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-200/60 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Documents ({documents.length})</h2>
                  <p className="text-gray-600 text-sm">Uploaded documents for AI reference</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                      <FileText size={32} className="text-purple-600" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      No documents uploaded yet. Upload a PDF above to get started.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between rounded-2xl border border-purple-200/60 bg-white/60 backdrop-blur-sm p-4 hover:bg-white/80 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <FileText size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                            {doc.filename}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(doc.createdAt).toLocaleDateString()} · {doc.fileType}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Enhanced ChatGPT-Style Chat Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-6 border-b border-blue-200/60 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <MessageCircle size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">AI Learning Assistant</h2>
                  <p className="text-gray-600 text-sm">Ask questions about your notebook materials</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700">Online</span>
                  </div>
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearChat}
                      className="rounded-xl bg-red-50 border-red-200 hover:bg-red-100 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Clear Chat
                    </Button>
                  )}
                </div>
              </div>

              {/* Chat Messages Area - ChatGPT Style */}
              <div className="h-[500px] overflow-y-auto bg-gradient-to-b from-white/40 to-white/20">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-6">
                      <Bot size={40} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Start a conversation</h3>
                    <p className="text-gray-600 text-center max-w-md mb-6">
                      Ask me anything about your notebook materials. I&apos;m here to help you learn!
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => setQuestion("Summarise Unit 3 for tomorrows exam")}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60 text-purple-700 text-sm font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
                      >
                        Summarise Unit 3
                      </button>
                      <button
                        onClick={() => setQuestion("Explain the main concepts in simple terms")}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60 text-blue-700 text-sm font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200"
                      >
                        Explain concepts
                      </button>
                      <button
                        onClick={() => setQuestion("What are the key takeaways from these documents?")}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60 text-emerald-700 text-sm font-medium hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-200"
                      >
                        Key takeaways
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-gray-500 px-6 py-2 border-b border-gray-200">
                      Debug: {messages.length} messages loaded
                    </div>
                    <div className="p-6 space-y-6">
                      {messages.map((msg, index) => (
                        <div
                          key={msg.id || `message-${index}`}
                          className={`flex gap-4 ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                                <Bot size={16} />
                              </div>
                            </div>
                          )}
                          
                          <div className={`max-w-[70%] ${msg.role === "user" ? "order-first" : ""}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm text-gray-600">
                                {msg.role === "user" ? "You" : "EduSage AI"}
                              </span>
                              <TimeDisplay createdAt={msg.createdAt} />
                            </div>
                            
                            <div
                              className={`rounded-2xl px-4 py-3 text-sm ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                  : "bg-white border border-gray-200/60 text-gray-900 shadow-sm"
                              }`}
                            >
                              {msg.role === "assistant" ? (
                                <MarkdownRenderer content={msg.content || ''} />
                              ) : (
                                msg.content || ''
                              )}
                            </div>
                            
                            {/* Accuracy Metrics Button - inside assistant chat bubble */}
                            {msg.role === "assistant" && msg.accuracyMetrics && (
                              <button
                                onClick={() => setMetricsModalMessageId(msg.id)}
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-300/40 hover:border-blue-400/60 hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 text-blue-700 text-xs font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 group"
                              >
                                <BarChart3 size={14} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                                <span>Accuracy Metrics</span>
                                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-600 text-[10px] font-bold">
                                  {msg.accuracyMetrics.overallScore ?? '—'}%
                                </span>
                              </button>
                            )}

                            {/* Render diagrams if present in assistant messages */}
                            {msg.role === "assistant" && msg.relevantImages && msg.relevantImages.length > 0 && (
                              <div className="mt-3 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                  <FileText size={14} />
                                  <span>Relevant Diagrams ({msg.relevantImages.length})</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                                  {msg.relevantImages.map((image, imageIndex) => {
                                    const imageKey = image.id || `image-${imageIndex}`;
                                    // Build image src: use proxy path if it's a relative backend URL
                                    let imgSrc = image.imageUrl || '';
                                    if (imgSrc.includes('/uploads/')) {
                                      // Extract the /uploads/... path and use it directly
                                      // Next.js rewrite will proxy this to the backend
                                      const uploadsPath = imgSrc.substring(imgSrc.indexOf('/uploads/'));
                                      imgSrc = uploadsPath;
                                    }
                                    return (
                                    <div
                                      key={imageKey}
                                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2"
                                    >
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                          {image.heading}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span>Page {image.pageNumber}</span>
                                          <span>•</span>
                                          <span>{Math.round((image.relevanceScore || 0) * 100)}% relevant</span>
                                        </div>
                                      </div>
                                      
                                      <div className="relative bg-white rounded border border-gray-200 overflow-hidden">
                                        {!imageErrors.has(imageKey) ? (
                                          <img
                                            src={imgSrc}
                                            alt={image.heading}
                                            className="w-full h-auto max-h-64 object-contain"
                                            onError={() => handleImageError(imageKey)}
                                          />
                                        ) : (
                                          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                                            <div className="text-center">
                                              <FileText size={24} className="mx-auto mb-2 opacity-50" />
                                              <p>Image unavailable</p>
                                              <p className="text-xs opacity-70 mt-1">{image.heading}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="truncate">
                                          {image.imageType} • {Math.round((image.confidence || 0) * 100)}% confidence
                                        </span>
                                      </div>
                                    </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {msg.role === "user" && (
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                                <User size={16} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {asking && (
                        <div className="flex gap-4 justify-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                              <Bot size={16} />
                            </div>
                          </div>
                          <div className="max-w-[70%]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm text-gray-600">EduSage AI</span>
                              <span className="text-xs text-gray-400">Thinking...</span>
                            </div>
                            <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200/60 text-gray-900 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Chat Input - ChatGPT Style */}
              <div className="p-6 border-t border-blue-200/60 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                {chatError && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium mb-4">
                    <AlertCircle size={16} />
                    {chatError}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Ask a question about this notebook..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!asking) {
                            handleAsk();
                          }
                        }
                      }}
                      className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 pr-12 bg-white/80 backdrop-blur-sm"
                      disabled={asking}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles size={20} className="text-blue-400" />
                    </div>
                  </div>
                  <Button
                    className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAsk}
                    disabled={asking || !question.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center mt-4 gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>Press Enter to send</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>Shift+Enter for new line</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Sidebar */}
        <StudioSidebar 
          notebookId={notebookId}
          isOpen={showStudio}
          onClose={() => setShowStudio(false)}
        />

        {/* Accuracy Metrics Modal */}
        {metricsModalMessageId && (() => {
          const targetMsg = messages.find(m => m.id === metricsModalMessageId);
          if (!targetMsg?.accuracyMetrics) return null;
          return (
            <AccuracyMetricsModal
              metrics={targetMsg.accuracyMetrics}
              isOpen={true}
              onClose={() => setMetricsModalMessageId(null)}
            />
          );
        })()}
    </div>
  );
}