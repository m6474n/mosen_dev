import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

import { CASE_STUDIES, SERVICES, RESOURCES, BLOG_POSTS } from './src/data.js';

async function seed() {
  console.log("Starting administrative database seeding script...");
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Missing credentials in .env. Verify Next.js variables.");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let count = 0;

  // 1. Seed Case Studies
  for (const cs of CASE_STUDIES) {
    await setDoc(doc(db, 'case_studies', cs.id), cs);
    console.log(`Synced Case Study: ${cs.id}`);
    count++;
  }

  // 2. Seed Services Catalog
  for (const srv of SERVICES) {
    await setDoc(doc(db, 'services', srv.id), srv);
    console.log(`Synced Service: ${srv.id}`);
    count++;
  }

  // 3. Seed Resources Vault
  for (const res of RESOURCES) {
    await setDoc(doc(db, 'resources', res.id), res);
    console.log(`Synced Resource: ${res.id}`);
    count++;
  }

  // 4. Seed Blog Posts
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
    console.log(`Synced Blog Post: ${blog.slug}`);
    count++;
  }

  // 5. Seed Mock Posts
  const initPosts = [
    { id: 'post-1', title: 'Architecting Server-to-Client background schedulers', status: 'Published', lastModified: '2026-06-12', type: 'posts', content: 'Standard deep dive info.' },
    { id: 'post-2', title: 'State recovery under slow connections (2G/3G)', status: 'Published', lastModified: '2026-06-14', type: 'posts', content: 'Detailed review post.' }
  ];
  for (const postItem of initPosts) {
    await setDoc(doc(db, 'posts', postItem.id), postItem);
    console.log(`Synced Post: ${postItem.id}`);
    count++;
  }

  console.log(`Database seeding finished. Synced ${count} nodes total.`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Critical error seeding:", err);
  process.exit(1);
});
