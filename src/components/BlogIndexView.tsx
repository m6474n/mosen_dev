'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import { stripHtml } from '../lib/richText';

export default function BlogIndexView() {
  const { blogs } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter posts by status = Published
  const publishedBlogs = blogs.filter(b => b.status === 'Published');

  // Extract all categories
  const allCategories = ['ALL', ...Array.from(new Set(
    publishedBlogs.flatMap(b => b.categories || [])
  ))];

  const filteredBlogs = selectedCategory === 'ALL'
    ? publishedBlogs
    : publishedBlogs.filter(b => (b.categories || []).includes(selectedCategory));

  return (
    <DefaultPageLayout>
      <Container>
        <DynamicPageHeader
          badge="WRITEUPS"
          title="THOUGHTS & ESSAYS"
          subtitle="Explorations into automation architecture paradigms, digital layouts engineering, and the developer-designer methodology behind systems."
          hasBorder={true}
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-neutral-200 pb-6">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 rounded-none cursor-pointer border ${
                selectedCategory === category
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.map((essay) => (
            <ReusableCard
              key={essay.slug}
              hoverable={true}
              variant="muted"
              className="hover:bg-white transition-all flex flex-col justify-between p-6 border border-neutral-200"
              id={`essay-card-${essay.slug}`}
            >
              <div>
                {essay.coverImage && (
                  <div className="w-full aspect-video overflow-hidden border border-neutral-100 bg-neutral-50 mb-6">
                    <img 
                      src={essay.coverImage} 
                      alt={essay.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-bold tracking-widest uppercase font-mono mb-4">
                  <span>{essay.publishedAt.toUpperCase()}</span>
                  <span>{essay.readTime.toUpperCase()}</span>
                </div>

                <h3 className="text-base font-light text-neutral-950 mb-3 uppercase tracking-tight hover:underline">
                  <Link href={`/blog/${essay.slug}`}>{essay.title.toUpperCase()}</Link>
                </h3>

                <p className="text-xs font-light text-neutral-500 leading-relaxed mb-6">
                  {stripHtml(essay.excerpt)}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex gap-2">
                  {(essay.categories || []).slice(0, 1).map((cat, idx) => (
                    <span key={idx} className="text-[9px] font-mono font-bold bg-neutral-950 text-white px-2 py-0.5 uppercase">
                      {cat.toUpperCase()}
                    </span>
                  ))}
                  {(essay.tags || []).slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] font-mono font-bold text-neutral-400 uppercase pt-0.5">
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
