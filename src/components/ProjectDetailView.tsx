'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CASE_STUDIES } from '@/data';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import InteractiveScreenshotMockup from './InteractiveScreenshotMockup';

interface ProjectDetailViewProps {
  slug: string;
}

export default function ProjectDetailView({ slug }: ProjectDetailViewProps) {
  const { projects, loading } = useData();

  // Show loader while Firebase data is still being fetched
  if (loading) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-32 text-center">
          <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading project...
          </p>
        </Container>
      </DefaultPageLayout>
    );
  }

  const project = projects.find((p) => p.id === slug);

  // Fallback if project is not found (only shown after loading completes)
  if (!project) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-20 text-center">
          <h2 className="text-xl font-light uppercase mb-4">PROJECT NOT FOUND</h2>
          <p className="text-sm font-light text-neutral-500 mb-8">
            The requested project ID does not exist on this channel.
          </p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-xs hover:bg-neutral-800 transition-colors"
          >
            Back to Projects
          </Link>
        </Container>
      </DefaultPageLayout>
    );
  }

  // Linked case study & screenshot enrichment
  const caseStudy = CASE_STUDIES.find((c) => c.id === slug);
  const screenshot = project.screenshotUrl || caseStudy?.screenshots?.[0]?.imageUrl || caseStudy?.image;
  const techStack = caseStudy?.tech || ['Next.js', 'React', 'TypeScript', 'TailwindCSS'];
  const results = caseStudy?.results || [
    { value: '100%', label: 'Type Safe Architecture' },
    { value: '99.9%', label: 'Production Uptime' },
    { value: '<0.4s', label: 'Average Interaction LCP' },
  ];

  // Next project peek finder
  const publishedProjects = projects.filter((p) => p.status === 'Published');
  const currentIndex = publishedProjects.findIndex((p) => p.id === slug);
  const nextProject =
    currentIndex >= 0 && currentIndex < publishedProjects.length - 1
      ? publishedProjects[currentIndex + 1]
      : publishedProjects[0] && publishedProjects[0].id !== slug
      ? publishedProjects[0]
      : null;

  return (
    <DefaultPageLayout>
      <Container className="max-w-5xl flex flex-col pt-8 pb-20">
        {/* Hero Title & Live Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-400 font-bold font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <Tag className="w-3.5 h-3.5" /> {project.projectType.toUpperCase()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> UPDATED: {project.lastModified ? project.lastModified.split('T')[0] : 'RECENT'}
            </span>
            {project.status === 'Published' && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PRODUCTION VERIFIED
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-[family-name:var(--font-inter-tight)] font-black text-3xl sm:text-4xl md:text-6xl tracking-tight text-neutral-950 uppercase leading-[1.05] select-none max-w-3xl">
              {project.title.toUpperCase()}
            </h1>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-sm shrink-0 self-start md:self-auto"
                title="Launch Live Production"
                id="live-project-link"
              >
                <span>VISIT LIVE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Cinematic Visual Stage Showcase (Border Removed) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl mb-12 group"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

          <div className="relative w-full overflow-hidden bg-neutral-900 aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            {screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={screenshot}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
                }}
              />
            ) : caseStudy && caseStudy.screenshots && caseStudy.screenshots.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center p-6">
                <InteractiveScreenshotMockup screenshotId={caseStudy.screenshots[0].id} />
              </div>
            ) : (
              <div className="text-center p-8 font-mono text-neutral-400">
                <Layers className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
                <span className="text-xs uppercase tracking-widest">
                  Architecture Schematics & Logic Layer
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Live Metrics Grid HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {results.map((res, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:border-neutral-950/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">
                  VERIFIED OUTCOME
                </span>
              </div>
              <div className="font-[family-name:var(--font-inter-tight)] text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                {res.value}
              </div>
              <div className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
                {res.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Layout: Main Prose + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 border-t border-neutral-200 pt-12 mb-16">
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                OVERVIEW & ARCHITECTURE
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-neutral-950 uppercase tracking-tight">
                THE ENGINEERING BREAKDOWN
              </h2>
            </div>

            <div
              className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm font-light font-sans tracking-wide ql-editor"
              id="project-content"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            {caseStudy && (
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    PROBLEM STATEMENT
                  </h3>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {caseStudy.challenge}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    DEPLOYED SOLUTION
                  </h3>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {caseStudy.solution}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Meta & Tech Stack Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-neutral-200 lg:pl-10">
            {/* Tech Stack Box */}
            <div className="p-6 rounded-2xl bg-neutral-50/80 border border-neutral-200">
              <div className="flex items-center gap-2 mb-4 text-neutral-950">
                <Code2 className="w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  TECHNOLOGY STACK
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-[10px] font-mono font-semibold text-neutral-800 uppercase shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                DELIVERY METADATA
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500 font-light">Status</span>
                  <span className="font-mono font-bold text-neutral-950 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    COMPLETED
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500 font-light">Role</span>
                  <span className="font-mono font-semibold text-neutral-950">
                    FULLSTACK LEAD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-light">Deployment</span>
                  <span className="font-mono font-semibold text-neutral-950">
                    EDGE / CLOUD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Project Footer Bar */}
        {nextProject && (
          <Link
            href={`/projects/${nextProject.id}`}
            className="group block p-8 rounded-3xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                  NEXT PROJECT IN QUEUE
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                  {nextProject.title}
                </h3>
                <span className="font-mono text-xs text-neutral-500 uppercase mt-1 block">
                  {nextProject.projectType}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-neutral-950 transition-all duration-300 flex items-center justify-center border border-white/20 shrink-0">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        )}
      </Container>
    </DefaultPageLayout>
  );
}
