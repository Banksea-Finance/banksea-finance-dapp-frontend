const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    configure: config => {
      const resolve = config.resolve
      const fallback = resolve.fallback

      return {
        ...config,
        resolve: {
          ...resolve,
          fallback: {
            ...fallback,
            assert: false
          }
        }
      }
    }
  }
}
