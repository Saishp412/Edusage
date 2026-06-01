"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Users, BookOpen, Target, Award, Clock, Globe2, BarChart3, FileText } from "lucide-react";

export default function EducatorsPage() {
  const router = useRouter();

  const benefits = [
    {
      icon: BarChart3,
      title: "Student Analytics",
      description: "Track individual and class performance with detailed insights and progress reports.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Target,
      title: "Curriculum Optimization",
      description: "AI-powered recommendations to improve teaching methods and curriculum effectiveness.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Users,
      title: "Personalized Support",
      description: "Identify students who need extra help and provide targeted assistance automatically.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: FileText,
      title: "Automated Assessment",
      description: "Save time with AI-powered grading and feedback generation for assignments and exams.",
      color: "from-orange-400 to-orange-600"
    }
  ];

  const features = [
    "Real-time student progress monitoring",
    "Automated assignment grading and feedback",
    "Personalized learning path recommendations",
    "Classroom engagement analytics",
    "Curriculum alignment tools",
    "Parent communication dashboard"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
              <BookOpen size={16} />
              <span>For Educators</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Transform Your Teaching Impact
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Empower your teaching with AI-driven insights that help you understand each student's needs, optimize your curriculum, and create personalized learning experiences that drive success.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <benefit.icon size={32} className="text-gray-700 group-hover:text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Comprehensive Teaching Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Educator Features</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Teacher Success Stories</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Dr. Emily Watson</h4>
                        <p className="text-sm text-gray-600">High School Mathematics</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "EduSage transformed my classroom. I can now identify struggling students early and provide targeted support that really makes a difference."
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Prof. James Miller</h4>
                        <p className="text-sm text-gray-600">University Physics</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "The automated grading tools save me 10+ hours per week, allowing me to focus more on teaching and student interaction."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classroom Dashboard Preview */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Intelligent Classroom Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Class Performance</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                <p className="text-sm text-gray-600 mb-4">Average Class Score</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '92%'}} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Students Needing Help</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                <p className="text-sm text-gray-600 mb-4">Require Immediate Attention</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-sm">Sarah K. - Mathematics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-sm">Mike R. - Physics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-sm">Lisa M. - Chemistry</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Tasks</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <p className="text-sm text-gray-600 mb-4">Assignments to Grade</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Auto-graded</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Manual review</span>
                    <span className="font-medium">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">5K+</div>
              <div className="text-gray-600">Educators Using</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">60%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">45%</div>
              <div className="text-gray-600">Better Outcomes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Teacher Satisfaction</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-12 border border-purple-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Revolutionize Your Teaching?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who are transforming their classrooms with AI-powered teaching tools.
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
                Schedule Educator Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
