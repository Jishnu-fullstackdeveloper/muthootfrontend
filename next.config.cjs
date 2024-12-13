/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  reactStrictMode: false,
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
      }
    ]
  },

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false
}

module.exports = nextConfig
