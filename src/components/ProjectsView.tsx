'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '@/context/DataContext';
import { stripHtml } from '@/lib/richText';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types';

export default function ProjectsView() {
  const { projects, loading } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

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
                }}
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
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  index={idx}
                />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </DefaultPageLayout>
  );
}
