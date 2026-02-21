/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/microsoft/fluentui-emoji@main/**',
      },
    ],
  },
};

export default nextConfig;
