import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@apse/shared-auth',
    '@apse/shared-config',
    '@apse/shared-db',
    '@apse/shared-domain',
    '@apse/shared-events',
    '@apse/shared-flags',
    '@apse/shared-ui',
  ],
  experimental: {
    typedRoutes: true,
  },
};

export default config;
