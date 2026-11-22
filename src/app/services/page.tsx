import ServicesView from '@/components/ServicesView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Engineering & Automation Services — Mosen',
  description: 'Product engineering, workflow automation systems, and high-conversion frontend applications by Muhammad Mohsin.',
};

export default function ServicesPage() {
  return <ServicesView />;
}

