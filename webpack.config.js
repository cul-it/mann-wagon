// Plugins
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');

var path = require('path');

var fontsDir = path.join('../fonts');

module.exports = {
  context: __dirname,

  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    },
    root: [
      path.resolve('./src/js/vendor')
    ]
  },
  entry: {
      consultationRequest: './src/js/form-consultation-request.js',
      eventsPage: './vue/events/events-page/events-page.js',
      formSiteFeedback: './src/js/form-site-feedback.js',
      homePageEvents: './vue/events/homepage-events/homepage-events.js',
      hoursNav: './src/js/hours-nav.js',
      instructionRequest: './src/js/form-instruction-request.js',
      main: './src/scss/main.scss',
      modalLibcal: './src/js/modal-libcal.js',
      purchaseRequest: './src/js/purchase-request.js',
      spacesQuiet: './src/js/spaces-quiet.js',
      spotlights: './src/js/spotlights.js',
      staffDirectory: './src/js/staff-directory.js',
      vendor: ['jquery']
  },
  output: {
    path: path.join(__dirname, 'public', 'javascripts'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
      // `loaders` is an array of loaders to use.
      loaders: [
        {
          test: /\.css/,
          loader: 'style!css'
        },
        {
          test: /\.html$/,
          loader: 'html'
        },
        {
          test:   /\.js/,
          loader: 'babel',
          include: path.join(__dirname, 'src')
        },
        {
          test: /\.scss/,
          // The key is to disable css-loaders's @import and url handling
          // so it leaves assets alone (fonts, images)
          // -- https://github.com/webpack/css-loader#disable-behavior
          // loader: ExtractTextPlugin.extract('style', 'css?-import,-url!sass')
          loader: ExtractTextPlugin.extract('style', 'css?-url!sass')
        },
        {
          test: /\.vue$/, // a regex for matching all files that end in `.vue`
          loader: 'vue'   // loader to use for matched files
        },
      ]
    },
  plugins: [
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // Browse app at http://localhost:3000 during development
        host: 'localhost',
        port: 3000,
        // Proxy `wagon serve` through Browsersync
        // -- see `npm start` in package.json
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
    ),
    // Copy over FontAwesome fonts
    new CopyWebpackPlugin([
      { from: 'node_modules/font-awesome/fonts', to: fontsDir },
    ], {
        ignore: []
    }),
    // Extract compiled CSS from bundle
    new ExtractTextPlugin('../stylesheets/[name].css'),
    // Remove extraneous bundle leftover after extracting CSS
    new WebpackShellPlugin({
      onBuildExit:['rm public/javascripts/main.bundle.js']
    })
  ]
};
