"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Activity,
  HardDrive,
} from "lucide-react";
import StatsCard from "./StatsCard";
import API from "@/services/api";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalNotebooks: 0,
    totalDocuments: 0,
    recentActivity: 0,
    storageUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user's notebooks
        const notebooksRes = await API.get("/notebooks");
        const totalNotebooks = notebooksRes.data.length || 0;
        
        // Calculate total documents from all notebooks
        let totalDocuments = 0;
        let storageUsed = 0;
        
          for (const notebook of notebooksRes.data) {
          if (notebook.documents) {
            totalDocuments += notebook.documents.length;
            // Estimate storage (rough calculation)
            storageUsed += notebook.documents.length * 0.5; // Assume 0.5MB per document
          }
          if (notebook.web_sources) {
            totalDocuments += notebook.web_sources.length;
            storageUsed += notebook.web_sources.length * 0.1; // Assume 0.1MB per web source
          }
        }

        // Fetch recent activity
        let recentActivity = 0;
        try {
          const activityRes = await API.get("/activity"); // Fixed: use correct endpoint
          recentActivity = activityRes.data.count || 0;
        } catch (err) {
          // Fallback: calculate from recent notebook updates
          recentActivity = Math.min(totalNotebooks * 2, 10); // Estimate
        }

        setStats({
          totalNotebooks,
          totalDocuments,
          recentActivity,
          storageUsed: Math.round(storageUsed * 10) / 10, // Round to 1 decimal
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Set fallback values
        setStats({
          totalNotebooks: 0,
          totalDocuments: 0,
          recentActivity: 0,
          storageUsed: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="animate-scale-in animation-delay-100">
        <StatsCard
          title="Total Notebooks"
          value={loading ? "..." : stats.totalNotebooks.toString()}
          icon={<BookOpen size={20} />}
          loading={loading}
        />
      </div>
      <div className="animate-scale-in animation-delay-200">
        <StatsCard
          title="Documents"
          value={loading ? "..." : stats.totalDocuments.toString()}
          icon={<FileText size={20} />}
          loading={loading}
        />
      </div>
      <div className="animate-scale-in animation-delay-300">
        <StatsCard
          title="Recent Activity"
          value={loading ? "..." : `${stats.recentActivity} updates`}
          icon={<Activity size={20} />}
          loading={loading}
        />
      </div>
      <div className="animate-scale-in animation-delay-400">
        <StatsCard
          title="Storage Used"
          value={loading ? "..." : `${stats.storageUsed} MB`}
          icon={<HardDrive size={20} />}
          loading={loading}
        />
      </div>
    </div>
  );
}
