/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/yapi/': {
      target: 'http://172.17.30.131:5023/',
      changeOrigin: true,
      pathRewrite: { [`/yapi/`]: '/' },
    },
    '/api/': {
      target: 'http://jksoft-apigateway.dev.jianke.com',
      changeOrigin: true,
      pathRewrite: { [`/api/`]: '/' },
    },
    ['/script/env.js']: {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '/script/env.js': '/env/script.dev.js' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
