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
    manifestOptions: {
      name: 'Todo List PWA',
      short_name: 'Todo List',
      display: 'standalone',
    },
  },
};
