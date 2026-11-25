'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Search, 
  Save, 
  Trash2, 
  Inbox, 
  FolderGit, 
  Settings,
  UploadCloud,
  Check,
  Mail,
  Clock,
  Terminal,
  Github,
  ExternalLink,
  RefreshCw,
  Loader2,
  X
} from 'lucide-react';
import { useData, MessageItemData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Project, BlogPost, Resource } from '../types';
import { marked } from 'marked';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Helper function to extract metadata and body from raw pasted markdown / frontmatter
function parseMarkdownWithFrontmatter(rawText: string): {
  metadata: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    tags?: string[];
    reading_time?: string;
    published_date?: string;
  };
  bodyHtml: string;
  bodyMarkdown: string;
} {
  let text = rawText.trim();
  const metadata: any = {};

  // Check if starts with YAML frontmatter delimiter --- or key-value headers
  const frontmatterRegex = /^(?:---[\r\n]+([\s\S]*?)[\r\n]+---|(?:title:\s*["'][^"']+["'][\s\S]*?(?:reading_time:\s*["'][^"']+["']|keywords:[\s\S]*?\n\n)))/i;
  const match = text.match(frontmatterRegex);

  let headerPart = '';
  let bodyPart = text;

  if (match) {
    headerPart = match[1] || match[0];
    bodyPart = text.slice(match[0].length).trim();
  } else {
    // If user pasted key-value headers directly at top without ---
    const lines = text.split('\n');
    let headerLines: string[] = [];
    let splitIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^(title|slug|description|author|author_title|published_date|category|tags|keywords|reading_time):/i.test(line)) {
        headerLines.push(line);
      } else if (headerLines.length > 0 && /^[a-z0-9_\-\s]+$/i.test(line) && !line.startsWith('#')) {
        // Multi-line list item under tags or keywords
        headerLines.push(line);
      } else if (headerLines.length > 0 && (line.startsWith('#') || line.length === 0)) {
        // Start of markdown body
        splitIndex = i;
        break;
      }
    }

    if (headerLines.length >= 2 && splitIndex !== -1) {
      headerPart = headerLines.join('\n');
      bodyPart = lines.slice(splitIndex).join('\n').trim();
    }
  }

  // Parse header lines
  if (headerPart) {
    const titleMatch = headerPart.match(/title:\s*["']?([^"'\r\n]+)["']?/i);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    const slugMatch = headerPart.match(/slug:\s*["']?([^"'\r\n]+)["']?/i);
    if (slugMatch) metadata.slug = slugMatch[1].trim();

    const descMatch = headerPart.match(/description:\s*["']?([^"'\r\n]+)["']?/i);
    if (descMatch) metadata.description = descMatch[1].trim();

    const catMatch = headerPart.match(/category:\s*["']?([^"'\r\n]+)["']?/i);
    if (catMatch) metadata.category = catMatch[1].trim();

    const readTimeMatch = headerPart.match(/reading_time:\s*["']?([^"'\r\n]+)["']?/i);
    if (readTimeMatch) metadata.reading_time = readTimeMatch[1].trim();

    const dateMatch = headerPart.match(/published_date:\s*["']?([^"'\r\n]+)["']?/i);
    if (dateMatch) metadata.published_date = dateMatch[1].trim();

    // Extract tags: either inline comma-separated or multi-line list
    const tagsSection = headerPart.match(/tags:([\s\S]*?)(?:keywords:|reading_time:|author:|published_date:|$)/i);
    if (tagsSection && tagsSection[1]) {
      const rawTags = tagsSection[1]
        .split('\n')
        .map(t => t.replace(/^[-*]\s*/, '').trim())
        .filter(t => t && !t.includes(':'));
      if (rawTags.length > 0) {
        metadata.tags = rawTags;
      }
    }
  }

  // If title was not in frontmatter, look for first H1 header
  if (!metadata.title) {
    const h1Match = bodyPart.match(/^#\s+(.+)$/m);
    if (h1Match) metadata.title = h1Match[1].trim();
  }

  // Normalize extra consecutive blank lines in markdown body
  const cleanedBody = bodyPart.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  // Parse markdown body into styled HTML
  const rawHtml = marked.parse(cleanedBody) as string;

  // Clean empty HTML paragraphs like <p></p> or <p><br></p> produced by Quill or marked
  const bodyHtml = rawHtml
    .replace(/<p>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, '')
    .trim();

  return {
    metadata,
    bodyHtml,
    bodyMarkdown: bodyPart,
  };
}
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'mosen-dcfde';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'mosen_preset';

