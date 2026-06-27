import CaseStudyDetailView from '@/components/CaseStudyDetailView';

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseStudyDetailView id={id} />;
}
