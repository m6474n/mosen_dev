'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import { stripHtml } from '@/lib/richText';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';
import { CASE_STUDIES } from '@/data';

interface ProjectCardProps {
  project: Project;
  index?: number;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export default function ProjectCard({ project, index, className = '', viewMode = 'grid' }: ProjectCardProps) {
  const category = (project.projectType?.trim() || 'PROJECT').toUpperCase();
  const indexLabel = index !== undefined ? String(index + 1).padStart(2, '0') : '';
  const caseStudy = CASE_STUDIES.find(c => c.id === project.id);
  const screenshot = project.screenshotUrl || caseStudy?.screenshots?.[0]?.imageUrl || caseStudy?.image;
  const metrics = caseStudy?.results?.[0];

  if (viewMode === 'list') {
    return (
      <Link
        href={`/projects/${project.id}`}
        id={`work-item-${project.id}`}
        className={cn(
          "group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-950/40 shadow-xs hover:shadow-md transition-all duration-300",
          className
        )}
      >
        <div className="flex items-start md:items-center gap-5 flex-1 min-w-0">
          <span className="font-mono text-xs font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors w-7">
            {indexLabel}
          </span>

          {screenshot && (
            <div className="w-20 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
                }}
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                {category}
              </span>
              {project.status === 'Published' && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <h3 className="text-base font-medium text-neutral-950 tracking-tight truncate group-hover:text-neutral-700 transition-colors uppercase font-sans">
              {project.title}
            </h3>
            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5 font-light">
              {stripHtml(project.description)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center shrink-0">
          {metrics && (
            <div className="text-right hidden lg:block mr-2">
              <div className="font-mono text-xs font-bold text-neutral-950">{metrics.value}</div>
              <div className="text-[10px] text-neutral-400 font-mono uppercase">{metrics.label}</div>
            </div>
          )}

          <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-950 text-neutral-600 group-hover:text-white transition-all duration-300 flex items-center justify-center border border-neutral-200 group-hover:border-neutral-950">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      id={`work-item-${project.id}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 hover:border-neutral-950/40 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden h-full",
        className
      )}
    >
      <div>
        {/* Preview image or fallback geometric card */}
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-neutral-100 relative">
          {screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={screenshot}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-50 to-neutral-100">
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase mb-2">
                SYSTEM ARCHITECTURE
              </span>
              <span className="font-sans font-bold text-sm text-neutral-700 uppercase tracking-tight">
                {project.title}
              </span>
            </div>
          )}

          {/* Top badges floating over image */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase font-mono bg-white/90 backdrop-blur-md text-neutral-800 border border-neutral-200/80 shadow-xs">
              {category}
            </span>
            {indexLabel && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-neutral-700 bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-xs">
                #{indexLabel}
              </span>
            )}
          </div>

          {/* Subtle hover gradient veil */}
          <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/[0.04] transition-colors duration-300 pointer-events-none" />
        </div>

        {/* Content body */}
        <div className="p-6 md:p-7 space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight group-hover:text-neutral-700 transition-colors uppercase font-sans leading-snug">
              {project.title}
            </h3>
          </div>

          <p className="text-xs font-light text-neutral-500 leading-relaxed line-clamp-2">
            {stripHtml(project.description)}
          </p>

          {/* Key Metric if available */}
          {metrics && (
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200/70 text-[10px] font-mono text-neutral-700">
                <Sparkles className="w-2.5 h-2.5 text-neutral-900" />
                <span className="font-bold text-neutral-950">{metrics.value}</span>
                <span className="text-neutral-400 ml-1">{metrics.label}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-6 md:px-7 py-5 border-t border-neutral-100/90 flex items-center justify-between text-xs font-mono text-neutral-500 mt-auto bg-neutral-50/50">
        <span className="font-bold tracking-wider uppercase text-neutral-800 group-hover:text-neutral-950 transition-colors">
          EXPLORE PROJECT
        </span>
        <div className="w-9 h-9 rounded-full bg-white group-hover:bg-neutral-950 text-neutral-900 group-hover:text-white transition-all duration-300 flex items-center justify-center border border-neutral-200 group-hover:border-neutral-950 shadow-xs">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
