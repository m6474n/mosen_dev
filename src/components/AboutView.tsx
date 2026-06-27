'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle2, Award, ArrowUpRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import { MOHSIN_BIO, SKILLSET, MILESTONES } from '../data';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';

const InteractiveWorldMap = dynamic(() => import('./InteractiveWorldMap'), { ssr: false });

export default function AboutView() {
  const skillset = SKILLSET;
  const milestones = MILESTONES;

  return (
    <DefaultPageLayout>
      {/* ─── ABOUT HEADER ─── */}
      <section className="border-b border-neutral-100 pb-12">
        <Container>
          <DynamicPageHeader
            badge="BIOGRAPHY"
            title="ABOUT MUHAMMAD MOHSIN"
            subtitle="I am a product engineer, modern designer, and automated workflow builder based in Gujrat, Pakistan. I operate at the intersection of aesthetic design, solid development, and continuous background pipelines."
            hasBorder={false}
          />
        </Container>
      </section>

      {/* ─── STORY & VALUES ─── */}
      <section className="py-8">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-neutral-900 uppercase">
              THE PHILOSOPHY BEHIND THE SYSTEM
            </h2>
            <p className="text-xs font-light text-neutral-500 leading-relaxed tracking-wide">
              Traditional development processes are broken. Separate designers, developers, and system administrators often argue over detail transitions, resulting in slower execution periods and bloated budgets.
            </p>
            <p className="text-xs font-light text-neutral-500 leading-relaxed tracking-wide">
              I believe in unified responsibility. By owning the visual layout, the server code, and the automation schedule simultaneously, duplication errors are eliminated entirely. What you approve as an interface mockup is precisely what runs in production.
            </p>
            <p className="text-xs font-light text-neutral-500 leading-relaxed tracking-wide">
              My engineering works are focused on business impact. Aesthetics exist to guide attention, and code exists to process actions safely. Every automation, script, or layout list is optimized for real-world reliability.
            </p>
          </div>

          <ReusableCard hoverable={false} variant="muted" className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <ShieldCheck className="w-5 h-5 text-neutral-900" />
              <h4 className="text-xs font-light tracking-wider text-neutral-950 uppercase">ABSOLUTE HONESTY</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">If a resource scale or script doesn’t make financial or operational sense, I will say so immediately. Pure, objective focus.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Zap className="w-5 h-5 text-neutral-900" />
              <h4 className="text-xs font-light tracking-wider text-neutral-950 uppercase">SPEED & PACING</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">Typical scopes ship in 1 to 4 weeks. I emphasize early functional rollouts so you can iterate on real telemetry data.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Layers className="w-5 h-5 text-neutral-900" />
              <h4 className="text-xs font-light tracking-wider text-neutral-950 uppercase">COMPREHENSIVE</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">Code quality and visual beauty must work side by side. I translate Figma configurations into pixel-perfect components.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Award className="w-5 h-5 text-neutral-900" />
              <h4 className="text-xs font-light tracking-wider text-neutral-950 uppercase">AUDIT-READY</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">All scripts, functions, and workflows are fully documented, with explicit logs, so another engineer can easily maintain them.</p>
            </div>
          </ReusableCard>
        </Container>
      </section>

      {/* ─── ACHIEVEMENTS / TIMELINE ─── */}
      <section className="py-8 md:py-12 bg-neutral-50 border-y border-neutral-100">
        <Container>
          <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-neutral-950 mb-12 uppercase">
            CHRONOLOGICAL MILESTONES
          </h2>
          <div className="flex flex-col">
            {milestones.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-12 py-8 border-b border-neutral-200 last:border-0">
                <span className="text-xs font-bold text-neutral-400 font-mono tracking-wider">{item.year}</span>
                <div>
                  <h3 className="text-sm font-light text-neutral-950 tracking-wide mb-2 uppercase">{item.title}</h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-2xl">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── DETAILED SKILLS & TOOLKIT ─── */}
      <section className="py-8 md:py-12 bg-white">
        <Container>
          <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-neutral-950 mb-12 uppercase">
            TECHNICAL TOOLKIT & STACKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillset.map((skill, idx) => (
              <ReusableCard key={idx} hoverable={true} className="p-6 md:p-8 flex flex-col justify-start">
                <h4 className="text-xs font-light tracking-wider text-neutral-900 mb-4 border-b border-neutral-100 pb-3 uppercase">
                  {skill.category}
                </h4>
                <ul className="flex flex-col gap-2.5 list-none">
                  {skill.items.map((item, id) => (
                    <li key={id} className="text-xs font-light text-neutral-500 flex items-center gap-2">
                      <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ReusableCard>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── LOCATION MAP SIMULATOR / WORKING RADIUS ─── */}
      <section className="py-12 md:py-16 bg-neutral-950 text-white border-t border-neutral-900">
        <Container>
          <div className="flex flex-col gap-12">
            {/* Top Info Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase block mb-3">GEOGRAPHY & CORE TERMS</span>
                <h2 className="font-sans font-light text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mb-5 uppercase">
                  Based in Pakistan. Operating Internationally.
                </h2>
                <p className="text-xs font-light text-neutral-400 leading-relaxed max-w-3xl">
                  Most client engagements are conducted entirely remote. We align schedules across European, Middle Eastern, and North American time zones seamlessly. Working hours are coordinated through async-first dashboards, task triggers, and weekly progress briefings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 bg-neutral-900 p-6 border border-neutral-800 w-full">
                <div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1 font-mono">LOCAL TIMEZONE</div>
                  <div className="text-xs font-light text-neutral-200 font-mono uppercase">PAKISTAN PST (UTC+5)</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1 font-mono">PREFERRED METHODS</div>
                  <div className="text-xs font-light text-neutral-200 font-mono uppercase">SLACK / EMAIL / Google Meet</div>
                </div>
              </div>
            </div>

            {/* Expansive Map Column */}
            <div className="w-full">
              <InteractiveWorldMap />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── COLLABORATION MANIFESTO / OPERATIONAL STANDARDS ─── */}
      <section id="collaboration-manifesto" className="py-16 md:py-24 bg-white border-t border-neutral-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse"></span>
                ENGAGEMENT CONTRACT
              </span>
              <h2 className="font-sans font-light text-2xl md:text-3xl lg:text-4xl tracking-tight text-neutral-950 uppercase leading-none">
                THE COLLABORATION PROTOCOLS
              </h2>
            </div>
            <div className="lg:col-span-2">
              <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-2xl mt-0.5">
                Working with a single specialized engineer is radically different than hiring a bloated agency. By removing managers, visual templates, and translation layers, we establish a high-trust, low-overhead environment designed for speed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-none overflow-hidden">
            {/* Protocol 1 */}
            <div id="manifesto-card-1" className="bg-white p-8 md:p-10 flex flex-col justify-between hover:bg-neutral-50/50 transition duration-300 group">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-300 font-mono">01 / FEEDBACK</span>
                  <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center bg-neutral-50 text-neutral-500 group-hover:border-neutral-900 group-hover:text-neutral-950 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold tracking-wider text-neutral-950 uppercase font-mono">ASYNC-FIRST STATUS LOOPS</h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">
                    No hour-long, directionless sync calls. I write daily visual summaries and update active code previews on progress markers, preserving your time.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>STATUS: TRANSPARENT</span>
                <span>METRIC: 100% VISIBILITY</span>
              </div>
            </div>

            {/* Protocol 2 */}
            <div id="manifesto-card-2" className="bg-white p-8 md:p-10 flex flex-col justify-between hover:bg-neutral-50/50 transition duration-300 group">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-300 font-mono">02 / CODE QUALITY</span>
                  <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center bg-neutral-50 text-neutral-500 group-hover:border-neutral-900 group-hover:text-neutral-950 transition-colors">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold tracking-wider text-neutral-950 uppercase font-mono">CODE IS THE CANVAS</h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">
                    Interactive flows are authored directly in clean production components, not just static PNG screens. What you inspect and audit is physically real.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>REDUCIBILITY: NO SLOP</span>
                <span>TESTS: LINT PASSED</span>
              </div>
            </div>

            {/* Protocol 3 */}
            <div id="manifesto-card-3" className="bg-white p-8 md:p-10 flex flex-col justify-between hover:bg-neutral-50/50 transition duration-300 group">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-300 font-mono">03 / OWNERSHIP</span>
                  <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center bg-neutral-50 text-neutral-500 group-hover:border-neutral-900 group-hover:text-neutral-950 transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold tracking-wider text-neutral-950 uppercase font-mono">ABSOLUTE INHERITABILITY</h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">
                    Every database collection, cloud automation, and container config is packaged with clear operational rules. Another engineer can take custody instantly.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>ASSET RIGHTS: 100% CUSTODY</span>
                <span>DOCS: DIRECT LINK</span>
              </div>
            </div>
          </div>

          <div id="manifesto-trust-indicator" className="mt-8 bg-neutral-50 border border-neutral-100 p-6 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold tracking-wider text-neutral-400 font-mono uppercase font-semibold">GUARANTEED ASSURANCE</span>
              <p className="text-xs font-light text-neutral-600">
                Every project is fully vetted for performance, SEO standards, and viewport compatibility before the files are handed over.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 select-none">
              <div className="w-2.5 h-2.5 bg-neutral-950 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-neutral-900 font-mono uppercase">LATEST REVISION ACTIVE</span>
            </div>
          </div>
        </Container>
      </section>
    </DefaultPageLayout>
  );
}
