"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Calendar, Clock, User, Search, TrendingUp } from "lucide-react";

export default function BlogPage() {
  const router = useRouter();

  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Education: Trends to Watch in 2024",
      excerpt: "Explore how artificial intelligence is reshaping the educational landscape and what it means for students and educators worldwide.",
      author: "Dr. Sarah Chen",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "AI Trends",
      image: "https://images.unsplash.com/photo-1677442135722-5f7a9c6d5f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "10 Study Techniques Backed by Cognitive Science",
      excerpt: "Discover evidence-based learning strategies that can help you retain information better and study more efficiently.",
      author: "Prof. Michael Rodriguez",
      date: "March 12, 2024",
      readTime: "8 min read",
      category: "Study Tips",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "How Personalized Learning is Transforming Student Success",
      excerpt: "Learn about the power of adaptive learning systems and how they're helping students achieve their full potential.",
      author: "Emily Watson",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Personalized Learning",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "The Role of AI in Modern Curriculum Development",
      excerpt: "Understanding how artificial intelligence is helping educators create more effective and engaging curricula.",
      author: "Dr. James Miller",
      date: "March 8, 2024",
      readTime: "7 min read",
      category: "Curriculum",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Building Better Study Habits: A Scientific Approach",
      excerpt: "Evidence-based strategies for developing effective study habits that last a lifetime and improve academic performance.",
      author: "Lisa Anderson",
      date: "March 5, 2024",
      readTime: "9 min read",
      category: "Study Habits",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Gamification in Education: Making Learning Fun",
      excerpt: "How game mechanics and rewards systems are revolutionizing student engagement and motivation in the classroom.",
      author: "Tom Harris",
      date: "March 3, 2024",
      readTime: "6 min read",
      category: "Gamification",
      image: "https://images.unsplash.com/photo-1609074869943-9e642ffae2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categories = ["All", "AI Trends", "Study Tips", "Personalized Learning", "Curriculum", "Study Habits", "Gamification"];

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 text-sm font-medium mb-6">
              <TrendingUp size={16} />
              <span>Blog & Resources</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Insights & Innovations in Learning
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Stay updated with the latest trends in AI-powered education, study techniques, and educational technology from our expert contributors.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/95 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:scale-105 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => router.push(`/blog/${post.id}`)}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{post.author}</span>
                    </div>
                    
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                      Read More
                      <ArrowLeft size={14} className="ml-1 rotate-180" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100 text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated with Latest Insights</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get weekly updates on AI in education, study tips, and exclusive content delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 font-medium shadow-lg">
                Subscribe
              </Button>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Topics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI in Education</h3>
                <ul className="space-y-3">
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Machine Learning Basics</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Natural Language Processing</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Computer Vision in Learning</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Ethical AI in Education</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Study Techniques</h3>
                <ul className="space-y-3">
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Active Recall Methods</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Spaced Repetition Systems</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Mind Mapping Techniques</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Feynman Technique</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Educational Technology</h3>
                <ul className="space-y-3">
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Virtual Reality Learning</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Gamification Strategies</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Mobile Learning Apps</li>
                  <li className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Learning Analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
