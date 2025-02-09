/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://tech0-gen8-step4-pos-app-72.azurewebsites.net/api/:path*', // バックエンドのURL
      },
    ];
  },
};

module.exports = nextConfig;
