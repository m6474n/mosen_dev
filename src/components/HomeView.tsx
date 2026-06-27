'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ArrowUpRight, Cpu, TrendingUp, Code, CheckCircle, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { stripHtml } from '../lib/richText';
import { MOHSIN_BIO, PROCESS_STEPS, TESTIMONIALS } from '../data';
import { Container } from './DefaultPageLayout';
import ReusableCard from './ReusableCard';
import Button from './Button';

function GsapCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const numericPart = parseInt(value, 10);
  const suffix = value.replace(String(numericPart), '');

  useEffect(() => {
    if (isNaN(numericPart)) {
      setDisplayValue(value);
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericPart,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => {
        setDisplayValue(Math.floor(obj.val) + suffix);
      }
    });
  }, [numericPart, suffix, value]);

  return <span>{displayValue}</span>;
}

export default function HomeView() {
  const { services, caseStudies } = useData();
  const router = useRouter();
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. GSAP Text Letter reveal
    if (heroTitleRef.current) {
      const chars = heroTitleRef.current.querySelectorAll('.hero-letter');
      gsap.fromTo(chars,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: 'power4.out',
          delay: 0.1
        }
      );
    }

    // 2. GSAP subtitle, buttons and stats reveal
    const tl = gsap.timeline({ delay: 0.4 });
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (buttonsRef.current) {
      tl.fromTo(buttonsRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
    }
    if (statsRef.current) {
      tl.fromTo(statsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
      );
    }
  }, []);

  return (
    <div className="w-full flex flex-col pt-16 bg-white overflow-hidden">
      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="py-12 md:py-16 flex items-center bg-white border-b border-neutral-100">
        <Container className="items-center text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">DESIGN</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">ENGINEER</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">AUTOMATE</span>
          </div>

          <h1 ref={heroTitleRef} className="font-sans font-black text-7xl md:text-[180px] lg:text-[230px] tracking-tight text-neutral-950 mb-8 uppercase leading-[0.85] select-none flex flex-wrap justify-center overflow-hidden">
            {MOHSIN_BIO.displayName.toUpperCase().split('').map((char, idx) => (
              <span key={idx} className="hero-letter inline-block" style={{ display: 'inline-block', opacity: 0 }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <p ref={subtitleRef} style={{ opacity: 0 }} className="text-sm md:text-base font-light text-neutral-500 max-w-[620px] leading-relaxed mb-10 tracking-wide mx-auto">
            I design and engineer systems that turn attention into revenue — combining precise UI, production code, and automated pipelines into one end-to-end product. No handoff gaps, no lost context.
          </p>

          <div ref={buttonsRef} style={{ opacity: 0 }} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 w-full">
            <Button
              onClick={() => router.push('/contact')}
              variant="primary"
              id="hero-cta-btn"
              className="w-full sm:w-auto"
            >
              BOOK A DISCOVERY CALL
            </Button>
            <Link
              href="/case-studies"
              className="text-xs font-bold tracking-wider text-neutral-950 hover:text-neutral-600 transition-colors border-b-2 border-neutral-950 pb-1 flex items-center gap-1.5 uppercase"
              id="hero-works-btn"
            >
              VIEW CASE STUDIES
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Core Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-12 border-t border-neutral-100 w-full max-w-4xl mx-auto">
            <div className="text-center" style={{ opacity: 0 }}>
              <div className="font-sans font-extralight text-4xl md:text-5xl text-neutral-900 tracking-tight mb-2">
                <GsapCounter value={MOHSIN_BIO.experienceYears} />
              </div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                YEARS OF EXPERIENCE
              </div>
            </div>
            <div className="text-center" style={{ opacity: 0 }}>
              <div className="font-sans font-extralight text-4xl md:text-5xl text-neutral-900 tracking-tight mb-2">
                <GsapCounter value={MOHSIN_BIO.projectsDelivered} />
              </div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                PROJECTS DELIVERED
              </div>
            </div>
            <div className="text-center" style={{ opacity: 0 }}>
              <div className="font-sans font-extralight text-4xl md:text-5xl text-neutral-900 tracking-tight mb-2">
                <GsapCounter value={MOHSIN_BIO.coreDisciplinesCount} />
              </div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                CORE DISCIPLINES
              </div>
            </div>
            <div className="text-center" style={{ opacity: 0 }}>
              <div className="font-sans font-extralight text-4xl md:text-5xl text-neutral-900 tracking-tight mb-2">
                <GsapCounter value="1" />
              </div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                PERSON. FULL STACK.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── ABOUT / METHODOLOGY OVERVIEW ─── */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        id="about-intro"
        className="py-12 md:py-16 bg-neutral-50/50 border-b border-neutral-100"
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6 text-neutral-400">
                <span className="w-6 h-[1px] bg-neutral-300"></span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase">ABOUT ME</span>
              </div>
              <h2 className="font-sans font-light text-3xl md:text-5xl leading-tight tracking-tight text-neutral-900 mb-8 uppercase">
                ONE PERSON.<br />THREE DISCIPLINES.<br />ZERO HANDOFFS.
              </h2>
              <p className="text-sm font-light text-neutral-600 leading-relaxed mb-6 tracking-wide">
                Most designers can't ship production code. Most developers can't craft layouts. Most automation builders can't do either. <strong className="text-neutral-950 font-medium">Mosen sits directly at the intersection of all three.</strong>
              </p>
              <p className="text-sm font-light text-neutral-600 leading-relaxed mb-8 tracking-wide">
                That means you get a single product partner who takes a business problem from architectural design to deployed, automated system — without translation loss between roles, without missed context, and without coordinating three agencies who have never met.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-950 hover:text-neutral-600 transition-colors border-b-2 border-neutral-950 pb-1 uppercase"
                id="about-learn-more"
              >
                LEARN MORE ABOUT MY BACKGROUND
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ReusableCard hoverable={false} variant="white" className="p-8 md:p-12 gap-6 flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-2">THE ADVANTAGES</span>
              <div className="flex gap-4 items-start pb-6 border-b border-neutral-100">
                <span className="text-xs font-bold text-neutral-400 pt-1">01</span>
                <div>
                  <h4 className="text-sm font-light tracking-wide text-neutral-950 mb-1 uppercase">PRODUCT ENGINEER</h4>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">Full ownership from raw concept to deployed system. We build to ship, not file.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6 border-b border-neutral-100">
                <span className="text-xs font-bold text-neutral-400 pt-1">02</span>
                <div>
                  <h4 className="text-sm font-light tracking-wide text-neutral-950 mb-1 uppercase">DESIGN-LED DEVELOPMENT</h4>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">Every UI element is crafted with intentional alignment and gorgeous, crisp spacing.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-xs font-bold text-neutral-400 pt-1">03</span>
                <div>
                  <h4 className="text-sm font-light tracking-wide text-neutral-950 mb-1 uppercase">AUTOMATION-FIRST WORKFLOW</h4>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">Repetitive internal administrative workflows are problems to be solved with scripts.</p>
                </div>
              </div>
            </ReusableCard>
          </div>
        </Container>
      </motion.section>

      {/* ─── SERVICES GRID OVERVIEW ─── */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        id="services-intro"
        className="py-12 md:py-16 bg-neutral-950 text-white border-b border-neutral-900"
      >
        <Container>
          <div className="flex items-center gap-3 mb-6 text-neutral-500">
            <span className="w-6 h-[1px] bg-neutral-700"></span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase">SERVICES</span>
          </div>
          <h2 className="font-sans font-light text-3xl md:text-5xl leading-none tracking-tight text-white mb-16 uppercase max-w-xl">
            THREE OFFERINGS.<br />ONE INTEGRATED SYSTEM.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 p-px">
            {services.map((srv) => (
              <div key={srv.id} className="bg-neutral-950 p-8 md:p-10 hover:bg-neutral-900/40 transition duration-300 flex flex-col">
                <span className="text-xs font-bold text-neutral-600 mb-8">{srv.num}</span>
                <h3 className="text-lg font-light text-white mb-4 uppercase tracking-wide">{srv.title.toUpperCase()}</h3>
                <p className="text-xs font-light text-neutral-400 leading-relaxed mb-8 flex-grow">
                  {stripHtml(srv.description)}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-white tracking-widest uppercase transition-colors"
                >
                  EXPLORE {srv.title.toUpperCase()} <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* ─── SELECTED WORK CASE STUDIES LIST ─── */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        id="work-intro"
        className="py-12 md:py-16 bg-white border-b border-neutral-100"
      >
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6 text-neutral-400">
                <span className="w-6 h-[1px] bg-neutral-300"></span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase">SELECTED WORK</span>
              </div>
              <h2 className="font-sans font-light text-3xl md:text-5xl leading-tight tracking-tight text-neutral-950 uppercase">
                PROJECTS THAT<br />MOVED NUMBERS.
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="text-xs font-bold tracking-wider text-neutral-950 hover:text-neutral-600 transition-colors border-b-2 border-neutral-950 pb-1 uppercase"
              id="all-work-link"
            >
              ALL COMPREHENSIVE CASE STUDIES
            </Link>
          </div>

          <div className="flex flex-col">
            {caseStudies.map((project, index) => (
              <Link
                href={`/case-studies/${project.id}`}
                key={project.id}
                className="group grid grid-cols-1 md:grid-cols-[60px_1.2fr_1.5fr_1fr] gap-4 md:gap-6 items-start py-10 border-b border-neutral-100 hover:bg-neutral-50 px-4 -mx-4 transition-all"
                id={`work-item-${project.id}`}
              >
                <div className="text-[11px] font-bold text-neutral-400 group-hover:text-neutral-950 transition-colors pt-1">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-base font-light text-neutral-950 tracking-tight mb-2 group-hover:underline uppercase decoration-neutral-400">
                    {project.title.toUpperCase()}
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono tracking-wider">{project.industry.toUpperCase()}</span>
                </div>
                <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-md">
                  {stripHtml(project.summary)}
                </p>
                <div className="md:text-right flex flex-col md:items-end">
                  <div className="text-2xl md:text-3xl font-sans font-extralight text-neutral-950 tracking-tight line-height-[1] mb-1">
                    {project.results[0].value}
                  </div>
                  <div className="text-[10px] font-semibold text-neutral-400 tracking-widest uppercase">
                    {project.results[0].label.toUpperCase()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* ─── PROCESS STEPS ─── */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        id="process-intro"
        className="py-12 md:py-16 bg-neutral-50/50 border-b border-neutral-100"
      >
        <Container>
          <div className="flex items-center gap-3 mb-6 text-neutral-400">
            <span className="w-6 h-[1px] bg-neutral-300"></span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase">HOW IT WORKS</span>
          </div>
          <h2 className="font-sans font-light text-3xl md:text-5xl leading-tight tracking-tight text-neutral-950 mb-16 uppercase max-w-md">
            A PROCESS THAT<br />REMOVES THE RISK.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-neutral-200 p-px">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="bg-white p-6 md:p-8 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-neutral-400 tracking-wider mb-6">{step.num}</span>
                <div>
                  <h4 className="text-xs font-light tracking-wider text-neutral-900 mb-2 uppercase">{step.title}</h4>
                  <p className="text-[11px] font-light text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* ─── TESTIMONIALS ─── */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        id="testimonials-intro"
        className="py-12 md:py-20 bg-white border-b border-neutral-100 overflow-hidden"
      >
        <Container>
          <div className="flex items-center gap-3 mb-6 text-neutral-400">
            <span className="w-6 h-[1px] bg-neutral-300"></span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase">TESTIMONIALS</span>
          </div>
          <h2 className="font-sans font-light text-3xl md:text-5xl leading-tight tracking-tight text-neutral-950 mb-12 uppercase">
            WHAT CLIENTS SAY.
          </h2>
        </Container>

        {/* Infinite Slider Outer Wrapper */}
        <div className="relative w-full overflow-hidden py-2 bg-neutral-50/20 border-t border-b border-neutral-100/60">
          {/* Edge gradient overlays for smooth mask fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 32,
                ease: "linear",
              },
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 md:p-10 border border-neutral-150 hover:border-neutral-350 hover:shadow-sm transition-all duration-300 rounded-none flex flex-col justify-between w-[280px] md:w-[380px] shrink-0 h-[210px] md:h-[240px] mx-3 select-none text-left"
              >
                <p className="text-xs md:text-[13px] font-light text-neutral-800 italic leading-relaxed mb-6 whitespace-normal">
                  {t.quote}
                </p>
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-950 tracking-wider mb-1 uppercase font-mono">{t.author}</h4>
                  <span className="text-[10px] font-light text-neutral-450 font-mono block">{t.meta}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ─── ACTION CALL CTA ─── */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        id="final-cta"
        className="py-16 md:py-20 bg-neutral-50/50"
      >
        <Container className="items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-neutral-400">
            <span className="w-10 h-[1px] bg-neutral-300"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase">LET'S BUILD</span>
            <span className="w-10 h-[1px] bg-neutral-300"></span>
          </div>

          <h2 className="font-sans font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight text-neutral-950 mb-6 uppercase">
            HAVE A PROJECT IN MIND?
          </h2>

          <p className="text-sm font-light text-neutral-500 leading-relaxed max-w-md mb-10 tracking-wide mx-auto font-sans">
            Tell me what you're building. I'll analyze it honestly and let you know if we're a fit, and exactly how I'd approach it. No pitch, no obligations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button
              onClick={() => router.push('/contact')}
              variant="primary"
              id="cta-schedule-call"
              className="w-full sm:w-auto px-8"
            >
              SCHEDULE A CALL
            </Button>
            <Button
              onClick={() => router.push('/contact')}
              variant="secondary"
              id="cta-project"
              className="w-full sm:w-auto px-8"
            >
              START A PROJECT
            </Button>
          </div>

          <span className="text-[11px] text-neutral-400 tracking-wide mt-12 font-mono">
            {MOHSIN_BIO.email} • BASED IN PAKISTAN • AVAILABLE GLOBALLY
          </span>
        </Container>
      </motion.section>
    </div>
  );
}
