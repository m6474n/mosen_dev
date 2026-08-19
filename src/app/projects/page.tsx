import ProjectsView from '@/components/ProjectsView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Projects — Muhammad Mohsin',
  description: 'Granular project directory showcasing digital products, automated integrations, and web layouts delivered by Muhammad Mohsin.',
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
