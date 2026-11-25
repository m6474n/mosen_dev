import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { CASE_STUDIES, RESOURCES, BLOG_POSTS } from '@/data';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/blog',
    '/resources',
    '/contact'
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  // Map to hold unique URLs
  const dynamicMap = new Map<string, { url: string; lastModified: Date; changeFrequency: 'monthly'; priority: number }>();

  // 1. Seed fallback dynamic items first (so sitemap is NEVER empty even during SSG build)
  BLOG_POSTS.forEach(b => {
    dynamicMap.set(`${BASE_URL}/blog/${b.slug}`, {
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    });
  });

  CASE_STUDIES.forEach(cs => {
    dynamicMap.set(`${BASE_URL}/projects/${cs.id}`, {
      url: `${BASE_URL}/projects/${cs.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    });
  });

  RESOURCES.forEach(r => {
    dynamicMap.set(`${BASE_URL}/resources/${r.id}`, {
      url: `${BASE_URL}/resources/${r.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    });
  });

  // 2. Fetch live Firestore items if available to augment/override
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const db = getFirestore(app);

      const [blogsSnap, projectsSnap, resourcesSnap] = await Promise.all([
        getDocs(collection(db, 'blogs')).catch(() => null),
        getDocs(collection(db, 'projects')).catch(() => null),
        getDocs(collection(db, 'resources')).catch(() => null),
      ]);

      if (blogsSnap) {
        const dummyBlogSlugs = new Set(['automated-lead-gen-machine', 'case-against-handoffs', 'offline-first-background-sync', 'post-1', 'post-2']);
        blogsSnap.docs.forEach(doc => {
          const data = doc.data();
          const slug = data.slug || doc.id;
          if (slug && !dummyBlogSlugs.has(slug)) {
            dynamicMap.set(`${BASE_URL}/blog/${slug}`, {
              url: `${BASE_URL}/blog/${slug}`,
              lastModified: data.lastModified ? new Date(data.lastModified) : new Date(),
              changeFrequency: 'monthly',
              priority: 0.7
            });
          }
        });
      }

      if (projectsSnap) {
        projectsSnap.docs.forEach(doc => {
          const data = doc.data();
          const slug = data.slug || doc.id;
          if (slug) {
            dynamicMap.set(`${BASE_URL}/projects/${slug}`, {
              url: `${BASE_URL}/projects/${slug}`,
              lastModified: data.lastModified ? new Date(data.lastModified) : new Date(),
              changeFrequency: 'monthly',
              priority: 0.8
            });
          }
        });
      }

      if (resourcesSnap) {
        const dummyIds = new Set(['fastapi-enricher-script', 'flutter-serial-coms', 'tailwind-bento-card-utilities', 'n8n-gmail-filter-json']);
        resourcesSnap.docs.forEach(doc => {
          const data = doc.data();
          const id = data.id || doc.id;
          if (id && !dummyIds.has(id)) {
            dynamicMap.set(`${BASE_URL}/resources/${id}`, {
              url: `${BASE_URL}/resources/${id}`,
              lastModified: data.lastModified ? new Date(data.lastModified) : new Date(),
              changeFrequency: 'monthly',
              priority: 0.7
            });
          }
        });
      }
    } catch (e) {
      console.warn('Sitemap live fetch warning:', e);
    }
  }

  return [...staticRoutes, ...Array.from(dynamicMap.values())];
}
