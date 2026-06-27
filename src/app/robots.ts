import { MetadataRoute } from 'next';

const SITE_URL = 'https://mosen.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
