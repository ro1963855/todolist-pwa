/* eslint-disable */

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
    manifestOptions: {
      name: 'Todo List PWA',
      short_name: 'Todo List',
      display: 'standalone',
    },
  },
};
