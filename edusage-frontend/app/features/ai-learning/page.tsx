"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Sparkles, Target, Zap, Lightbulb, BarChart3, Cpu } from "lucide-react";

export default function AILearningPage() {
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: "Intelligent Tutoring",
      description: "Our AI tutor understands your learning style and adapts explanations to match your cognitive preferences.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Sparkles,
      title: "Smart Content Generation",
      description: "Automatically generates personalized study materials, practice questions, and summaries based on your progress.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Target,
      title: "Adaptive Learning Paths",
      description: "Dynamic curriculum that adjusts in real-time based on your performance and learning goals.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Real-time analysis of your work with detailed explanations and improvement suggestions.",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: Lightbulb,
      title: "Concept Mapping",
      description: "AI-powered visualization of connections between topics to enhance understanding and retention.",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description: "Comprehensive insights into your learning patterns, strengths, and areas for improvement.",
      color: "from-pink-400 to-pink-600"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <Cpu size={16} />
              <span>AI Learning Features</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Revolutionary AI-Powered Learning
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the future of education with our cutting-edge artificial intelligence that adapts to your unique learning style, providing personalized guidance and insights every step of the way.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <feature.icon size={32} className="text-gray-700 group-hover:text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How Our AI Learning Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Understand</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes your learning patterns, strengths, and areas for improvement to create a personalized profile.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Adapt</h3>
                <p className="text-gray-600 leading-relaxed">
                  Content and teaching methods dynamically adjust to match your optimal learning style and pace.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Optimize</h3>
                <p className="text-gray-600 leading-relaxed">
                  Continuous improvement through real-time feedback and data-driven insights to maximize your learning potential.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Transform Your Learning Experience</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Our AI-powered platform revolutionizes how you learn by providing personalized attention that adapts to your unique needs and goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">300% faster learning compared to traditional methods</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">Personalized study plans for optimal retention</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="text-gray-700">24/7 AI assistance whenever you need help</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Learning Statistics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Learning Efficiency</span>
                    <span className="text-gray-900 font-bold">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full" style={{width: '95%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Student Satisfaction</span>
                    <span className="text-gray-900 font-bold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full" style={{width: '92%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Knowledge Retention</span>
                    <span className="text-gray-900 font-bold">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full" style={{width: '88%'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience AI-Powered Learning?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their education with our intelligent learning platform.
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
                See AI in Action
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
