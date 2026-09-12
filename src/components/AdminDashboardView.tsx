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
  Clock
} from 'lucide-react';
import { useData, MessageItemData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Project, BlogPost } from '../types';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// ─── Cloudinary Image Uploader Widget ─────────────────────────────────────────
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

// ─── ADMIN DASHBOARD MAIN component ──────────────────────────────────────────
export default function AdminDashboardView() {
  const router = useRouter();
  const { logout } = useAuth();
  const { 
    projects, 
    blogs, 
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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'blogs' | 'leads'>('dashboard');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [activeLead, setActiveLead] = useState<MessageItemData | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Reset search term on tab shift
  useEffect(() => {
    setSearchTerm('');
    setEditingProject(null);
    setIsCustomCategory(false);
    setEditingBlog(null);
    setActiveLead(null);
  }, [activeTab]);

  // Statistics calculations
  const totalProjects = projects.length;
  const totalBlogs = blogs.length;
  const totalLeads = messages.length;
  const unreadLeads = messages.filter(m => !m.read).length;

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    try {
      const success = await saveItem('projects', editingProject);
      if (success) {
        setEditingProject(null);
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

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    setIsSaving(true);
    try {
      const success = await saveItem('blogs', editingBlog);
      if (success) {
        setEditingBlog(null);
      } else {
        alert("Could not save blog post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog.");
    } finally {
      setIsSaving(false);
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
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={<FolderGit className="w-4 h-4" />} 
              label="Projects" 
              active={activeTab === 'projects'} 
              onClick={() => setActiveTab('projects')} 
            />
            <SidebarItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Blog Posts" 
              active={activeTab === 'blogs'} 
              onClick={() => setActiveTab('blogs')} 
            />
            <SidebarItem 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="Queries / Leads" 
              active={activeTab === 'leads'} 
              onClick={() => setActiveTab('leads')} 
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

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">TOTAL PROJECTS</span>
                    <span className="text-3xl font-extrabold text-neutral-950">{totalProjects}</span>
                  </div>
                  <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">TOTAL ESSAYS</span>
                    <span className="text-3xl font-extrabold text-neutral-950">{totalBlogs}</span>
                  </div>
                  <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">TOTAL LEADS / INQUIRIES</span>
                    <span className="text-3xl font-extrabold text-neutral-950">{totalLeads}</span>
                  </div>
                  <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">UNREAD INQUIRIES</span>
                    <span className="text-3xl font-extrabold text-rose-600">{unreadLeads}</span>
                  </div>
                </div>

                {/* Cloudinary Info Panel */}
                <div className="bg-white border border-neutral-200 p-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-neutral-800">
                    <Settings className="w-4 h-4" /> Cloudinary Configuration Help
                  </h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-3xl">
                    To upload images directly, enter your Cloudinary configuration parameters inside any image upload box. These values will be persisted in your local workspace sandbox cache. Alternatively, configure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in your `.env` environment variables.
                  </p>
                </div>
              </div>
            )}

            {/* ─── PROJECTS TAB ─── */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {editingProject ? (
                  <form onSubmit={handleSaveProject} className="bg-white border border-neutral-200 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">
                        {projects.some(p => p.id === editingProject.id) ? 'Modify Project' : 'Provision Project'}
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingProject(null);
                            setIsCustomCategory(false);
                          }} 
                          className="px-3 py-1.5 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-100 cursor-pointer rounded-none"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-none disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Project'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Unique ID</label>
                        <input 
                          type="text" 
                          value={editingProject.id} 
                          onChange={e => setEditingProject({ ...editingProject, id: e.target.value })}
                          required
                          disabled={projects.some(p => p.id === editingProject.id)}
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-neutral-50 disabled:text-neutral-400 rounded-none font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Title</label>
                        <input 
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
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Type / Category</label>
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
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none cursor-pointer"
                        >
                          <option value="">-- Select Category --</option>
                          {existingCategories.map(cat => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                          ))}
                          <option value="__NEW__">+ ADD NEW CATEGORY...</option>
                        </select>

                        {isCustomCategory && (
                          <div className="flex items-center gap-2 mt-2">
                            <input 
                              type="text" 
                              value={editingProject.projectType} 
                              onChange={e => setEditingProject({ ...editingProject, projectType: e.target.value })}
                              required
                              autoFocus
                              placeholder="Enter new custom category (e.g. Web3, AI Tools)..."
                              className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none font-mono" 
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomCategory(false);
                                setEditingProject({ ...editingProject, projectType: '' });
                              }}
                              className="text-[10px] font-mono text-neutral-500 hover:text-neutral-800 uppercase px-2 py-2 border border-neutral-200 shrink-0"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Publication Status</label>
                        <select 
                          value={editingProject.status} 
                          onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none cursor-pointer"
                        >
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Published">Published (Live)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Featured status</label>
                        <select 
                          value={editingProject.featured ? 'Featured' : 'Standard'} 
                          onChange={e => setEditingProject({ ...editingProject, featured: e.target.value === 'Featured' })}
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none cursor-pointer"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Featured">Featured</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Live / Production URL</label>
                        <input 
                          type="text" 
                          value={editingProject.liveUrl || ''} 
                          onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                          placeholder="e.g. App Store, Play Store or web link"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Screenshot URL</label>
                        <input 
                          type="text" 
                          value={editingProject.screenshotUrl || ''} 
                          onChange={e => setEditingProject({ ...editingProject, screenshotUrl: e.target.value })}
                          placeholder="Enter URL or upload image below..."
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none font-mono" 
                        />
                      </div>
                    </div>

                    <CloudinaryUploader 
                      currentUrl={editingProject.screenshotUrl}
                      onUploadSuccess={(url) => setEditingProject({ ...editingProject, screenshotUrl: url })}
                    />

                    <div className="flex flex-col gap-2 min-h-[300px]">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Detailed Description</label>
                      <div className="flex-grow flex flex-col min-h-[250px] border border-neutral-200">
                        <ReactQuill 
                          theme="snow" 
                          value={editingProject.description}
                          onChange={(val) => setEditingProject({ ...editingProject, description: val })}
                          className="flex-grow flex flex-col font-sans text-sm bg-white"
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Projects Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">TOTAL PROJECTS</span>
                        <span className="text-3xl font-extrabold text-neutral-950">{projects.length}</span>
                      </div>
                      <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">PUBLISHED (LIVE)</span>
                        <span className="text-3xl font-extrabold text-neutral-950">
                          {projects.filter(p => p.status === 'Published').length}
                        </span>
                      </div>
                      <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">DRAFTS (HIDDEN)</span>
                        <span className="text-3xl font-extrabold text-neutral-500">
                          {projects.filter(p => p.status === 'Draft').length}
                        </span>
                      </div>
                      <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between gap-4">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">CATEGORIES</span>
                        <span className="text-3xl font-extrabold text-neutral-950">{existingCategories.length}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-none shadow-xs overflow-hidden">
                      <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Search projects..."
                          className="pl-9 pr-4 py-1.5 border border-neutral-200 text-xs w-64 focus:outline-hidden focus:border-neutral-950 bg-white font-mono"
                        />
                      </div>
                      <button 
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
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer rounded-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> New Project
                      </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">ID</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Title</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-32">Type</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-28">Status</th>
                          <th className="p-4 w-28 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500">Actions</th>
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
                                   <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-none">
                                     ★ FEATURED
                                   </span>
                                 )}
                               </div>
                             </td>
                            <td className="p-4 text-xs text-neutral-500 font-mono uppercase">{project.projectType}</td>
                            <td className="p-4">
                              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded-none ${
                                project.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="p-4 text-right flex gap-1 justify-end">
                              <button 
                                onClick={() => {
                                  setIsCustomCategory(Boolean(project.projectType && !existingCategories.includes(project.projectType)));
                                  setEditingProject(project);
                                }}
                                className="px-2.5 py-1 border border-neutral-200 text-[9px] font-bold uppercase hover:bg-neutral-100 transition rounded-none cursor-pointer"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm("Delete project?")) {
                                    await deleteItem('projects', project.id);
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
                  </div>
                </>
              )}
              </div>
            )}

            {/* ─── BLOG POSTS TAB ─── */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                {editingBlog ? (
                  <form onSubmit={handleSaveBlog} className="bg-white border border-neutral-200 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">
                        {blogs.some(b => b.slug === editingBlog.slug) ? 'Modify Blog Post' : 'Write Blog Post'}
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => setEditingBlog(null)} 
                          className="px-3 py-1.5 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-100 cursor-pointer rounded-none"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-none disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Post'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">SEO Route Slug (ID)</label>
                        <input 
                          type="text" 
                          value={editingBlog.slug} 
                          onChange={e => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                          required
                          disabled={blogs.some(b => b.slug === editingBlog.slug)}
                          placeholder="e.g. building-scalable-systems"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-neutral-50 disabled:text-neutral-400 rounded-none font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Post Title</label>
                        <input 
                          type="text" 
                          value={editingBlog.title} 
                          onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })}
                          required
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Read Time Indicator</label>
                        <input 
                          type="text" 
                          value={editingBlog.readTime} 
                          onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                          required
                          placeholder="e.g. 5 MIN READ"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Categories (Comma-separated)</label>
                        <input 
                          type="text" 
                          value={(editingBlog.categories || []).join(', ')} 
                          onChange={e => setEditingBlog({ ...editingBlog, categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
                          placeholder="e.g. Design, Architecture"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none font-semibold font-sans" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tags (Comma-separated)</label>
                        <input 
                          type="text" 
                          value={(editingBlog.tags || []).join(', ')} 
                          onChange={e => setEditingBlog({ ...editingBlog, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                          placeholder="e.g. TECH, DEV"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none font-mono" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Status</label>
                        <select 
                          value={editingBlog.status} 
                          onChange={e => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                          className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none cursor-pointer font-semibold"
                        >
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Published">Published (Live)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cover Image Link / Uploader</label>
                      <input 
                        type="text" 
                        value={editingBlog.coverImage || ''} 
                        onChange={e => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                        placeholder="Enter direct URL or upload below..."
                        className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white rounded-none font-mono mb-2" 
                      />
                      <CloudinaryUploader 
                        currentUrl={editingBlog.coverImage}
                        onUploadSuccess={(url) => setEditingBlog({ ...editingBlog, coverImage: url })}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Short Summary Excerpt</label>
                      <textarea 
                        rows={2} 
                        value={editingBlog.excerpt} 
                        onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                        required
                        className="w-full border border-neutral-200 p-3 text-xs bg-white rounded-none font-sans" 
                      />
                    </div>

                    <div className="flex flex-col gap-2 min-h-[300px]">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Detailed Essay Body</label>
                      <div className="flex-grow flex flex-col min-h-[250px] border border-neutral-200">
                        <ReactQuill 
                          theme="snow" 
                          value={editingBlog.contentHtml}
                          onChange={(val) => setEditingBlog({ ...editingBlog, contentHtml: val })}
                          className="flex-grow flex flex-col font-sans text-sm bg-white"
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-none shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Search essays..."
                          className="pl-9 pr-4 py-1.5 border border-neutral-200 text-xs w-64 focus:outline-hidden focus:border-neutral-950 bg-white font-mono"
                        />
                      </div>
                      <button 
                        onClick={() => setEditingBlog({
                          slug: `essay-${Math.floor(Math.random() * 1000)}`,
                          title: '',
                          excerpt: '',
                          publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                          readTime: '',
                          tags: [],
                          categories: [],
                          contentHtml: '',
                          coverImage: '',
                          status: 'Published',
                          lastModified: new Date().toISOString().split('T')[0]
                        })}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer rounded-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> Write Essay
                      </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">Slug</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Title</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">Categories</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-28">Status</th>
                          <th className="p-4 w-28 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map((blog) => (
                          <tr key={blog.slug} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 text-xs font-mono text-neutral-400">{blog.slug}</td>
                            <td className="p-4 text-xs font-bold uppercase text-neutral-950">{blog.title}</td>
                            <td className="p-4 text-xs text-neutral-500 font-mono uppercase">{(blog.categories || []).join(', ')}</td>
                            <td className="p-4">
                              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded-none ${
                                blog.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              }`}>
                                {blog.status}
                              </span>
                            </td>
                            <td className="p-4 text-right flex gap-1 justify-end">
                              <button 
                                onClick={() => setEditingBlog(blog)}
                                className="px-2.5 py-1 border border-neutral-200 text-[9px] font-bold uppercase hover:bg-neutral-100 transition rounded-none cursor-pointer"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm("Delete blog?")) {
                                    await deleteItem('blogs', blog.slug);
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
                  <div className="bg-white border border-neutral-200 rounded-none shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-700">Queries / Leads Inbox</h3>
                      <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-600 px-3 py-1 border border-rose-100">
                        {unreadLeads} UNREAD
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100/50">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-28">Ref Code</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Sender Name</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Subject</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">Received At</th>
                          <th className="p-4 w-24 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500">Actions</th>
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
                              <button 
                                onClick={async () => {
                                  setActiveLead(lead);
                                  if (!lead.read) {
                                    await toggleMessageRead(lead.id);
                                  }
                                }}
                                className="px-3 py-1 border border-neutral-200 text-[9px] font-bold uppercase hover:bg-neutral-950 hover:text-white transition rounded-none cursor-pointer"
                              >
                                View
                              </button>
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
                  </div>
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
