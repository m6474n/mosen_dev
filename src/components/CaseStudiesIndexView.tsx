'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import { stripHtml } from '../lib/richText';

export default function CaseStudiesIndexView() {
  const { caseStudies } = useData();

  return (
    <DefaultPageLayout>
      <Container>
        <DynamicPageHeader
          badge="PORTFOLIO DEPLOYMENTS"
          title="CASE STUDIES"
          subtitle="A granular breakdown of select commercial systems built from wireframe architectures to optimized execution channels."
          hasBorder={true}
        />

        {/* List items */}
        <div className="grid grid-cols-1 gap-12">
          {caseStudies.map((project, idx) => (
            <ReusableCard
              key={project.id}
              hoverable={true}
              variant="white"
              className="p-8 md:p-12 justify-between"
            >
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-neutral-400 font-mono">0{idx + 1} //</span>
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{project.industry.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[9px] font-bold text-neutral-400 tracking-wider bg-neutral-100 px-2 py-0.5 uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-light text-neutral-950 mb-4 tracking-tight uppercase">
                  {project.title.toUpperCase()}
                </h3>

                <p className="text-xs font-light text-neutral-600 leading-relaxed max-w-2xl mb-8">
                  {stripHtml(project.summary)}
                </p>

                {/* Immediate main outcome indicator */}
                <div className="bg-neutral-50 p-4 border border-neutral-100 shadow-xs mb-8 flex items-center justify-between max-w-md">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Key Result</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-sans text-neutral-900">{project.results[0].value}</span>
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">{project.results[0].label}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-start">
                <Link
                  href={`/case-studies/${project.id}`}
                  className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider flex items-center gap-2 uppercase"
                >
                  Read Comprehensive Analysis <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ReusableCard>
          ))}
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
