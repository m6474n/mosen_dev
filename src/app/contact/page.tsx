import ContactView from '@/components/ContactView';
import { DEFAULT_METADATA } from '@/lib/seo';

export const metadata = {
  ...DEFAULT_METADATA,
  title: 'Contact & Book a Discovery Call — Muhammad Mohsin | Mosen',
  description: 'Book a discovery consultation with Muhammad Mohsin (Mosen). Discuss your engineering or automation project, get an honest assessment of scope, and start building without handoffs.',
};

export default function ContactPage() {
  return <ContactView />;
}
