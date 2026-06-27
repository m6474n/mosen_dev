import CaseStudyDetailView from '@/components/CaseStudyDetailView';

export default function CaseStudyDetailPage({ params }: { params: { id: string } }) {
  return <CaseStudyDetailView id={params.id} />;
}
