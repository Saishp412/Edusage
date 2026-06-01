"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardStats from "@/components/dashboard/DashboardStats";
import NotebookList from "@/components/dashboard/NotebookList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Trophy, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Activity,
  Star,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  Brain,
  BarChart3,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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

  return (
    <div className="relative z-10 space-y-8">
      {/* Professional Header */}
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Back</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Here is your personalized learning space with real-time insights and intelligent recommendations.
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60">
            <Trophy size={18} className="text-green-600" />
            <span className="text-sm font-bold text-green-700">Top Performer</span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60">
            <Target size={18} className="text-blue-600" />
            <span className="text-sm font-bold text-blue-700">On Track</span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60">
            <Sparkles size={18} className="text-amber-600" />
            <span className="text-sm font-bold text-amber-700">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid - Multiple Cards Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up animation-delay-100">
        {/* Study Time Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-60" />
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Clock size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUp size={16} />
                <span>12%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">24.5 hrs</h3>
            <p className="text-gray-600 text-sm">Study Time This Week</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '75%'}} />
              </div>
              <span className="text-xs text-gray-500">75%</span>
            </div>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-pink-50 opacity-60" />
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Activity size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUp size={16} />
                <span>8%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">142</h3>
            <p className="text-gray-600 text-sm">Total Sessions</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{width: '89%'}} />
              </div>
              <span className="text-xs text-gray-500">89%</span>
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-emerald-50 opacity-60" />
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <CheckCircle size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUp size={16} />
                <span>5%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">89%</h3>
            <p className="text-gray-600 text-sm">Completion Rate</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{width: '89%'}} />
              </div>
              <span className="text-xs text-gray-500">89%</span>
            </div>
          </div>
        </div>

        {/* Achievement Points Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-orange-50 opacity-60" />
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Trophy size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUp size={16} />
                <span>15%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">2,450</h3>
            <p className="text-gray-600 text-sm">Achievement Points</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{width: '92%'}} />
              </div>
              <span className="text-xs text-gray-500">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview Section */}
      <div className="animate-slide-up animation-delay-200">
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-2xl">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50 opacity-60" />
          
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl">
                <TrendingUp size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">Performance Overview</h2>
                <p className="text-gray-600">Your learning progress and achievements</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60">
                  <Activity size={18} className="text-green-600" />
                  <span className="text-sm font-bold text-green-700">Live Data</span>
                </div>
              </div>
            </div>
            
            <DashboardStats />
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up animation-delay-300">
        {/* Learning Streak */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/60 shadow-2xl">
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                <Zap size={24} />
              </div>
              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                🔥 7 days
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Learning Streak</h3>
            <p className="text-gray-600 text-sm mb-4">Keep it going! You're on fire!</p>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
              ))}
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">?</div>
            </div>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 shadow-2xl">
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <BarChart3 size={24} />
              </div>
              <div className="text-blue-700 text-sm font-bold">Top: Math</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Subject Progress</h3>
            <p className="text-gray-600 text-sm mb-4">Your strongest subjects this month</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mathematics</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: '92%'}} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Science</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{width: '88%'}} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">History</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{width: '76%'}} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">76%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/60 shadow-2xl">
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                <Clock size={24} />
              </div>
              <div className="text-purple-700 text-sm font-bold">Today</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600 text-sm mb-4">Your latest learning sessions</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Math Chapter 5</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Science Quiz</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">History Notes</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Notebooks Section */}
      <div className="animate-slide-up animation-delay-400">
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-2xl">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-transparent to-blue-50 opacity-60" />
          
          <div className="relative z-10 p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-xl">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Your Notebooks</h2>
                  <p className="text-gray-600">Manage and organize your learning materials</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/60">
                  <Star size={16} className="text-purple-600" />
                  <span className="text-sm font-bold text-purple-700">Featured</span>
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60">
                  <Award size={16} className="text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">Recent</span>
                </div>
                <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 px-6 py-3 flex items-center gap-2">
                  <ChevronRight size={20} />
                  View All
                </button>
              </div>
            </div>
            
            <NotebookList />
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="animate-slide-up animation-delay-500">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200/60 shadow-2xl">
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xl">
                <Zap size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-gray-600">Get started with your learning journey</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Brain size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Start New Session</h3>
                  <p className="text-gray-600 text-sm">Begin an AI-powered learning session</p>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <BookOpen size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Create Notebook</h3>
                  <p className="text-gray-600 text-sm">Organize your study materials</p>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Trophy size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">View Progress</h3>
                  <p className="text-gray-600 text-sm">Track your learning achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}