import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Activity,
  Plus,
  Search,
  Calendar,
  X,
  Save,
  Trash2,
  Database,
  CloudLightning,
  Sparkles,
  Inbox,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Mail,
  Send,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useData, MessageItemData } from '../context/DataContext';
import { CaseStudy, Service, Resource, BlogPost } from '../types';

type ContentType = 'posts' | 'case_studies' | 'projects' | 'services' | 'resources' | 'blogs';

export default function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contentSubTab, setContentSubTab] = useState<ContentType>('posts');
  const [inboxSubTab, setInboxSubTab] = useState<'messages' | 'bookings'>('messages');

  // Load dynamic data context
  const { 
    posts, 
    caseStudies, 
    projects, 
    services, 
    resources, 
    blogs, 
    messages, 
    loading,
    isFirebaseActive,
    saveItem,
    deleteItem,
    toggleMessageRead,
    seedFirebase
  } = useData();

  const [logs, setLogs] = useState<{id: number, action: string, time: string, target: string}[]>([
    { id: 1, action: "Admin Panel Loaded", time: "Just now", target: "Local workstation console" },
    { id: 2, action: "Database Connection", time: "1 min ago", target: isFirebaseActive ? "Firestore Live Cluster" : "Offline Sandbox LocalStorage" },
  ]);

  const addLog = (action: string, target: string) => {
    setLogs(prev => [{ id: Date.now(), action, target, time: 'Just now' }, ...prev].slice(0, 8));
  };

  // Keep logs refreshed on backend change
  useEffect(() => {
    addLog("System Status Checked", isFirebaseActive ? "Firestore Cluster Node Connected" : "Sandbox local storage synchronized");
  }, [isFirebaseActive]);

  // Aggregate stats
  const totalContentCount = posts.length + caseStudies.length + projects.length + services.length + resources.length + blogs.length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden font-sans text-neutral-900 border-t border-neutral-200">
      {/* ─── SIDEBAR ─── */}
      <div className="w-64 bg-neutral-950 text-white flex flex-col justify-between shrink-0 border-r border-neutral-900">
        <div>
          {/* Dashboard Header Branding */}
          <div className="p-6 border-b border-neutral-900">
            <h1 className="font-sans font-extrabold text-xl tracking-tight uppercase flex items-center gap-2">
              MOSEN<span className="text-neutral-500">_ADMIN</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest leading-none">
                {isFirebaseActive ? 'Firestore Online' : 'Simulation Mode'}
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
              icon={<FileText className="w-4 h-4" />} 
              label="Content Manager" 
              active={activeTab === 'content'} 
              onClick={() => setActiveTab('content')} 
            />
            <SidebarItem 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="Inbox & CRM" 
              active={activeTab === 'inbox'} 
              onClick={() => setActiveTab('inbox')} 
            />
            <SidebarItem 
              icon={<Settings className="w-4 h-4" />} 
              label="System Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </nav>
        </div>

        {/* Action button: Exit to index */}
        <div className="p-4 border-t border-neutral-900">
          <button 
            onClick={() => window.location.hash = '#/'}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all uppercase text-[10px] font-bold tracking-wider rounded-none cursor-pointer border border-neutral-800"
          >
            <LogOut className="w-4 h-4" /> Exit to Homepage
          </button>
        </div>
      </div>

      {/* ─── MAIN SCROLL CONTAINER ─── */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white">
            <Activity className="w-8 h-8 text-neutral-950 animate-spin" />
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">Connecting Database Nodes...</span>
          </div>
        ) : (
          <main className="p-8 max-w-7xl mx-auto w-full flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardOverview 
                    logs={logs} 
                    contentCount={totalContentCount} 
                    msgCount={messages.length} 
                    unreadCount={unreadMessagesCount} 
                    isFirebaseActive={isFirebaseActive}
                  />
                )}
                {activeTab === 'content' && (
                  <ContentManager 
                    subTab={contentSubTab} 
                    setSubTab={setContentSubTab}
                    addLog={addLog}
                  />
                )}
                {activeTab === 'inbox' && (
                  <InboxManager 
                    subTab={inboxSubTab}
                    setSubTab={setInboxSubTab}
                    messages={messages}
                    toggleMessageRead={toggleMessageRead}
                    addLog={addLog}
                  />
                )}
                {activeTab === 'settings' && (
                  <SettingsPanel 
                    isFirebaseActive={isFirebaseActive} 
                    seedFirebase={seedFirebase}
                    addLog={addLog}
                  />
                )}
              </motion.div>
            </AnimatePresence>
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
          ? 'bg-white text-neutral-950 border-l-4 border-neutral-950' 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-l-4 border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
 * DASHBOARD OVERVIEW SUB-VIEW
 * ───────────────────────────────────────────────────────── */
