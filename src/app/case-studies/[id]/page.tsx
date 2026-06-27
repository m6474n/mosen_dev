import CaseStudyDetailView from '@/components/CaseStudyDetailView';
import { DEFAULT_METADATA, BASE_URL } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const readableTitle = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    ...DEFAULT_METADATA,
    title: `${readableTitle} — Case Study | Mosen`,
    description: `In-depth case study of ${readableTitle}: architecture decisions, challenge breakdown, solution implementation, and measurable business outcomes — by Muhammad Mohsin.`,
    alternates: {
      canonical: `${BASE_URL}/case-studies/${id}`,
    },
    openGraph: {
      ...(DEFAULT_METADATA.openGraph as object),
      title: `${readableTitle} — Case Study | Mosen`,
      description: `In-depth case study of ${readableTitle}: architecture decisions, challenges, and measurable results.`,
      url: `${BASE_URL}/case-studies/${id}`,
      type: 'article',
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseStudyDetailView id={id} />;
}
