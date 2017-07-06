import webpack from 'webpack'
import Config from 'webpack-config'

export default new Config().extend({
  'webpack.dev.config.js': config => {
    delete config.debug
    delete config.output.pathinfo

    return config
  }
}).merge({
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    })
  ]
})
