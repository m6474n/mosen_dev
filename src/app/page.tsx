import HomeView from '@/components/HomeView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Mosen — Product Engineer · Designer · Automation Builder',
};

export default function HomePage() {
  return <HomeView />;
}
