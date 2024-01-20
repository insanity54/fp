/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "assets", "styles")],
  },
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'futureporn-b2.b-cdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  }
};


module.exports = nextConfig;
