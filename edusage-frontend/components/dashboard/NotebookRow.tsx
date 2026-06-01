import { FileText, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotebookRowProps {
  title: string;
  documents: number;
  updatedAt: string;
  onDelete?: () => void;
}

export default function NotebookRow({
  title,
  documents,
  updatedAt,
  onDelete,
}: NotebookRowProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4f8a8b]/40 hover:shadow-lg hover:shadow-[#4f8a8b]/10">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f8a8b]/8 to-[#4f8a8b]/4 text-[#2f5f60] transition-all duration-300 group-hover:from-[#4f8a8b]/12 group-hover:to-[#4f8a8b]/6 group-hover:scale-105">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-semibold text-foreground tracking-tight text-base">
              {title}
            </p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              {documents} {documents === 1 ? 'document' : 'documents'} • Updated {updatedAt}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg transition-all duration-200 hover:bg-[#4f8a8b]/10 hover:scale-105"
              onClick={(e) => {
                // prevent row navigation when opening menu
                e.stopPropagation();
              }}
              suppressHydrationWarning
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-lg border border-border/40 shadow-lg"
            onClick={(e) => {
              // ensure clicks inside the menu don't trigger row navigation
              e.stopPropagation();
            }}
          >
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-md transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                if (!onDelete) return;
                const confirmed = window.confirm(
                  "Delete this notebook and all of its documents? This action cannot be undone."
                );
                if (confirmed) {
                  onDelete();
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete notebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4f8a8b]/0 via-[#4f8a8b]/20 to-[#4f8a8b]/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}