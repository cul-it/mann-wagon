import Config from 'webpack-config'

export default new Config().extend('webpack.base.config.js').merge({
  debug: true,
  output: {
    pathinfo: true
  }
})
