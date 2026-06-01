"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, BarChart3, Shield, CheckCircle, AlertTriangle, Target, Zap, Cpu, Layers, ChevronDown } from "lucide-react";

interface AccuracyMetrics {
  pdfGrounding: number | null;
  answerCompleteness: number | null;
  contextRelevance: number | null;
  retrievalConfidence: number | null;
  hallucinationRisk: number | null;
  overallScore: number | null;
  modelUsed: string | null;
  chunksRetrieved: number | null;
  avgChunkDistance: number | null;
  evaluatedAt: string | null;
}

interface AccuracyMetricsModalProps {
  metrics: AccuracyMetrics;
  isOpen: boolean;
  onClose: () => void;
}

// Animated circular gauge component
function CircularGauge({
  value,
  label,
  icon,
  color,
  delay = 0,
  isRisk = false,
}: {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  isRisk?: boolean;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const displayValue = value ?? 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1.5;
        if (start >= displayValue) {
          setAnimatedValue(displayValue);
          return;
        }
        setAnimatedValue(Math.round(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [displayValue, delay]);

  // Color tiers
  const getColor = () => {
    if (value === null) return { stroke: "#94a3b8", bg: "from-slate-500/20 to-slate-600/20", text: "text-slate-400" };
    if (isRisk) {
      if (value <= 20) return { stroke: "#22c55e", bg: "from-emerald-500/20 to-green-500/20", text: "text-emerald-400" };
      if (value <= 50) return { stroke: "#f59e0b", bg: "from-amber-500/20 to-orange-500/20", text: "text-amber-400" };
      return { stroke: "#ef4444", bg: "from-red-500/20 to-rose-500/20", text: "text-red-400" };
    }
    if (value >= 80) return { stroke: "#22c55e", bg: "from-emerald-500/20 to-green-500/20", text: "text-emerald-400" };
    if (value >= 50) return { stroke: "#f59e0b", bg: "from-amber-500/20 to-orange-500/20", text: "text-amber-400" };
    return { stroke: "#ef4444", bg: "from-red-500/20 to-rose-500/20", text: "text-red-400" };
  };

  const colors = getColor();

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className={`relative w-[140px] h-[140px] rounded-2xl bg-gradient-to-br ${colors.bg} p-3 border border-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Animated progress arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.05s linear",
              filter: `drop-shadow(0 0 6px ${colors.stroke}60)`,
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>
            {value === null ? "N/A" : `${animatedValue}%`}
          </span>
          <div className="mt-0.5 opacity-60">{icon}</div>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-300 text-center leading-tight max-w-[120px]">
        {label}
      </span>
    </div>
  );
}

// Overall score large gauge
function OverallGauge({ value }: { value: number | null }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const displayValue = value ?? 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1;
        if (start >= displayValue) {
          setAnimatedValue(displayValue);
          return;
        }
        setAnimatedValue(Math.round(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 200);
    return () => clearTimeout(timer);
  }, [displayValue]);

  const getGradient = () => {
    if (value === null) return { from: "#94a3b8", to: "#64748b" };
    if (value >= 80) return { from: "#22c55e", to: "#10b981" };
    if (value >= 50) return { from: "#f59e0b", to: "#f97316" };
    return { from: "#ef4444", to: "#dc2626" };
  };

  const colors = getGradient();
  const getLabel = () => {
    if (value === null) return "Unavailable";
    if (value >= 90) return "Excellent";
    if (value >= 80) return "Very Good";
    if (value >= 70) return "Good";
    if (value >= 50) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] h-[200px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="url(#overallGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.05s linear",
              filter: `drop-shadow(0 0 12px ${colors.from}50)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white">
            {value === null ? "N/A" : animatedValue}
          </span>
          <span className="text-sm text-gray-400 mt-1">{getLabel()}</span>
        </div>
      </div>
      <span className="text-base font-bold text-gray-200 mt-2">Overall Accuracy Score</span>
    </div>
  );
}

export default function AccuracyMetricsModal({ metrics, isOpen, onClose }: AccuracyMetricsModalProps) {
  const [visible, setVisible] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
      document.body.classList.add("metrics-modal-open");
      setShowScrollHint(true);
    } else {
      setVisible(false);
      document.body.style.overflow = "";
      document.body.classList.remove("metrics-modal-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("metrics-modal-open");
    };
  }, [isOpen]);

  // Track scroll to fade out the scroll hint
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollTop > 60) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`metrics-modal-active fixed inset-0 z-[99999] transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(8,12,25,0.98) 0%, rgba(15,23,42,0.99) 40%, rgba(20,28,50,0.99) 70%, rgba(8,12,25,0.98) 100%)",
      }}
    >
      {/* Full-screen scroll container — hidden scrollbar + hide topbar/sidebar */}
      <style>{`
        .metrics-scroll-hide::-webkit-scrollbar { display: none; }
        body.metrics-modal-open header { display: none !important; }
        body.metrics-modal-open aside { display: none !important; }
      `}</style>
      <div
        ref={scrollRef}
        className="metrics-scroll-hide h-full w-full overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
          {/* Glow effects */}
          <div className="pointer-events-none fixed top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full z-10" />
          <div className="pointer-events-none fixed top-0 right-0 w-72 h-72 bg-purple-500/8 rounded-full blur-[100px]" />
          <div className="pointer-events-none fixed bottom-0 left-0 w-72 h-72 bg-blue-500/8 rounded-full blur-[100px]" />

          {/* Close Button — fixed top right */}
          <div className="fixed top-6 right-6 z-[100000]">
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 backdrop-blur-sm shadow-xl"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="max-w-4xl w-full mx-auto px-6 sm:px-10 pt-16 pb-20">

            {/* Header */}
            <div className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Accuracy Metrics</h1>
                  <p className="text-sm text-gray-400 mt-1">RAG Pipeline Performance Analysis</p>
                </div>
              </div>

              {/* Model info bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Cpu size={14} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">
                    Model: {metrics.modelUsed || "gpt-3.5-turbo"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Layers size={14} className="text-purple-400" />
                  <span className="text-xs font-medium text-purple-300">
                    Chunks Retrieved: {metrics.chunksRetrieved ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Target size={14} className="text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-300">
                    Avg Distance: {metrics.avgChunkDistance ?? "N/A"}
                  </span>
                </div>
                {metrics.evaluatedAt && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-500/10 border border-slate-500/20">
                    <Zap size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-300">
                      {new Date(metrics.evaluatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Overall Score - Hero Section */}
            <div className={`py-12 flex justify-center transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
              <OverallGauge value={metrics.overallScore} />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Individual Metrics Grid */}
            <div className={`pt-10 pb-8 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Detailed Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
                <CircularGauge
                  value={metrics.pdfGrounding}
                  label="PDF Grounding"
                  icon={<Shield size={16} className="text-gray-400" />}
                  color="emerald"
                  delay={100}
                />
                <CircularGauge
                  value={metrics.answerCompleteness}
                  label="Answer Completeness"
                  icon={<CheckCircle size={16} className="text-gray-400" />}
                  color="blue"
                  delay={200}
                />
                <CircularGauge
                  value={metrics.contextRelevance}
                  label="Context Relevance"
                  icon={<Target size={16} className="text-gray-400" />}
                  color="purple"
                  delay={300}
                />
                <CircularGauge
                  value={metrics.retrievalConfidence}
                  label="Retrieval Confidence"
                  icon={<Zap size={16} className="text-gray-400" />}
                  color="cyan"
                  delay={400}
                />
                <CircularGauge
                  value={metrics.hallucinationRisk}
                  label="Hallucination Risk"
                  icon={<AlertTriangle size={16} className="text-gray-400" />}
                  color="red"
                  delay={500}
                  isRisk={true}
                />
              </div>
            </div>

            {/* Explanation Footer */}
            <div className={`pb-10 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">What do these metrics mean?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400 leading-relaxed">
                  <div className="flex gap-2">
                    <Shield size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-300">PDF Grounding</strong> — % of the answer that is directly sourced from your uploaded PDF content</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-300">Answer Completeness</strong> — How thoroughly the answer addresses all aspects of your question</span>
                  </div>
                  <div className="flex gap-2">
                    <Target size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-300">Context Relevance</strong> — Quality of the retrieved document chunks (via vector similarity)</span>
                  </div>
                  <div className="flex gap-2">
                    <Zap size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-300">Retrieval Confidence</strong> — How confident the embedding model is in the best matching chunk</span>
                  </div>
                  <div className="flex gap-2 sm:col-span-2">
                    <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-300">Hallucination Risk</strong> — Risk that the answer contains information not present in the PDF (lower is better)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
      </div>

      {/* Scroll down hint — floats at bottom, fades out on scroll */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100000] flex flex-col items-center gap-1 transition-all duration-500 ${
          showScrollHint ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <span className="text-xs font-medium text-gray-400 tracking-wide">Scroll down to know more</span>
        <ChevronDown size={20} className="text-gray-500 animate-bounce" />
      </div>
    </div>
  );
}
