'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Tag, ExternalLink } from 'lucide-react';
import { useData } from '@/context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';

interface ProjectDetailViewProps {
  slug: string;
}

export default function ProjectDetailView({ slug }: ProjectDetailViewProps) {
  const { projects, loading } = useData();
  const project = projects.find((p) => p.id === slug);

  // Show loader while Firebase data is still being fetched
  if (loading) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-32 text-center">
          <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Loading project...</p>
        </Container>
      </DefaultPageLayout>
    );
  }

  // Fallback if project is not found (only shown after loading completes)
  if (!project) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-20 text-center">
          <h2 className="text-xl font-light uppercase mb-4">PROJECT NOT FOUND</h2>
          <p className="text-sm font-light text-neutral-500 mb-8">The requested project ID does not exist on this channel.</p>
          <Link href="/projects" className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase">
            Back to Projects
          </Link>
        </Container>
      </DefaultPageLayout>
    );
  }

  return (
    <DefaultPageLayout>
      <Container className="max-w-3xl flex flex-col">
        {/* Main Screenshot/Image */}
        {project.screenshotUrl && (
          <div className="w-full aspect-video overflow-hidden border border-neutral-200 bg-neutral-50 relative mb-6">
            <img 
              src={project.screenshotUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
              }}
            />
          </div>
        )}

        {/* Time and category line */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-neutral-400 font-bold font-mono uppercase tracking-widest mb-3">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> {project.projectType.toUpperCase()}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> UPDATED: {project.lastModified}
          </span>
        </div>

        {/* Core Project display Heading */}
        <h1 className="font-[family-name:var(--font-inter-tight)] font-black text-3xl md:text-5xl tracking-tight text-neutral-950 uppercase leading-tight select-none flex items-center gap-3 flex-wrap mb-8">
          {project.title.toUpperCase()}
          {project.liveUrl && (
            <a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-neutral-450 hover:text-neutral-950 transition-colors"
              title="Launch Live Production"
              id="live-project-link"
            >
              <ExternalLink className="w-6 h-6 md:w-8 md:h-8" />
            </a>
          )}
        </h1>

        {/* The main core text body */}
        <div
          className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm font-light font-sans tracking-wide space-y-6 ql-editor mb-12"
          id="project-content"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

      </Container>
    </DefaultPageLayout>
  );
}
