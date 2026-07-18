import { Metadata } from 'next';

// Hardcode the production URL — override via APP_URL env only if it's a valid URL
export const BASE_URL = (() => {
  const env = process.env.APP_URL;
  if (env && env.startsWith('http')) return env;
  return 'https://mosen.dev';
})();

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mosen — Product Engineer, Designer & Automation Builder',
    template: '%s | Mosen'
  },
  description: 'Muhammad Mohsin (Mosen) — Professional Product Engineer, Visual Designer, and Workflow Automation Builder. Specializing in high-performance web systems, custom lead generation flows, and zero-handoff execution.',
  keywords: [
    'Muhammad Mohsin',
    'Mosen',
    'Product Engineer',
    'UI UX Designer',
    'Workflow Automation',
    'Next.js Portfolio',
    'React Developer',
    'Software Architecture Pakistan',
    'Lead Generation Automation',
    'Bespoke Web Development',
    'Full Stack Engineer'
  ],
  authors: [{ name: 'Muhammad Mohsin', url: BASE_URL }],
  creator: 'Muhammad Mohsin',
  publisher: 'Muhammad Mohsin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: 'Mosen — Product Engineer, Designer & Automation Builder',
    description: 'Muhammad Mohsin (Mosen) — Product Engineer, Visual Designer, and Workflow Automation Builder. Bridging the gap between structure, beauty, and operational efficiency.',
    siteName: 'Mosen Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mosen — Product Engineer, Designer & Automation Builder'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mosen — Product Engineer, Designer & Automation Builder',
    description: 'Muhammad Mohsin (Mosen) — Product Engineer, Visual Designer, and Workflow Automation Builder. Bridging the gap between structure, beauty, and operational efficiency.',
    creator: '@mosen_here',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};
