'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, List, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { stripHtml } from '@/lib/richText';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ProjectCard from './ProjectCard';

export default function ProjectsView() {
  const { projects, loading } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Include all published projects (both featured and standard)
  const publishedProjects = projects.filter(p => p.status === 'Published');

  // Dynamically extract all available unique categories from published projects
  const projectTypes = [
    'ALL',
    ...Array.from(
      new Set(
        publishedProjects
          .map(p => (p.projectType?.trim() || 'PROJECT').toUpperCase())
          .filter(Boolean)
      )
    ),
  ];

  const filteredProjects = publishedProjects.filter(p => {
    const type = (p.projectType?.trim() || 'PROJECT').toUpperCase();
    const matchesCategory = activeFilter === 'ALL' || type === activeFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(p.description).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DefaultPageLayout>
      <Container>
        <DynamicPageHeader
          badge="PORTFOLIO ARCHIVE"
          title="ENGINEERING DIRECTORY"
          subtitle="Production-grade platforms, fullstack web applications, AI orchestration engines, and high-conversion client systems designed and deployed by Mosen."
          hasBorder={true}
        />

        {/* Filters, Search & View Switcher */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10 pb-6 border-b border-neutral-200">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 rounded-full cursor-pointer border ${
                  activeFilter === type
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'
                }`}
              >
                {type}
                {type === 'ALL' && (
                  <span className={`ml-1.5 font-mono text-[9px] ${activeFilter === 'ALL' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    ({publishedProjects.length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search bar & View toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="SEARCH DIRECTORY..."
                className="w-full border border-neutral-200 pl-9 pr-4 py-2 text-[10px] tracking-wider font-bold bg-white focus:outline-none focus:border-neutral-950 rounded-full uppercase font-sans placeholder-neutral-400 shadow-2xs"
              />
            </div>

            {/* Grid / List view mode switcher */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Project Feed */}
        {loading ? (
          <div className="py-24 text-center text-neutral-400 text-xs font-mono uppercase tracking-widest">
            Synchronizing projects feed...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center text-neutral-400 text-xs font-mono uppercase tracking-widest border border-neutral-200 rounded-3xl bg-neutral-50/50">
            No projects found matching the active criteria.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  index={idx}
                  viewMode="grid"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard
                  project={project}
                  index={idx}
                  viewMode="list"
                />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </DefaultPageLayout>
  );
}
