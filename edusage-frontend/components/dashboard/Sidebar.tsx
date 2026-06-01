"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  BookOpen,
  Plus,
  FileText,
  Clock,
  Star,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Brain,
  ChevronDown,
  Activity,
  Layers,
  Target,
  Award,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Core",
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
      { label: "Notebooks", href: "/notebooks", icon: BookOpen },
      { label: "Documents", href: "/documents", icon: FileText },
    ],
  },
  {
    title: "Productivity",
    items: [
      { label: "Recent Activity", href: "/activity", icon: Clock },
      { label: "Pinned", href: "/pinned", icon: Star },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help", href: "/help", icon: HelpCircle },
    ],
  },
];

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    // Only access localStorage on client side - this is safe in event handlers
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex fixed left-8 top-24 bottom-8 z-20">
      {/* Enhanced Navigation - Navbar Style but Vertical */}
      <div 
        className={cn(
          "h-full transition-all duration-500 overflow-hidden flex flex-col",
          isCollapsed ? "w-20 py-4" : "w-72 py-6"
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        style={{
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.01)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)'
        }}
      >
        {/* Brand - Exact Navbar Style */}
        <div className="px-6 mb-8">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative h-12 w-12 rounded-lg bg-black flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                <Brain size={24} className="group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
          </div>
          {!isCollapsed && (
            <div className="text-center mt-4">
              <span className="text-2xl font-bold tracking-tight text-gray-900">EduSage</span>
              <div className="text-xs text-gray-500 font-medium">AI Dashboard</div>
            </div>
          )}
        </div>
        
        {/* Navigation Container - Exact Navbar Style Vertical */}
        {!isCollapsed && (
          <div className="px-6 mb-8">
            <div className="flex flex-col items-center gap-2 bg-gray-100 rounded-full p-1">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-white transition-all duration-300 text-sm font-medium text-gray-900 border border-transparent">
                <Activity size={14} />
                <span>Menu</span>
              </button>
            </div>
          </div>
        )}

        <div className={cn("px-6 space-y-3 flex-1 overflow-y-auto scrollbar-hide", isCollapsed && "px-4")}>
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className={cn("mb-8", isCollapsed && "mb-6")}>
              {!isCollapsed && (
                <div className="mb-4 px-4 py-2 bg-gray-100 rounded-2xl border border-gray-200/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500/70 text-center">
                    {section.title}
                  </p>
                </div>
              )}

              <div className={cn("flex flex-col gap-2", !isCollapsed && "bg-gray-100 rounded-2xl p-2 border border-gray-200/50")}>
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  const hasDropdown = sectionIndex === 0 && itemIndex === 1; // Notebooks with dropdown

                  return (
                    <div key={item.label} className="relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200",
                          active && "bg-white text-gray-900 border border-gray-200 shadow-sm",
                          isCollapsed ? "justify-center" : "justify-center"
                        )}
                        onMouseEnter={hasDropdown ? () => setActiveDropdown(item.label) : undefined}
                        onMouseLeave={hasDropdown ? () => setActiveDropdown(null) : undefined}
                      >
                        <div className={cn(
                          "relative flex items-center justify-center transition-all duration-300",
                          isCollapsed ? "w-8 h-8" : "w-6 h-6"
                        )}>
                          <Icon 
                            size={isCollapsed ? 20 : 18}
                            className={cn(
                              "transition-all duration-300",
                              active ? "text-blue-600" : "text-gray-600"
                            )} 
                          />
                        </div>
                        
                        {!isCollapsed && (
                          <>
                            <span className="font-medium">{item.label}</span>
                            {hasDropdown && (
                              <ChevronDown 
                                size={14} 
                                className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                              />
                            )}
                          </>
                        )}
                      </Link>

                      {/* Dropdown for Notebooks - Inline dropdown that pushes content down */}
                      {hasDropdown && activeDropdown === item.label && !isCollapsed && (
                        <div 
                          className="mt-2 bg-white rounded-2xl p-2 shadow-2xl border border-gray-200/50 overflow-hidden z-40 animate-slide-down"
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                          style={{
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <Link
                              href="/notebooks/all"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-gray-50 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                              onMouseEnter={() => setActiveDropdown(item.label)}
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <BookOpen size={16} className="text-gray-600" />
                              <span className="font-medium">All Notebooks</span>
                            </Link>
                            <Link
                              href="/notebooks/recent"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-gray-50 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                              onMouseEnter={() => setActiveDropdown(item.label)}
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <Clock size={16} className="text-gray-600" />
                              <span className="font-medium">Recent</span>
                            </Link>
                            <Link
                              href="/notebooks/shared"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-gray-50 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                              onMouseEnter={() => setActiveDropdown(item.label)}
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <Star size={16} className="text-gray-600" />
                              <span className="font-medium">Shared</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button - Navbar Style */}
        <div className="px-6 py-4 border-t border-gray-200/50 flex justify-center">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200 w-full max-w-xs",
              isCollapsed ? "w-12 h-12 p-0" : "w-full"
            )}
          >
            <LogOut size={20} className="transition-colors duration-300" />
            
            {!isCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}
