"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Settings, 
  Palette, 
  Monitor, 
  Shield, 
  User, 
  Bell, 
  Globe, 
  Database,
  Lock,
  Eye,
  Moon,
  Sun,
  Zap,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  Save,
  Check,
  X,
  Info,
  Star,
  Sparkles,
  Cpu,
  Fingerprint,
  Key,
  Smartphone,
  Laptop,
  Globe2,
  Wifi,
  Battery,
  Volume2,
  MonitorSpeaker,
  Keyboard,
  Mouse
} from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("english");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const settingsCategories = [
    {
      title: "Appearance",
      icon: <Palette size={20} />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
      items: [
        {
          label: "Theme",
          description: "Choose between light and dark themes",
          control: (
            <div className="flex items-center gap-2">
              <Button
                variant={darkMode ? "outline" : "default"}
                size="sm"
                onClick={() => setDarkMode(false)}
                className="h-8 w-8 p-0"
              >
                <Sun size={16} />
              </Button>
              <Button
                variant={darkMode ? "default" : "outline"}
                size="sm"
                onClick={() => setDarkMode(true)}
                className="h-8 w-8 p-0"
              >
                <Moon size={16} />
              </Button>
            </div>
          )
        },
        {
          label: "Color Palette",
          description: "Calm teal theme for consistency",
          control: <span className="text-sm text-gray-500">Fixed</span>
        },
        {
          label: "Font Size",
          description: "Adjust text size for better readability",
          control: (
            <select defaultValue="Medium" className="px-3 py-1 rounded-lg border border-gray-300 text-sm">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          )
        },
        {
          label: "Compact Mode",
          description: "Reduce spacing for more content",
          control: (
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className="h-4 w-4 rounded-full bg-gray-400 transition-transform translate-x-1" />
            </Button>
          )
        }
      ]
    },
    {
      title: "Workspace",
      icon: <Monitor size={20} />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      items: [
        {
          label: "Auto-save",
          description: "Automatically save your work",
          control: (
            <Button
              variant={autoSave ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoSave(!autoSave)}
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${autoSave ? "translate-x-5" : "translate-x-1"}`} />
            </Button>
          )
        },
        {
          label: "Default Notebook",
          description: "Choose notebook to open by default",
          control: <span className="text-sm text-gray-500">Coming soon</span>
        },
        {
          label: "File Upload Quality",
          description: "Set quality for uploaded documents",
          control: (
            <select defaultValue="Medium" className="px-3 py-1 rounded-lg border border-gray-300 text-sm">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          )
        },
        {
          label: "Workspace Layout",
          description: "Choose your preferred layout style",
          control: (
            <select defaultValue="Grid" className="px-3 py-1 rounded-lg border border-gray-300 text-sm">
              <option>Grid</option>
              <option>List</option>
              <option>Cards</option>
            </select>
          )
        }
      ]
    },
    {
      title: "Notifications",
      icon: <Bell size={20} />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 border-green-200",
      items: [
        {
          label: "Push Notifications",
          description: "Receive updates about your notebooks",
          control: (
            <Button
              variant={notifications ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(!notifications)}
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-1"}`} />
            </Button>
          )
        },
        {
          label: "Email Updates",
          description: "Weekly learning summaries",
          control: <span className="text-sm text-gray-500">Coming soon</span>
        },
        {
          label: "Study Reminders",
          description: "Get reminded to study regularly",
          control: (
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className="h-4 w-4 rounded-full bg-gray-400 transition-transform translate-x-5" />
            </Button>
          )
        },
        {
          label: "Achievement Alerts",
          description: "Celebrate your learning milestones",
          control: (
            <Button
              variant="default"
              size="sm"
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5" />
            </Button>
          )
        }
      ]
    },
    {
      title: "Account & Security",
      icon: <Shield size={20} />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 border-red-200",
      items: [
        {
          label: "Password",
          description: "Change your password",
          control: <Button variant="outline" size="sm">Change</Button>
        },
        {
          label: "Two-Factor Auth",
          description: "Add an extra layer of security",
          control: <span className="text-sm text-gray-500">Coming soon</span>
        },
        {
          label: "Session Timeout",
          description: "Auto-logout after inactivity",
          control: (
            <select defaultValue="1 hour" className="px-3 py-1 rounded-lg border border-gray-300 text-sm">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>Never</option>
            </select>
          )
        },
        {
          label: "Login History",
          description: "View recent login activity",
          control: <Button variant="outline" size="sm">View</Button>
        }
      ]
    },
    {
      title: "AI & Learning",
      icon: <Zap size={20} />,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50 border-indigo-200",
      items: [
        {
          label: "AI Response Length",
          description: "Control how detailed AI responses are",
          control: (
            <select defaultValue="Balanced" className="px-3 py-1 rounded-lg border border-gray-300 text-sm">
              <option>Concise</option>
              <option>Balanced</option>
              <option>Detailed</option>
            </select>
          )
        },
        {
          label: "Smart Suggestions",
          description: "Get AI-powered study suggestions",
          control: (
            <Button
              variant="default"
              size="sm"
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5" />
            </Button>
          )
        },
        {
          label: "Learning Analytics",
          description: "Track your learning progress",
          control: (
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className="h-4 w-4 rounded-full bg-gray-400 transition-transform translate-x-1" />
            </Button>
          )
        },
        {
          label: "AI Model",
          description: "Choose AI model for responses",
          control: (
            <select defaultValue="Fast" className="px-3 py-1 rounded-lg border border-gray-300 text-sm">
              <option>Fast</option>
              <option>Balanced</option>
              <option>Advanced</option>
            </select>
          )
        }
      ]
    },
    {
      title: "Privacy & Data",
      icon: <Eye size={20} />,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50 border-gray-200",
      items: [
        {
          label: "Data Collection",
          description: "Help us improve EduSage with usage data",
          control: (
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-11 p-0 rounded-full"
            >
              <div className="h-4 w-4 rounded-full bg-gray-400 transition-transform translate-x-5" />
            </Button>
          )
        },
        {
          label: "Cookie Preferences",
          description: "Manage your cookie settings",
          control: <Button variant="outline" size="sm">Manage</Button>
        },
        {
          label: "Export Data",
          description: "Download all your data",
          control: <Button variant="outline" size="sm">Export</Button>
        },
        {
          label: "Delete Account",
          description: "Permanently delete your account",
          control: <Button variant="outline" size="sm" className="text-red-600 border-red-200">Delete</Button>
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-white to-[#f0f7f7]">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#4f8a8b]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#9cc7c7]/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        {/* Professional Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4f8a8b]/10 border border-[#4f8a8b]/20 mb-6">
            <div className="h-2 w-2 rounded-full bg-[#4f8a8b] animate-pulse" />
            <span className="text-sm font-medium text-[#2f5f60]">Settings</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Application <span className="text-[#4f8a8b]">Settings</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Customize your EduSage experience to match your preferences. Configure themes, 
            notifications, and workspace settings for optimal learning.
          </p>
        </div>

        {/* Settings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl font-bold text-purple-700 mb-2">{settingsCategories.length}</div>
            <div className="text-sm text-purple-600 font-medium">Categories</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {settingsCategories.reduce((sum, cat) => sum + cat.items.length, 0)}
            </div>
            <div className="text-sm text-blue-600 font-medium">Total Settings</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl font-bold text-emerald-700 mb-2">6</div>
            <div className="text-sm text-emerald-600 font-medium">Feature Areas</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Settings Overview Section */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-xl">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/3 via-transparent to-[#9cc7c7]/3 opacity-60" />
            
            {/* Content */}
            <div className="relative z-10 p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left side - Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4f8a8b] to-[#3e6f70] flex items-center justify-center text-white shadow-lg">
                      <Settings size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Personalize Your Experience</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Tailor EduSage to your learning style with customizable themes, notification preferences, 
                    and workspace configurations. Create the perfect environment for focused study.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      Theme Options
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Smart Controls
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Privacy First
                    </div>
                  </div>
                </div>
                
                {/* Right side - Preview */}
                <div className="flex-1 w-full max-w-md">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#4f8a8b]/10 to-[#4f8a8b]/5 flex items-center justify-center mx-auto mb-4">
                        <Zap size={32} className="text-[#2f5f60]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Setup</h3>
                      <p className="text-gray-600 mb-4">
                        Most settings are configured with sensible defaults. 
                        Customize as needed for your perfect workflow.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4f8a8b]/10 border border-[#4f8a8b]/20">
                        <span className="text-sm font-medium text-[#2f5f60]">
                          Ready to Use →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {/* Search and Tabs */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-[#4f8a8b]/60 focus:ring-2 focus:ring-[#4f8a8b]/20 transition-all duration-200 text-lg"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { key: "all", label: "All Settings", icon: <Sliders size={16} />, color: "from-purple-500 to-pink-500", bg: "bg-purple-50 border-purple-300", text: "text-purple-700" },
                { key: "appearance", label: "Appearance", icon: <Palette size={16} />, color: "from-purple-500 to-pink-500", bg: "bg-purple-50 border-purple-300", text: "text-purple-700" },
                { key: "workspace", label: "Workspace", icon: <Monitor size={16} />, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 border-blue-300", text: "text-blue-700" },
                { key: "notifications", label: "Notifications", icon: <Bell size={16} />, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 border-emerald-300", text: "text-emerald-700" },
                { key: "security", label: "Security", icon: <Shield size={16} />, color: "from-red-500 to-orange-500", bg: "bg-red-50 border-red-300", text: "text-red-700" },
                { key: "ai", label: "AI & Learning", icon: <Zap size={16} />, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50 border-indigo-300", text: "text-indigo-700" },
                { key: "privacy", label: "Privacy", icon: <Eye size={16} />, color: "from-amber-500 to-yellow-500", bg: "bg-amber-50 border-amber-300", text: "text-amber-700" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 ${
                    activeTab === tab.key
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : `bg-white/80 backdrop-blur-sm border-gray-200/60 text-gray-600 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5`
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                  <Star size={16} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    {settingsCategories.length} categories
                  </span>
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
                  <Sparkles size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {settingsCategories.reduce((sum, cat) => sum + cat.items.length, 0)} settings
                  </span>
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    All optimized
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-xl bg-white/80 backdrop-blur-sm hover:bg-gray-50 border-gray-200/60">
                  <RefreshCw size={16} />
                  Reset All
                </Button>
                <Button className="rounded-xl bg-gradient-to-r from-[#4f8a8b] to-[#3e6f70] hover:from-[#3e6f70] hover:to-[#2f5f60] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                  <Save size={16} />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {settingsCategories.map((category, index) => (
              <div
                key={category.title}
                className="animate-scale-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Status indicator */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className={`flex items-center gap-3 p-6 border-b border-gray-200/40 ${category.bgColor}`}>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                        <p className="text-sm text-gray-600">{category.items.length} settings</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-[#4f8a8b] transition-colors duration-300" />
                    </div>
                    
                    {/* Settings Items */}
                    <div className="p-6 space-y-4">
                      {category.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/50 transition-colors duration-200">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                              {item.label}
                              {item.control && typeof item.control === 'object' && item.control.props?.variant === 'default' && (
                                <div className="h-2 w-2 rounded-full bg-green-400" />
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          </div>
                          <div className="ml-4">
                            {item.control}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4f8a8b]/0 via-[#4f8a8b]/60 to-[#4f8a8b]/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Panel */}
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up" style={{ animationDelay: "1.2s" }}>
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/60 p-6 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Cpu size={24} />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Quick Actions</p>
                <p className="text-sm text-gray-600">Advanced settings & tools</p>
              </div>
              <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-red-500 transition-all duration-300">
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Additional Settings */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Preferences */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-indigo-50/50 border border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Smartphone size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">Device Preferences</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white">
                        <Laptop size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Desktop Layout</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 w-11 p-0 rounded-full">
                      <div className="h-4 w-4 rounded-full bg-purple-500 transition-transform translate-x-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center text-white">
                        <Smartphone size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Mobile Mode</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 w-11 p-0 rounded-full">
                      <div className="h-4 w-4 rounded-full bg-gray-400 transition-transform translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Settings */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/50 via-green-50/50 to-cyan-50/50 border border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Battery size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900">Performance</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white">
                        <Wifi size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Auto-sync</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 w-11 p-0 rounded-full">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 transition-transform translate-x-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white">
                        <Volume2 size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Sound Effects</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 w-11 p-0 rounded-full">
                      <div className="h-4 w-4 rounded-full bg-gray-400 transition-transform translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/50 via-yellow-50/50 to-orange-50/50 border border-amber-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900">Accessibility</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white">
                        <MonitorSpeaker size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">High Contrast</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 w-11 p-0 rounded-full">
                      <div className="h-4 w-4 rounded-full bg-amber-500 transition-transform translate-x-1" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white">
                        <Keyboard size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Keyboard Shortcuts</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 w-11 p-0 rounded-full">
                      <div className="h-4 w-4 rounded-full bg-amber-500 transition-transform translate-x-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: "0.9s" }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/60 shadow-lg">
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reset Settings</h3>
                    <p className="text-sm text-gray-600">Restore all settings to default values</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                  Reset All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Export/Import Section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: "1.0s" }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 shadow-lg">
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Settings Management</h3>
                    <p className="text-sm text-gray-600">Export or import your settings configuration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-xl">
                    Export
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    Import
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}