import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  className?: string;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  className,
  loading = false,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4f8a8b]/40 hover:shadow-lg hover:shadow-[#4f8a8b]/10 animate-scale-in",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f8a8b]/8 to-[#4f8a8b]/4 text-[#2f5f60] transition-all duration-300 group-hover:from-[#4f8a8b]/12 group-hover:to-[#4f8a8b]/6 group-hover:scale-105">
            {loading ? (
              <div className="animate-spin">
                <div className="h-4 w-4 border-2 border-[#2f5f60] border-t-transparent rounded-full"></div>
              </div>
            ) : (
              icon
            )}
          </div>
        </div>

        <p className="mt-4 text-2xl font-semibold text-foreground tracking-tight">
          {loading ? "..." : value}
        </p>
      </div>
      
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4f8a8b]/0 via-[#4f8a8b]/20 to-[#4f8a8b]/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}
