"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Users, BookOpen, Target, Award, Clock, Globe2 } from "lucide-react";

export default function StudentsPage() {
  const router = useRouter();

  const benefits = [
    {
      icon: Brain,
      title: "Personalized Learning",
      description: "AI adapts to your learning style and pace, creating a unique educational journey just for you.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Target,
      title: "Goal Achievement",
      description: "Set and track your learning objectives with smart milestones that keep you motivated and on track.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Award,
      title: "Skill Recognition",
      description: "Earn certificates and badges that validate your skills and enhance your academic profile.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Study anytime, anywhere with 24/7 AI assistance that fits around your busy student life.",
      color: "from-orange-400 to-orange-600"
    }
  ];

  const features = [
    "Adaptive learning paths based on your strengths",
    "Real-time feedback on assignments and quizzes",
    "Personalized study schedules and reminders",
    "Access to vast knowledge base and resources",
    "Collaborative learning with study groups",
    "Exam preparation with AI-powered practice tests"
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
              <Users size={16} />
              <span>For Students</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Excel in Your Academic Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Transform your learning experience with AI-powered personalized education that adapts to your unique needs, helping you achieve academic excellence while enjoying the process.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <benefit.icon size={32} className="text-gray-700 group-hover:text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Everything You Need to Succeed</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Learning Features</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Success Stories</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                        <p className="text-sm text-gray-600">Computer Science Student</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "EduSage helped me improve my grades from C to A in just one semester. The personalized learning approach made all the difference!"
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Michael Rodriguez</h4>
                        <p className="text-sm text-gray-600">Medical Student</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "The AI tutor is available 24/7, which is perfect for my crazy schedule. I can study whenever I have free time and get instant help."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Areas */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Excel in Every Subject</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Mathematics", "Science", "Programming", "Languages",
                "History", "Literature", "Business", "Arts"
              ].map((subject, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <BookOpen className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{subject}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">40K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">3.5x</div>
              <div className="text-gray-600">Faster Learning</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">89%</div>
              <div className="text-gray-600">Grade Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">150+</div>
              <div className="text-gray-600">Subjects Covered</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Education?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already achieving academic excellence with AI-powered learning.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 font-medium shadow-lg"
                onClick={() => router.push("/register")}
              >
                Start Learning Free
              </Button>
              <Button
                className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900 transition-all duration-300 font-medium"
                onClick={() => router.push("/demo")}
              >
                See Student Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
