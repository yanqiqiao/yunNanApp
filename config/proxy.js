module.exports = {
  '/api/*': {
    target: 'http://39.99.245.16:81/',
    changeOrigin: true,
    secure: false, // 不检查安全问题。设置后，可以接受运行在 HTTPS 上，可以使用无效证书的后端服务器
    pathRewrite: {
      '^/api/': '/'
    }
  }
};
