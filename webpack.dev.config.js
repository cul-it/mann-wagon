import Config from 'webpack-config'

// Plugins
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'

export default new Config().extend('webpack.base.config.js').merge({
  debug: true,
  output: {
    pathinfo: true
  },
  plugins: [
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // Browse app at http://localhost:3000 during development
        host: 'localhost',
        port: 3000,
        // Proxy `wagon serve` through Browsersync
        // -- see `start script` in package.json
        proxy: 'localhost:3333',
        // Files to watch
        files: [
          'public/stylesheets/**/*',
          'public/javascripts/**/*',
          'app/views/**/*'
        ]
      },
      // Plugin options
      {
        // Don't force Browsersync to reload
        // -- let the watched files trigger it
        // -- allows for CSS injection without full page reload
        reload: false
      }
    )
  ]
})
