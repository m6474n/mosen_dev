'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Download, Copy, Check, Terminal, FileCode, Sliders, ExternalLink, Github, BookOpen, Code2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { stripHtml, stripMarkdown } from '../lib/richText';
import { Resource } from '../types';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import Button from './Button';

export default function ResourcesView() {
  const router = useRouter();
  const { resources } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<{ [key: string]: number }>({});
  const [cardViews, setCardViews] = useState<{ [key: string]: 'readme' | 'code' }>({});

  useEffect(() => {
    const initial: { [key: string]: number } = {};
    resources.forEach(res => {
      initial[res.id] = res.downloadCount;
    });
    setDownloads(initial);
  }, [resources]);

  const resourceTypes = React.useMemo(() => {
    const types = new Set<string>();
    resources.forEach(res => {
      if (res.type) {
        types.add(res.type.toUpperCase());
      }
    });
    return ['ALL', ...Array.from(types)];
  }, [resources]);

  // Copy code utility
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Simulate download count trigger
  const handleDownloadMetric = (id: string) => {
    setDownloads(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    
    // Simulate downloadable action feed message
    setNotification(`LOGGED ACCESS: Downloader fetched resource package for ${id} locally.`);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'ALL' || resource.type.toUpperCase() === selectedType;

    return matchesSearch && matchesType;
  });


  return (
    <DefaultPageLayout>
      <Container>
        {/* RESOURCE PANEL HEADER */}
        <DynamicPageHeader
          badge="RESOURCES"
          title="THE OPEN VAULT"
          subtitle="A repository of production-ready automations, scripts, configuration blueprints, and widgets to copy directly into your local workspaces."
          hasBorder={true}
        />

        {/* SEARCH AND FILTERS TOOLBAR */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center mb-4 bg-neutral-50 p-4 border border-neutral-200">
          {/* Search bar input tool */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="SEARCH UTILITIES, SCRIPTS, OR STACKS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-semibold tracking-wider text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-950 pl-10 pr-4 py-3 outline-hidden rounded-full"
              id="resource-search"
            />
          </div>

          {/* Filter options buttons rows */}
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 text-[10px] font-bold tracking-wider transition-all rounded-full uppercase cursor-pointer border ${
                  selectedType === type
                    ? 'bg-neutral-950 border-neutral-950 text-white'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* UTILITIES GRID */}
        {filteredResources.length === 0 ? (
          <div className="w-full text-center py-16 border border-dashed border-neutral-200 rounded-3xl bg-neutral-50/50">
            <span className="text-xs text-neutral-400 font-mono font-bold uppercase tracking-widest">NO RESOURCES MATCH YOUR PARAMETERS</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => router.push(`/resources/${resource.id}`)}
                className="group relative rounded-3xl border border-neutral-200/90 bg-white hover:border-neutral-950/40 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_1fr] cursor-pointer"
                id={`resource-${resource.id}`}
              >
                {/* Info & Details Column (2/3 width on desktop) */}
                <div className="p-7 sm:p-9 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-100 bg-white">
                  <div>
                    {/* Header badges */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="text-[9px] font-mono font-bold px-3 py-1 uppercase tracking-wider bg-neutral-100 text-neutral-800 rounded-full border border-neutral-200/80">
                        {resource.type.toUpperCase()}
                      </span>
                      {Boolean(resource.downloadCount) && (
                        <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5 font-semibold">
                          <Download className="w-3.5 h-3.5 text-neutral-500" /> {downloads[resource.id] || resource.downloadCount} USES
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight mb-4 uppercase font-[family-name:var(--font-inter-tight)] leading-tight group-hover:text-neutral-700 transition-colors">
                      {resource.title}
                    </h3>

                    {/* Runtime-Cleaned Markdown Description: formatted as continuous 3-4 line clamped text */}
                    <p className="text-xs sm:text-[13px] font-light text-neutral-600 leading-relaxed mb-6 line-clamp-4 selection:bg-neutral-900 selection:text-white font-sans">
                      {stripMarkdown(resource.description || resource.content)
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .join(' ')}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {resource.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-mono font-semibold text-neutral-500 px-2.5 py-0.5 bg-neutral-50 border border-neutral-200/60 rounded-md uppercase tracking-wide">
                          #{tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons / Links */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-neutral-100 mt-6"
                  >
                    <Link
                      href={`/resources/${resource.id}`}
                      className="py-2.5 px-5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 rounded-full cursor-pointer uppercase transition-all shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> READ SPEC & DOCS
                    </Link>
                    {resource.liveUrl && (
                      <a
                        href={resource.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 rounded-full cursor-pointer uppercase transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> LIVE DEMO
                      </a>
                    )}
                    {resource.githubUrl && (
                      <a
                        href={resource.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-5 border border-neutral-200 hover:border-neutral-950 text-neutral-950 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 rounded-full cursor-pointer uppercase transition-all bg-white"
                      >
                        <Github className="w-3.5 h-3.5" /> REPO
                      </a>
                    )}
                    {Boolean(resource.fileUrl && resource.fileUrl.trim()) && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleDownloadMetric(resource.id)}
                        className="py-2.5 px-5 border border-neutral-200 hover:border-neutral-900 text-neutral-900 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 rounded-full cursor-pointer uppercase transition-colors"
                        id={`download-btn-${resource.id}`}
                      >
                        <Download className="w-3.5 h-3.5" /> DOWNLOAD FILE
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Stage: Featured Image (1/3 width on desktop) */}
                <div className="relative bg-neutral-950 min-h-[260px] sm:min-h-[320px] lg:min-h-full flex items-center justify-center overflow-hidden">
                  {/* Subtle Ambient Lighting */}
                  <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

                  {resource.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resource.imageUrl}
                      alt={resource.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
                      }}
                    />
                  ) : (
                    // Fallback architectural preview
                    <div className="w-full h-full p-8 flex flex-col justify-between relative z-10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900">
                      <div className="flex items-center justify-between text-neutral-500 font-mono text-[9px] uppercase tracking-widest">
                        <span>VAULT SPEC</span>
                        <span>{resource.type}</span>
                      </div>

                      <div className="my-auto py-8 text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                          <Terminal className="w-6 h-6 text-neutral-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                          {resource.title}
                        </h4>
                        <p className="text-[10px] font-mono text-neutral-500 max-w-xs mx-auto line-clamp-2">
                          {resource.tags.map(t => `#${t}`).join(' ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-neutral-500 font-mono text-[9px] uppercase tracking-widest pt-4 border-t border-neutral-800/80">
                        <span>OPEN SOURCE</span>
                        <span className="text-emerald-500 font-bold">VERIFIED</span>
                      </div>
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Floating Status Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs px-4 py-3 shadow-lg flex items-center gap-2 rounded-none animate-bounce">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}
    </DefaultPageLayout>
  );
}