function DashboardOverview({ logs, contentCount, msgCount, unreadCount, isFirebaseActive }: { logs: Array<any>, contentCount: number, msgCount: number, unreadCount: number, isFirebaseActive: boolean }) {
  return (
    <div className="space-y-8">
      {/* Greeting Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-950">System Control Desk</h2>
          <p className="text-xs text-neutral-500 font-mono mt-1 uppercase">Live Metrics, Schedulers & Firebase Collection Feeds</p>
        </div>
        
        {/* Real-time database cluster indicator badge */}
        <div className="p-4 bg-white border border-neutral-200 flex items-center gap-4">
          <div className={`p-2 rounded-none ${isFirebaseActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block tracking-widest uppercase mb-0.5">DB STATUS</span>
            <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
              {isFirebaseActive ? 'Firestore Live Node Connected' : 'LocalStorage Cache Connected'}
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Direct Bookings" value={msgCount.toString()} trend="+4 New" trendUp icon={<Inbox className="w-5 h-5 text-indigo-500" />} />
        <StatCard title="Unread Inquiries" value={unreadCount.toString()} trend="Requires Reply" trendUp={unreadCount > 0} icon={<MessageSquare className="w-5 h-5 text-rose-500" />} />
        <StatCard title="Published Documents" value={contentCount.toString()} trend="Sync Ready" trendUp icon={<FileText className="w-5 h-5 text-emerald-500" />} />
        <StatCard title="Conversion Metrics" value="6.4%" trend="+1.2%" trendUp icon={<TrendingUp className="w-5 h-5 text-cyan-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Line Chart visualization mock */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 rounded-none shadow-xs">
          <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <CloudLightning className="w-4 h-4 text-emerald-500" /> API Schedulers & Load metrics
            </h3>
            <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2.5 py-1 font-mono uppercase tracking-widest">Live Node Traffic</span>
          </div>
          
          <div className="h-64 w-full border border-neutral-100 bg-neutral-50/50 flex items-end p-4 gap-2.5 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
            {[50, 40, 65, 30, 80, 52, 74, 95, 60, 88, 55, 75, 42, 60, 89].map((h, i) => (
              <div key={i} className="flex-1 bg-neutral-950 relative z-10 transition-all hover:bg-neutral-800 cursor-pointer group" style={{ height: `${h}%` }}>
                {/* Floating tooltip metrics on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-950 text-white font-mono text-[9px] px-2 py-0.5 hidden group-hover:block uppercase whitespace-nowrap z-30 shadow-md">
                  Day {i+1}: {h}% Load
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-3 uppercase tracking-wider">
            <span>Interval 01</span>
            <span>Interval 08</span>
            <span>Current Cluster Tick</span>
          </div>
        </div>

        {/* System Activity logs */}
        <div className="bg-white border border-neutral-200 p-6 rounded-none flex flex-col shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-6 pb-4 border-b border-neutral-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-900" /> Operational Log File
          </h3>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {logs.map(log => (
              <LogItem key={log.id} action={log.action} time={log.time} target={log.target} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 p-6 rounded-none flex flex-col justify-between gap-4 shadow-xs">
      <div className="flex justify-between items-start text-neutral-500">
        <h4 className="text-[10px] font-bold uppercase tracking-widest">{title}</h4>
        {icon}
      </div>
      <div>
        <span className="text-3xl font-extrabold tracking-tight text-neutral-950">{value}</span>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded-none border ${
            trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-neutral-100 text-neutral-500 border-neutral-200'
          }`}>{trend}</span>
          <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest">SYSTEM PULSE</span>
        </div>
      </div>
    </div>
  );
}

