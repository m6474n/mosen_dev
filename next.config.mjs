/** @type {import('next').NextConfig} */
const nextConfig = {
 
  // output : "export",
  // trailingSlash : true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'assets.aceternity.com',
            pathname: '**',
          },
          
        ]
      },
};

export default nextConfig;
