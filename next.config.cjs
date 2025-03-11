/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = withBundleAnalyzer({
  basePath: process.env.BASEPATH,
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx'],
  redirects: async () => [
    {
      source: '/',
      destination: '/login',
      permanent: true
    },
    {
      source: '/jd-management/add',
      destination: '/jd-management/add/jd',
      permanent: true
    },
    {
      source: '/recruitment-management',
      destination: '/recruitment-management/request-listing', // Fixed missing '/'
      permanent: true
    }
  ]
})

module.exports = nextConfig
