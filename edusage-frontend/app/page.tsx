"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  Zap, 
  Users, 
  FileText, 
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Bot,
  Target,
  Lightbulb,
  Award,
  BarChart3,
  Cpu,
  Shield,
  Rocket,
  Globe2,
  Layers3,
  Menu,
  X,
  ChevronDown,
  Play,
  Pause
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set()); // Start empty for animation
  const heroRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setIsScrolled(scrollPosition > 50);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Simple and reliable scroll animation
  useEffect(() => {
    const checkCardsVisibility = () => {
      const triggerPoint = window.innerHeight * 0.8; // 80% of viewport
      
      cardsRef.current.forEach((card, index) => {
        if (card && !visibleCards.has(index)) {
          const rect = card.getBoundingClientRect();
          if (rect.top < triggerPoint) {
            // Add staggered delay
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, index]));
            }, index * 150);
          }
        }
      });
    };

    // Check on scroll
    const handleScroll = () => {
      checkCardsVisibility();
    };

    // Initial check after component mounts
    setTimeout(checkCardsVisibility, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fallback: Show all cards after 3 seconds
    const fallback = setTimeout(() => {
      setVisibleCards(new Set([0, 1, 2, 3, 4, 5]));
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(fallback);
    };
  }, [visibleCards]);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Animated Background with notebook grid pattern */}
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
          backgroundPosition: '0 0, 0 0, 0 0, 0 0',
          transform: `translateY(${scrollY * 0.05}px)`
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
          transform: `translateY(${scrollY * 0.03}px)`
        }} />
        
        {/* Subtle notebook margin line */}
        <div className="absolute left-20 top-0 bottom-0 w-px bg-red-400 opacity-[0.06]" style={{
          transform: `translateX(${scrollY * 0.02}px)`
        }} />
        
        {/* Additional diagonal grid for more texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px',
          backgroundPosition: '0 0, 0 0',
          transform: `translateY(${scrollY * 0.02}px)`
        }} />
        
        {/* Mouse-following gradient orb */}
        <div 
          className="pointer-events-none fixed w-96 h-96 rounded-full opacity-20 transition-all duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            filter: 'blur(40px)'
          }}
        />
        
        {/* Floating notebook elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-300 opacity-[0.08] rounded-lg transform rotate-12 animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-300 opacity-[0.08] rounded-lg transform -rotate-6 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-16 w-28 h-28 border border-blue-300 opacity-[0.08] rounded-lg transform rotate-3 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-16 w-20 h-20 border border-purple-300 opacity-[0.08] rounded-lg transform -rotate-12 animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Additional floating squares for more visual interest */}
        <div className="absolute top-60 right-40 w-16 h-16 border border-blue-200 opacity-[0.06] rounded transform rotate-45 animate-float" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-60 left-32 w-20 h-20 border border-purple-200 opacity-[0.06] rounded-lg transform -rotate-8 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Enhanced Navigation - Better Mistakes Style */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-12 w-12 rounded-lg bg-black flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                  <Brain size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-gray-900">EduSage</span>
                <div className="text-xs text-gray-500 font-medium">AI Learning Platform</div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-full p-1">
              {/* Features Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                  onMouseEnter={() => setActiveDropdown('features')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>Features</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'features' && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-gray-100 rounded-full p-1 shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-down"
                    onMouseEnter={() => setActiveDropdown('features')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push('/features/ai-learning')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      >
                        <div className="font-medium">AI Learning</div>
                      </button>
                      <button 
                        onClick={() => router.push('/features/progress-tracking')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      >
                        <div className="font-medium">Progress</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>Solutions</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'solutions' && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-gray-100 rounded-full p-1 shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-down"
                    onMouseEnter={() => setActiveDropdown('solutions')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push('/solutions/students')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      >
                        <div className="font-medium">Students</div>
                      </button>
                      <button 
                        onClick={() => router.push('/solutions/educators')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      >
                        <div className="font-medium">Educators</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Button */}
              <button 
                onClick={() => router.push('/pricing')}
                className="px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
              >
                Pricing
              </button>

              {/* Resources Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                  onMouseEnter={() => setActiveDropdown('resources')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>Resources</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'resources' && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-gray-100 rounded-full p-1 shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-down"
                    onMouseEnter={() => setActiveDropdown('resources')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push('/blog')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      >
                        <div className="font-medium">Blog</div>
                      </button>
                      <button 
                        onClick={() => router.push('/help')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      >
                        <div className="font-medium">Help</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* About Button */}
              <button 
                onClick={() => router.push('/about')}
                className="px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
              >
                About
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="hidden lg:flex px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 hover:scale-105 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
              <Button
                className="relative group overflow-hidden rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-500 hover:scale-105 px-5 py-2.5 text-sm font-medium"
                onClick={() => router.push("/register")}
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                className="lg:hidden rounded-lg hover:bg-gray-100 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="relative w-6 h-5">
                  <span className={`absolute h-0.5 w-6 bg-black transition-all duration-300 ${mobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}`} />
                  <span className={`absolute h-0.5 w-6 bg-black transition-all duration-300 top-2 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`absolute h-0.5 w-6 bg-black transition-all duration-300 ${mobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`} />
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 animate-slide-down">
            <div className="container mx-auto px-8 py-6 flex flex-col gap-6">
              <a href="#features" className="group flex items-center justify-between text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300">
                <span>Features</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="#how-it-works" className="group flex items-center justify-between text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300">
                <span>How it Works</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="#testimonials" className="group flex items-center justify-between text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300">
                <span>Testimonials</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="#pricing" className="group flex items-center justify-between text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300">
                <span>Pricing</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full rounded-full justify-center hover:bg-gray-100 transition-all duration-300 text-sm font-medium"
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 mt-3 text-sm font-medium"
                  onClick={() => {
                    router.push("/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-12">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-sm font-medium animate-float">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">AI-Powered Learning Platform</span>
            </div>
            
            {/* Enhanced Main Heading */}
            <div className="relative">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                <span className="block mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Learn
                </span>
                <span className="block mb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-shift">
                    Smarter,
                  </span>
                </span>
                <span className="block animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  Not Harder
                </span>
              </h1>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-8 w-16 h-16 rounded-full bg-blue-100 opacity-50 animate-bounce-slow" />
              <div className="absolute -bottom-4 -right-8 w-12 h-12 rounded-full bg-purple-100 opacity-50 animate-bounce-slow" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Transform your learning experience with AI that understands your needs, 
              adapts to your style, and helps you master any subject faster than ever before.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-black text-white hover:bg-gray-900 transition-all duration-500 hover:scale-105 px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-black/25"
                onClick={() => router.push("/register")}
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group relative overflow-hidden rounded-full border-2 border-gray-300 hover:border-gray-400 transition-all duration-500 hover:scale-105 px-10 py-4 text-lg font-semibold bg-white hover:bg-gray-50"
                onClick={() => router.push("/demo")}
              >
                <span className="flex items-center">
                  <div className="relative mr-3">
                    <Play size={20} className="group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gray-200 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-30" />
                  </div>
                  Watch Demo
                </span>
              </Button>
            </div>
            
            {/* Enhanced Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className="fill-yellow-400 text-yellow-400 animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <span className="text-sm text-gray-600">
                  Join <strong className="text-gray-900">10,000+</strong> students already learning smarter
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white animate-bounce-slow"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Active now</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <ChevronDown size={24} className="text-gray-400" />
              <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Powerful features designed to accelerate your learning journey and help you achieve your goals faster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              ref={(el) => (cardsRef.current[0] = el)}
              data-index="0"
              className={`group relative transition-all duration-700 ${
                visibleCards.has(0) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Brain size={32} className="text-blue-600 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">AI-Powered Learning</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get personalized AI recommendations and insights based on your learning patterns and progress.
                </p>
                <div className="flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
            
            <div 
              ref={(el) => (cardsRef.current[1] = el)}
              data-index="1"
              className={`group relative transition-all duration-700 ${
                visibleCards.has(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <MessageCircle size={32} className="text-purple-600 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-purple-600 transition-colors duration-300">Interactive Study Sessions</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Engage in dynamic AI-powered conversations that adapt to your learning style and provide detailed explanations.
                </p>
                <div className="flex items-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
            
            <div 
              ref={(el) => (cardsRef.current[2] = el)}
              data-index="2"
              className={`group relative transition-all duration-700 ${
                visibleCards.has(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Target size={32} className="text-green-600 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-green-600 transition-colors duration-300">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Monitor your learning journey with detailed analytics, milestones, and personalized achievement badges.
                </p>
                <div className="flex items-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
            
            <div 
              ref={(el) => (cardsRef.current[3] = el)}
              data-index="3"
              className={`group relative transition-all duration-700 ${
                visibleCards.has(3) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Zap size={32} className="text-orange-600 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-orange-600 transition-colors duration-300">24/7 AI Assistance</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get instant answers to your questions with detailed explanations, examples, and personalized learning resources.
                </p>
                <div className="flex items-center text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
            
            <div 
              ref={(el) => (cardsRef.current[4] = el)}
              data-index="4"
              className={`group relative transition-all duration-700 ${
                visibleCards.has(4) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Layers3 size={32} className="text-pink-600 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-pink-600 transition-colors duration-300">Smart Note Organization</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Automatically organize your study materials and notes with AI-powered categorization and easy retrieval.
                </p>
                <div className="flex items-center text-pink-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
            
            <div 
              ref={(el) => (cardsRef.current[5] = el)}
              data-index="5"
              className={`group relative transition-all duration-700 ${
                visibleCards.has(5) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Award size={32} className="text-indigo-600 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-600 transition-colors duration-300">Learning Achievements</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Earn badges and certificates as you master new topics and reach important learning milestones.
                </p>
                <div className="flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section id="how-it-works" className="relative z-10 py-32 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
              <Zap size={16} />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Get started in minutes and transform your learning experience with our simple 3-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl" />
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  1
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">Upload Your Materials</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Import your notes, documents, and study materials in any format. Our AI handles the rest.
              </p>
            </div>
            
            <div className="group text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl" />
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  2
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors duration-300">AI Processes Everything</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our AI analyzes and understands your content to create a personalized learning experience.
              </p>
            </div>
            
            <div className="group text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl" />
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  3
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-green-600 transition-colors duration-300">Start Learning Smarter</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chat with your AI tutor, get instant answers, and track your progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Trusted by learners worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join thousands of students who are already transforming their learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  10K+
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
              </div>
              <div className="text-lg text-gray-600 font-medium">Active Students</div>
              <div className="mt-3 flex justify-center">
                <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  1M+
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
              </div>
              <div className="text-lg text-gray-600 font-medium">Questions Answered</div>
              <div className="mt-3 flex justify-center">
                <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  95%
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
              </div>
              <div className="text-lg text-gray-600 font-medium">Success Rate</div>
              <div className="mt-3 flex justify-center">
                <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
              <Rocket size={16} />
              <span>Ready to get started?</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to transform your learning?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who are already learning smarter with EduSage. Start your free trial today and experience the future of education.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="group relative overflow-hidden rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-500 hover:scale-105 px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/25"
              onClick={() => router.push("/register")}
            >
              <span className="relative z-10 flex items-center">
                Start Free Trial
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden rounded-full border-2 border-white/70 hover:border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-white/30"
              onClick={() => router.push("/demo")}
            >
              <span className="flex items-center">
                <Play size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                Schedule Demo
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center text-white">
                  <Brain size={24} />
                </div>
                <div>
                  <span className="text-2xl font-bold">EduSage</span>
                  <div className="text-sm text-gray-500">AI Learning Platform</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md">
                Transform your learning experience with AI-powered insights and personalized education paths.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-gray-600 hover:text-black transition-colors duration-300">Features</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-black transition-colors duration-300">Pricing</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-black transition-colors duration-300">API</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-gray-600 hover:text-black transition-colors duration-300">About</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-black transition-colors duration-300">Blog</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-black transition-colors duration-300">Contact</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2024 EduSage. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-black transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-black transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
          }
          25% { 
            transform: translateY(-10px) translateX(5px); 
          }
          50% { 
            transform: translateY(0px) translateX(-5px); 
          }
          75% { 
            transform: translateY(10px) translateX(5px); 
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-20px); 
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background-size: 200% 200%; 
            background-position: 0% 50%; 
          }
          50% { 
            background-size: 200% 200%; 
            background-position: 100% 50%; 
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
