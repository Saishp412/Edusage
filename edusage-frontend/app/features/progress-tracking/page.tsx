"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, BarChart3, Target, Award, TrendingUp, Calendar, Clock } from "lucide-react";

export default function ProgressTrackingPage() {
  const router = useRouter();

  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track your learning progress with comprehensive dashboards showing detailed performance metrics and trends.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set personalized learning objectives and monitor your achievement with smart milestones and deadlines.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Earn badges and certificates as you complete milestones, keeping you motivated throughout your journey.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "AI-powered analysis of your learning patterns with personalized recommendations for improvement.",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: Calendar,
      title: "Study Scheduling",
      description: "Smart calendar integration that optimizes your study time based on your peak performance periods.",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Monitor time spent on different subjects and optimize your study schedule for maximum efficiency.",
      color: "from-yellow-400 to-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        
        {/* Notebook grid pattern */}
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px',
        }} />
        
        {/* Notebook lines pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(59, 130, 246, 0.5) 0px,
              transparent 1px,
              transparent 24px,
              rgba(59, 130, 246, 0.5) 25px
            )
          `,
          backgroundSize: '100% 25px',
        }} />
        
        {/* Subtle notebook margin line */}
        <div className="absolute left-20 top-0 bottom-0 w-px bg-red-400 opacity-[0.06]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-12 w-12 rounded-lg bg-black flex items-center justify-center text-white">
                  <Brain size={24} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-gray-900">EduSage</span>
                <div className="text-xs text-gray-500 font-medium">AI Learning Platform</div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 px-6 pt-32 pb-16">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6">
              <BarChart3 size={16} />
              <span>Progress Tracking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Track Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Monitor your progress, celebrate achievements, and stay motivated with comprehensive analytics and insights that help you reach your educational goals faster.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <feature.icon size={32} className="text-gray-700 group-hover:text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Dashboard Preview */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Comprehensive Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Overall Progress</span>
                      <span className="text-2xl font-bold text-green-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" style={{width: '78%'}} />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Study Streak</span>
                      <span className="text-2xl font-bold text-orange-600">15 days</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className="w-2 h-8 bg-orange-400 rounded-sm" />
                      ))}
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-8 bg-gray-200 rounded-sm" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Skills Mastered</span>
                      <span className="text-2xl font-bold text-blue-600">24/32</span>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {[...Array(32)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-sm ${i < 24 ? 'bg-blue-400' : 'bg-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quick Learner</h4>
                      <p className="text-sm text-gray-600">Completed 5 lessons in one day</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Goal Crusher</h4>
                      <p className="text-sm text-gray-600">Achieved weekly study goal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">On Fire</h4>
                      <p className="text-sm text-gray-600">15-day learning streak</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Knowledge Master</h4>
                      <p className="text-sm text-gray-600">Scored 95% on advanced quiz</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Progress Tracking Matters</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Effective progress tracking is the key to successful learning. Our system provides the insights you need to stay motivated and achieve your goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">Increase motivation by 40% with visible progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">Identify knowledge gaps before they become problems</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">Optimize study time with data-driven insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">Celebrate milestones to maintain momentum</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Success Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Goal Achievement Rate</span>
                    <span className="text-gray-900 font-bold">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '87%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Study Consistency</span>
                    <span className="text-gray-900 font-bold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full" style={{width: '92%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Knowledge Retention</span>
                    <span className="text-gray-900 font-bold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full" style={{width: '85%'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12 border border-green-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Start Tracking Your Progress Today</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are achieving their learning goals faster with intelligent progress tracking.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 font-medium shadow-lg"
                onClick={() => router.push("/register")}
              >
                Start Free Trial
              </Button>
              <Button
                className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900 transition-all duration-300 font-medium"
                onClick={() => router.push("/demo")}
              >
                View Dashboard Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
