import ResourcesView from '@/components/ResourcesView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Open Vault — Developer Resources, Scripts & Templates | Mosen',
  description: 'Free downloadable developer templates, CLI scripts, reusable workflow components, and utility boilerplate files from the Mosen open vault. All copyable and production-ready.',
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
