'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, hasFirebaseConfig } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc,
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { 
  CASE_STUDIES, 
  SERVICES, 
  RESOURCES, 
  BLOG_POSTS, 
  SERVICES_FAQ, 
  TESTIMONIALS, 
  MOHSIN_BIO,
  ESTIMATOR_FEATURES,
  SKILLSET
} from '../data';
import { CaseStudy, Service, Resource, BlogPost, ContactSubmission } from '../types';

export interface MessageItemData {
  id: string;
  name: string;
  email: string;
  subject: string;
  time: string;
  content: string;
  read: boolean;
  type: 'message' | 'booking';
  company?: string;
  service?: string;
  budget?: string;
}

interface DataContextType {
  posts: any[];
  caseStudies: CaseStudy[];
  projects: any[];
  services: Service[];
  resources: Resource[];
  blogs: BlogPost[];
  messages: MessageItemData[];
  loading: boolean;
  isFirebaseActive: boolean;
  saveItem: (type: string, item: any) => Promise<boolean>;
  deleteItem: (type: string, id: string) => Promise<boolean>;
  addContactMessage: (msg: Omit<MessageItemData, 'id' | 'time' | 'read'>) => Promise<string>;
  toggleMessageRead: (id: string) => Promise<void>;
  seedFirebase: () => Promise<{ success: boolean; count: number; error?: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<MessageItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const isFirebaseActive = hasFirebaseConfig && db !== null;

  // Initial load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (isFirebaseActive) {
        try {
          console.log("Loading real-time data from Firestore Collections...");

          const postsSnap = await getDocs(collection(db, 'posts'));
          const postsList = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          const csSnap = await getDocs(collection(db, 'case_studies'));
          const csList = csSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

          const projSnap = await getDocs(collection(db, 'projects'));
          const projList = projSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          const svcsSnap = await getDocs(collection(db, 'services'));
          const svcsList = svcsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

          const resSnap = await getDocs(collection(db, 'resources'));
          const resList = resSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

          const blogsSnap = await getDocs(collection(db, 'blogs'));
          const blogsList = blogsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

          const msgsSnap = await getDocs(collection(db, 'contact'));
          const msgsList = msgsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

          // Fallbacks to default data if Firebase databases are connected but brand-new empty
          if (postsList.length === 0 && csList.length === 0 && svcsList.length === 0) {
            console.log("Firestore databases are empty. Sourced from local assets.");
            loadLocalDataFallback();
          } else {
            setPosts(postsList);
            setCaseStudies(csList);
            setProjects(projList);
            setServices(svcsList);
            setResources(resList);
            setBlogs(blogsList);
            setMessages(msgsList);
          }
        } catch (error) {
          console.error("Error loading Firestore collections, falling back to LocalStorage:", error);
          loadLocalDataFallback();
        }
      } else {
        loadLocalDataFallback();
      }
      setLoading(false);
    }

    loadData();
  }, [isFirebaseActive]);

  const loadLocalDataFallback = () => {
    // Blogs Fallback (converts slug to ID)
    const storedPosts = localStorage.getItem('mosen_posts');
    if (storedPosts) setPosts(JSON.parse(storedPosts));
    else {
      const initPosts = [
        { id: 'post-1', title: 'Architecting Server-to-Client background schedulers', status: 'Published', lastModified: '2026-06-12', type: 'posts', content: 'Standard deep dive info.' },
        { id: 'post-2', title: 'State recovery under slow connections (2G/3G)', status: 'Published', lastModified: '2026-06-14', type: 'posts', content: 'Detailed review post.' }
      ];
      setPosts(initPosts);
      localStorage.setItem('mosen_posts', JSON.stringify(initPosts));
    }

    // Case studies
    const storedCS = localStorage.getItem('mosen_case_studies');
    if (storedCS) setCaseStudies(JSON.parse(storedCS));
    else {
      setCaseStudies(CASE_STUDIES);
      localStorage.setItem('mosen_case_studies', JSON.stringify(CASE_STUDIES));
    }

    // Projects (We can list separate dynamic projects or link them with case studies)
    const storedProj = localStorage.getItem('mosen_projects');
    if (storedProj) setProjects(JSON.parse(storedProj));
    else {
      const initProj = CASE_STUDIES.map(cs => ({
        id: cs.id,
        title: cs.title,
        status: 'Published',
        lastModified: '2026-06-01',
        content: cs.summary,
        industry: cs.industry,
        tech: cs.tech
      }));
      setProjects(initProj);
      localStorage.setItem('mosen_projects', JSON.stringify(initProj));
    }

    // Services
    const storedSvcs = localStorage.getItem('mosen_services');
    if (storedSvcs) setServices(JSON.parse(storedSvcs));
    else {
      setServices(SERVICES);
      localStorage.setItem('mosen_services', JSON.stringify(SERVICES));
    }

    // Resources
    const storedRes = localStorage.getItem('mosen_resources');
    if (storedRes) setResources(JSON.parse(storedRes));
    else {
      setResources(RESOURCES);
      localStorage.setItem('mosen_resources', JSON.stringify(RESOURCES));
    }

    // Blogs
    const storedBlogs = localStorage.getItem('mosen_blogs');
    if (storedBlogs) setBlogs(JSON.parse(storedBlogs));
    else {
      const blogsList = BLOG_POSTS.map(bp => ({
        ...bp,
        id: bp.slug, // map slug to id for administrative listing
        status: 'Published',
        lastModified: bp.publishedAt
      })) as any[];
      setBlogs(blogsList);
      localStorage.setItem('mosen_blogs', JSON.stringify(blogsList));
    }

    // Messages
    const storedMsgs = localStorage.getItem('mosen_messages');
    if (storedMsgs) setMessages(JSON.parse(storedMsgs));
    else {
      const initMsgs: MessageItemData[] = [
        { id: 'msg-1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', subject: 'Enterprise Automation Inquiry', time: 'June 14, 2026', content: 'Hi Mosen,\n\nWe are a mid-sized logistics firm looking to automate our internal shipping workflows and CRM syncs. I saw your case study on the Appex system and was very impressed by the offline-first architecture.\n\nCould we schedule a call next week?', read: false, type: 'message', company: 'Appex Global', service: 'AUTOMATION SYSTEMS', budget: '$2,500 - $5,000' },
        { id: 'msg-2', name: 'Marcus Chen', email: 'marcus@startup.io', subject: 'Portfolio Redesign Timeline?', time: 'June 12, 2026', content: 'Looking to get my agency site redesigned. We need elegant premium layout systems.', read: true, type: 'message', company: 'Solo Founder', service: 'PRODUCT DESIGN', budget: '$1,500 - $2,500' }
      ];
      setMessages(initMsgs);
      localStorage.setItem('mosen_messages', JSON.stringify(initMsgs));
    }
  };

  // Generic Save / Update
  const saveItem = async (type: string, item: any): Promise<boolean> => {
    let savedSuccessfully = false;

    // Helper to map and sync state
    const updateLocalState = (type: string, updatedItem: any) => {
      switch (type) {
        case 'posts':
          setPosts(prev => {
            const list = prev.some(i => i.id === updatedItem.id) ? prev.map(i => i.id === updatedItem.id ? updatedItem : i) : [updatedItem, ...prev];
            localStorage.setItem('mosen_posts', JSON.stringify(list));
            return list;
          });
          break;
        case 'case_studies':
          setCaseStudies(prev => {
            const list = prev.some(i => i.id === updatedItem.id) ? prev.map(i => i.id === updatedItem.id ? updatedItem : i) : [updatedItem, ...prev];
            localStorage.setItem('mosen_case_studies', JSON.stringify(list));
            return list;
          });
          break;
        case 'projects':
          setProjects(prev => {
            const list = prev.some(i => i.id === updatedItem.id) ? prev.map(i => i.id === updatedItem.id ? updatedItem : i) : [updatedItem, ...prev];
            localStorage.setItem('mosen_projects', JSON.stringify(list));
            return list;
          });
          break;
        case 'services':
          setServices(prev => {
            const list = prev.some(i => i.id === updatedItem.id) ? prev.map(i => i.id === updatedItem.id ? updatedItem : i) : [updatedItem, ...prev];
            localStorage.setItem('mosen_services', JSON.stringify(list));
            return list;
          });
          break;
        case 'resources':
          setResources(prev => {
            const list = prev.some(i => i.id === updatedItem.id) ? prev.map(i => i.id === updatedItem.id ? updatedItem : i) : [updatedItem, ...prev];
            localStorage.setItem('mosen_resources', JSON.stringify(list));
            return list;
          });
          break;
        case 'blogs':
          setBlogs(prev => {
            const list = prev.some(i => i.slug === updatedItem.slug) ? prev.map(i => i.slug === updatedItem.slug ? updatedItem : i) : [updatedItem, ...prev];
            localStorage.setItem('mosen_blogs', JSON.stringify(list));
            return list;
          });
          break;
      }
    };

    if (isFirebaseActive) {
      try {
        const collectionName = type;
        const docId = type === 'blogs' ? item.slug : item.id;
        await setDoc(doc(db, collectionName, docId), item);
        updateLocalState(type, item);
        savedSuccessfully = true;
      } catch (err) {
        console.error(`Firebase SetDoc failed for ${type}:`, err);
        // Fallback local persistence
        updateLocalState(type, item);
        savedSuccessfully = true;
      }
    } else {
      updateLocalState(type, item);
      savedSuccessfully = true;
    }

    return savedSuccessfully;
  };

  // Generic Delete
  const deleteItem = async (type: string, id: string): Promise<boolean> => {
    const removeFromLocalState = (type: string, targetId: string) => {
      switch (type) {
        case 'posts':
          setPosts(prev => {
            const list = prev.filter(i => i.id !== targetId);
            localStorage.setItem('mosen_posts', JSON.stringify(list));
            return list;
          });
          break;
        case 'case_studies':
          setCaseStudies(prev => {
            const list = prev.filter(i => i.id !== targetId);
            localStorage.setItem('mosen_case_studies', JSON.stringify(list));
            return list;
          });
          break;
        case 'projects':
          setProjects(prev => {
            const list = prev.filter(i => i.id !== targetId);
            localStorage.setItem('mosen_projects', JSON.stringify(list));
            return list;
          });
          break;
        case 'services':
          setServices(prev => {
            const list = prev.filter(i => i.id !== targetId);
            localStorage.setItem('mosen_services', JSON.stringify(list));
            return list;
          });
          break;
        case 'resources':
          setResources(prev => {
            const list = prev.filter(i => i.id !== targetId);
            localStorage.setItem('mosen_resources', JSON.stringify(list));
            return list;
          });
          break;
        case 'blogs':
          setBlogs(prev => {
            const list = prev.filter(i => i.slug !== targetId);
            localStorage.setItem('mosen_blogs', JSON.stringify(list));
            return list;
          });
          break;
      }
    };

    if (isFirebaseActive) {
      try {
        await deleteDoc(doc(db, type, id));
        removeFromLocalState(type, id);
        return true;
      } catch (err) {
        console.error(`Firebase DeleteDoc failed for ${type}:`, err);
        removeFromLocalState(type, id);
        return true;
      }
    } else {
      removeFromLocalState(type, id);
      return true;
    }
  };

  // Adding Contact Message directly
  const addContactMessage = async (msg: Omit<MessageItemData, 'id' | 'time' | 'read'>): Promise<string> => {
    const refCode = 'MSG-' + Math.floor(100000 + Math.random() * 900000);
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const newMsg: MessageItemData = {
      ...msg,
      id: refCode,
      time: dateFormatted,
      read: false
    };

    const addToLocal = (m: MessageItemData) => {
      setMessages(prev => {
        const list = [m, ...prev];
        localStorage.setItem('mosen_messages', JSON.stringify(list));
        return list;
      });
    };

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'contact', refCode), newMsg);
        addToLocal(newMsg);
      } catch (error) {
        console.error("Failed to post message to Firestore, keeping locally as backup:", error);
        addToLocal(newMsg);
      }
    } else {
      addToLocal(newMsg);
    }

    return refCode;
  };

  // Mark message as read
  const toggleMessageRead = async (id: string): Promise<void> => {
    const updateLocal = (msgId: string) => {
      setMessages(prev => {
        const list = prev.map(m => m.id === msgId ? { ...m, read: true } : m);
        localStorage.setItem('mosen_messages', JSON.stringify(list));
        return list;
      });
    };

    const targetMsg = messages.find(m => m.id === id);
    if (!targetMsg) return;

    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'contact', id), { ...targetMsg, read: true });
        updateLocal(id);
      } catch (error) {
        console.error("Firestore message read state update failed, keeping offline state:", error);
        updateLocal(id);
      }
    } else {
      updateLocal(id);
    }
  };

  // Seed static portfolio configurations into real Firestore
  const seedFirebase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    if (!isFirebaseActive) {
      return { success: false, count: 0, error: "Firebase connection is not configured yet. Add configuration parameters in .env" };
    }

    try {
      let uploadCount = 0;

      // Seed blog posts
      for (const blog of BLOG_POSTS) {
        const payload = {
          id: blog.slug,
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          publishedAt: blog.publishedAt,
          readTime: blog.readTime,
          tags: blog.tags,
          contentHtml: blog.contentHtml,
          status: 'Published',
          lastModified: blog.publishedAt
        };
        await setDoc(doc(db, 'blogs', blog.slug), payload);
        uploadCount++;
      }

      // Seed mock administrative posts list
      const initPosts = [
        { id: 'post-1', title: 'Architecting Server-to-Client background schedulers', status: 'Published', lastModified: '2026-06-12', type: 'posts', content: 'Standard deep dive info.' },
        { id: 'post-2', title: 'State recovery under slow connections (2G/3G)', status: 'Published', lastModified: '2026-06-14', type: 'posts', content: 'Detailed review post.' }
      ];
      for (const postItem of initPosts) {
        await setDoc(doc(db, 'posts', postItem.id), postItem);
        uploadCount++;
      }

      // Seed case studies
      for (const cs of CASE_STUDIES) {
        await setDoc(doc(db, 'case_studies', cs.id), cs);
        uploadCount++;
      }

      // Seed dynamic projects
      const initProj = CASE_STUDIES.map(cs => ({
        id: cs.id,
        title: cs.title,
        status: 'Published',
        lastModified: '2026-06-01',
        content: cs.summary,
        industry: cs.industry,
        tech: cs.tech
      }));
      for (const pr of initProj) {
        await setDoc(doc(db, 'projects', pr.id), pr);
        uploadCount++;
      }

      // Seed services
      for (const srv of SERVICES) {
        await setDoc(doc(db, 'services', srv.id), srv);
        uploadCount++;
      }

      // Seed resources
      for (const res of RESOURCES) {
        await setDoc(doc(db, 'resources', res.id), res);
        uploadCount++;
      }

      // Refresh loaded Firestore state in DataProvider
      const updatedBlogs = await getDocs(collection(db, 'blogs'));
      setBlogs(updatedBlogs.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);

      const updatedPosts = await getDocs(collection(db, 'posts'));
      setPosts(updatedPosts.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);

      const updatedCS = await getDocs(collection(db, 'case_studies'));
      setCaseStudies(updatedCS.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);

      const updatedSvcs = await getDocs(collection(db, 'services'));
      setServices(updatedSvcs.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);

      const updatedRes = await getDocs(collection(db, 'resources'));
      setResources(updatedRes.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);

      const updatedProj = await getDocs(collection(db, 'projects'));
      setProjects(updatedProj.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);

      return { success: true, count: uploadCount };

    } catch (e: any) {
      console.error("Firebase seeding failed:", e);
      return { success: false, count: 0, error: e.message || String(e) };
    }
  };

  return (
    <DataContext.Provider value={{
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
      addContactMessage,
      toggleMessageRead,
      seedFirebase
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
