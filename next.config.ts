/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Serverless 関数に必ず同梱させるファイルを指定
    outputFileTracingIncludes: {
      'app/**': ['prisma/schema.prisma', 'prisma/dev.db'],
      'app/api/**': ['prisma/schema.prisma', 'prisma/dev.db'],
    },
  },
};

module.exports = nextConfig;
