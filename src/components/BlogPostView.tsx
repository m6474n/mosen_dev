'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';

interface BlogPostViewProps {
  slug: string;
}

export default function BlogPostView({ slug }: BlogPostViewProps) {
  const { blogs, loading } = useData();
  const activePost = blogs.find((b) => b.slug === slug);

  // Show loader while Firebase data is still being fetched
  if (loading) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-32 text-center">
          <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Loading essay...</p>
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
          <p className="text-sm font-light text-neutral-500 mb-8">The requested essay slug does not exist on this channel.</p>
          <Link href="/blog" className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase">
            Back to Blog
          </Link>
        </Container>
      </DefaultPageLayout>
    );
  }

  return (
    <DefaultPageLayout>
      <Container className="max-w-3xl">
        {/* Go back trigger button */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors uppercase"
            id="back-to-essays"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO ESSAYS WRITEUP
          </Link>
        </div>

        {/* Time and tags line */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-neutral-400 font-bold font-mono uppercase tracking-widest">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activePost.publishedAt.toUpperCase()}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activePost.readTime.toUpperCase()}</span>
        </div>

        {/* Core Essay display Heading */}
        <h1 className="font-sans font-black text-3xl md:text-5xl tracking-tight text-neutral-950 uppercase leading-tight select-none">
          {activePost.title.toUpperCase()}
        </h1>

        {/* Related items list tags */}
        <div className="flex flex-wrap gap-2 pb-8 border-b border-neutral-100">
          {activePost.tags.map((tag, idx) => (
            <span key={idx} className="text-[9px] font-bold text-neutral-950 px-2.5 py-1 bg-neutral-100 uppercase tracking-wider">
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* The main core text body */}
        <div
          className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm font-light font-sans tracking-wide space-y-6"
          id="essay-content"
          dangerouslySetInnerHTML={{ __html: activePost.contentHtml }}
        />

        {/* Author footer segment */}
        <div className="pt-8 border-t border-neutral-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-950 flex items-center justify-center text-white font-mono text-sm font-bold">
            MM
          </div>
          <div>
            <h4 className="text-xs font-light text-neutral-900 uppercase">MUHAMMAD MOHSIN</h4>
            <span className="text-[10px] font-light text-neutral-400 block mt-0.5">PRODUCT ENGINEER & COMPOSER</span>
          </div>
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
