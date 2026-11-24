import ResourceDetailView from '@/components/ResourceDetailView';
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
    title: `${readableTitle} — Resource Documentation — Mosen`,
    description: `Complete README documentation, installation guidelines, and open source repository for ${readableTitle}.`,
    alternates: {
      canonical: `${BASE_URL}/resources/${slug}`,
    },
    openGraph: {
      ...(DEFAULT_METADATA.openGraph as object),
      title: `${readableTitle} — Mosen Resources`,
      description: `Complete README documentation, installation guidelines, and open source repository for ${readableTitle}.`,
      url: `${BASE_URL}/resources/${slug}`,
      type: 'article',
    },
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ResourceDetailView slug={slug} />;
}

