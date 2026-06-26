import React from 'react';
import { ArrowLeft, Clock, Calendar, ChevronRight, Hash, User } from 'lucide-react';
import { useData } from '../context/DataContext';
import { MOHSIN_BIO } from '../data';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';

interface BlogViewProps {
  currentHash: string;
}

export default function BlogView({ currentHash }: BlogViewProps) {
  const { blogs } = useData();

  // Parse blog essay slug if any
  const isPost = currentHash.startsWith('#/blog/');
  const currentSlug = isPost ? currentHash.replace('#/blog/', '') : '';
  const activePost = blogs.find(b => b.slug === currentSlug);


  // Fallback if detail path is active but post is not found
  if (isPost && !activePost) {
    return (
      <DefaultPageLayout>
        <Container className="items-center justify-center py-20 text-center">
          <h2 className="text-xl font-light uppercase mb-4">ESSAY NOT FOUND</h2>
          <p className="text-sm font-light text-neutral-500 mb-8">The requested essay slug does not exist on this channel.</p>
          <a href="#/blog" className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold tracking-wider uppercase">
            Back to Blog
          </a>
        </Container>
      </DefaultPageLayout>
    );
  }

  // Render individual Blog Essay detail reader
  if (activePost) {
    return (
      <DefaultPageLayout>
        <Container className="max-w-3xl">
          {/* Go back trigger button */}
          <div>
            <a
              href="#/blog"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors uppercase"
              id="back-to-essays"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO ESSAYS WRITEUP
            </a>
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

  // Render essays directory view list
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
                  <a href={`#/blog/${essay.slug}`}>{essay.title.toUpperCase()}</a>
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
                <a
                  href={`#/blog/${essay.slug}`}
                  className="text-xs font-bold tracking-wider text-neutral-950 hover:text-neutral-600 flex items-center gap-1 uppercase"
                >
                  READ WRITEUP <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </ReusableCard>
          ))}
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
