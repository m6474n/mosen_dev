import BlogIndexView from '@/components/BlogIndexView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Articles & Tech Insights — Mosen Blog | Muhammad Mohsin',
  description: 'Explorations into automation architecture paradigms, digital layout engineering, and product engineering methodology. Technical articles by Muhammad Mohsin.',
};

export default function BlogPage() {
  return <BlogIndexView />;
}
