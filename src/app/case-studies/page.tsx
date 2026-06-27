import CaseStudiesIndexView from '@/components/CaseStudiesIndexView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Case Studies — Selected Work & Commercial Systems | Mosen',
  description: 'A granular breakdown of select commercial systems built from wireframe architectures to optimized production execution — automation platforms, ERP systems, and web applications.',
};

export default function CaseStudiesPage() {
  return <CaseStudiesIndexView />;
}
