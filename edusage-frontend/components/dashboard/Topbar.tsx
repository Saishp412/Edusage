"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, Bell, Search, Home, Brain, Activity, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import API from "@/services/api";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();

  // theme toggle - safe to access document in useEffect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // load user info for avatar/dropdown
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/user/me");
        setUserName(res.data?.name);
        setUserEmail(res.data?.email);
      } catch {
        // non-blocking UI enhancement
      }
    };

    loadUser();
  }, []);

  return (
    <>
      {/* Mobile sidebar */}
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Floating Glassmorphism Topbar - Not attached to borders */}
      <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-30">
        <div 
          className="h-16 transition-all duration-500"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            boxShadow: '0 4px 20px rgba(31, 38, 135, 0.05)',
            borderRadius: '24px'
          }}
        >
          <div className="flex h-full items-center gap-6 px-6">
            {/* Left Section - Navigation & Search */}
            <div className="flex items-center gap-6 flex-1">
              {/* Quick Navigation */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-transparent hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/20"
                  onClick={() => router.push("/dashboard")}
                >
                  <Home size={18} className="text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-transparent hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/20"
                  onClick={() => router.push("/notebooks")}
                >
                  <Brain size={18} className="text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-transparent hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/20"
                  onClick={() => router.push("/analytics")}
                >
                  <Activity size={18} className="text-gray-600" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <Search size={18} className="absolute left-4 top-1/2 text-gray-400" />
                <Input
                  placeholder="Search notebooks, documents, settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl transition-all duration-300 flex-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-6">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-xl bg-transparent hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/20"
                >
                  <Bell size={18} className="text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl bg-transparent hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/20"
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun size={18} className="text-gray-600" /> : <Moon size={18} className="text-gray-600" />}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-transparent hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/20">
                    <span suppressHydrationWarning>
                      {(userName || userEmail || "U").slice(0, 2).toUpperCase()}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center text-white">
                          <User size={20} />
                        </div>
                        <div>
                          <span className="text-sm font-medium" suppressHydrationWarning>{userName || "User"}</span>
                          {userEmail && (
                            <span className="text-xs text-gray-500" suppressHydrationWarning>{userEmail}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <div className="flex items-center gap-3">
                      <Settings size={16} className="text-gray-600" />
                      <span>Profile Settings</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/help")}>
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-gray-600" />
                      <span>Help & Support</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      // Safe to access localStorage in event handlers
                      localStorage.removeItem("token");
                      router.push("/login");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Menu size={16} className="text-red-500" />
                      <span className="text-red-500">Logout</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}