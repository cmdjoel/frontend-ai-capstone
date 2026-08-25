"use client";

import { useEffect, useRef, useState } from "react";

export function KnowledgeArtifact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: -8, y: 12 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layers = [
    {
      tag: "PHASE 01 // INGESTION",
      title: "Raw Notes & Lecture Materials",
      badge: "Text · PDF · Syllabus",
      color: "from-zinc-500/20 to-zinc-700/20 border-zinc-400/40 text-zinc-300",
    },
    {
      tag: "PHASE 02 // SYNTHESIS",
      title: "Deconstructed Topic Hierarchy",
      badge: "AI Concept Mapping",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-400/50 text-blue-200",
    },
    {
      tag: "PHASE 03 // ACTIVE DRILL",
      title: "Diagnostic Quizzing & Recall",
      badge: "Weak Area Isolation",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-400/50 text-emerald-200",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveLayer((prev) => (prev + 1) % layers.length);
      }
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered, layers.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 20;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: -8, y: 12 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[380px] sm:h-[440px] w-full max-w-lg items-center justify-center perspective-1000 select-none cursor-pointer"
      aria-label="Interactive 3D StudyFlow Knowledge Artifact"
    >
      {/* Background Ambient Glow */}
      <div className="absolute h-64 w-64 rounded-full bg-gradient-to-tr from-zinc-700/30 via-blue-500/20 to-emerald-500/20 blur-3xl animate-pulse-glow pointer-events-none" />

      {/* 3D Root Container */}
      <div
        className="relative h-72 w-72 sm:h-80 sm:w-80 preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Layer 1: Backing Grid Plate (Deep Z) */}
        <div
          className="absolute inset-0 rounded-3xl border border-zinc-800/80 bg-zinc-950/95 shadow-2xl p-5 flex flex-col justify-between"
          style={{
            transform: "translateZ(-50px)",
          }}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>CORE_NODE // 0x7F</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-2 opacity-60">
            <div className="h-1.5 w-3/4 rounded bg-zinc-800" />
            <div className="h-1.5 w-1/2 rounded bg-zinc-800" />
            <div className="h-1.5 w-5/6 rounded bg-zinc-800" />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
            <span>MEM_BUFFER: ACTIVE</span>
            <span>AI_STREAM: LIVE</span>
          </div>
        </div>

        {/* Layer 2: Main Interactive Dynamic Prism (Z: 0) */}
        <div
          className={`absolute inset-4 rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-xl shadow-xl transition-colors duration-700 flex flex-col justify-between ${layers[activeLayer].color}`}
          style={{
            transform: "translateZ(0px)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider font-semibold uppercase opacity-90">
              {layers[activeLayer].tag}
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">
              {layers[activeLayer].badge}
            </span>
          </div>

          <div className="my-auto space-y-2">
            <p className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
              {layers[activeLayer].title}
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white transition-[width] duration-700"
                  style={{
                    width: `${((activeLayer + 1) / layers.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono opacity-80">
                0{activeLayer + 1}/03
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
            <span>TRANSFORMATION MATRIX</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              SYNCHRONIZED
            </span>
          </div>
        </div>

        {/* Layer 3: Floating Satellite Card (Z: +45px) */}
        <div
          className="absolute -right-4 -top-4 w-44 rounded-xl border border-zinc-700/60 bg-zinc-900/95 p-3 shadow-2xl transition-transform duration-300"
          style={{
            transform: "translateZ(45px)",
          }}
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active Recall Flashcards
          </div>
          <p className="mt-1 text-[11px] text-zinc-300 leading-snug">
            Adaptive retention engine targeting weak areas.
          </p>
        </div>

        {/* Layer 4: Floating Satellite Card (Z: +65px) */}
        <div
          className="absolute -left-4 -bottom-4 w-48 rounded-xl border border-zinc-700/60 bg-zinc-900/95 p-3 shadow-2xl transition-transform duration-300"
          style={{
            transform: "translateZ(65px)",
          }}
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Diagnostic AI Quiz
          </div>
          <p className="mt-1 text-[11px] text-zinc-300 leading-snug">
            Real-time evaluation with deterministic weak topic isolation.
          </p>
        </div>

        {/* Interactive Layer Dots Selector */}
        <div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1"
          style={{ transform: "translateZ(20px)" }}
        >
          {layers.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveLayer(idx)}
              aria-label={`Show transformation phase ${idx + 1}`}
              className="flex h-11 min-w-[44px] items-center justify-center p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <span
                className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                  activeLayer === idx
                    ? "w-6 bg-zinc-100 dark:bg-zinc-100"
                    : "w-2 bg-zinc-500 hover:bg-zinc-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
