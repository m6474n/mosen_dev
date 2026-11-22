import CaseStudiesIndexView from '@/components/CaseStudiesIndexView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Case Studies & Production Architecture — Mosen',
  description: 'In-depth case studies on offline-first trading systems, industrial weighing software, and autonomous lead gen agents by Muhammad Mohsin.',
};

export default function CaseStudiesPage() {
  return <CaseStudiesIndexView />;
}

