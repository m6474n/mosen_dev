'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Copy, Check, Terminal, FileCode, Sliders, ExternalLink, Github, BookOpen, Code2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { stripHtml } from '../lib/richText';
import { Resource } from '../types';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import Button from './Button';

export default function ResourcesView() {
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
          <div className="w-full text-center py-12 border border-dashed border-neutral-200">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">NO RESOURCES MATCH YOUR PARAMETERS</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {filteredResources.map((resource) => (
              <ReusableCard
                key={resource.id}
                hoverable={true}
                variant="white"
                className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8 p-6 md:p-8"
                id={`resource-${resource.id}`}
              >
                {/* Info and action panel */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[10px] font-extrabold text-neutral-400 border border-neutral-200 px-2.5 py-1 uppercase tracking-wide bg-neutral-50">
                        {resource.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                        <Download className="w-3 h-3" /> INPUTS: {downloads[resource.id] || 0}
                      </span>
                    </div>

                    <h3 className="text-lg font-light text-neutral-950 tracking-tight mb-3 uppercase leading-snug">
                      {resource.title.toUpperCase()}
                    </h3>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed mb-6 whitespace-pre-wrap max-h-48 overflow-y-auto pr-2 selection:bg-neutral-900 selection:text-white">
                      {resource.description || resource.content}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-8">
                       {resource.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-neutral-400 px-2 py-0.5 bg-neutral-100 uppercase tracking-wide">
                          #{tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6 mt-4">
                    {resource.liveUrl && (
                      <a
                        href={resource.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 rounded-full cursor-pointer uppercase transition-all shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> LIVE DEMO
                      </a>
                    )}
                    {resource.githubUrl && (
                      <a
                        href={resource.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-5 border border-neutral-200 hover:border-neutral-950 text-neutral-950 text-xs font-bold tracking-wider flex items-center justify-center gap-2 rounded-full cursor-pointer uppercase transition-all"
                      >
                        <Github className="w-3.5 h-3.5" /> GITHUB
                      </a>
                    )}
                    <button
                      onClick={() => handleDownloadMetric(resource.id)}
                      className="py-2.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold tracking-wider flex items-center justify-center gap-2 rounded-full cursor-pointer uppercase transition-colors"
                      id={`download-btn-${resource.id}`}
                    >
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD
                    </button>
                    {resource.codeBlock && (
                      <button
                        onClick={() => handleCopyCode(resource.id, resource.codeBlock || '')}
                        className="py-2.5 px-5 border border-neutral-200 hover:border-neutral-900 text-neutral-900 text-xs font-bold tracking-wider flex items-center justify-center gap-2 rounded-full cursor-pointer uppercase transition-all"
                        id={`copy-btn-${resource.id}`}
                      >
                        {copiedId === resource.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> COPIED!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> COPY CODE
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Viewport: Defaults to README documentation, with toggle to Code */}
                {(() => {
                  const currentView = cardViews[resource.id] || (resource.content ? 'readme' : 'code');
                  return (
                    <div className="bg-neutral-950 p-6 md:p-8 text-neutral-300 font-sans text-xs leading-relaxed relative border-l-4 border-neutral-800 overflow-x-auto max-h-[480px] max-w-full flex flex-col rounded-2xl">
                      {/* Top View Switcher Bar */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800/80 shrink-0">
                        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-full border border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setCardViews(prev => ({ ...prev, [resource.id]: 'readme' }))}
                            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                              currentView === 'readme'
                                ? 'bg-white text-neutral-950 font-bold shadow-2xs'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            <BookOpen className="w-3 h-3" /> README
                          </button>
                          {resource.codeBlock && (
                            <button
                              type="button"
                              onClick={() => setCardViews(prev => ({ ...prev, [resource.id]: 'code' }))}
                              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                                currentView === 'code'
                                  ? 'bg-white text-neutral-950 font-bold shadow-2xs'
                                  : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              <Code2 className="w-3 h-3" /> CODE
                            </button>
                          )}
                        </div>

                        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 hidden sm:inline">
                          {currentView === 'readme' ? 'MARKDOWN GUIDE' : 'SOURCE SNIPPET'}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="flex-grow overflow-y-auto pr-2">
                        {currentView === 'readme' ? (
                          <div className="prose prose-invert prose-neutral max-w-none text-neutral-300 text-xs sm:text-[13px] leading-relaxed font-sans space-y-3 whitespace-pre-wrap selection:bg-white selection:text-neutral-950">
                            {resource.content ? resource.content.trim() : resource.description}
                          </div>
                        ) : (
                          <pre className="font-mono text-[11px] leading-relaxed break-words whitespace-pre text-neutral-300 selection:bg-white selection:text-neutral-950">
                            {resource.codeBlock ? resource.codeBlock.trim() : '// No code snippet attached.'}
                          </pre>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </ReusableCard>
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