function CloudinaryUploader({ 
  onUploadSuccess, 
  currentUrl 
}: { 
  onUploadSuccess: (url: string) => void; 
  currentUrl?: string; 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.secure_url) {
        onUploadSuccess(data.secure_url);
        setFile(null);
      } else {
        throw new Error("No URL returned from Cloudinary.");
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-4 rounded-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="text-xs font-mono text-neutral-500"
          />
          {file && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] px-4 py-2 font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer rounded-none"
            >
              {uploading ? 'Uploading to cloud...' : 'Upload Image'}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-[10px] text-red-600 font-mono">{error}</p>}

      {currentUrl && (
        <div className="pt-2 border-t border-neutral-200">
          <span className="text-[9px] font-bold text-neutral-400 block mb-1">CURRENT SECURE IMAGE LINK</span>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={currentUrl} 
              className="flex-grow border border-neutral-200 px-3 py-1 text-xs bg-neutral-100 font-mono select-all rounded-none"
            />
            <a 
              href={currentUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] font-bold underline text-neutral-800 hover:text-neutral-500 uppercase tracking-widest font-mono shrink-0"
            >
              Preview
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

interface AdminDashboardViewProps {
  initialSection?: 'dashboard' | 'projects' | 'blogs' | 'resources' | 'leads';
}

// ─── ADMIN DASHBOARD MAIN component ──────────────────────────────────────────
export default function AdminDashboardView({ initialSection = 'dashboard' }: AdminDashboardViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { 
    projects, 
    blogs, 
    resources,
    messages, 
    loading, 
    isFirebaseActive, 
    saveItem, 
    deleteItem, 
    toggleMessageRead 
  } = useData();

  // Get all unique project categories/types dynamically listed from existing projects
  const existingCategories = Array.from(
    new Set(projects.map(p => p.projectType).filter(Boolean))
  ).sort();

  // Determine active tab from current URL pathname or fallback prop
  const currentSection = ((): 'dashboard' | 'projects' | 'blogs' | 'resources' | 'leads' => {
    if (pathname.includes('/admin/projects')) return 'projects';
    if (pathname.includes('/admin/blogs')) return 'blogs';
    if (pathname.includes('/admin/resources')) return 'resources';
    if (pathname.includes('/admin/leads')) return 'leads';
    return initialSection;
  })();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'blogs' | 'resources' | 'leads'>(currentSection);

  useEffect(() => {
    setActiveTab(currentSection);
  }, [currentSection]);

  const navigateToSection = (section: 'dashboard' | 'projects' | 'blogs' | 'resources' | 'leads') => {
    setActiveTab(section);
    if (section === 'dashboard') {
      router.push('/admin');
    } else {
      router.push(`/admin/${section}`);
    }
  };
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogEditorMode, setBlogEditorMode] = useState<'rich' | 'markdown' | 'preview'>('markdown');
  const [markdownInput, setMarkdownInput] = useState('');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceTagsInput, setResourceTagsInput] = useState('');
  const [activeLead, setActiveLead] = useState<MessageItemData | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Reset search term on tab shift
  useEffect(() => {
    setSearchTerm('');
    setEditingProject(null);
    setIsCustomCategory(false);
    setEditingBlog(null);
    setEditingResource(null);
    setActiveLead(null);
  }, [activeTab]);

  // Statistics calculations
  const totalProjects = projects.length;
  const totalBlogs = blogs.length;
  const totalResources = resources.length;
  const totalLeads = messages.length;
  const unreadLeads = messages.filter(m => !m.read).length;

  const handleSaveProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    try {
      const payload: Project = {
        ...editingProject,
        id: editingProject.id.trim(),
        title: editingProject.title.trim(),
      };
      const success = await saveItem('projects', payload);
      if (success) {
        setEditingProject(null);
        alert("Project saved successfully!");
      } else {
        alert("Could not save project. Check Firestore configuration/rules.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBlog = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingBlog) return;
    setIsSaving(true);
    try {
      // If user was typing in markdown tab, convert to HTML before saving
      let finalHtml = editingBlog.contentHtml;
      if (blogEditorMode === 'markdown' && markdownInput.trim()) {
        const parsed = parseMarkdownWithFrontmatter(markdownInput);
        finalHtml = parsed.bodyHtml;
      }
      if (finalHtml) {
        finalHtml = finalHtml.replace(/<p>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, '').trim();
      }
      
      const cleanSlug = (editingBlog.slug || editingBlog.title || 'untitled-post')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload: BlogPost = {
        ...editingBlog,
        slug: cleanSlug,
        title: editingBlog.title?.trim() || 'Untitled Post',
        contentHtml: finalHtml || '<p></p>',
      };

      const success = await saveItem('blogs', payload);
      if (success) {
        setEditingBlog(null);
        setMarkdownInput('');
        alert("Blog post saved successfully!");
      } else {
        alert("Could not save blog post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog: " + (err as any)?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveResource = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingResource) return;
    setIsSaving(true);
    try {
      const parsedTags = resourceTagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      const payload: Resource = {
        ...editingResource,
        id: editingResource.id.trim(),
        tags: parsedTags,
      };
      const success = await saveItem('resources', payload);
      if (success) {
        setEditingResource(null);
        alert("Resource saved successfully!");
      } else {
        alert("Could not save resource.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving resource.");
    } finally {
      setIsSaving(false);
    }
  };

  // GitHub integration state & helpers
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubUsername, setGithubUsername] = useState('m6474n');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [isLoadingGithubRepos, setIsLoadingGithubRepos] = useState(false);
  const [importingRepoName, setImportingRepoName] = useState<string | null>(null);
  const [githubDirectInput, setGithubDirectInput] = useState('');
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);
  const [githubFeedback, setGithubFeedback] = useState<string | null>(null);

  // Helper for authenticated GitHub headers using NEXT_PUBLIC_GITHUB_TOKEN
  const getGithubHeaders = (): HeadersInit => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (token && token.trim()) {
      headers.Authorization = `Bearer ${token.trim()}`;
    }
    return headers;
  };

  const fetchGithubRepoResource = async (repoInput: string): Promise<Resource> => {
    let clean = repoInput.trim()
      .replace(/^https?:\/\/github\.com\//, '')
      .replace(/\.git$/, '')
      .replace(/\/$/, '');
    const parts = clean.split('/').filter(Boolean);
    const owner = parts.length > 1 ? parts[0] : (githubUsername || 'm6474n');
    const repo = (parts.length > 1 ? parts[1] : parts[0]).replace(/\.git$/, '');

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: getGithubHeaders(),
    });
    if (!repoRes.ok) {
      throw new Error(`Repository "${owner}/${repo}" error (${repoRes.status}). Rate limit or invalid repo.`);
    }
    const repoData = await repoRes.json();

    let readmeContent = '';
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: getGithubHeaders(),
      });
      if (readmeRes.ok) {
        const readmeJson = await readmeRes.json();
        if (readmeJson.content) {
          const binaryString = atob(readmeJson.content.replace(/\s/g, ''));
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          readmeContent = new TextDecoder().decode(bytes);
        }
      }
    } catch (e) {
      console.warn("Could not load readme:", e);
    }

    const tags = Array.from(new Set([
      repoData.language,
      ...(repoData.topics || [])
    ])).filter(Boolean) as string[];

    let inferredType: 'Product' | 'Script' | 'Template' | 'Utility' = 'Utility';
    if (repoData.homepage) {
      inferredType = 'Product';
    } else if (tags.some(t => /script|bot|scraper|automation|playwright/i.test(t))) {
      inferredType = 'Script';
    } else if (tags.some(t => /template|boilerplate|starter/i.test(t))) {
      inferredType = 'Template';
    }

    // Put full README in description (and fallback to repo description if readme empty)
    const fullReadme = readmeContent || repoData.description || `Open source repository by ${owner}`;
    const description = fullReadme;

    return {
      id: repoData.name.toLowerCase(),
      title: repoData.name.replace(/[-_]/g, ' ').toUpperCase(),
      description,
      type: inferredType,
      tags,
      downloadCount: repoData.stargazers_count || 0,
      content: fullReadme,
      codeBlock: `git clone ${repoData.clone_url || repoData.html_url}.git`,
      fileUrl: `${repoData.html_url}/archive/refs/heads/${repoData.default_branch || 'main'}.zip`,
      githubUrl: repoData.html_url,
      liveUrl: repoData.homepage || '',
      isPremium: false,
    };
  };

  const handleFetchAndPopulate = async (url: string) => {
    if (!url.trim()) return;
    setIsFetchingDirect(true);
    setGithubFeedback(null);
    try {
      const res = await fetchGithubRepoResource(url);
      setEditingResource(res);
      setResourceTagsInput(res.tags.join(', '));
      setGithubFeedback(`Loaded metadata and README for ${res.title}`);
    } catch (err: any) {
      alert(err.message || 'Error fetching GitHub repository.');
    } finally {
      setIsFetchingDirect(false);
    }
  };

  const handleOneClickImport = async (repo: any) => {
    setImportingRepoName(repo.name);
    try {
      const res = await fetchGithubRepoResource(`${repo.owner.login}/${repo.name}`);
      const success = await saveItem('resources', res);
      if (success) {
        setGithubFeedback(`Imported "${res.title}" into resources!`);
      } else {
        alert("Failed to save resource.");
      }
    } catch (err: any) {
      alert(err.message || 'Error importing repository.');
    } finally {
      setImportingRepoName(null);
    }
  };

  const fetchUserRepos = async (username: string) => {
    if (!username.trim()) return;
    setIsLoadingGithubRepos(true);
    try {
      const res = await fetch(`https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=30`, {
        headers: getGithubHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setGithubRepos(Array.isArray(data) ? data : []);
      } else {
        alert(`Failed to fetch repositories for "${username}". Status: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error fetching GitHub repositories.");
    } finally {
      setIsLoadingGithubRepos(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-neutral-900 border-t border-neutral-200">
      {/* ─── SIDEBAR ─── */}
      <div className="w-64 bg-neutral-950 text-white flex flex-col justify-between shrink-0 border-r border-neutral-800">
        <div>
          <div className="p-6 border-b border-neutral-900">
            <h1 className="font-sans font-extrabold text-lg tracking-tight uppercase flex items-center gap-1.5">
              MOSEN<span className="text-neutral-500">_3.0</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest leading-none">
                {isFirebaseActive ? 'Firestore Live' : 'Simulation Mode'}
              </span>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard className="w-4 h-4" />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => navigateToSection('dashboard')} 
            />
            <SidebarItem 
              icon={<FolderGit className="w-4 h-4" />} 
              label="Projects" 
              active={activeTab === 'projects'} 
              onClick={() => navigateToSection('projects')} 
            />
            <SidebarItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Blog Posts" 
              active={activeTab === 'blogs'} 
              onClick={() => navigateToSection('blogs')} 
            />
            <SidebarItem 
              icon={<Terminal className="w-4 h-4" />} 
              label="Resources" 
              active={activeTab === 'resources'} 
              onClick={() => navigateToSection('resources')} 
            />
            <SidebarItem 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="Queries / Leads" 
              active={activeTab === 'leads'} 
              onClick={() => navigateToSection('leads')} 
            />
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-900 flex flex-col gap-2">
          <button 
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all uppercase text-[10px] font-bold tracking-wider rounded-none cursor-pointer border border-neutral-800"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-neutral-500 hover:text-white transition-all uppercase text-[9px] font-bold tracking-wider rounded-none cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 flex flex-col">
        {loading ? (
          <div className="flex-grow flex flex-col items-center justify-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 animate-pulse">Syncing nodes...</span>
          </div>
        ) : (
          <main className="p-8 max-w-7xl mx-auto w-full flex-grow">
            {/* ─── DASHBOARD OVERVIEW ─── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-light uppercase tracking-tight text-neutral-950">System Performance</h2>
                  <p className="text-xs text-neutral-400 font-mono mt-1 uppercase">V3.0 Simple Desk Overview</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 shadow-xs bg-white rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">TOTAL PROJECTS</span>
                    <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">{totalProjects}</span>
                  </Card>
                  <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 shadow-xs bg-white rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">TOTAL ESSAYS</span>
                    <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">{totalBlogs}</span>
                  </Card>
                  <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 shadow-xs bg-white rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">RESOURCES</span>
                    <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">{totalResources}</span>
                  </Card>
                  <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 shadow-xs bg-white rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">TOTAL LEADS</span>
                    <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">{totalLeads}</span>
                  </Card>
                  <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 shadow-xs bg-white rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">UNREAD INQUIRIES</span>
                    <span className="text-3xl font-extrabold text-rose-600 font-[family-name:var(--font-inter-tight)]">{unreadLeads}</span>
                  </Card>
                </div>

                {/* Cloudinary Info Panel */}
                <Card className="border border-neutral-200/90 bg-white p-6 rounded-2xl shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-neutral-800">
                    <Settings className="w-4 h-4" /> Cloudinary Configuration
                  </h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-3xl">
                    To upload images directly, enter your Cloudinary configuration parameters inside any image upload box. These values will be persisted in your local workspace sandbox cache. Alternatively, configure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in your `.env` environment variables.
                  </p>
                </Card>
              </div>
            )}

            {/* ─── PROJECTS TAB ─── */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {editingProject ? (
                  <form onSubmit={handleSaveProject}>
                    <Card className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">
                          {projects.some(p => p.id === editingProject.id) ? 'Modify Project' : 'Provision Project'}
                        </h3>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProject(null);
                              setIsCustomCategory(false);
                            }} 
                            className="rounded-full"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            size="sm"
                            disabled={isSaving}
                            onClick={() => handleSaveProject()}
                            className="rounded-full"
                          >
                            {isSaving ? 'Saving...' : 'Save Project'}
                          </Button>
                        </div>
                      </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Project Unique ID</label>
                        <Input 
                          type="text" 
                          value={editingProject.id} 
                          onChange={e => setEditingProject({ ...editingProject, id: e.target.value })}
                          required
                          disabled={projects.some(p => p.id === editingProject.id)}
                          className="rounded-xl font-mono text-xs" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Project Title</label>
                        <Input 
                          type="text" 
                          value={editingProject.title} 
                          onChange={e => {
                            const title = e.target.value;
                            const isNew = !projects.some(p => p.id === editingProject.id);
                            if (isNew) {
                              const slug = title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, '');
                              setEditingProject({ ...editingProject, title, id: slug });
                            } else {
                              setEditingProject({ ...editingProject, title });
                            }
                          }}
                          required
                          className="rounded-xl text-xs" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Project Type / Category</label>
                        <select
                          value={isCustomCategory ? '__NEW__' : (editingProject.projectType || '')}
                          onChange={e => {
                            const val = e.target.value;
                            if (val === '__NEW__') {
                              setIsCustomCategory(true);
                              setEditingProject({ ...editingProject, projectType: '' });
                            } else {
                              setIsCustomCategory(false);
                              setEditingProject({ ...editingProject, projectType: val });
                            }
                          }}
                          className="w-full border border-neutral-200/90 px-3 py-2 text-xs bg-white rounded-xl cursor-pointer"
                        >
                          <option value="">-- Select Category --</option>
                          {existingCategories.map(cat => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                          ))}
                          <option value="__NEW__">+ ADD NEW CATEGORY...</option>
                        </select>

                        {isCustomCategory && (
                          <div className="flex items-center gap-2 mt-2">
                            <Input 
                              type="text" 
                              value={editingProject.projectType} 
                              onChange={e => setEditingProject({ ...editingProject, projectType: e.target.value })}
                              placeholder="Enter new custom category..."
                              className="rounded-xl text-xs font-mono" 
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                setIsCustomCategory(false);
                                setEditingProject({ ...editingProject, projectType: '' });
                              }}
                              className="rounded-full shrink-0"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Publication Status</label>
                        <select 
                          value={editingProject.status} 
                          onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                          className="w-full border border-neutral-200/90 px-3 py-2 text-xs bg-white rounded-xl cursor-pointer"
                        >
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Published">Published (Live)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Featured status</label>
                        <select 
                          value={editingProject.featured ? 'Featured' : 'Standard'} 
                          onChange={e => setEditingProject({ ...editingProject, featured: e.target.value === 'Featured' })}
                          className="w-full border border-neutral-200/90 px-3 py-2 text-xs bg-white rounded-xl cursor-pointer"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Featured">Featured</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Live / Production URL</label>
                        <Input 
                          type="text" 
                          value={editingProject.liveUrl || ''} 
                          onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                          placeholder="e.g. App Store or web link"
                          className="rounded-xl text-xs font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Screenshot URL</label>
                        <Input 
                          type="text" 
                          value={editingProject.screenshotUrl || ''} 
                          onChange={e => setEditingProject({ ...editingProject, screenshotUrl: e.target.value })}
                          placeholder="Enter URL or upload image below..."
                          className="rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                    <CloudinaryUploader 
                      currentUrl={editingProject.screenshotUrl}
                      onUploadSuccess={(url) => setEditingProject({ ...editingProject, screenshotUrl: url })}
                    />

                    <div className="flex flex-col gap-2 min-h-[300px]">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Detailed Description</label>
                      <div className="flex-grow flex flex-col min-h-[250px] border border-neutral-200/90 rounded-xl overflow-hidden">
                        <ReactQuill 
                          theme="snow" 
                          value={editingProject.description}
                          onChange={(val) => setEditingProject({ ...editingProject, description: val })}
                          className="flex-grow flex flex-col font-sans text-sm bg-white"
                        />
                      </div>
                    </div>
                  </Card>
                </form>
                ) : (
                  <>
                    {/* Projects Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                      <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 rounded-2xl bg-white shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">TOTAL PROJECTS</span>
                        <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">{projects.length}</span>
                      </Card>
                      <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 rounded-2xl bg-white shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">PUBLISHED (LIVE)</span>
                        <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">
                          {projects.filter(p => p.status === 'Published').length}
                        </span>
                      </Card>
                      <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 rounded-2xl bg-white shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">DRAFTS (HIDDEN)</span>
                        <span className="text-3xl font-extrabold text-neutral-500 font-[family-name:var(--font-inter-tight)]">
                          {projects.filter(p => p.status === 'Draft').length}
                        </span>
                      </Card>
                      <Card className="p-6 flex flex-col justify-between gap-4 border border-neutral-200/90 rounded-2xl bg-white shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">CATEGORIES</span>
                        <span className="text-3xl font-extrabold text-neutral-950 font-[family-name:var(--font-inter-tight)]">{existingCategories.length}</span>
                      </Card>
                    </div>

                    <Card className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs overflow-hidden">
                      <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/70">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <Input 
                          type="text" 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Search projects..."
                          className="pl-9 pr-4 py-1.5 text-xs w-64 bg-white rounded-xl font-mono"
                        />
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setEditingProject({
                            id: `project-${Math.floor(Math.random() * 1000)}`,
                            title: '',
                            projectType: '',
                            description: '',
                            screenshotUrl: '',
                            liveUrl: '',
                            status: 'Published',
                            lastModified: new Date().toISOString().split('T')[0],
                            featured: false
                          });
                        }}
                        className="rounded-full flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> New Project
                      </Button>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-36">ID</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Title</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-32">Type</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-28">Status</th>
                          <th className="p-4 w-28 text-right text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((project) => (
                          <tr key={project.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 text-xs font-mono text-neutral-400">{project.id}</td>
                             <td className="p-4 text-xs font-bold uppercase text-neutral-950">
                               <div className="flex items-center gap-2 flex-wrap">
                                 <span>{project.title}</span>
                                 {project.featured && (
                                   <Badge variant="outline" className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 border-amber-200 rounded-full px-2">
                                     ★ FEATURED
                                   </Badge>
                                 )}
                               </div>
                             </td>
                            <td className="p-4 text-xs text-neutral-500 font-mono uppercase">{project.projectType}</td>
                            <td className="p-4">
                              <Badge 
                                variant="outline"
                                className={`text-[9px] font-mono font-bold uppercase rounded-full px-2.5 ${
                                  project.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                }`}
                              >
                                {project.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right flex gap-1.5 justify-end">
                              <Button 
                                variant="outline"
                                size="xs"
                                onClick={() => {
                                  setIsCustomCategory(Boolean(project.projectType && !existingCategories.includes(project.projectType)));
                                  setEditingProject(project);
                                }}
                                className="rounded-full text-[10px]"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost"
                                size="icon-xs"
                                onClick={async () => {
                                  if (confirm("Delete project?")) {
                                    await deleteItem('projects', project.id);
                                  }
                                }}
                                className="text-neutral-400 hover:text-red-600 rounded-full"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </>
              )}
              </div>
            )}

            {/* ─── BLOG POSTS TAB ─── */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                {editingBlog ? (
                  <form onSubmit={handleSaveBlog}>
                    <Card className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">
                          {blogs.some(b => b.slug === editingBlog.slug) ? 'Modify Blog Post' : 'Write Blog Post'}
                        </h3>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBlog(null)} 
                            className="rounded-full"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            size="sm"
                            disabled={isSaving}
                            onClick={() => handleSaveBlog()}
                            className="rounded-full"
                          >
                            {isSaving ? 'Saving...' : 'Save Post'}
                          </Button>
                        </div>
                      </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">SEO Route Slug (ID)</label>
                        <Input 
                          type="text" 
                          value={editingBlog.slug} 
                          onChange={e => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                          required
                          disabled={blogs.some(b => b.slug === editingBlog.slug)}
                          placeholder="e.g. building-scalable-systems"
                          className="rounded-xl font-mono text-xs" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Post Title</label>
                        <Input 
                          type="text" 
                          value={editingBlog.title} 
                          onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })}
                          required
                          className="rounded-xl text-xs" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Read Time Indicator</label>
                        <Input 
                          type="text" 
                          value={editingBlog.readTime} 
                          onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                          required
                          placeholder="e.g. 5 MIN READ"
                          className="rounded-xl text-xs" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Categories (Comma-separated)</label>
                        <Input 
                          type="text" 
                          value={(editingBlog.categories || []).join(', ')} 
                          onChange={e => setEditingBlog({ ...editingBlog, categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
                          placeholder="e.g. Design, Architecture"
                          className="rounded-xl text-xs font-sans" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Tags (Comma-separated)</label>
                        <Input 
                          type="text" 
                          value={(editingBlog.tags || []).join(', ')} 
                          onChange={e => setEditingBlog({ ...editingBlog, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                          placeholder="e.g. TECH, DEV"
                          className="rounded-xl font-mono text-xs" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Status</label>
                        <select 
                          value={editingBlog.status} 
                          onChange={e => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                          className="w-full border border-neutral-200/90 px-3 py-2 text-xs bg-white rounded-xl cursor-pointer font-semibold"
                        >
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Published">Published (Live)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Cover Image Link / Uploader</label>
                      <Input 
                        type="text" 
                        value={editingBlog.coverImage || ''} 
                        onChange={e => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                        placeholder="Enter direct URL or upload below..."
                        className="rounded-xl text-xs font-mono mb-2" 
                      />
                      <CloudinaryUploader 
                        currentUrl={editingBlog.coverImage}
                        onUploadSuccess={(url) => setEditingBlog({ ...editingBlog, coverImage: url })}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Short Summary Excerpt</label>
                      <Textarea 
                        rows={2} 
                        value={editingBlog.excerpt} 
                        onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                        required
                        className="rounded-xl text-xs font-sans" 
                      />
                    </div>

                    <div className="flex flex-col gap-2 min-h-[380px]">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Essay Content
                        </label>
                        {/* Editor Mode Tabs */}
                        <div className="flex items-center border border-neutral-200 p-0.5 bg-neutral-100">
                          <button
                            type="button"
                            onClick={() => {
                              // If switching from markdown, sync HTML
                              if (markdownInput.trim()) {
                                setEditingBlog({ ...editingBlog, contentHtml: marked.parse(markdownInput) as string });
                              }
                              setBlogEditorMode('markdown');
                            }}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              blogEditorMode === 'markdown'
                                ? 'bg-neutral-950 text-white shadow-2xs'
                                : 'text-neutral-600 hover:text-neutral-950'
                            }`}
                          >
                            Markdown (Paste)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (blogEditorMode === 'markdown' && markdownInput.trim()) {
                                const parsed = parseMarkdownWithFrontmatter(markdownInput);
                                setEditingBlog({ ...editingBlog, contentHtml: parsed.bodyHtml });
                              }
                              setBlogEditorMode('rich');
                            }}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              blogEditorMode === 'rich'
                                ? 'bg-neutral-950 text-white shadow-2xs'
                                : 'text-neutral-600 hover:text-neutral-950'
                            }`}
                          >
                            Rich Text Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (blogEditorMode === 'markdown' && markdownInput.trim()) {
                                const parsed = parseMarkdownWithFrontmatter(markdownInput);
                                setEditingBlog({ ...editingBlog, contentHtml: parsed.bodyHtml });
                              }
                              setBlogEditorMode('preview');
                            }}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              blogEditorMode === 'preview'
                                ? 'bg-neutral-950 text-white shadow-2xs'
                                : 'text-neutral-600 hover:text-neutral-950'
                            }`}
                          >
                            Live Preview
                          </button>
                        </div>
                      </div>

                      {blogEditorMode === 'markdown' && (
                        <div className="flex flex-col gap-2">
                          <div className="text-[11px] text-neutral-600 font-mono bg-neutral-50 p-3 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <span>
                              💡 <strong>Smart Importer:</strong> Paste any raw Markdown (with or without frontmatter). Title, slug, description, tags, and reading time will be extracted automatically into the fields above.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (!markdownInput.trim()) return;
                                const parsed = parseMarkdownWithFrontmatter(markdownInput);
                                setEditingBlog(prev => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    title: parsed.metadata.title || prev.title,
                                    slug: parsed.metadata.slug || prev.slug,
                                    excerpt: parsed.metadata.description || prev.excerpt,
                                    readTime: parsed.metadata.reading_time || prev.readTime,
                                    categories: parsed.metadata.category ? [parsed.metadata.category] : prev.categories,
                                    tags: parsed.metadata.tags && parsed.metadata.tags.length > 0 ? parsed.metadata.tags : prev.tags,
                                    publishedAt: parsed.metadata.published_date || prev.publishedAt,
                                    contentHtml: parsed.bodyHtml,
                                  };
                                });
                                setMarkdownInput(parsed.bodyMarkdown);
                              }}
                              className="px-3 py-1 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-none cursor-pointer shrink-0"
                            >
                              Auto-Extract Fields
                            </button>
                          </div>
                          <textarea
                            rows={15}
                            value={markdownInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMarkdownInput(val);
                              // Auto parse on paste or change
                              const parsed = parseMarkdownWithFrontmatter(val);
                              setEditingBlog(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  title: parsed.metadata.title || prev.title,
                                  slug: parsed.metadata.slug || prev.slug,
                                  excerpt: parsed.metadata.description || prev.excerpt,
                                  readTime: parsed.metadata.reading_time || prev.readTime,
                                  categories: parsed.metadata.category ? [parsed.metadata.category] : prev.categories,
                                  tags: parsed.metadata.tags && parsed.metadata.tags.length > 0 ? parsed.metadata.tags : prev.tags,
                                  publishedAt: parsed.metadata.published_date || prev.publishedAt,
                                  contentHtml: parsed.bodyHtml,
                                };
                              });
                            }}
                            placeholder="Paste raw Markdown with or without YAML frontmatter here...&#10;&#10;title: &quot;My Article Title&quot;&#10;slug: &quot;my-article-title&quot;&#10;description: &quot;Short summary...&quot;&#10;&#10;# Article Body..."
                            className="w-full border border-neutral-200/90 p-4 text-xs bg-white rounded-xl font-mono leading-relaxed resize-y focus:outline-hidden focus:border-neutral-950"
                          />
                        </div>
                      )}

                      {blogEditorMode === 'rich' && (
                        <div className="flex-grow flex flex-col min-h-[300px] border border-neutral-200/90 rounded-xl overflow-hidden">
                          <ReactQuill 
                            theme="snow" 
                            value={editingBlog.contentHtml}
                            onChange={(val) => setEditingBlog({ ...editingBlog, contentHtml: val })}
                            className="flex-grow flex flex-col font-sans text-sm bg-white"
                          />
                        </div>
                      )}

                      {blogEditorMode === 'preview' && (
                        <div className="border border-neutral-200/90 bg-white p-6 sm:p-8 min-h-[300px] rounded-xl overflow-y-auto max-h-[500px]">
                          <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest pb-3 mb-4 border-b border-neutral-100">
                            RENDERED BLOG PREVIEW
                          </div>
                          <div
                            className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm font-light font-sans tracking-wide space-y-4"
                            dangerouslySetInnerHTML={{
                              __html: editingBlog.contentHtml || '<p class="text-neutral-400 italic font-mono text-xs">No content to preview yet. Switch to Markdown tab and paste your content.</p>',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </form>
                ) : (
                  <Card className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/70">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <Input 
                          type="text" 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Search essays..."
                          className="pl-9 pr-4 py-1.5 text-xs w-64 bg-white rounded-xl font-mono"
                        />
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setEditingBlog({
                            slug: `essay-${Math.floor(Math.random() * 1000)}`,
                            title: '',
                            excerpt: '',
                            publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                            readTime: '5 MIN READ',
                            tags: [],
                            categories: ['Engineering'],
                            contentHtml: '',
                            coverImage: '',
                            status: 'Published',
                            lastModified: new Date().toISOString().split('T')[0]
                          });
                          setMarkdownInput('');
                          setBlogEditorMode('markdown');
                        }}
                        className="rounded-full flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Write Essay
                      </Button>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-36">Slug</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Title</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-36">Categories</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-28">Status</th>
                          <th className="p-4 w-28 text-right text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map((blog) => (
                          <tr key={blog.slug} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 text-xs font-mono text-neutral-400">{blog.slug}</td>
                            <td className="p-4 text-xs font-bold uppercase text-neutral-950">{blog.title}</td>
                            <td className="p-4 text-xs text-neutral-500 font-mono uppercase">{(blog.categories || []).join(', ')}</td>
                            <td className="p-4">
                              <Badge 
                                variant="outline"
                                className={`text-[9px] font-mono font-bold uppercase rounded-full px-2.5 ${
                                  blog.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                }`}
                              >
                                {blog.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right flex gap-1.5 justify-end">
                              <Button 
                                variant="outline"
                                size="xs"
                                onClick={() => {
                                  setEditingBlog(blog);
                                  setMarkdownInput('');
                                  setBlogEditorMode(blog.contentHtml ? 'rich' : 'markdown');
                                }}
                                className="rounded-full text-[10px]"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost"
                                size="icon-xs"
                                onClick={async () => {
                                  if (confirm("Delete blog?")) {
                                    await deleteItem('blogs', blog.slug);
                                  }
                                }}
                                className="text-neutral-400 hover:text-red-600 rounded-full"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}
              </div>
            )}

            {/* ─── RESOURCES CRUD TAB ─── */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                {githubFeedback && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 text-xs font-mono flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      {githubFeedback}
                    </span>
                    <button onClick={() => setGithubFeedback(null)} className="text-emerald-600 hover:text-emerald-900 text-xs">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {editingResource ? (
                  <form onSubmit={handleSaveResource}>
                    <Card className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-neutral-900" />
                          <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">
                            {resources.some(r => r.id === editingResource.id) ? 'Modify Resource' : 'Add New Resource'}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingResource(null)} 
                            className="rounded-full"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            size="sm"
                            disabled={isSaving}
                            onClick={() => handleSaveResource()}
                            className="rounded-full"
                          >
                            {isSaving ? 'Saving...' : 'Save Resource'}
                          </Button>
                        </div>
                      </div>

                    {/* Quick GitHub Auto-Fill Bar */}
                    <div className="bg-neutral-50 p-4 border border-neutral-200/90 rounded-xl flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                        <Github className="w-4 h-4" /> Quick Import from GitHub:
                      </div>
                      <div className="flex-grow flex items-center gap-2 w-full">
                        <Input 
                          type="text" 
                          value={githubDirectInput} 
                          onChange={e => setGithubDirectInput(e.target.value)} 
                          placeholder="e.g. https://github.com/m6474n/my-repo or owner/repo"
                          className="flex-grow rounded-xl text-xs font-mono bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          disabled={isFetchingDirect || !githubDirectInput.trim()}
                          onClick={() => handleFetchAndPopulate(githubDirectInput)}
                          className="rounded-full shrink-0 flex items-center gap-1.5"
                        >
                          {isFetchingDirect ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" /> Fetch & Auto-Fill
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Resource ID</label>
                        <Input 
                          type="text" 
                          value={editingResource.id} 
                          onChange={e => setEditingResource({ ...editingResource, id: e.target.value })}
                          required
                          disabled={resources.some(r => r.id === editingResource.id)}
                          placeholder="e.g. fastapi-lead-scraper"
                          className="rounded-xl text-xs font-mono bg-neutral-50" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Title</label>
                        <Input 
                          type="text" 
                          value={editingResource.title} 
                          onChange={e => setEditingResource({ ...editingResource, title: e.target.value })}
                          required
                          placeholder="e.g. FastAPI Lead Enrichment Agent"
                          className="rounded-xl text-xs" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Type / Classification</label>
                        <select 
                          value={editingResource.type || 'Script'} 
                          onChange={e => setEditingResource({ ...editingResource, type: e.target.value as any })}
                          className="border border-neutral-200/90 px-3 py-2 text-xs bg-white rounded-xl font-mono cursor-pointer"
                        >
                          <option value="Script">Script</option>
                          <option value="Template">Template</option>
                          <option value="Utility">Utility</option>
                          <option value="Product">Product</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5" /> GitHub Repository URL
                        </label>
                        <Input 
                          type="text" 
                          value={editingResource.githubUrl || ''} 
                          onChange={e => setEditingResource({ ...editingResource, githubUrl: e.target.value })}
                          placeholder="https://github.com/m6474n/repo-name"
                          className="rounded-xl text-xs font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" /> Live / Deployed Demo URL
                        </label>
                        <Input 
                          type="text" 
                          value={editingResource.liveUrl || ''} 
                          onChange={e => setEditingResource({ ...editingResource, liveUrl: e.target.value })}
                          placeholder="https://my-app.vercel.app"
                          className="rounded-xl text-xs font-mono" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Tags (comma-separated)</label>
                        <Input 
                          type="text" 
                          value={resourceTagsInput} 
                          onChange={e => setResourceTagsInput(e.target.value)}
                          placeholder="Python, FastAPI, Gemini API, Playwright"
                          className="rounded-xl text-xs font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Download / Star Count</label>
                        <Input 
                          type="number" 
                          value={editingResource.downloadCount ?? 0} 
                          onChange={e => setEditingResource({ ...editingResource, downloadCount: parseInt(e.target.value, 10) || 0 })}
                          className="rounded-xl text-xs font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Downloadable Archive / File URL</label>
                        <Input 
                          type="text" 
                          value={editingResource.fileUrl || ''} 
                          onChange={e => setEditingResource({ ...editingResource, fileUrl: e.target.value })}
                          placeholder="Direct zip/tar/asset URL..."
                          className="rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Featured Image URL</label>
                        <Input 
                          type="text" 
                          value={editingResource.imageUrl || ''} 
                          onChange={e => setEditingResource({ ...editingResource, imageUrl: e.target.value })}
                          placeholder="Banner image URL..."
                          className="rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Resource Description / Overview</label>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Displayed on Resource Card</span>
                      </div>
                      <Textarea 
                        rows={4}
                        value={editingResource.description} 
                        onChange={e => setEditingResource({ ...editingResource, description: e.target.value })}
                        required
                        placeholder="Comprehensive overview or architectural breakdown of the resource..."
                        className="rounded-xl p-3 text-xs bg-white leading-relaxed font-mono" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Copyable Code / Clone Snippet</label>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Optional Code Block</span>
                      </div>
                      <Textarea 
                        rows={6}
                        value={editingResource.codeBlock || ''} 
                        onChange={e => setEditingResource({ ...editingResource, codeBlock: e.target.value })}
                        placeholder="# Paste code snippet, clone command, or configuration block..."
                        className="rounded-xl p-4 font-mono text-xs bg-neutral-950 text-neutral-100 leading-relaxed border-neutral-800" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Detailed Guide / README Content</label>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Full Documentation</span>
                      </div>
                      <Textarea 
                        rows={8}
                        value={editingResource.content} 
                        onChange={e => setEditingResource({ ...editingResource, content: e.target.value })}
                        required
                        placeholder="Detailed installation, parameters, deployment guide or README markdown..."
                        className="rounded-xl p-3 text-xs bg-white leading-relaxed font-mono" 
                      />
                    </div>
                  </Card>
                </form>
                ) : (
                  <Card className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-neutral-200/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-neutral-50/70">
                      <div className="relative w-full sm:w-72">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                        <Input 
                          type="text" 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Filter vault resources..."
                          className="pl-9 rounded-xl text-xs font-mono bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button 
                          onClick={() => {
                            setShowGithubModal(true);
                            if (githubRepos.length === 0) {
                              fetchUserRepos(githubUsername);
                            }
                          }}
                          className="border border-neutral-300 hover:border-neutral-900 bg-white text-neutral-900 text-[10px] px-3.5 py-2 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-none transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" /> Import from GitHub
                        </button>
                        <button 
                          onClick={() => {
                            const newRes: Resource = {
                              id: `res-${Date.now().toString(36)}`,
                              title: '',
                              description: '',
                              type: 'Script',
                              tags: [],
                              downloadCount: 0,
                              content: '',
                              codeBlock: '',
                              fileUrl: '',
                              githubUrl: '',
                              liveUrl: '',
                              isPremium: false,
                            };
                            setEditingResource(newRes);
                            setResourceTagsInput('');
                            setGithubDirectInput('');
                          }}
                          className="bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] px-4 py-2 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer rounded-none"
                        >
                          <Plus className="w-3.5 h-3.5" /> New Resource
                        </button>
                      </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">ID</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Resource</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-28">Type</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">Tags</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-28">Links</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-20">Count</th>
                          <th className="p-4 w-28 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.filter(r => 
                          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.tags && r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
                        ).map((res) => (
                          <tr key={res.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 text-xs font-mono text-neutral-400">{res.id}</td>
                            <td className="p-4">
                              <div className="font-bold text-xs uppercase text-neutral-950">{res.title}</div>
                              <div className="text-[11px] text-neutral-400 line-clamp-1">{res.description}</div>
                            </td>
                            <td className="p-4">
                              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-neutral-200 bg-neutral-50 text-neutral-700 rounded-none">
                                {res.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(res.tags || []).slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-none">
                                    {tag}
                                  </span>
                                ))}
                                {(res.tags || []).length > 3 && (
                                  <span className="text-[9px] font-mono text-neutral-400">
                                    +{res.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {res.githubUrl && (
                                  <a href={res.githubUrl} target="_blank" rel="noreferrer" title="GitHub Repo" className="text-neutral-500 hover:text-neutral-950">
                                    <Github className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {res.liveUrl && (
                                  <a href={res.liveUrl} target="_blank" rel="noreferrer" title="Live Preview" className="text-neutral-500 hover:text-neutral-950">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-xs font-mono text-neutral-600">
                              {res.downloadCount || 0}
                            </td>
                            <td className="p-4 text-right flex gap-1 justify-end">
                              <button 
                                onClick={() => {
                                  setEditingResource(res);
                                  setResourceTagsInput(res.tags ? res.tags.join(', ') : '');
                                  setGithubDirectInput(res.githubUrl || '');
                                }}
                                className="px-2.5 py-1 border border-neutral-200 text-[9px] font-bold uppercase hover:bg-neutral-100 transition rounded-none cursor-pointer"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Delete resource "${res.title}"?`)) {
                                    await deleteItem('resources', res.id);
                                  }
                                }}
                                className="p-1 text-neutral-400 hover:text-red-600 transition rounded-none cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}

                {/* ─── GITHUB REPOSITORY BROWSER MODAL ─── */}
                {showGithubModal && (
                  <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-neutral-200 w-full max-w-3xl max-h-[85vh] flex flex-col rounded-none shadow-2xl">
                      {/* Modal Header */}
                      <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
                        <div className="flex items-center gap-2">
                          <Github className="w-5 h-5 text-neutral-950" />
                          <div>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-950">
                              Import Resource from GitHub
                            </h3>
                            <p className="text-[11px] text-neutral-500 font-mono">
                              1-Click fetch repo info, README documentation & deployed link
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowGithubModal(false)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-950 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Modal Controls Bar */}
                      <div className="p-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 font-mono">USER:</span>
                          <input 
                            type="text" 
                            value={githubUsername}
                            onChange={e => setGithubUsername(e.target.value)}
                            placeholder="GitHub username"
                            className="border border-neutral-200 px-3 py-1.5 text-xs bg-neutral-50 font-mono w-32 rounded-none"
                          />
                          <button
                            onClick={() => fetchUserRepos(githubUsername)}
                            disabled={isLoadingGithubRepos}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 cursor-pointer disabled:opacity-50 flex items-center gap-1 rounded-none"
                          >
                            {isLoadingGithubRepos ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            Load Repos
                          </button>
                        </div>

                        <div className="flex-grow w-full sm:w-auto flex items-center gap-2 sm:border-l sm:border-neutral-200 sm:pl-3">
                          <input 
                            type="text" 
                            value={githubDirectInput}
                            onChange={e => setGithubDirectInput(e.target.value)}
                            placeholder="Or paste any repo: owner/repo or full URL"
                            className="flex-grow border border-neutral-200 px-3 py-1.5 text-xs font-mono rounded-none"
                          />
                          <button
                            onClick={async () => {
                              if (!githubDirectInput.trim()) return;
                              setImportingRepoName('direct');
                              try {
                                const res = await fetchGithubRepoResource(githubDirectInput);
                                const success = await saveItem('resources', res);
                                if (success) {
                                  setGithubFeedback(`Imported "${res.title}" successfully!`);
                                  setShowGithubModal(false);
                                }
                              } catch (err: any) {
                                alert(err.message || 'Error importing repo.');
                              } finally {
                                setImportingRepoName(null);
                              }
                            }}
                            disabled={importingRepoName === 'direct' || !githubDirectInput.trim()}
                            className="bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 cursor-pointer disabled:opacity-50 shrink-0 rounded-none"
                          >
                            {importingRepoName === 'direct' ? 'Importing...' : 'Direct Import'}
                          </button>
                        </div>
                      </div>

                      {/* Repos List */}
                      <div className="flex-grow overflow-y-auto p-4 space-y-2">
                        {isLoadingGithubRepos ? (
                          <div className="py-16 text-center flex flex-col items-center justify-center gap-2 text-neutral-400 font-mono text-xs">
                            <Loader2 className="w-5 h-5 animate-spin text-neutral-950" />
                            <span>Querying GitHub API for @{githubUsername}...</span>
                          </div>
                        ) : githubRepos.length === 0 ? (
                          <div className="py-12 text-center text-neutral-400 font-mono text-xs">
                            No public repositories found. Enter a GitHub username and click "Load Repos".
                          </div>
                        ) : (
                          githubRepos.map((repo) => {
                            const isImporting = importingRepoName === repo.name;
                            const alreadyImported = resources.some(r => r.id === repo.name.toLowerCase() || r.githubUrl === repo.html_url);

                            return (
                              <div 
                                key={repo.id} 
                                className="border border-neutral-200 p-4 hover:border-neutral-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-xs uppercase text-neutral-950 font-sans tracking-wide">
                                      {repo.name}
                                    </span>
                                    {repo.language && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-700">
                                        {repo.language}
                                      </span>
                                    )}
                                    <span className="text-[10px] font-mono text-neutral-400">
                                      ★ {repo.stargazers_count}
                                    </span>
                                    {repo.homepage && (
                                      <a 
                                        href={repo.homepage} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-[10px] font-mono text-emerald-600 hover:underline flex items-center gap-0.5"
                                      >
                                        <ExternalLink className="w-2.5 h-2.5" /> Deployed
                                      </a>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-500 line-clamp-1 font-sans">
                                    {repo.description || 'No description provided.'}
                                  </p>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                  {alreadyImported && (
                                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                                      In Library
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleOneClickImport(repo)}
                                    disabled={isImporting}
                                    className="bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 rounded-none"
                                  >
                                    {isImporting ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" /> Importing...
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3" /> 1-Click Import
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center text-[10px] font-mono text-neutral-400">
                        <span>Imports README markdown into resource content & sets deployment URLs automatically.</span>
                        <button 
                          onClick={() => setShowGithubModal(false)} 
                          className="px-3 py-1 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-bold uppercase"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── QUERIES / LEADS TAB ─── */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                {activeLead ? (
                  <div className="bg-white border border-neutral-200 p-6 space-y-6 rounded-none relative">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${activeLead.read ? 'bg-neutral-300' : 'bg-rose-500 animate-pulse'}`} />
                        <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">
                          Query {activeLead.id} Details
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {!activeLead.read && (
                          <button 
                            onClick={async () => {
                              await toggleMessageRead(activeLead.id);
                              setActiveLead({ ...activeLead, read: true });
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-none"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Read
                          </button>
                        )}
                        <button 
                          onClick={() => setActiveLead(null)} 
                          className="px-3 py-1.5 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-100 cursor-pointer rounded-none"
                        >
                          Back to Inbox
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-neutral-50 p-4 border border-neutral-200 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Sender Name</span>
                        <span className="text-xs font-semibold text-neutral-900">{activeLead.name}</span>
                      </div>
                      <div className="bg-neutral-50 p-4 border border-neutral-200 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Email Address</span>
                        <a href={`mailto:${activeLead.email}`} className="text-xs font-semibold text-neutral-900 underline font-mono">{activeLead.email}</a>
                      </div>
                      <div className="bg-neutral-50 p-4 border border-neutral-200 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Received At</span>
                        <span className="text-xs font-semibold text-neutral-900 font-mono">{activeLead.time}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-neutral-50 p-4 border border-neutral-200 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Company / Entity</span>
                        <span className="text-xs font-semibold text-neutral-900">{activeLead.company || 'N/A'}</span>
                      </div>
                      <div className="bg-neutral-50 p-4 border border-neutral-200 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Service Requested</span>
                        <span className="text-xs font-semibold text-neutral-900 font-mono uppercase">{activeLead.service || 'General'}</span>
                      </div>
                      <div className="bg-neutral-50 p-4 border border-neutral-200 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Stated Budget</span>
                        <span className="text-xs font-semibold text-neutral-900 font-mono">{activeLead.budget || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 p-6 flex flex-col gap-3 min-h-[150px]">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Message Content Description</span>
                      <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans">{activeLead.content}</p>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/70">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-700">Queries / Leads Inbox</h3>
                      <Badge variant="outline" className="text-[10px] font-mono font-bold bg-rose-50 text-rose-600 border-rose-200 rounded-full px-2.5">
                        {unreadLeads} UNREAD
                      </Badge>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-28">Ref Code</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Sender Name</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Subject</th>
                          <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-36">Received At</th>
                          <th className="p-4 w-24 text-right text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((lead) => (
                          <tr key={lead.id} className={`border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors ${!lead.read ? 'bg-rose-50/20 font-bold' : ''}`}>
                            <td className="p-4 text-xs font-mono text-neutral-400">{lead.id}</td>
                            <td className="p-4 text-xs text-neutral-900 flex items-center gap-2">
                              {!lead.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />}
                              {lead.name}
                            </td>
                            <td className="p-4 text-xs text-neutral-500 max-w-[200px] truncate">{lead.subject}</td>
                            <td className="p-4 text-xs text-neutral-400 font-mono">{lead.time}</td>
                            <td className="p-4 text-right">
                              <Button 
                                variant="outline"
                                size="xs"
                                onClick={async () => {
                                  setActiveLead(lead);
                                  if (!lead.read) {
                                    await toggleMessageRead(lead.id);
                                  }
                                }}
                                className="rounded-full text-[10px]"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {messages.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-16 text-center text-neutral-400 font-mono text-xs uppercase tracking-wider">
                              Inbox is completely empty.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Card>
                )}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all uppercase text-[10px] font-bold tracking-wider rounded-none cursor-pointer ${
        active 
          ? 'bg-white text-neutral-950 border-l-4 border-neutral-950 font-extrabold' 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-l-4 border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
