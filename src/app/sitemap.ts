import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
    '/services',
    '/case-studies',
    '/blog',
    '/resources',
    '/contact'
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  // Try to load dynamic blogs and case studies directly from Firestore to include in sitemap
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const db = getFirestore(app);

      // Dynamic blogs URLs
      const blogsSnap = await getDocs(collection(db, 'blogs'));
      const blogUrls = blogsSnap.docs.map(doc => {
        const data = doc.data();
        return {
          url: `${BASE_URL}/blog/${data.slug}`,
          lastModified: data.lastModified ? new Date(data.lastModified) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6
        };
      });

      // Dynamic case studies URLs
      const csSnap = await getDocs(collection(db, 'case_studies'));
      const csUrls = csSnap.docs.map(doc => {
        const data = doc.data();
        return {
          url: `${BASE_URL}/case-studies/${doc.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7
        };
      });

      dynamicRoutes = [...blogUrls, ...csUrls];
    } catch (e) {
      console.error('Error generating dynamic sitemap routes:', e);
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
