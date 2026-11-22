'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  Monitor,
  Terminal,
} from 'lucide-react';
import { Project } from '@/types';
import { CASE_STUDIES } from '@/data';
import { stripHtml } from '@/lib/richText';
import InteractiveScreenshotMockup from './InteractiveScreenshotMockup';

interface PanoramicProjectSliderProps {
  projects: Project[];
}

export default function PanoramicProjectSlider({ projects }: PanoramicProjectSliderProps) {
  // Combine projects with case-study enrichment
  const displayItems = React.useMemo(() => {
    if (!projects || projects.length === 0) {
      return CASE_STUDIES.map((cs) => ({
        id: cs.id,
        title: cs.title,
        projectType: cs.industry || 'ENGINEERING',
        description: cs.summary,
        status: 'Published' as const,
        lastModified: new Date().toISOString(),
        caseStudy: cs,
      }));
    }

    return projects.map((p) => {
      const cs = CASE_STUDIES.find((c) => c.id === p.id);
      return {
        ...p,
        caseStudy: cs,
      };
    });
  }, [projects]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = displayItems.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused || count <= 1) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, count]);

  if (count === 0) return null;

  return (
    <section
      id="panoramic-work-showcase"
      className="w-full relative overflow-hidden bg-neutral-950 text-white py-20 md:py-28 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── PANORAMIC STAGE AMBIENT LIGHTING ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top curved panoramic spot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[340px] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,255,255,0.09),transparent_75%)]" />
        {/* Subtle grid mesh */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Bottom floor bounce light */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      {/* ─── STAGE HEADER BAR ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-3 mb-3 text-neutral-400">
              <span className="w-8 h-[1px] bg-neutral-700"></span>
              <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-neutral-400">
                PANORAMIC 3D SHOWCASE
              </span>
            </div>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              PROJECTS THAT<br />
              <span className="text-neutral-500 font-light">MOVED REAL NUMBERS.</span>
            </h2>
          </div>

          {/* Controls & Nav */}
          <div className="flex items-center gap-4">
            {/* Slide counter */}
            <div className="font-mono text-xs text-neutral-400 tracking-widest px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
              <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-neutral-600 mx-1.5">/</span>
              <span>{String(count).padStart(2, '0')}</span>
            </div>

            {/* Circular buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous project"
                className="w-11 h-11 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-white hover:text-neutral-950 hover:border-white text-white transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next project"
                className="w-11 h-11 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-white hover:text-neutral-950 hover:border-white text-white transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View all link */}
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors border-b border-neutral-700 hover:border-white pb-0.5 ml-2"
            >
              ALL PROJECTS
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── FULL-WIDTH PANORAMIC 3D VIEWPORT ─── */}
      <div 
        ref={containerRef}
        className="w-full relative h-[560px] sm:h-[600px] md:h-[640px] flex items-center justify-center overflow-visible"
        style={{ perspective: 1250, perspectiveOrigin: '50% 50%' }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {displayItems.map((item, index) => {
            // Calculate signed distance in cyclic fashion
            let diff = index - currentIndex;
            // Shortest cyclic offset
            if (diff > count / 2) diff -= count;
            if (diff < -count / 2) diff += count;

            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            // Compute 3D wide-angle curved transformations
            let rotateY = 0;
            let translateX = '0%';
            let translateZ = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 30;
            let brightness = 1;

            if (diff === 0) {
              rotateY = 0;
              translateX = '0%';
              translateZ = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
              brightness = 1;
            } else if (diff === 1) {
              rotateY = -26; // Curved inwards toward viewer
              translateX = '64%';
              translateZ = -140;
              scale = 0.88;
              opacity = 0.65;
              zIndex = 20;
              brightness = 0.65;
            } else if (diff === -1) {
              rotateY = 26; // Curved inwards toward viewer
              translateX = '-64%';
              translateZ = -140;
              scale = 0.88;
              opacity = 0.65;
              zIndex = 20;
              brightness = 0.65;
            } else if (diff >= 2) {
              rotateY = -38;
              translateX = '105%';
              translateZ = -320;
              scale = 0.74;
              opacity = 0.25;
              zIndex = 10;
              brightness = 0.4;
            } else if (diff <= -2) {
              rotateY = 38;
              translateX = '-105%';
              translateZ = -320;
              scale = 0.74;
              opacity = 0.25;
              zIndex = 10;
              brightness = 0.4;
            }

            const cs = item.caseStudy;
            const techList = cs?.tech || ['Next.js', 'React', 'TypeScript', 'Tailwind'];
            const results = cs?.results || [];

            return (
              <motion.div
                key={item.id}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                }}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 60) prevSlide();
                  else if (info.offset.x < -60) nextSlide();
                }}
                animate={{
                  rotateY,
                  x: translateX,
                  z: translateZ,
                  scale,
                  opacity,
                  filter: `brightness(${brightness})`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                  mass: 0.85,
                }}
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute top-0 w-[88vw] sm:w-[78vw] md:w-[68vw] lg:w-[60vw] max-w-4xl h-[520px] sm:h-[560px] md:h-[600px] cursor-pointer rounded-[2rem] border transition-shadow duration-300 ${
                  isCenter
                    ? 'border-white/25 bg-neutral-900/95 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)]'
                    : 'border-white/10 bg-neutral-900/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] hover:border-white/30'
                } backdrop-blur-2xl flex flex-col justify-between overflow-hidden`}
              >
                {/* ─── CARD UPPER HALF: VISUAL SHOWCASE STAGE ─── */}
                <div className="relative w-full h-[52%] bg-neutral-950/80 border-b border-neutral-800/80 overflow-hidden flex flex-col">
                  {/* Window titlebar */}
                  <div className="h-9 px-4 border-b border-neutral-800/80 bg-neutral-900/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest truncate max-w-[200px]">
                      {item.id}.mosen.dev
                    </span>
                    <div className="flex items-center gap-1 text-neutral-500 text-[10px] font-mono">
                      <Terminal className="w-3 h-3 text-neutral-400" />
                      <span>SECURE</span>
                    </div>
                  </div>

                  {/* Visual Content: Screenshot, Interactive Mockup or Custom Graphic */}
                  <div className="relative flex-grow w-full overflow-hidden flex items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-neutral-950 to-neutral-900">
                    {item.screenshotUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.screenshotUrl}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : cs && cs.screenshots && cs.screenshots.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center scale-90 sm:scale-100 origin-center">
                        <InteractiveScreenshotMockup screenshotId={cs.screenshots[0].id} />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-xl border border-dashed border-neutral-800 bg-neutral-950/60 flex flex-col items-center justify-center p-6 text-center">
                        <Monitor className="w-8 h-8 text-neutral-600 mb-2" />
                        <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider font-bold">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-600 mt-1">
                          Production System · Verified Architecture
                        </span>
                      </div>
                    )}

                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  </div>
                </div>

                {/* ─── CARD LOWER HALF: DETAILS & METRICS ─── */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow bg-neutral-900/90">
                  <div>
                    {/* Meta category row */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15 tracking-wider uppercase">
                          {item.projectType || 'SYSTEM'}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">
                          {cs?.industry || 'PRODUCTION'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        VERIFIED BUILD
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="font-sans font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight uppercase leading-snug line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed mt-2 line-clamp-2">
                      {stripHtml(item.description)}
                    </p>
                  </div>

                  {/* Impact Metrics or Tech Pills */}
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Results Metrics */}
                    {results.length > 0 ? (
                      <div className="flex items-center gap-4 sm:gap-6">
                        {results.slice(0, 2).map((res, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="font-sans font-black text-base sm:text-lg text-white leading-none">
                              {res.value}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">
                              {res.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Tech badges fallback */
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {techList.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-800/60 border border-neutral-700/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 rounded-full border border-neutral-700 hover:border-white text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> LIVE
                        </a>
                      )}
                      <Link
                        href={`/projects/${item.id}`}
                        onClick={(e) => {
                          if (!isCenter) {
                            e.preventDefault();
                            setCurrentIndex(index);
                          }
                        }}
                        className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        DETAILS
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── STAGE FOOTER TRACK & BULLETS ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation bullets */}
        <div className="flex items-center gap-2">
          {displayItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-10 bg-white'
                  : 'w-2.5 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        {/* Drag / swipe guide */}
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          <span>DRAG TO ROTATE PANORAMA · ARROW KEYS TO NAVIGATE</span>
        </div>
      </div>
    </section>
  );
}
