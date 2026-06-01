"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Settings, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter,
  Send,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap,
  Shield,
  Users,
  Brain
} from "lucide-react";

export default function HelpPage() {
  const router = useRouter();

  const supportContacts = {
    phone: "+1 (555) 123-4567",
    email: "support@edusage.com",
    instagram: "https://instagram.com/edusage",
    facebook: "https://facebook.com/edusage",
    twitter: "https://twitter.com/edusage"
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

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
          {/* Professional Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <HelpCircle size={16} />
              <span>Help Center</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Help & Support Center
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Everything you need to get the most out of EduSage. Find guides, troubleshooting tips, 
              and direct support to enhance your learning experience.
            </p>
          </div>

          {/* Help Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="text-center p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="text-center p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-2">AI</div>
              <div className="text-gray-600">Powered Help</div>
            </div>
            <div className="text-center p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-green-600 mb-2">⚡</div>
              <div className="text-gray-600">Quick Solutions</div>
            </div>
          </div>

          {/* Help Overview Section */}
          <div className="mb-20">
            <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-60" />
              
              {/* Content */}
              <div className="relative z-10 p-12">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Left side - Text */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 mb-6">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <HelpCircle size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Get Started Quickly</h2>
                    </div>
                    
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Master EduSage with our comprehensive guides and support resources. 
                      From basic setup to advanced features, we've got you covered every step of the way.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Step-by-Step Guides
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        Expert Tips
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        24/7 Support
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Quick Actions */}
                  <div className="flex-1 w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl">
                      <div className="text-center">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                          <Zap size={40} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                        <p className="text-gray-600 mb-6">
                          Our support team is ready to assist you with any questions or issues.
                        </p>
                        <Button
                          className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 font-medium shadow-lg"
                          onClick={() => router.push("/demo")}
                        >
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Guides Grid */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Help Guides</h2>
                <p className="text-xl text-gray-600 mt-2">Step-by-step instructions for common tasks</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700">
                  <BookOpen size={16} />
                  <span className="text-sm font-medium">3 guides</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Getting Started */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl hover:scale-105 transition-all duration-300 hover:-translate-y-2">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <BookOpen size={32} className="text-green-600" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                      Beginner
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Getting Started</h3>
                  
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Create a notebook for each subject or exam you are preparing for</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Upload lecture slides, PDFs, Word files, or text notes into the notebook</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ask focused questions against a notebook to get answers grounded in your material</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Good Questions */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl hover:scale-105 transition-all duration-300 hover:-translate-y-2">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Lightbulb size={32} className="text-blue-600" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                      Tips
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Good Questions to Ask</h3>
                  
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Ask definition-style questions: "Define software project management"</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Request short comparisons: "Compare waterfall and agile"</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Use your own wording from the notes to get more precise matches</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl hover:scale-105 transition-all duration-300 hover:-translate-y-2">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Settings size={32} className="text-orange-600" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                      Support
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">Troubleshooting</h3>
                  
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>If answers feel off-topic, check that the right notebook is selected</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Re-upload documents if text extraction failed or the file was incomplete</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Use Recent activity to confirm that uploads and notebook actions were saved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Contact Support</h2>
                <p className="text-xl text-gray-600 mt-2">Get in touch with our support team</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700">
                  <Users size={16} />
                  <span className="text-sm font-medium">24/7 Available</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Methods */}
              <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl">
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <MessageCircle size={24} className="text-blue-600" />
                    Get in Touch
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Phone size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Phone Support</p>
                        <p className="font-bold text-gray-900 text-lg">{supportContacts.phone}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Phone size={16} />
                      </Button>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <Mail size={24} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Email Support</p>
                        <p className="font-bold text-gray-900 text-lg">{supportContacts.email}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={24} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-blue-900 mb-2">Response Time</p>
                        <p className="text-blue-700">
                          We typically respond within 24 hours. For urgent issues, please call our support line.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl">
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Shield size={24} className="text-purple-600" />
                    Follow Us
                  </h3>
                  
                  <p className="text-xl text-gray-600 mb-8">
                    Stay updated with tips, updates, and community insights. Follow us on social media for the latest EduSage news.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Instagram */}
                    <button
                      onClick={() => handleSocialClick(supportContacts.instagram)}
                      className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Instagram size={24} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900">Instagram</p>
                        <p className="text-gray-600">@edusage</p>
                      </div>
                      <ExternalLink size={20} className="text-gray-400 group-hover:text-gray-600" />
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={() => handleSocialClick(supportContacts.facebook)}
                      className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Facebook size={24} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900">Facebook</p>
                        <p className="text-gray-600">EduSage Official</p>
                      </div>
                      <ExternalLink size={20} className="text-gray-400 group-hover:text-gray-600" />
                    </button>

                    {/* Twitter/X */}
                    <button
                      onClick={() => handleSocialClick(supportContacts.twitter)}
                      className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Twitter size={24} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900">X (Twitter)</p>
                        <p className="text-gray-600">@edusage</p>
                      </div>
                      <ExternalLink size={20} className="text-gray-400 group-hover:text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}