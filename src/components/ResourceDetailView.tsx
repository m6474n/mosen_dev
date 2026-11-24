'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  Download,
  ExternalLink,
  Github,
  Copy,
  Check,
  Tag,
  Share2,
  Terminal,
  BookOpen,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { marked } from 'marked';
import { useData } from '@/context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';

interface ResourceDetailViewProps {
  slug: string;
}

export default function ResourceDetailView({ slug }: ResourceDetailViewProps) {
  const { resources, loading } = useData();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Scroll reading progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const resource = resources.find(
    (r) => r.id === slug || r.id.toLowerCase() === slug.toLowerCase()
  );

  // Render markdown to safe HTML using marked
  const renderedReadmeHtml = useMemo(() => {
    if (!resource) return '';
    const markdownSource = resource.content || resource.description || '';
    if (!markdownSource.trim()) return '<p>No README content provided for this resource.</p>';
    try {
      return marked.parse(markdownSource, {
        gfm: true,
        breaks: true,
      }) as string;
    } catch {
      return `<pre>${markdownSource}</pre>`;
    }
  }, [resource]);

  const handleCopyCode = () => {
    if (!resource?.codeBlock) return;
    navigator.clipboard.writeText(resource.codeBlock);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource?.title || 'Resource Documentation',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {
      // ignored
    }
  };

  // Loader
  if (loading) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-32 text-center">
          <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading documentation...
          </p>
        </Container>
      </DefaultPageLayout>
    );
  }

  // Not Found
  if (!resource) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-20 text-center">
          <h2 className="text-xl font-light uppercase mb-4">RESOURCE NOT FOUND</h2>
          <p className="text-sm font-light text-neutral-500 mb-8">
            The requested resource ID does not exist in the vault.
          </p>
          <Link
            href="/resources"
            className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-xs hover:bg-neutral-800 transition-colors"
          >
            Back to Resources
          </Link>
        </Container>
      </DefaultPageLayout>
    );
  }

  // Next resource finder
  const currentIndex = resources.findIndex((r) => r.id === resource.id);
  const nextResource =
    currentIndex >= 0 && currentIndex < resources.length - 1
      ? resources[currentIndex + 1]
      : resources[0] && resources[0].id !== resource.id
      ? resources[0]
      : null;

  return (
    <DefaultPageLayout>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neutral-950 z-50 origin-left"
        style={{ scaleX }}
      />

      <Container className="max-w-5xl flex flex-col pt-8 pb-24">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 mb-10"
        >
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-neutral-400 font-bold font-mono uppercase tracking-widest pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                <Tag className="w-3.5 h-3.5" /> {resource.type.toUpperCase()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-neutral-600">
                <Download className="w-3.5 h-3.5" /> {resource.downloadCount} DOWNLOADS
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                VERIFIED SOURCE
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 hover:border-neutral-950 text-[10px] font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-all cursor-pointer shadow-2xs"
            >
              {copiedShare ? (
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

          {/* Title & Action Links */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-[family-name:var(--font-inter-tight)] font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-neutral-950 uppercase leading-[1.05] select-none max-w-3xl">
              {resource.title}
            </h1>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-auto">
              {resource.liveUrl && (
                <a
                  href={resource.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-sm"
                  title="Open Live Preview"
                >
                  <span>LIVE DEMO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {resource.githubUrl && (
                <a
                  href={resource.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-neutral-950 text-neutral-950 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-2xs"
                  title="View on GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span>GITHUB</span>
                </a>
              )}
              {resource.fileUrl && (
                <a
                  href={resource.fileUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD ZIP</span>
                </a>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {resource.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono font-bold text-neutral-700 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors uppercase tracking-wider rounded-full border border-neutral-200/80"
              >
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Featured Image Stage (if available) */}
        {resource.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl mb-12 aspect-[16/9] flex items-center justify-center group"
          >
            {/* Ambient Lighting */}
            <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resource.imageUrl}
              alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Clone / Quick Setup Snippet Card */}
        {resource.codeBlock && (
          <div className="mb-12 rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 text-neutral-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
                  QUICK START / CLONE COMMAND
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-neutral-950 text-neutral-300 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-neutral-800"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY COMMAND</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs sm:text-[13px] leading-relaxed break-words whitespace-pre-wrap text-neutral-300 selection:bg-white selection:text-neutral-950">
              {resource.codeBlock.trim()}
            </pre>
          </div>
        )}

        {/* GitHub README Documentation Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-white border border-neutral-200/90 p-8 sm:p-12 shadow-xs mb-16 overflow-hidden"
        >
          {/* Top Stage Header */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-950">
              <BookOpen className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                README.md SPECIFICATION
              </span>
            </div>
            {resource.githubUrl && (
              <a
                href={resource.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-950 flex items-center gap-1"
              >
                <span>SOURCE ON GITHUB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Rendered HTML from Markdown */}
          <div
            className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm sm:text-base font-light font-sans tracking-wide space-y-6 [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-black [&_h1]:uppercase [&_h1]:tracking-tight [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-neutral-200 [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2 [&_pre]:bg-neutral-950 [&_pre]:text-neutral-200 [&_pre]:p-5 [&_pre]:rounded-2xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-xs [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-neutral-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-950 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-neutral-300 [&_th]:p-2.5 [&_th]:bg-neutral-100 [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2.5 [&_a]:text-neutral-950 [&_a]:underline [&_a]:font-medium"
            id="readme-content"
            dangerouslySetInnerHTML={{ __html: renderedReadmeHtml }}
          />

          {/* Author segment footer */}
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
              <span>INQUIRE INTEGRATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Next Resource Peek Card */}
        {nextResource && (
          <Link
            href={`/resources/${nextResource.id}`}
            className="group block p-8 rounded-3xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                  NEXT RESOURCE IN VAULT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-neutral-300 transition-colors max-w-xl">
                  {nextResource.title}
                </h3>
                <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 uppercase mt-2">
                  <span>{nextResource.type}</span>
                  <span>•</span>
                  <span>{nextResource.downloadCount} DOWNLOADS</span>
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

