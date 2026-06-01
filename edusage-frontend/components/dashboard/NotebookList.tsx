"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NotebookRow from "./NotebookRow";
import API from "@/services/api";

interface Notebook {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotebookList() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/notebooks");
        const list: Notebook[] = res.data || [];
        setNotebooks(list);

        const countsEntries = await Promise.all(
          list.map(async (nb) => {
            try {
              const docsRes = await API.get(`/documents/${nb._id}`);
              const docs = docsRes.data || [];
              return [nb._id, Array.isArray(docs) ? docs.length : 0] as const;
            } catch {
              return [nb._id, 0] as const;
            }
          })
        );

        const counts: Record<string, number> = {};
        for (const [id, count] of countsEntries) {
          counts[id] = count;
        }
        setDocCounts(counts);
      } catch (err) {
        console.error("Error loading notebooks:", err);
        setError("Failed to load notebooks");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="text-sm font-medium">Loading notebooks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="rounded-full bg-red-50 p-3 mb-4">
          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs">!</span>
          </div>
        </div>
        <p className="text-sm font-medium text-red-600 mb-2">Failed to load notebooks</p>
        <p className="text-xs text-muted-foreground text-center">Please check your connection and try again</p>
      </div>
    );
  }

  if (!notebooks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="rounded-full bg-[#4f8a8b]/10 p-4 mb-4">
          <div className="h-8 w-8 rounded-full bg-[#4f8a8b]/20 flex items-center justify-center">
            <span className="text-[#4f8a8b] text-lg">📓</span>
          </div>
        </div>
        <p className="text-base font-medium text-foreground mb-2">No notebooks yet</p>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Create your first notebook from the Notebooks page to get started
        </p>
        <Link 
          href="/notebooks/create" 
          className="inline-flex items-center gap-2 rounded-lg bg-[#4f8a8b] text-white px-4 py-2 text-sm font-medium hover:bg-[#3e6f70] transition-colors duration-200"
        >
          Create Notebook
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notebooks.map((nb) => (
        <NotebookRow
          key={nb._id}
          title={nb.title}
          documents={docCounts[nb._id] ?? 0}
          updatedAt={new Date(nb.updatedAt).toLocaleDateString()}
        />
      ))}
    </div>
  );
}
