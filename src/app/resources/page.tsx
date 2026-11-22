import ResourcesView from '@/components/ResourcesView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Engineering Resources & Automation Scripts — Mosen',
  description: 'Downloadable backend utilities, Python scraping agents, n8n workflows, and UI templates crafted by Muhammad Mohsin.',
};

export default function ResourcesPage() {
  return <ResourcesView />;
}

