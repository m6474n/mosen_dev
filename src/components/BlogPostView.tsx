'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';

interface BlogPostViewProps {
  slug: string;
}

export default function BlogPostView({ slug }: BlogPostViewProps) {
  const { blogs, loading } = useData();
  const [copied, setCopied] = useState(false);

  // Scroll progress spring animation for reading bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const activePost = blogs.find((b) => b.slug === slug);

  // Next essay peek finder
  const currentIndex = blogs.findIndex((b) => b.slug === slug);
  const nextPost =
    currentIndex >= 0 && currentIndex < blogs.length - 1
      ? blogs[currentIndex + 1]
      : blogs[0] && blogs[0].slug !== slug
      ? blogs[0]
      : null;

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: activePost?.title || 'Mosen Essay',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled or unsupported
    }
  };

  // Show loader while Firebase data is still being fetched
  if (loading) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-32 text-center">
          <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading essay...
          </p>
        </Container>
      </DefaultPageLayout>
    );
  }

  // Fallback if post is not found (only shown after loading completes)
  if (!activePost) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-20 text-center">
          <h2 className="text-xl font-light uppercase mb-4">ESSAY NOT FOUND</h2>
          <p className="text-sm font-light text-neutral-500 mb-8">
            The requested essay slug does not exist on this channel.
          </p>
          <Link
            href="/blog"
            className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-xs hover:bg-neutral-800 transition-colors"
          >
            Back to Blog
          </Link>
        </Container>
      </DefaultPageLayout>
    );
  }

  return (
    <DefaultPageLayout>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neutral-950 z-50 origin-left"
        style={{ scaleX }}
      />

      <Container className="max-w-4xl pt-8 pb-24">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 mb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-neutral-400 font-bold font-mono uppercase tracking-widest">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-neutral-600">
                <Calendar className="w-3.5 h-3.5" /> {activePost.publishedAt.toUpperCase()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-neutral-600">
                <Clock className="w-3.5 h-3.5" /> {activePost.readTime.toUpperCase()}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-neutral-900 font-bold">
                <BookOpen className="w-3 h-3" /> EDITORIAL ESSAY
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 hover:border-neutral-950 text-[10px] font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-all cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>LINK COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>SHARE</span>
                </>
              )}
            </button>
          </div>

          <h1 className="font-[family-name:var(--font-inter-tight)] font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-neutral-950 uppercase leading-[1.08] select-none">
            {activePost.title.toUpperCase()}
          </h1>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 pt-2">
            {activePost.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono font-bold text-neutral-700 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors uppercase tracking-wider rounded-full border border-neutral-200/80"
              >
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Article Container Card */}
        <motion.article
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-white border border-neutral-200/90 p-8 sm:p-12 shadow-xs mb-16"
        >
          <div
            className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm sm:text-base font-light font-sans tracking-wide space-y-6 ql-editor"
            id="essay-content"
            dangerouslySetInnerHTML={{ __html: activePost.contentHtml }}
          />

          {/* Author Card Footer inside article */}
          <div className="mt-14 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-neutral-50/60 -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-8 sm:p-10 rounded-b-3xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-950 flex items-center justify-center text-white font-mono text-sm font-black shadow-xs">
                MM
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-950 uppercase font-sans">
                  MUHAMMAD MOHSIN
                </h4>
                <span className="text-[10px] font-mono text-neutral-400 block mt-0.5 tracking-wider uppercase">
                  FOUNDER & FULLSTACK SYSTEM COMPOSER
                </span>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <span>DISCUSS ESSAY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.article>

        {/* Next Essay Peek Card */}
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group block p-8 rounded-3xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                  NEXT ESSAY WRITEUP
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-neutral-300 transition-colors max-w-xl">
                  {nextPost.title}
                </h3>
                <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 uppercase mt-2">
                  <span>{nextPost.publishedAt}</span>
                  <span>•</span>
                  <span>{nextPost.readTime}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-neutral-950 transition-all duration-300 flex items-center justify-center border border-white/20 shrink-0">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        )}
      </Container>
    </DefaultPageLayout>
  );
}
