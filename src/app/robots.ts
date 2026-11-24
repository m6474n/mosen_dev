import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/api/'],
      },
      // Explicit allowance for AI search engines & LLM indexing bots
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Amazonbot',
          'cohere-ai',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: ['/admin', '/login', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
