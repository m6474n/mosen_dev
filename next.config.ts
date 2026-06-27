import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow building even if there are type errors in generated files
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow importing from specific external packages that use ESM
  serverExternalPackages: [],
  // Optimise images (external sources)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
