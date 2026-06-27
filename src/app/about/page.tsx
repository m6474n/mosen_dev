import AboutView from '@/components/AboutView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'About Muhammad Mohsin — Mosen Portfolio',
  description: 'Learn about Muhammad Mohsin (Mosen) — Product Engineer, UI/UX Designer, and Automation Builder. Discover my design philosophy and visual backend system integration patterns.',
};

export default function AboutPage() {
  return <AboutView />;
}
