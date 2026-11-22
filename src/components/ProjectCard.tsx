'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { stripHtml } from '@/lib/richText';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index?: number;
  className?: string;
}

export default function ProjectCard({ project, index, className = '' }: ProjectCardProps) {
  const category = (project.projectType?.trim() || 'PROJECT').toUpperCase();
  const indexLabel = index !== undefined ? `${String(index + 1).padStart(2, '0')} // ` : '';

  return (
    <Link
      href={`/projects/${project.id}`}
      id={`work-item-${project.id}`}
      className={cn(
        "group flex flex-col justify-between rounded-2xl border border-neutral-200/90 hover:border-neutral-950/60 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden h-full",
        className
      )}
    >
      <div>
        {project.screenshotUrl && (
          <div className="w-full aspect-[2/1] overflow-hidden bg-neutral-50 border-b border-neutral-100 relative rounded-t-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.screenshotUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
              }}
            />
          </div>
        )}
        <div className="p-6 space-y-3">
          <div>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
              {indexLabel}{category}
            </span>
            <h3 className="text-sm sm:text-base font-light text-neutral-950 tracking-tight mt-1 group-hover:underline uppercase decoration-neutral-400">
              {project.title}
            </h3>
          </div>
          <div className="text-xs font-light text-neutral-500 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
            {stripHtml(project.description)}
          </div>
        </div>
      </div>
      <div className="px-6 py-3.5 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-auto bg-neutral-50/40">
        <span className="font-semibold tracking-wider">VIEW DETAILS</span>
        <ArrowRight className="w-3.5 h-3.5 text-neutral-950 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