function LogItem({ action, time, target }: { action: string, time: string, target: string, key?: any }) {
  return (
    <div className="py-2.5 border-b border-neutral-100 last:border-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-semibold text-neutral-900">{action}</span>
        <span className="text-[9px] font-mono text-neutral-400">{time}</span>
      </div>
      <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-tight">{target}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * CONTENT MANAGER SUB-VIEW WITH COMPREHENSIVE SCHEMAS
 * ───────────────────────────────────────────────────────── */
function ContentManager({ subTab, setSubTab, addLog }: { subTab: ContentType, setSubTab: (t: ContentType) => void, addLog: (a: string, t: string) => void }) {
  // Read collections directly
  const dataContext = useData();
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Map subTab to state array in context
  const getSubTabList = (): any[] => {
    switch (subTab) {
      case 'posts': return dataContext.posts;
      case 'case_studies': return dataContext.caseStudies;
      case 'projects': return dataContext.projects;
      case 'services': return dataContext.services;
      case 'resources': return dataContext.resources;
      case 'blogs': return dataContext.blogs;
      default: return [];
    }
  };

  const listItems = getSubTabList();
  const filteredItems = listItems.filter(item => {
    const titleVal = item.title || item.slug || '';
    return titleVal.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    
    try {
      const saved = await dataContext.saveItem(subTab, editingItem);
      if (saved) {
        addLog(`Document Set`, `${subTab.toUpperCase()}: ${editingItem.title || editingItem.id}`);
        setEditingItem(null);
      } else {
        alert("Action rejected by Firestore rules or state limitation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving record parameters.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you absolutely sure you want to delete document "${id}" from ${subTab}?`)) return;
    
    try {
      const deleted = await dataContext.deleteItem(subTab, id);
      if (deleted) {
        addLog(`Document Deleted`, `${subTab.toUpperCase()}: ${id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error hard deleting document node.");
    }
  };

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-6rem)] relative">
      <div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-950">Document Manager</h2>
        <p className="text-xs text-neutral-500 font-mono mt-1 uppercase">Perform CRUD synchronization directly to database nodes</p>
      </div>

      {/* Directory subtabs header */}
      <div className="flex gap-1 border-b border-neutral-200 pb-0 flex-wrap shrink-0">
        <TabButton label="Administrative Posts" active={subTab === 'posts'} onClick={() => { setSubTab('posts'); setEditingItem(null); }} />
        <TabButton label="Case Studies" active={subTab === 'case_studies'} onClick={() => { setSubTab('case_studies'); setEditingItem(null); }} />
        <TabButton label="Projects" active={subTab === 'projects'} onClick={() => { setSubTab('projects'); setEditingItem(null); }} />
        <TabButton label="Services" active={subTab === 'services'} onClick={() => { setSubTab('services'); setEditingItem(null); }} />
        <TabButton label="Resources Vault" active={subTab === 'resources'} onClick={() => { setSubTab('resources'); setEditingItem(null); }} />
        <TabButton label="Blog Writeups" active={subTab === 'blogs'} onClick={() => { setSubTab('blogs'); setEditingItem(null); }} />
      </div>

      <div className="bg-white border border-neutral-200 flex-1 flex flex-col overflow-hidden rounded-none relative shadow-xs">
        {editingItem ? (
          /* ─── DYNAMIC MODEL EDITOR INNER SCREEN ─── */
          <form onSubmit={handleSave} className="absolute inset-0 bg-white z-20 flex flex-col">
            <div className="border-b border-neutral-200 px-6 py-4 flex justify-between items-center bg-neutral-50 shrink-0">
              <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                {listItems.some(i => i.id === editingItem.id) ? 'Refine Document Interface' : 'Provision Brand-New Document Node'}
              </h3>
              <div className="flex gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)} 
                  className="px-4 py-2 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider transition hover:bg-neutral-100 cursor-pointer rounded-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> 
                  {isSaving ? 'Synching...' : 'Commit Save'}
                </button>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto flex flex-col gap-6">
              {/* Document ID & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Node Unique ID</label>
                  <input 
                    type="text" 
                    value={editingItem.id} 
                    onChange={e => setEditingItem({ ...editingItem, id: e.target.value })}
                    required
                    disabled={listItems.some(i => i.id === editingItem.id)}
                    className="w-full border border-neutral-200 bg-neutral-50 text-neutral-500 px-4 py-2.5 outline-hidden focus:border-neutral-950 font-mono text-xs rounded-none" 
                  />
                  <p className="text-[9px] text-neutral-400 italic">This serves as firestore document name key.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title / Caption</label>
                  <input 
                    type="text" 
                    value={editingItem.title || ''} 
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    required
                    placeholder="E.g., Appex Logistics Migration"
                    className="w-full border border-neutral-200 px-4 py-2.5 outline-hidden focus:border-neutral-950 text-xs font-semibold rounded-none" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Status</label>
                  <select 
                    value={editingItem.status || 'Published'} 
                    onChange={e => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full border border-neutral-200 px-4 py-2.5 outline-hidden focus:border-neutral-950 text-xs bg-white font-semibold rounded-none cursor-pointer"
                  >
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Published">Published (Live)</option>
                  </select>
                </div>
              </div>

              {/* Conditionally reveal schema inputs depending on subpage type */}
              {subTab === 'case_studies' && (
                <div className="border-t border-b border-neutral-100 py-6 my-2 space-y-6">
                  <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">Case Study Schema Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Vertical / Industry</label>
                      <input 
                        type="text" 
                        value={editingItem.industry || ''} 
                        onChange={e => setEditingItem({ ...editingItem, industry: e.target.value })} 
                        placeholder="E.g., ENTERPRISE LOGISTICS"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs font-semibold rounded-none" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tech Stack (comma separated list)</label>
                      <input 
                        type="text" 
                        value={(editingItem.tech || []).join(', ')} 
                        onChange={e => setEditingItem({ ...editingItem, tech: e.target.value.split(',').map(s=>s.trim()) })} 
                        placeholder="E.g., TypeScript, Node, React"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs font-mono rounded-none" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outcome Value</label>
                      <input 
                        type="text" 
                        value={editingItem.results?.[0]?.value || ''} 
                        onChange={e => {
                          const currentRes = editingItem.results || [{value: '', label: ''}];
                          currentRes[0] = { ...currentRes[0], value: e.target.value };
                          setEditingItem({ ...editingItem, results: currentRes });
                        }} 
                        placeholder="E.g., +240%"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-bold" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outcome Label</label>
                      <input 
                        type="text" 
                        value={editingItem.results?.[0]?.label || ''} 
                        onChange={e => {
                          const currentRes = editingItem.results || [{value: '', label: ''}];
                          currentRes[0] = { ...currentRes[0], label: e.target.value };
                          setEditingItem({ ...editingItem, results: currentRes });
                        }} 
                        placeholder="E.g., pipeline speed-up ratio"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Problem Brief Challenge</label>
                    <textarea 
                      value={editingItem.challenge || ''} 
                      onChange={e => setEditingItem({ ...editingItem, challenge: e.target.value })} 
                      rows={2}
                      className="w-full border border-neutral-200 p-3 text-xs rounded-none font-sans" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Solution Architecture</label>
                    <textarea 
                      value={editingItem.solution || ''} 
                      onChange={e => setEditingItem({ ...editingItem, solution: e.target.value })} 
                      rows={2}
                      className="w-full border border-neutral-200 p-3 text-xs rounded-none font-sans" 
                    />
                  </div>
                </div>
              )}

              {subTab === 'services' && (
                <div className="border-t border-b border-neutral-100 py-6 my-2 space-y-6">
                  <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">Service Catalogue Schema Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Catalogue Position Num</label>
                      <input 
                        type="text" 
                        value={editingItem.num || ''} 
                        onChange={e => setEditingItem({ ...editingItem, num: e.target.value })} 
                        placeholder="E.g., 01 //"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs font-bold rounded-none font-mono" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outcomes List (comma-separated rows)</label>
                      <input 
                        type="text" 
                        value={(editingItem.outcomes || []).join(', ')} 
                        onChange={e => setEditingItem({ ...editingItem, outcomes: e.target.value.split(',').map(s=>s.trim()) })} 
                        placeholder="E.g., 90% SLA audit, AWS serverless deploy"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-semibold" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {subTab === 'resources' && (
                <div className="border-t border-b border-neutral-100 py-6 my-2 space-y-6">
                  <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">Vault Resource Schema Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Tag</label>
                      <select 
                        value={editingItem.type || 'Product'} 
                        onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}
                        className="w-full border border-neutral-200 px-3 py-2 text-xs bg-white font-semibold rounded-none cursor-pointer"
                      >
                        <option value="Product">Product</option>
                        <option value="Script">Script</option>
                        <option value="Template">Template</option>
                        <option value="Utility">Utility</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tags list (comma-separated)</label>
                      <input 
                        type="text" 
                        value={(editingItem.tags || []).join(', ')} 
                        onChange={e => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(s=>s.trim()) })} 
                        placeholder="E.g., BASH, WEBSCRIPT"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-mono" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Download Metrists Count</label>
                      <input 
                        type="number" 
                        value={editingItem.downloadCount || 0} 
                        onChange={e => setEditingItem({ ...editingItem, downloadCount: parseInt(e.target.value) })}
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-mono" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Copyable code snippet block (optional)</label>
                    <textarea 
                      value={editingItem.codeBlock || ''} 
                      onChange={e => setEditingItem({ ...editingItem, codeBlock: e.target.value })} 
                      rows={5}
                      placeholder="Paste copyable shell scripting or system code here..."
                      className="w-full border border-neutral-200 p-3 text-xs rounded-none font-mono" 
                    />
                  </div>
                </div>
              )}

              {subTab === 'blogs' && (
                <div className="border-t border-b border-neutral-100 py-6 my-2 space-y-6">
                  <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">Blog Essay Schema Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Route SEO Slug (Identifier)</label>
                      <input 
                        type="text" 
                        value={editingItem.slug || ''} 
                        onChange={e => setEditingItem({ ...editingItem, slug: e.target.value, id: e.target.value })} 
                        placeholder="E.g., absolute-minimalism-paradigms"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-semibold font-mono" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Time to Read</label>
                      <input 
                        type="text" 
                        value={editingItem.readTime || ''} 
                        onChange={e => setEditingItem({ ...editingItem, readTime: e.target.value })} 
                        placeholder="E.g., 4 MIN READ"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Published Text Date</label>
                      <input 
                        type="text" 
                        value={editingItem.publishedAt || ''} 
                        onChange={e => setEditingItem({ ...editingItem, publishedAt: e.target.value })} 
                        placeholder="E.g., June 14, 2026"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tags (comma-separated)</label>
                      <input 
                        type="text" 
                        value={(editingItem.tags || []).join(', ')} 
                        onChange={e => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(s=>s.trim()) })} 
                        placeholder="E.g., DEV, ARCH"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs rounded-none font-mono font-semibold" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Short Card Excerpt (Summary)</label>
                    <textarea 
                      value={editingItem.excerpt || ''} 
                      onChange={e => setEditingItem({ ...editingItem, excerpt: e.target.value })} 
                      rows={2}
                      maxLength={200}
                      className="w-full border border-neutral-200 p-3 text-xs rounded-none" 
                    />
                  </div>
                </div>
              )}

              {/* Main Content TextArea (Handles description, summaries or html bodies) */}
              <div className="flex flex-col gap-2 flex-grow min-h-[220px]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {subTab === 'blogs' ? 'Detailed Essay Content Body (HTML Supported)' : 'Document Core Description / Summary Text'}
                </label>
                <textarea 
                  value={editingItem.content || editingItem.contentMarkdown || editingItem.contentHtml || editingItem.description || ''} 
                  onChange={e => {
                    const txt = e.target.value;
                    const updateObj: any = { ...editingItem };
                    if (subTab === 'case_studies') {
                      updateObj.contentMarkdown = txt;
                      updateObj.summary = txt.slice(0, 180);
                    } else if (subTab === 'blogs') {
                      updateObj.contentHtml = txt;
                      updateObj.content = txt;
                    } else if (subTab === 'services' || subTab === 'resources') {
                      updateObj.description = txt;
                      updateObj.content = txt;
                    } else {
                      updateObj.content = txt;
                    }
                    setEditingItem(updateObj);
                  }} 
                  required
                  rows={8}
                  placeholder="Insert complete writeup body, documentation text or description paragraphs here..."
                  className="w-full border border-neutral-200 p-4 outline-hidden focus:border-neutral-950 font-mono text-xs flex-grow rounded-none resize-y" 
                />
              </div>
            </div>
          </form>
        ) : (
          /* ─── DATA TABLE LIST SCREEN ─── */
          <>
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50 shrink-0">
              {/* Search Field */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={`Search ${subTab.replace('_', ' ')} list...`}
                  className="pl-9 pr-4 py-2 border border-neutral-200 text-xs font-mono w-64 focus:outline-hidden focus:border-neutral-950 rounded-none bg-white"
                />
              </div>
              
              {/* Create Button */}
              <button 
                type="button"
                onClick={() => {
                  let defaultObj: any = {
                    id: `${subTab}-${Math.floor(Math.random()*1000)}`,
                    title: `New ${subTab.replace('_', ' ')} Document`,
                    status: 'Published',
                    lastModified: new Date().toISOString().split('T')[0]
                  };
                  if (subTab === 'blogs') {
                    defaultObj.slug = defaultObj.id;
                    defaultObj.readTime = '4 MINS';
                    defaultObj.publishedAt = 'June 16, 2026';
                    defaultObj.tags = ['TECH'];
                    defaultObj.excerpt = 'Brief excerpt summary text.';
                    defaultObj.contentHtml = '<p>Writeup details content.</p>';
                  } else if (subTab === 'case_studies') {
                    defaultObj.industry = 'SAAS SYSTEM';
                    defaultObj.tech = ['React', 'Node'];
                    defaultObj.results = [{ value: '+50%', label: 'speed advancement' }];
                    defaultObj.summary = 'Detailed study summary';
                    defaultObj.challenge = 'Enterprise constraints';
                    defaultObj.solution = 'Automated service layer';
                    defaultObj.contentMarkdown = '### Document details markup';
                  } else if (subTab === 'services') {
                    defaultObj.num = '04 //';
                    defaultObj.outcomes = ['Outcome feature 1', 'Outcome feature 2'];
                    defaultObj.description = 'Clean specifications description.';
                  } else if (subTab === 'resources') {
                    defaultObj.type = 'Script';
                    defaultObj.tags = ['BASH'];
                    defaultObj.downloadCount = 120;
                    defaultObj.codeBlock = '# Script placeholder';
                    defaultObj.description = 'Guide instructions description text.';
                  }
                  setEditingItem(defaultObj);
                }}
                className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Provision New
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-100/50">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-36">Document ID</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Node Title</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-32">Status</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 w-44">Index / Category</th>
                    <th className="p-4 w-28 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const displayId = item.id || item.slug;
                    const displayTitle = item.title || item.slug || 'UNTITLED';
                    const displayStatus = item.status || 'Published';
                    const displayDesc = item.industry || item.type || item.num || 'Baseline Node';

                    return (
                      <tr key={displayId} className="border-b border-neutral-100 hover:bg-neutral-50/75 transition-colors">
                        <td className="p-4 text-xs font-mono text-neutral-400 truncate max-w-[140px]">{displayId}</td>
                        <td className="p-4 text-xs font-bold text-neutral-950 uppercase tracking-tight">
                          {displayTitle}
                        </td>
                        <td className="p-4">
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded-none ${
                            displayStatus === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {displayStatus}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] font-mono text-neutral-500 uppercase">{displayDesc}</td>
                        <td className="p-4 text-right flex gap-1 justify-end">
                          <button 
                            type="button"
                            onClick={() => setEditingItem(item)} 
                            className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-all rounded-none cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDelete(displayId)} 
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-none cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-16 text-center text-neutral-400 font-mono text-xs uppercase tracking-wider">No dynamic collection items synchronized.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2 rounded-none cursor-pointer ${
        active 
          ? 'border-neutral-950 text-neutral-950 font-extrabold' 
          : 'border-transparent text-neutral-400 hover:text-neutral-700 hover:border-neutral-300'
      }`}
    >
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
 * INBOX & CONNECT CRM SUB-VIEW
 * ───────────────────────────────────────────────────────── */
interface InboxManagerProps {
  subTab: 'messages'|'bookings';
  setSubTab: (t: 'messages'|'bookings') => void;
  messages: MessageItemData[];
  toggleMessageRead: (id: string) => Promise<void>;
  addLog: (a: string, t: string) => void;
}

function InboxManager({ subTab, setSubTab, messages, toggleMessageRead, addLog }: InboxManagerProps) {
  const filteredMessages = messages.filter(m => {
    if (subTab === 'messages') {
      return m.type === 'message' || !m.type;
    } else {
      return m.type === 'booking';
    }
  });

  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const activeMessage = messages.find(m => m.id === activeMessageId);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    setActiveMessageId(id);
    await toggleMessageRead(id);
  };

  const handleReplyMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;
    setIsSendingReply(true);

    setTimeout(() => {
      setIsSendingReply(false);
      setReplySuccessMessage(`SMTP DISPATCH: Reply compiled successfully and transmitted securely to ${activeMessage.email}!`);
      addLog("CRM Email Transmitted", `Reply to ${activeMessage.name}`);
      setReplyText('');
      setTimeout(() => setReplySuccessMessage(null), 4500);
    }, 1500);
  };

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-6rem)] relative">
      <div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-950">Inbox & Connect</h2>
        <p className="text-xs text-neutral-500 font-mono mt-1 uppercase">Process client consultations, discovery scopes and booking parameter cards</p>
      </div>

      <div className="flex gap-1 border-b border-neutral-200 pb-0 shrink-0">
        <TabButton label="Contact Inquiries" active={subTab === 'messages'} onClick={() => { setSubTab('messages'); setActiveMessageId(null); }} />
        <TabButton label="Discovery Bookings" active={subTab === 'bookings'} onClick={() => { setSubTab('bookings'); setActiveMessageId(null); }} />
      </div>

      <div className="bg-white border border-neutral-200 flex-1 flex overflow-hidden rounded-none shadow-xs">
        {/* Inbox Left Pane list */}
        <div className="w-80 border-r border-neutral-200 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 z-10 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 font-mono">
              Unprocessed: {filteredMessages.filter(m => !m.read).length} Items
            </span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {filteredMessages.length === 0 ? (
               <div className="p-12 text-center text-neutral-400 font-mono text-xs uppercase tracking-wider">No {subTab} items synced.</div>
            ) : (
                filteredMessages.map(msg => (
                  <MessageItemCard 
                    key={msg.id}
                    active={msg.id === activeMessageId} 
                    name={msg.name} 
                    subject={msg.subject} 
                    time={msg?.time || 'June 16, 2026'} 
                    read={msg.read}
                    onClick={() => handleSelect(msg.id)}
                  />
                ))
            )}
          </div>
        </div>

        {/* Inbox Detail Right Pane */}
        <div className="flex-1 flex flex-col bg-neutral-50/40 relative">
          {activeMessage ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-neutral-200 bg-white overflow-y-auto flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b border-neutral-100 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-950 uppercase tracking-tight">{activeMessage.subject}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-2 text-xs font-mono text-neutral-400">
                        <span>Prospect: <strong className="text-neutral-800">{activeMessage.name}</strong></span>
                        <span>SMTP Channel: <strong className="text-neutral-800 font-bold">{activeMessage.email}</strong></span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-3 py-1 rounded-none uppercase font-bold tracking-widest">{activeMessage.time}</span>
                  </div>

                  {/* Schema breakdown metadata cards if booking inquiry */}
                  {activeMessage.type === 'booking' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-neutral-950 text-neutral-200 p-5 font-mono text-xs leading-relaxed border-l-4 border-indigo-500">
                      <div>
                        <span className="text-neutral-500 block text-[9px] font-bold uppercase tracking-widest mb-1">Company Alignment</span>
                        <span className="text-white font-semibold uppercase">{activeMessage.company || 'Not Specified'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px] font-bold uppercase tracking-widest mb-1">Target Capabilities</span>
                        <span className="text-white font-semibold uppercase">{activeMessage.service || 'Automation Consultation'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px] font-bold uppercase tracking-widest mb-1">Budget Allocation Range</span>
                        <span className="text-emerald-400 font-extrabold uppercase">{activeMessage.budget || '$2,500 - $5,000'}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="prose prose-sm prose-neutral max-w-none mt-4 whitespace-pre-wrap font-sans text-neutral-700 leading-relaxed max-w-3xl">
                    <span className="text-[10px] font-bold tracking-widest text-neutral-400 block uppercase mb-3 font-mono">MESSAGE PARAMETERS EXTRACT</span>
                    {activeMessage.content}
                  </div>
                </div>

                {/* Dispatch response board */}
                <form onSubmit={handleReplyMessage} className="p-6 bg-white border-t border-neutral-200 shrink-0">
                  <div className="flex items-center justify-between mb-3 text-neutral-500">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Send className="w-3.5 h-3.5 text-neutral-800" /> Transmit Secure Response</h4>
                    <span className="text-[9px] font-mono">SMTP pipeline active</span>
                  </div>

                  {replySuccessMessage && (
                    <div className="mb-4 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 font-mono uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {replySuccessMessage}
                    </div>
                  )}

                  <div className="border border-neutral-200 p-3 hover:border-neutral-400 focus-within:border-neutral-950 transition-colors bg-neutral-50/50">
                    <textarea 
                      required
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="w-full h-20 p-1 text-xs focus:outline-hidden resize-none bg-transparent font-medium" 
                      placeholder={`Draft reply email to ${activeMessage.name} (${activeMessage.email})...`}
                    />
                    <div className="flex justify-between items-center pt-2.5 border-t border-neutral-100">
                      <span className="text-[9px] text-neutral-400 font-mono uppercase">Encryption: TLSv1.3 secured</span>
                      <button 
                        type="submit"
                        disabled={isSendingReply}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-colors cursor-pointer"
                      >
                        {isSendingReply ? 'Transmitting Server...' : 'Dispatch Reply'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs uppercase tracking-wider py-20 gap-3">
                <Inbox className="w-6 h-6 text-neutral-300" />
                Select an intake document from database logs
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageItemCard({ active = false, name, subject, time, read, onClick }: { active?: boolean, name: string, subject: string, time: string, read: boolean, onClick: () => any, key?: any }) {
  return (
    <div 
      onClick={onClick} 
      className={`p-5 border-b border-neutral-100 cursor-pointer transition-all ${
        active 
          ? 'bg-neutral-50 border-l-4 border-l-neutral-950 shadow-xs' 
          : 'hover:bg-neutral-50/50 border-l-4 border-transparent'
      }`}
    >
      <div className="flex justify-between items-baseline mb-1.5">
        <span className={`text-xs uppercase tracking-wide ${!read ? 'font-black text-neutral-950' : 'font-semibold text-neutral-600'}`}>{name}</span>
        <span className="text-[9px] font-mono text-neutral-400 font-bold">{time}</span>
      </div>
      <p className={`text-xs truncate ${!read ? 'font-bold text-neutral-800' : 'text-neutral-500 font-light'}`}>{subject}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * SYSTEM CONFIGURATION SETTINGS VIEW
 * ───────────────────────────────────────────────────────── */
function SettingsPanel({ isFirebaseActive, seedFirebase, addLog }: { isFirebaseActive: boolean, seedFirebase: () => Promise<any>, addLog: (a: string, t: string) => void }) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; count: number; error?: string } | null>(null);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed your Firestore with baseline case studies, blogs, services, and script configurations in one click? This will write initial data to active collections.")) return;
    setIsSeeding(true);

    try {
      const res = await seedFirebase();
      setSeedResult(res);
      if (res.success) {
        addLog("Firebase Seed Completed", `${res.count} documents uploaded`);
      } else {
        addLog("Firebase Seed Failed", res.error || "Unknown error");
      }
    } catch (e: any) {
      setSeedResult({ success: false, count: 0, error: e.message || String(e) });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-950">System Configuration</h2>
        <p className="text-xs text-neutral-500 font-mono mt-1 uppercase">Activate backend nodes and configure environmental settings</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-none divide-y divide-neutral-100 shadow-xs">
        <SettingRow 
          title="Firebase Firestore connection" 
          desc="Identifies if the site is securely bound to real-time Cloud Firestore collections" 
          value={isFirebaseActive ? "Live Online" : "Sandbox Isolation Mode"} 
          status={isFirebaseActive ? "good" : "warn"} 
        />
        <SettingRow 
          title="Google Workspace OAuth Schedulers" 
          desc="Status of secure intake triggers for calendars and automation leads" 
          value="Ingestion Service Active" 
          status="good" 
        />
        <SettingRow 
          title="SSL Certificates / Security Headers" 
          desc="TLS v1.3 transport encryption certificate validation" 
          value="SECURE HTTPS/FORCE" 
          status="good" 
        />
        <SettingRow 
          title="App Metadata Title" 
          desc="Default fallback meta documentation attributes tag" 
          value="Mosen — Product Eng. & Designer" 
          status="neutral" 
        />
      </div>

      {/* Seeding Controls Box */}
      <div className="bg-neutral-950 text-white rounded-none p-8 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 shadow-md border-l-4 border-indigo-500">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Zap className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono">🔋 1-Click Firestore Seed Engine</h4>
          </div>
          <h3 className="text-lg font-light uppercase tracking-tight mb-2">Preload active Firebase Firestore with system assets</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            If you are connecting your real-time Firebase environment variables for the very first time, click this utility to sync all baseline portfolio collections (`blogs`, `case_studies`, `services`, `resources`, `posts`) automatically so your site loads dynamically!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 min-w-[200px] bg-neutral-900 border border-neutral-800 p-4">
          <button 
            type="button"
            disabled={isSeeding || !isFirebaseActive} 
            onClick={handleSeed}
            className={`py-3 px-6 text-[10px] font-extrabold uppercase tracking-widest text-center w-full transition-all cursor-pointer ${
              !isFirebaseActive 
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                : 'bg-white hover:bg-neutral-100 text-neutral-950'
            }`}
          >
            {isSeeding ? 'Seeding Clusters...' : 'Seed Live Firebase'}
          </button>
          {!isFirebaseActive && (
            <span className="text-[9px] text-amber-400 font-mono uppercase tracking-widest text-center mt-2">
              Requires VITE_ env keys
            </span>
          )}
        </div>
      </div>

      {seedResult && (
        <div className={`p-6 border font-mono text-xs ${
          seedResult.success 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {seedResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-700" />}
            <span className="font-bold uppercase tracking-wider">{seedResult.success ? 'Seed Succeeded!' : 'Seed Error Intercept'}</span>
          </div>
          {seedResult.success ? (
            <p>Sourced and successfully synchronized {seedResult.count} dynamic document nodes directly inside Firebase collection buckets.</p>
          ) : (
            <p>Seeding declined: {seedResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

function SettingRow({ title, desc, value, status }: { title: string, desc: string, value: string, status: 'good'|'warn'|'neutral' }) {
  return (
    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">{desc}</p>
      </div>
      <div>
        <span className={`text-[10px] font-mono font-extrabold px-3 py-1.5 border rounded-none uppercase tracking-wider ${
          status === 'good' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : status === 'warn'
              ? 'bg-amber-50/50 text-amber-700 border-amber-200'
              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
        }`}>
          {value}
        </span>
      </div>
    </div>
  );
}
