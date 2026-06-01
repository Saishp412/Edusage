"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-white text-gray-900 overflow-x-hidden">
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
          backgroundSize: '40px 40px, 40px 40px, 200px 200px',
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

      {/* Soft gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-purple-400/10 blur-3xl" />

      {/* Topbar - High z-index to ensure visibility */}
      <Topbar />

      {/* Main Content Area - Below topbar with proper z-index */}
      <div className="relative z-5 flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content - Takes remaining space after sidebar */}
        <main className="flex-1 overflow-y-auto pt-24 pl-32">
          <div 
            className="mx-auto max-w-6xl flex flex-col gap-6 transition-all duration-300 w-full"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}