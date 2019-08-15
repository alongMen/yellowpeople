
module.exports = {
  
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      '/api': {
          // target: 'http://api.yellowduck.vip',
          target: 'http://api.angtv.cn',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/api': ''
          }
      }
  }
  },
};