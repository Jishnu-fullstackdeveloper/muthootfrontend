/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx'],
  redirects: async () => {
    return [
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
        destination: 'recruitment-management/request-listing',
        permanent: true
      }
    ]
  },

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false
}

module.exports = nextConfig
