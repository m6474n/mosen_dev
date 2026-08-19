'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '@/context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import type { Project } from '@/types';

export default function ProjectsView() {
  const { projects, loading } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Filter projects by status = Published
  const publishedProjects = projects.filter(p => p.status === 'Published');

  // Get unique project types for filter buttons
  const projectTypes = ['ALL', ...Array.from(new Set(publishedProjects.map(p => p.projectType.toUpperCase())))];

  const filteredProjects = activeFilter === 'ALL' 
    ? publishedProjects 
    : publishedProjects.filter(p => p.projectType.toUpperCase() === activeFilter);

  return (
    <DefaultPageLayout>
      <Container>
        <DynamicPageHeader
          badge="PORTFOLIO"
          title="PROJECT DIRECTORY"
          subtitle="A catalog of systems, integrations, and layouts engineered to move business metrics. Filtering available by category vertical."
          hasBorder={true}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-neutral-200 pb-6">
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 rounded-none cursor-pointer border ${
                activeFilter === type
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              {type}
            </button>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ReusableCard hoverable={true} className="flex flex-col h-full justify-between p-6 border-neutral-200">
                  <div className="space-y-4">
                    {project.screenshotUrl && (
                      <div className="w-full aspect-video overflow-hidden border border-neutral-200 bg-neutral-50 relative group-hover:border-neutral-950 transition-colors duration-300">
                        <img 
                          src={project.screenshotUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            // Fallback to placeholder if url fails
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                        {project.projectType}
                      </span>
                      <h3 className="font-[family-name:var(--font-inter)] text-lg font-medium tracking-tight text-neutral-950 uppercase mt-1">
                        {project.title}
                      </h3>
                    </div>
                    <div 
                      className="text-xs font-light text-neutral-500 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>
                  <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>STATUS: {project.status.toUpperCase()}</span>
                    <span className="font-bold text-neutral-950 flex items-center gap-1">
                      REVISED: {project.lastModified}
                    </span>
                  </div>
                </ReusableCard>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </DefaultPageLayout>
  );
}
