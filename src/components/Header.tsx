'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Bot,
  Workflow,
  Cpu,
  Smartphone,
  AppWindow,
  Layers,
  LayoutGrid,
  Terminal,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';

interface MegaItem {
  name: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

interface MegaCategory {
  title: string;
  badge: string;
  items: MegaItem[];
}

const megaCategories: MegaCategory[] = [
  {
    title: 'AUTOMATION & AGENTS',
    badge: 'SCRIPTS',
    items: [
      {
        name: 'ClipForge AI Clipper',
        desc: 'Offline local whisper transcription & reframing',
        href: '/resources',
        icon: Bot,
        tag: 'AI',
      },
      {
        name: 'Kroma Browser Engine',
        desc: 'Concurrent Chrome profile manager & scheduler',
        href: '/resources',
        icon: Workflow,
        tag: 'AUTO',
      },
      {
        name: 'Workflow Systems',
        desc: 'End-to-end business automation design',
        href: '/services',
        icon: Cpu,
      },
    ],
  },
  {
    title: 'APPS & SYSTEMS',
    badge: 'PRODUCTION',
    items: [
      {
        name: 'Appex Trading Suite',
        desc: 'Offline-first B2B mobile trading terminal',
        href: '/projects/appex-global-trading',
        icon: Smartphone,
      },
      {
        name: 'Weighbridge ERP',
        desc: 'C++ hardware linker, RTSP feeds & desktop',
        href: '/projects/weighbridge-management-system',
        icon: AppWindow,
      },
      {
        name: 'CRM Kanban Module',
        desc: 'Realtime multiplayer Firestore pipeline',
        href: '/projects/crm-leads-module',
        icon: Layers,
      },
    ],
  },
  {
    title: 'TOOLS & DOWNLOADS',
    badge: 'LIBRARY',
    items: [
      {
        name: 'YouTube Stream Downloader',
        desc: 'yt-dlp 4K/1080p merging & MP3 audio extractor',
        href: '/resources',
        icon: Terminal,
        tag: 'TOOL',
      },
      {
        name: 'All Open Resources',
        desc: 'Explore source code and README guides',
        href: '/resources',
        icon: LayoutGrid,
      },
    ],
  },
];

export default function Header() {
  const { resources } = useData();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 180);
  };

  const navLinks = [
    { label: 'ABOUT', href: '/about' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'RESOURCES', href: '/resources', isMega: true },
    { label: 'BLOG', href: '/blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/projects') {
      return pathname.startsWith('/projects');
    }
    if (href === '/resources') {
      return pathname.startsWith('/resources') || pathname.startsWith('/case-studies');
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      id="navbar"
      className="fixed top-3 sm:top-5 inset-x-0 mx-auto z-50 w-full px-4 sm:px-6 pointer-events-none transition-all duration-300"
    >
      <div className="pointer-events-auto mx-auto max-w-4xl relative">
        {/* Floating pill navigation container */}
        <div
          className={`rounded-full border transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[58px] sm:min-h-[64px] flex items-center justify-between ${
            scrolled
              ? 'bg-white/70 backdrop-blur-2xl backdrop-saturate-180 border-white/80 shadow-[0_12px_40px_0_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05] scale-[0.99]'
              : 'bg-white/50 backdrop-blur-xl backdrop-saturate-150 border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03]'
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="font-sans font-bold text-sm sm:text-base tracking-widest text-neutral-900 transition-opacity hover:opacity-80 pl-2 select-none"
            id="nav-logo"
          >
            MOSEN<span className="text-neutral-400">.</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/[0.04] backdrop-blur-sm p-1.5 rounded-full border border-neutral-200/50">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (link.isMega) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                      className={`relative px-5 py-2 text-xs font-semibold tracking-wider transition-colors uppercase rounded-full select-none inline-flex items-center gap-1.5 cursor-pointer ${
                        active || resourcesOpen
                          ? 'text-neutral-950 font-bold'
                          : 'text-neutral-500 hover:text-neutral-950'
                      }`}
                      id="link-resources"
                      aria-expanded={resourcesOpen}
                    >
                      {(active || resourcesOpen) && (
                        <motion.div
                          layoutId="floatingNavPill"
                          className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-full shadow-2xs border border-white/80"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                      <ChevronDown
                        className={`relative z-10 w-3 h-3 transition-transform duration-200 ${
                          resourcesOpen ? 'rotate-180 text-neutral-950' : 'text-neutral-400'
                        }`}
                      />
                    </button>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2 text-xs font-semibold tracking-wider transition-colors uppercase rounded-full select-none ${
                    active ? 'text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                  id={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {active && (
                    <motion.div
                      layoutId="floatingNavPill"
                      className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-full shadow-2xs border border-white/80"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={() => router.push('/contact')}
              className="rounded-full h-10 sm:h-11 px-5 sm:px-6 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
              id="cta-book-call"
            >
              BOOK A CALL
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
              className="rounded-full h-10 w-10 text-neutral-700 hover:text-neutral-950"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {resourcesOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-2rem)] max-w-4xl rounded-3xl border border-white/80 bg-white/85 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_24px_60px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] p-6 overflow-hidden pointer-events-auto"
            >
              <div className="grid grid-cols-3 gap-6">
                {/* Column 1: Live Real Resources from Database/Store */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                    <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
                      OPEN RESOURCES & SCRIPTS
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 font-bold tracking-wider">
                      {resources.length} ITEMS
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {resources.slice(0, 3).map((res) => (
                      <Link
                        key={res.id}
                        href="/resources"
                        onClick={() => setResourcesOpen(false)}
                        className="group flex items-start gap-3 p-2.5 rounded-2xl transition-all duration-200 hover:bg-neutral-900/[0.04] border border-transparent hover:border-neutral-200/60"
                      >
                        <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-700 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-200 mt-0.5">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-950 tracking-tight truncate">
                              {res.title}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 shrink-0">
                              {res.type}
                            </span>
                          </div>
                          <span className="text-[11px] font-light text-neutral-500 leading-snug line-clamp-1">
                            {res.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {resources.length === 0 && (
                      <span className="text-[11px] text-neutral-400 p-2 font-mono">No resources published.</span>
                    )}
                  </div>
                </div>

                {/* Column 2 & 3: Production Apps and Case Studies */}
                {megaCategories.slice(1).map((category) => (
                  <div key={category.title} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                      <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
                        {category.title}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 font-bold tracking-wider">
                        {category.badge}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setResourcesOpen(false)}
                            className="group flex items-start gap-3 p-2.5 rounded-2xl transition-all duration-200 hover:bg-neutral-900/[0.04] border border-transparent hover:border-neutral-200/60"
                          >
                            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-700 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-200 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-950 tracking-tight">
                                  {item.name}
                                </span>
                                {item.tag && (
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200">
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-light text-neutral-500 leading-snug line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom bar of Mega Menu */}
              <div className="mt-5 pt-4 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                  <span className="font-mono text-[11px] text-neutral-600">
                    Engineered to eliminate manual workflows and technical bottlenecks.
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/resources"
                    onClick={() => setResourcesOpen(false)}
                    className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-neutral-950 hover:text-neutral-600 transition-colors text-[11px]"
                  >
                    ALL RESOURCES
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto md:hidden mt-2 max-w-4xl mx-auto rounded-3xl border border-white/60 bg-white/75 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_16px_48px_0_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04] p-4 flex flex-col gap-3 overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              <ul className="flex flex-col gap-1 list-none p-0 m-0">
                {navLinks.map((link) => {
                  const active = isActive(link.href);

                  if (link.isMega) {
                    return (
                      <li key={link.href} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-colors uppercase cursor-pointer ${
                            active
                              ? 'bg-neutral-900/10 text-neutral-950 border border-white/60 backdrop-blur-sm'
                              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-900/[0.04]'
                          }`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              mobileResourcesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileResourcesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-3 pr-1 py-1 flex flex-col gap-1 overflow-hidden"
                            >
                              <Link
                                href="/resources"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-1.5 text-[11px] font-semibold text-neutral-900 uppercase hover:text-neutral-600"
                              >
                                → All Resources & Scripts
                              </Link>
                              <Link
                                href="/projects"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-1.5 text-[11px] font-semibold text-neutral-900 uppercase hover:text-neutral-600"
                              >
                                → Production Apps & Systems
                              </Link>
                              <Link
                                href="/services"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-1.5 text-[11px] font-semibold text-neutral-900 uppercase hover:text-neutral-600"
                              >
                                → Automation Services
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-colors uppercase ${
                          active
                            ? 'bg-neutral-900/10 text-neutral-950 border border-white/60 backdrop-blur-sm'
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-900/[0.04]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-2 border-t border-neutral-200/50">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/contact');
                  }}
                  className="w-full justify-center rounded-full h-11 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  BOOK A CALL
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
