"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import API from "@/services/api";
import { Activity, PlusCircle, Trash2, Upload, Clock, TrendingUp, Calendar } from "lucide-react";

interface ActivityItem {
  _id: string;
  type: string;
  title?: string;
  notebookId?: string;
  documentId?: string;
  createdAt: string;
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  notebook_created: {
    label: "Notebook created",
    icon: <PlusCircle size={16} />,
    color: "text-green-600 bg-green-50 border-green-200"
  },
  notebook_deleted: {
    label: "Notebook deleted",
    icon: <Trash2 size={16} />,
    color: "text-red-600 bg-red-50 border-red-200"
  },
  document_uploaded: {
    label: "Document uploaded",
    icon: <Upload size={16} />,
    color: "text-blue-600 bg-blue-50 border-blue-200"
  },
};

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/activity");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load recent activity");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getActivityStats = () => {
    if (!Array.isArray(items)) {
      return { total: 0, today: 0, thisWeek: 0 };
    }
    
    const today = new Date();
    const todayActivities = items.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate.toDateString() === today.toDateString();
    });
    
    const thisWeek = items.filter(item => {
      const itemDate = new Date(item.createdAt);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= weekAgo;
    });

    return {
      total: items.length,
      today: todayActivities.length,
      thisWeek: thisWeek.length
    };
  };

  const stats = getActivityStats();
  const filteredItems = filter === "all" 
    ? items 
    : Array.isArray(items) ? items.filter(item => item.type.includes(filter)) : [];

  return (
    <div className="w-full space-y-8 animate-slide-up">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60 backdrop-blur-sm mb-8">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-700">Activity Timeline</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">Activity</span>
          </h1>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Track your learning journey with a comprehensive timeline of all your activities. 
            Monitor notebook creation, document uploads, and study progress.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-700 mb-2">{stats.total}</div>
            <div className="text-sm text-purple-600 font-medium">Total Activities</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-700 mb-2">{stats.today}</div>
            <div className="text-sm text-blue-600 font-medium">Today's Activities</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-emerald-700 mb-2">{stats.thisWeek}</div>
            <div className="text-sm text-emerald-600 font-medium">This Week</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Activity Overview Section */}
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
                      <TrendingUp size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed font-medium text-sm">
                    Monitor your study patterns and learning progress. The activity timeline helps you 
                    understand your learning habits and optimize your study schedule.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-bold text-emerald-700">Track Progress</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-sm font-bold text-blue-700">Study Insights</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-sm font-bold text-purple-700">Time Management</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Stats */}
                <div className="flex-1 w-full max-w-sm">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200/60">
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center mx-auto mb-4">
                        <Activity size={28} className="text-purple-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Activity Summary</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Stay motivated by tracking your daily learning activities and progress.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                        <span className="text-sm font-medium text-purple-700">
                          Keep Learning →
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

        {/* Activity Timeline */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Activity Timeline</h2>
                    <p className="text-gray-600 text-sm">View your learning activities and progress</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm font-bold text-purple-700">
                      {filteredItems.length} {filteredItems.length === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
            {[
              { key: "all", label: "All Activities", icon: <Activity size={16} /> },
              { key: "notebook", label: "Notebooks", icon: <PlusCircle size={16} /> },
              { key: "document", label: "Documents", icon: <Upload size={16} /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  filter === tab.key
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/60 text-purple-700"
                    : "bg-white/60 border-gray-200/60 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

              <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#4f8a8b]" />
                  <span className="text-lg font-medium">Loading your activities...</span>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                  <Activity size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {filter === "all" ? "No activities yet" : `No ${filter} activities`}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm">
                  {filter === "all" 
                    ? "Start creating notebooks and uploading documents to see your activity timeline."
                    : `Try switching to "All Activities" or create some ${filter}s to see them here.`
                  }
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const config = typeConfig[item.type] || {
                  label: item.type,
                  icon: <Activity size={16} />,
                  color: "text-gray-600 bg-gray-50 border-gray-200"
                };
                const when = new Date(item.createdAt).toLocaleString();

                return (
                  <div
                    key={item._id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      <div className="relative z-10 p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`h-12 w-12 rounded-xl border ${config.color} flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
                              {config.icon}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 text-base">
                                  {config.label}
                                </h3>
                              </div>
                              
                              {item.title && (
                                <p className="text-gray-600 mb-2">
                                  {item.title}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock size={14} />
                                <span>{when}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom accent */}
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </div>
                  </div>
                );
              })
            )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}