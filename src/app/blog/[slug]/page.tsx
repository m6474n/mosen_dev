import BlogPostView from '@/components/BlogPostView';
import { DEFAULT_METADATA, BASE_URL } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const readableTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    ...DEFAULT_METADATA,
    title: `${readableTitle} — Mosen Blog`,
    description: `Read the technical essay: "${readableTitle}" by Muhammad Mohsin. Explorations into product engineering, automation, and design systems.`,
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      ...(DEFAULT_METADATA.openGraph as object),
      title: `${readableTitle} — Mosen Blog`,
      description: `Read the technical essay: "${readableTitle}" by Muhammad Mohsin.`,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostView slug={slug} />;
}
