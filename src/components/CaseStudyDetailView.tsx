'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import dynamic from 'next/dynamic';

const InteractiveScreenshotMockup = dynamic(
  () => import('./InteractiveScreenshotMockup'),
  { ssr: false }
);

interface CaseStudyDetailViewProps {
  id: string;
}

export default function CaseStudyDetailView({ id }: CaseStudyDetailViewProps) {
  const { caseStudies } = useData();
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);

  const currentProject = caseStudies.find((p) => p.id === id);

  // Reset active tab when shifting between case studies
  useEffect(() => {
    setActiveScreenshotIdx(0);
  }, [id]);

  // Fallback if project is not found
  if (!currentProject) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-20 text-center">
          <h2 className="text-xl font-light uppercase mb-4">CASE STUDY NOT FOUND</h2>
          <p className="text-sm font-light text-neutral-500 mb-8">The requested case study has either been relocated or renamed.</p>
          <Link href="/case-studies" className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase">
            Back to Case Studies
          </Link>
        </Container>
      </DefaultPageLayout>
    );
  }

  return (
    <DefaultPageLayout>
      <Container>
        {/* Back Action button */}
        <div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors uppercase"
            id="back-btn"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO ALL PROJECTS
          </Link>
        </div>

        {/* Title & Metadata Header */}
        <DynamicPageHeader
          badge={`CASE STUDY DETAILS — ${currentProject.industry}`}
          title={currentProject.title}
          subtitle={currentProject.summary}
          hasBorder={true}
        />

        {/* Results Outcomes cards */}
        <ReusableCard hoverable={false} variant="muted" className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 border-neutral-100 mb-4">
          {currentProject.results.map((res, i) => (
            <div key={i} className="flex flex-col border-r last:border-0 border-neutral-200 pr-4">
              <span className="text-3xl md:text-4xl font-extralight text-neutral-950 tracking-tight font-sans mb-1">
                {res.value}
              </span>
              <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                {res.label.toUpperCase()}
              </span>
            </div>
          ))}
        </ReusableCard>

        {/* SYSTEM SCREENSHOTS & INTERACTIVE LAYOUTS */}
        {currentProject.screenshots && currentProject.screenshots.length > 0 && (
          <div id="screenshots-section" className="mb-14 border-t border-b border-neutral-150 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-8">
              <div className="max-w-md">
                <span className="text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase font-mono block mb-1">
                  PRODUCTION PREVIEWS & INTERACTION BLUEPRINTS
                </span>
                <h3 className="text-xl md:text-2xl font-light tracking-tight text-neutral-950 uppercase mb-2 font-sans">
                  SYSTEM IN-ACTION VIEWS
                </h3>
                <p className="text-xs font-light text-neutral-500 leading-relaxed">
                  Interactive simulations representing the active system frontends. Click the terminal parameters or buttons to verify the modular responsiveness of the implementation.
                </p>
              </div>

              {/* Tabs selection for screenshots if count > 1 */}
              {currentProject.screenshots.length > 1 && (
                <div className="flex border border-neutral-200 p-1 bg-neutral-50 rounded-none select-none">
                  {currentProject.screenshots.map((shot, idx) => (
                    <button
                      key={shot.id}
                      onClick={() => setActiveScreenshotIdx(idx)}
                      className={`px-4 py-1.5 text-[10px] font-bold uppercase transition select-none cursor-pointer ${
                        activeScreenshotIdx === idx
                          ? 'bg-neutral-950 text-white shadow-xs rounded-none'
                          : 'text-neutral-500 hover:text-neutral-950'
                      }`}
                    >
                      SCREEN {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layout grid containing details & the simulator canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2.5fr] gap-8 items-stretch pt-2">
              {(() => {
                const activeShot = currentProject.screenshots![activeScreenshotIdx] || currentProject.screenshots![0];
                if (!activeShot) return null;
                return (
                  <div className="flex flex-col justify-between p-6 bg-neutral-50 border border-neutral-200 rounded-none text-left">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 border border-neutral-950/20 rounded-none font-mono uppercase bg-white">
                          {activeShot.type.toUpperCase()} PREVIEW
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold tracking-wider text-neutral-950 uppercase font-mono">
                        {activeShot.title}
                      </h4>
                      <p className="text-xs font-light text-neutral-500 leading-relaxed">
                        {activeShot.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-200 text-[10px] font-mono text-neutral-400 space-y-1.5">
                      <div className="flex justify-between">
                        <span>RENDER STATUS:</span>
                        <span className="text-emerald-600 font-bold">100% INTERACTIVE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PLATFORM SETUP:</span>
                        <span>{activeShot.type.toUpperCase()}_EMULATOR</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Simulated UI container */}
              <div className="bg-neutral-950 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] rounded-none border border-neutral-200 p-4 md:p-8 flex items-center justify-center min-h-[380px] lg:min-h-[480px]">
                {(() => {
                  const activeShot = currentProject.screenshots![activeScreenshotIdx] || currentProject.screenshots![0];
                  if (!activeShot) return null;
                  return <InteractiveScreenshotMockup screenshotId={activeShot.id} />;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Two-column analysis layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          {/* Left Column Sidebar */}
          <ReusableCard hoverable={false} variant="muted" className="p-6 gap-8 lg:sticky lg:top-24">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 font-mono">INDUSTRY CLASSIFICATION</span>
              <span className="text-xs font-bold text-neutral-900 uppercase">{currentProject.industry}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 font-mono">INTEGRATED TECHNOLOGIES</span>
              <div className="flex flex-wrap gap-2">
                {currentProject.tech.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-neutral-950 px-3 py-1 bg-white border border-neutral-200">
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-4 font-mono">PROJECT ENGAGEMENT</span>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed mb-4 font-sans">
                This work was designed, engineered, and shipped directly to production under an independent contract setup.
              </p>
              <Link
                href="/contact"
                className="w-full text-center py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold tracking-wider transition-all block uppercase"
              >
                Request Similar System
              </Link>
            </div>
          </ReusableCard>

          {/* Right Column Core Case Writeup */}
          <div className="prose text-neutral-800 flex flex-col gap-8 font-sans">
            <div>
              <h2 className="text-xs font-light tracking-widest text-neutral-400 uppercase mb-4">THE BUSINESS PROBLEM</h2>
              <p className="text-sm font-light text-neutral-600 leading-relaxed tracking-wide">
                {currentProject.challenge}
              </p>
            </div>

            <div className="border-t border-neutral-100 pt-8">
              <h2 className="text-xs font-light tracking-widest text-neutral-400 uppercase mb-4">THE ARCHITECTURAL PROPOSAL</h2>
              <p className="text-sm font-light text-neutral-600 leading-relaxed tracking-wide mb-6">
                {currentProject.solution}
              </p>
            </div>

            <div className="border-t border-neutral-100 pt-8">
              <h2 className="text-xs font-light tracking-widest text-neutral-400 uppercase mb-4">TECHNICAL DEEP DIVE</h2>
              <div className="text-sm font-light text-neutral-600 leading-relaxed tracking-wide whitespace-pre-line bg-neutral-50 p-6 md:p-8 border border-neutral-200 font-sans">
                {currentProject.contentMarkdown}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
