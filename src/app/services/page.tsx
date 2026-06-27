import ServicesView from '@/components/ServicesView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Services, Revenue Engines & Workflow Automation — Mosen Portfolio',
  description: 'Three integrated value engines: Product Design, client-side engineering, and backend workflow automation systems. Get details on development pricing models and timeline estimates.',
};

export default function ServicesPage() {
  return <ServicesView />;
}
