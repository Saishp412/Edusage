"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, FolderOpen, Calendar, File } from "lucide-react";

interface NotebookRef {
  _id: string;
  title: string;
}

interface DocumentItem {
  _id: string;
  filename: string;
  fileType: string;
  createdAt: string;
  notebook?: NotebookRef;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/documents");
        setDocuments((res.data || []) as DocumentItem[]);
      } catch (err) {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" size={20} />;
      default:
        return <File className="text-gray-500" size={20} />;
    }
  };

  const uniqueNotebooks = [...new Set(documents.map(doc => doc.notebook?.title).filter(Boolean))];
  const totalFileSize = documents.length; // Simplified - would need actual file sizes

  return (
    <div className="w-full space-y-8 animate-slide-up">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60 backdrop-blur-sm mb-8">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-700">Document Library</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">Documents</span>
          </h1>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Access all your uploaded study materials in one place. Each document is linked to its notebook 
            for focused AI-powered learning and Q&A sessions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-700 mb-2">{documents.length}</div>
            <div className="text-sm text-purple-600 font-medium">Total Documents</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-700 mb-2">{uniqueNotebooks.length}</div>
            <div className="text-sm text-blue-600 font-medium">Notebooks</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-emerald-700 mb-2">PDF</div>
            <div className="text-sm text-emerald-600 font-medium">Primary Format</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-xl">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/3 via-transparent to-[#9cc7c7]/3 opacity-60" />
            
            {/* Content */}
            <div className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Left side - Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4f8a8b] to-[#3e6f70] flex items-center justify-center text-white shadow-lg">
                      <Upload size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Upload More Documents</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed font-medium text-sm">
                    Add more study materials to your notebooks. Upload PDFs, documents, and other files 
                    to enhance your AI-powered learning experience.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-bold text-emerald-700">PDF Support</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-sm font-bold text-blue-700">AI Processing</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-sm font-bold text-purple-700">Smart Search</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Action */}
                <div className="flex-1 w-full max-w-sm">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200/60">
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center mx-auto mb-4">
                        <FolderOpen size={28} className="text-purple-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Go to Notebooks</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Navigate to any notebook to upload new documents directly.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                        <span className="text-sm font-medium text-purple-700">
                          Visit Notebooks →
                        </span>
                      </div>
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

        {/* Documents Grid */}
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
                    <h2 className="text-xl font-bold text-gray-900">All Documents</h2>
                    <p className="text-gray-600 text-sm">Browse and manage your study materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm font-bold text-purple-700">
                      {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#4f8a8b]" />
                  <span className="text-lg font-medium">Loading your documents...</span>
                </div>
              </div>
            ) : documents.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                  <FileText size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No documents yet</h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm">
                  Upload your first document to any notebook to start building your AI-powered study library.
                </p>
              </div>
            ) : (
              documents.map((doc, index) => (
                <div
                  key={doc._id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="relative z-10 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                          {getFileIcon(doc.fileType)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                        {doc.filename}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60 text-blue-700 text-xs font-bold">
                          {doc.fileType.toUpperCase()}
                        </span>
                      </div>
                      
                      {doc.notebook && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FolderOpen size={14} />
                          <span className="text-sm">{doc.notebook.title}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
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