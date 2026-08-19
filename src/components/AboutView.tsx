'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CheckCircle2, Award, ArrowUpRight, ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { MOHSIN_BIO, SKILLSET, MILESTONES } from '../data';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import Button from './Button';
import { stripHtml } from '../lib/richText';

const InteractiveWorldMap = dynamic(() => import('./InteractiveWorldMap'), { ssr: false });

export default function AboutView() {
  const { services, projects } = useData();
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
      <section className="py-12">
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

      {/* ─── SERVICES INTEGRATION SECTION ─── */}
      <section className="py-16 bg-neutral-950 text-white border-y border-neutral-900">
        <Container>
          <div className="flex items-center gap-3 mb-6 text-neutral-500">
            <span className="w-6 h-[1px] bg-neutral-700"></span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase">CORE SERVICES</span>
          </div>
          <h2 className="font-sans font-light text-2xl md:text-4xl tracking-tight text-white mb-12 uppercase">
            DESIGN, ENGINEERING & AUTOMATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 p-px">
            {services.slice(0, 3).map((srv) => (
              <div key={srv.id} className="bg-neutral-950 p-8 hover:bg-neutral-900/40 transition duration-300 flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-xs font-bold text-neutral-600 mb-6 block">{srv.num}</span>
                  <h3 className="text-base font-light text-white mb-4 uppercase tracking-wide">{srv.title.toUpperCase()}</h3>
                  <p className="text-xs font-light text-neutral-400 leading-relaxed">
                    {stripHtml(srv.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── FEATURED PROJECTS SECTION ─── */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <Container>
          <div className="flex items-center gap-3 mb-6 text-neutral-400">
            <span className="w-6 h-[1px] bg-neutral-300"></span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase">FEATURED WORK</span>
          </div>
          <h2 className="font-sans font-light text-2xl md:text-4xl tracking-tight text-neutral-950 mb-12 uppercase">
            SELECTED PRODUCT DEPLOYS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.filter(p => p.status === 'Published').slice(0, 3).map((project, idx) => (
              <ReusableCard key={project.id} hoverable={true} className="p-6 border-neutral-200 flex flex-col justify-between">
                <div>
                  {project.screenshotUrl && (
                    <div className="w-full aspect-video overflow-hidden border border-neutral-100 bg-neutral-50 mb-4">
                      <img src={project.screenshotUrl} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                    {project.projectType}
                  </span>
                  <h3 className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-tight text-neutral-950 uppercase mt-1">
                    {project.title}
                  </h3>
                  <div 
                    className="text-xs font-light text-neutral-500 leading-relaxed mt-2"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              </ReusableCard>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── TECHNICAL TOOLKIT & STACKS ─── */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-100">
        <Container>
          <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-neutral-950 mb-12 uppercase">
            TECHNICAL TOOLKIT & STACKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillset.map((skill, idx) => (
              <ReusableCard key={idx} hoverable={true} className="p-6 md:p-8 flex flex-col justify-start bg-white">
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

      {/* ─── LOCATION MAP & GEOGRAPHY ─── */}
      <section className="py-16 bg-neutral-950 text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
            <div className="lg:col-span-2">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase block mb-3">GEOGRAPHY & TIMING</span>
              <h2 className="font-sans font-light text-2xl md:text-4xl tracking-tight text-white mb-5 uppercase">
                Remote Collaboration. Globally Synchronized.
              </h2>
              <p className="text-xs font-light text-neutral-400 leading-relaxed max-w-3xl">
                Operating internationally from Pakistan. Engagements align smoothly across European, Middle Eastern, and North American business hours using async-first systems.
              </p>
            </div>
            <div className="bg-neutral-900 p-6 border border-neutral-800 w-full flex flex-col gap-4">
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1 font-mono">LOCAL TIMEZONE</div>
                <div className="text-xs font-light text-neutral-200 font-mono uppercase">PAKISTAN PST (UTC+5)</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1 font-mono">CHANNELS</div>
                <div className="text-xs font-light text-neutral-200 font-mono uppercase">SLACK / EMAIL / GOOGLE MEET</div>
              </div>
            </div>
          </div>
          <InteractiveWorldMap />
        </Container>
      </section>

      {/* ─── HIGH IMPACT CTA ─── */}
      <section className="py-24 bg-white border-t border-neutral-100 text-center">
        <Container className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">GET IN TOUCH</span>
          <h2 className="font-sans font-light text-4xl md:text-6xl tracking-tight text-neutral-950 uppercase leading-tight">
            Ready to optimize your workflow pipeline?
          </h2>
          <p className="text-sm font-light text-neutral-500 max-w-[600px] leading-relaxed">
            Let's design a custom layout, engineer a robust interface, or automate background APIs for your business. Book a discovery call today.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button variant="primary" className="flex items-center gap-2">
                BOOK A DISCOVERY CALL
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </DefaultPageLayout>
  );
}
