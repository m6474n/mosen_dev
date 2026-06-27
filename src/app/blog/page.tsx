import BlogIndexView from '@/components/BlogIndexView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Thoughts & Tech Essays — Mosen Blog | Muhammad Mohsin',
  description: 'Explorations into automation architecture paradigms, digital layout engineering, and the developer-designer methodology. Technical essays by Muhammad Mohsin.',
};

export default function BlogPage() {
  return <BlogIndexView />;
}
