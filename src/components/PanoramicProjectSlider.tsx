'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Terminal,
  Monitor,
} from 'lucide-react';
import { Project } from '@/types';
import { CASE_STUDIES } from '@/data';
import { stripHtml } from '@/lib/richText';
import InteractiveScreenshotMockup from './InteractiveScreenshotMockup';

interface PanoramicProjectSliderProps {
  projects: Project[];
}

export default function PanoramicProjectSlider({ projects }: PanoramicProjectSliderProps) {
  // Guarantee at least 6 items for continuous multi-card panoramic rendering
  const items = React.useMemo(() => {
    // Filter out:
    // 1. Projects categorized under "AI systems and automations" (or containing ai / automation)
    // 2. Projects without any feature image/screenshot
    const eligibleProjects = (projects || []).filter((p) => {
      const type = (p.projectType || '').toLowerCase();
      const isAiAutomation = type.includes('ai system') || type.includes('automation');
      if (isAiAutomation) return false;

      const cs = CASE_STUDIES.find((c) => c.id === p.id);
      const hasFeaturedImage = Boolean(
        p.screenshotUrl ||
        (cs && cs.screenshots && cs.screenshots.length > 0)
      );

      return hasFeaturedImage;
    });

    let source: Project[] = eligibleProjects.length > 0 ? eligibleProjects : CASE_STUDIES.filter((cs) => {
      const ind = (cs.industry || '').toLowerCase();
      const isAiAutomation = ind.includes('ai system') || ind.includes('automation');
      const hasImg = Boolean(cs.screenshots && cs.screenshots.length > 0 && cs.screenshots[0].imageUrl);
      return !isAiAutomation && hasImg;
    }).map((cs) => ({
      id: cs.id,
      title: cs.title,
      projectType: cs.industry || 'ENGINEERING',
      description: cs.summary,
      screenshotUrl: cs.screenshots?.[0]?.imageUrl || undefined,
      liveUrl: undefined,
      status: 'Published' as const,
      lastModified: new Date().toISOString(),
    }));

    // If still empty fallback to all CASE_STUDIES with screenshots
    if (source.length === 0) {
      source = CASE_STUDIES.filter(cs => cs.screenshots && cs.screenshots.length > 0).map(cs => ({
        id: cs.id,
        title: cs.title,
        projectType: cs.industry || 'ENGINEERING',
        description: cs.summary,
        screenshotUrl: cs.screenshots?.[0]?.imageUrl || undefined,
        liveUrl: undefined,
        status: 'Published' as const,
        lastModified: new Date().toISOString(),
      }));
    }

    // If less than 6 items, repeat to guarantee 5+ slides per view smoothly
    let expanded = [...source];
    while (expanded.length < 6) {
      expanded = [...expanded, ...source.map((item) => ({ ...item, id: `${item.id}-dup-${expanded.length}` }))];
    }

    return expanded.map((p) => {
      const baseId = p.id.replace(/-dup-\d+$/, '');
      const cs = CASE_STUDIES.find((c) => c.id === baseId);
      return {
        ...p,
        realId: baseId,
        caseStudy: cs,
      };
    });
  }, [projects]);

  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Animation refs for GSAP smooth scrolling
  const progressRef = useRef({ value: 0 });
  const [displayProgress, setDisplayProgress] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth GSAP transition to target index
  const animateTo = useCallback((targetIndex: number, duration = 0.8) => {
    if (tweenRef.current) tweenRef.current.kill();

    // Find shortest cyclic distance
    const current = progressRef.current.value;
    let diff = (targetIndex - current) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const endValue = current + diff;

    tweenRef.current = gsap.to(progressRef.current, {
      value: endValue,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        setDisplayProgress(progressRef.current.value);
        const norm = Math.round(((progressRef.current.value % total) + total) % total);
        setActiveIndex(norm);
      },
      onComplete: () => {
        // Normalize progress inside 0..total to avoid runaway numbers
        const norm = Math.round(((progressRef.current.value % total) + total) % total);
        progressRef.current.value = norm;
        setDisplayProgress(norm);
        setActiveIndex(norm);
      },
    });
  }, [total]);

  const nextSlide = useCallback(() => {
    animateTo(activeIndex + 1);
  }, [activeIndex, animateTo]);

  const prevSlide = useCallback(() => {
    animateTo(activeIndex - 1);
  }, [activeIndex, animateTo]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || isDraggingRef.current) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Smooth wheel scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 40) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 20) nextSlide();
        else if (e.deltaX < -20) prevSlide();
      }
    }
  };

  // Pointer dragging gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    if (tweenRef.current) tweenRef.current.kill();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartProgressRef.current = progressRef.current.value;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Responsive drag sensitivity: ~300px per card
    const cardStep = Math.max(220, windowWidth * 0.22);
    const newProgress = dragStartProgressRef.current - deltaX / cardStep;
    progressRef.current.value = newProgress;
    setDisplayProgress(newProgress);
    const norm = Math.round(((newProgress % total) + total) % total);
    setActiveIndex(norm);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    // Snap to nearest integer slide with smooth GSAP inertia
    const nearest = Math.round(progressRef.current.value);
    animateTo(nearest, 0.6);
  };

  // Wide-angle card spacing calculations (visible 5 cards: -2, -1, 0, 1, 2)
  // Increased spacing between slides for more breathing room
  const baseSpacing = Math.min(Math.max(windowWidth * 0.25, 290), 420);

  return (
    <section
      id="panoramic-work-showcase"
      className="w-full relative overflow-hidden bg-neutral-950 text-white py-16 md:py-24 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onWheel={handleWheel}
    >
      {/* ─── STAGE AMBIENT CINEMA LIGHTING ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Overhead wide-angle radial spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130vw] h-[400px] bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />
        {/* Subtle coordinate dot mesh */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Horizon bottom fog */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* ─── STAGE HEADER ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-3 mb-3 text-neutral-400">
              <span className="w-8 h-[1px] bg-neutral-700"></span>
              <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-neutral-400">
                PANORAMIC WIDE-ANGLE SHOWCASE
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
            <div className="font-mono text-xs text-neutral-400 tracking-widest px-3.5 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 flex items-center gap-1.5 shadow-xs">
              <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-neutral-600">/</span>
              <span>{String(total).padStart(2, '0')}</span>
            </div>

            {/* Circular GSAP nav buttons */}
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

      {/* ─── FULL-WIDTH PANORAMIC 3D VIEWPORT (5+ SLIDES PER VIEW) ─── */}
      <div 
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full relative h-[540px] sm:h-[580px] md:h-[620px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing touch-none"
        style={{ perspective: 1200, perspectiveOrigin: '50% 50%' }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            // Compute signed distance from current smooth progress
            let diff = index - displayProgress;
            // Shortest cyclic wrap
            while (diff > total / 2) diff -= total;
            while (diff < -total / 2) diff += total;

            const absDiff = Math.abs(diff);

            // Hide cards beyond 5-slide wide-angle visibility
            if (absDiff > 2.8) return null;

            // ─── REVERSE WIDE-ANGLE PROJECTION MATH ───
            // Center is small (focus); sides gradually increase in size!
            // d=0: scale: 0.82 (small focused)
            // d=1: scale: 1.02 (larger)
            // d=2: scale: 1.20 (maximum wide-angle peripheral expansion)
            const scale = 0.82 + Math.min(absDiff, 2.5) * 0.19;

            // Horizontal position across panoramic field
            const x = diff * baseSpacing * (1 + absDiff * 0.08);

            // Angle inwards towards center (panoramic amphitheater curvature)
            const rotateY = diff * -18 * (1 + absDiff * 0.15);

            // Z-depth: push sides slightly back in space to maintain perspective curvature
            const z = -Math.pow(absDiff, 1.4) * 45;

            // Opacity & brightness: center is 1.0, sides slightly dimmed for contrast
            const opacity = Math.max(0.25, 1 - absDiff * 0.22);
            const brightness = Math.max(0.45, 1 - absDiff * 0.22);

            // Higher zIndex for side cards so they expand over peripherals naturally
            const zIndex = Math.round(50 - absDiff * 10);
            const isCenter = absDiff < 0.45;

            const cs = item.caseStudy;
            const techList = cs?.tech || ['Next.js', 'React', 'TypeScript', 'Tailwind'];
            const results = cs?.results || [];

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCenter) {
                    animateTo(Math.round(displayProgress + diff));
                  }
                }}
                style={{
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  filter: `brightness(${brightness})`,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transition: isDraggingRef.current ? 'none' : 'filter 0.3s ease, border-color 0.3s ease',
                }}
                className={`absolute top-0 w-[270px] sm:w-[310px] md:w-[340px] lg:w-[360px] h-[480px] sm:h-[510px] md:h-[550px] cursor-pointer rounded-3xl border transition-all duration-300 ${
                  isCenter
                    ? 'border-white/80 bg-neutral-900/95 shadow-[0_25px_80px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.4)] ring-1 ring-white/20'
                    : 'border-white/15 bg-neutral-900/80 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.7)] hover:border-white/40'
                } backdrop-blur-2xl flex flex-col justify-between overflow-hidden select-none`}
              >
                {/* ─── CARD UPPER HALF: WINDOW STAGE ─── */}
                <div className="relative w-full h-[48%] bg-neutral-950/90 border-b border-neutral-800/80 overflow-hidden flex flex-col shrink-0">
                  {/* Window title bar */}
                  <div className="h-8 px-3 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest truncate max-w-[150px]">
                      {item.realId}.mosen.dev
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500">
                      <Terminal className="w-2.5 h-2.5 text-neutral-400" />
                      <span>PROD</span>
                    </div>
                  </div>

                  {/* Screenshot / Mockup Preview */}
                  <div className="relative flex-grow w-full overflow-hidden flex items-center justify-center p-2.5 bg-gradient-to-b from-neutral-950 to-neutral-900">
                    {item.screenshotUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.screenshotUrl}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg border border-white/10 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : cs && cs.screenshots && cs.screenshots.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center scale-75 sm:scale-85 origin-center">
                        <InteractiveScreenshotMockup screenshotId={cs.screenshots[0].id} />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-lg border border-dashed border-neutral-800 bg-neutral-950/60 flex flex-col items-center justify-center p-4 text-center">
                        <Monitor className="w-6 h-6 text-neutral-600 mb-1" />
                        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                          {item.title}
                        </span>
                        <span className="text-[9px] text-neutral-600 mt-0.5">
                          Verified Architecture
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                  </div>
                </div>

                {/* ─── CARD LOWER HALF: INFORMATION & METRICS ─── */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow bg-neutral-900/90">
                  <div>
                    {/* Badge & Industry */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15 uppercase">
                          {item.projectType || 'PROJECT'}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase truncate max-w-[100px]">
                          {cs?.industry || 'B2B'}
                        </span>
                      </div>
                      {isCenter && (
                        <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> FOCUS
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-sans font-extrabold text-base sm:text-lg text-white tracking-tight uppercase line-clamp-1 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] font-light text-neutral-400 leading-relaxed mt-1.5 line-clamp-2">
                      {stripHtml(item.description)}
                    </p>
                  </div>

                  {/* Impact Metrics or Tech Pills */}
                  <div className="mt-3 pt-3 border-t border-neutral-800/80 flex flex-col gap-3">
                    {results.length > 0 ? (
                      <div className="flex items-center justify-between">
                        {results.slice(0, 2).map((res, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="font-sans font-black text-sm text-white leading-none">
                              {res.value}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5 truncate max-w-[110px]">
                              {res.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-full">
                        {techList.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-800/60 border border-neutral-700/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-full border border-neutral-700 hover:border-white text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> LIVE
                        </a>
                      )}
                      <Link
                        href={`/projects/${item.realId}`}
                        onClick={(e) => {
                          if (!isCenter) {
                            e.preventDefault();
                            animateTo(Math.round(displayProgress + diff));
                          }
                        }}
                        className={`flex-grow justify-center px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-1 shadow-sm ${
                          isCenter
                            ? 'bg-white hover:bg-neutral-200 text-neutral-950'
                            : 'bg-neutral-800 hover:bg-white hover:text-neutral-950 text-white'
                        }`}
                      >
                        EXPLORE
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── STAGE FOOTER TRACK & BULLETS ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation bullets */}
        <div className="flex items-center gap-2">
          {items.slice(0, Math.min(total, 6)).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => animateTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === (activeIndex % Math.min(total, 6))
                  ? 'w-10 bg-white'
                  : 'w-2.5 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        {/* Drag / swipe guide */}
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          <span>GSAP SMOOTH SCROLL · DRAG / WHEEL TO ROTATE · CENTER FOCUS EXPANDS SIDES</span>
        </div>
      </div>
    </section>
  );
}
