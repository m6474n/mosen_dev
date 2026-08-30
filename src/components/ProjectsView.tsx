'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { stripHtml } from '@/lib/richText';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import type { Project } from '@/types';

export default function ProjectsView() {
  const { projects, loading } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter projects by status = Published and not featured
  const publishedProjects = projects.filter(p => p.status === 'Published' && !p.featured);

  // Get unique project types for filter buttons
  const projectTypes = ['ALL', ...Array.from(new Set(publishedProjects.map(p => p.projectType.toUpperCase())))];

  const filteredProjects = publishedProjects.filter(p => {
    const matchesCategory = activeFilter === 'ALL' || p.projectType.toUpperCase() === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(p.description).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DefaultPageLayout>
      <Container>
        <DynamicPageHeader
          badge="PORTFOLIO"
          title="PROJECT DIRECTORY"
          subtitle="A catalog of systems, integrations, and layouts engineered to move business metrics. Filtering available by category vertical."
          hasBorder={true}
        />

        {/* Filters & Search Row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12 border-b border-neutral-200 pb-6">
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveFilter(type);
                  // Optionally clear search when changing tabs to prevent empty feed confusion
                }}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 rounded-none cursor-pointer border ${activeFilter === type
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search bar input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="SEARCH PROJECTS..."
              className="w-full border border-neutral-200 px-4 py-2 text-[10px] tracking-wider font-bold bg-white focus:outline-none focus:border-neutral-950 rounded-none uppercase font-sans placeholder-neutral-400"
            />
          </div>
        </div>

        {/* Project Feed */}
        {loading ? (
          <div className="py-24 text-center text-neutral-400 text-xs font-mono uppercase tracking-widest">
            Synchronizing projects feed...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center text-neutral-400 text-xs font-mono uppercase tracking-widest border border-neutral-200">
            No projects in this category vertical.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/projects/${project.id}`} className="block h-full group">
                  <ReusableCard hoverable={true} noPadding={true} className="flex flex-col h-full justify-between border-neutral-200 group-hover:border-neutral-950 transition-colors duration-300 overflow-hidden">
                    <div>
                      {project.screenshotUrl && (
                        <div className="w-full aspect-video overflow-hidden bg-neutral-50 border-b border-neutral-200 relative transition-colors duration-300">
                          <img
                            src={project.screenshotUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              // Fallback to placeholder if url fails
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                            {project.projectType.toUpperCase()}
                          </span>
                          <h3 className="font-[family-name:var(--font-inter)] text-lg font-medium tracking-tight text-neutral-950 uppercase mt-1 group-hover:underline decoration-neutral-400">
                            {project.title}
                          </h3>
                        </div>
                        <div
                          className="text-xs font-light text-neutral-500 leading-relaxed font-sans line-clamp-3 overflow-hidden text-ellipsis"
                        >
                          {stripHtml(project.description)}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-auto">
                      <span>STATUS: {project.status.toUpperCase()}</span>
                      <span className="font-bold text-neutral-950 flex items-center gap-1">
                        UPDATED ON: {project.lastModified}
                      </span>
                    </div>
                  </ReusableCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </DefaultPageLayout>
  );
}
