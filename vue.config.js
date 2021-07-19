module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/v1': {
        target: 'http://127.0.0.1:8888/api/private',
        changeOrigin: true,
        pathRewrite: {
          "^/v1": ""
        }

        /* /kerwin/ajax/comingList  ====> /ajax/comingList  */
      },
      // '/ajax': {
      //   target: 'http://m1.a.com',
      //   changeOrigin: true
      // }
    }

  },
  lintOnSave: false // 关了eslint 检查
}
