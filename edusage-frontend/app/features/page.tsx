"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, MessageCircle, Zap, Target, Shield } from "lucide-react";

export default function Features() {
  const router = useRouter();

  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Neural AI Engine",
      description: "Advanced neural networks process your materials with human-like understanding and context awareness.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Smart Conversations",
      description: "Natural language processing enables meaningful dialogues about your learning materials.",
      color: "from-pink-400 to-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Speed",
      description: "Instant responses and real-time processing of complex queries and document analysis.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Targeting",
      description: "Focused insights tailored to your specific learning goals and knowledge gaps.",
      color: "from-cyan-400 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
      color: "from-emerald-400 to-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-100 to-teal-50">
      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover the powerful capabilities that make EduSage the future of learning
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Advanced Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Document Processing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• PDF, Word, and text file support</li>
                <li>• Automatic topic extraction</li>
                <li>• Intelligent chunking for better context</li>
                <li>• Multi-format document management</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Smart Search</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Web search integration</li>
                <li>• Source attribution and citations</li>
                <li>• Real-time result processing</li>
                <li>• Multiple search providers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎨 Studio Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Audio overview generation</li>
                <li>• Video script creation</li>
                <li>• Mind map visualization</li>
                <li>• Quiz and flashcard creation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Analytics & Insights</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Learning progress tracking</li>
                <li>• Performance analytics</li>
                <li>• Knowledge gap identification</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-400/10 via-pink-400/5 to-blue-400/10 rounded-2xl p-8 border border-purple-400/30">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience the Future?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join thousands of learners who are already transforming their education with AI-powered learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold px-8 py-3"
                onClick={() => router.push("/register")}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-purple-400/40 hover:bg-purple-400/10 text-purple-700 font-bold px-8 py-3"
                onClick={() => router.push("/login")}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
