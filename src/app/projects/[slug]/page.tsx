import ProjectDetailView from '@/components/ProjectDetailView';
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
    title: `${readableTitle} — Muhammad Mohsin`,
    description: `Detailed project walk-through and technical system review for: "${readableTitle}" by Muhammad Mohsin.`,
    alternates: {
      canonical: `${BASE_URL}/projects/${slug}`,
    },
    openGraph: {
      ...(DEFAULT_METADATA.openGraph as object),
      title: `${readableTitle} — Muhammad Mohsin`,
      description: `Detailed project walk-through and technical system review for: "${readableTitle}" by Muhammad Mohsin.`,
      url: `${BASE_URL}/projects/${slug}`,
      type: 'article',
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetailView slug={slug} />;
}
