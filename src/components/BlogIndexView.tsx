'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';

export default function BlogIndexView() {
  const { blogs } = useData();

  return (
    <DefaultPageLayout>
      <Container>
        <DynamicPageHeader
          badge="WRITEUPS"
          title="THOUGHTS & ESSAYS"
          subtitle="Explorations into automation architecture paradigms, digital layouts engineering, and the developer-designer methodology behind systems."
          hasBorder={true}
        />

        {/* Directory cards split list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((essay) => (
            <ReusableCard
              key={essay.slug}
              hoverable={true}
              variant="muted"
              className="hover:bg-white transition-all flex flex-col justify-between"
              id={`essay-card-${essay.slug}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold tracking-widest uppercase font-mono mb-6">
                  <span>{essay.publishedAt.toUpperCase()}</span>
                  <span>{essay.readTime.toUpperCase()}</span>
                </div>

                <h3 className="text-lg font-light text-neutral-950 mb-4 uppercase tracking-tight hover:underline">
                  <Link href={`/blog/${essay.slug}`}>{essay.title.toUpperCase()}</Link>
                </h3>

                <p className="text-xs font-light text-neutral-500 leading-relaxed mb-8">
                  {essay.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex gap-1">
                  {essay.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] font-mono font-bold text-neutral-400 uppercase">
                      #{t.toUpperCase()}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${essay.slug}`}
                  className="text-xs font-bold tracking-wider text-neutral-950 hover:text-neutral-600 flex items-center gap-1 uppercase"
                >
                  READ WRITEUP <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </ReusableCard>
          ))}
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
