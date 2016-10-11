// Plugins
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');

var path = require('path');

module.exports = {
  context: __dirname,

  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    },
    extensions: ['', '.css', '.scss', '.js', '.vue'],
    root: [
      path.resolve('./src/js/vendor'),
      path.resolve('./src/scss')
    ]
  },
  entry: {
      consultationRequest: './src/js/form-consultation-request.js',
      courseReserves: './vue/course-reserves/course-reserves.js',
      eventsPage: './vue/events/events-page/events-page.js',
      experts: './src/js/experts.js',
      formSiteFeedback: './src/js/form-site-feedback.js',
      homePageEvents: './vue/events/homepage-events/homepage-events.js',
      hours: './src/js/hours.js',
      instructionRequest: './src/js/form-instruction-request.js',
      main: './src/scss/main.scss',
      modalLibcal: './src/js/modal-libcal.js',
      purchaseRequest: './src/js/purchase-request.js',
      softwareList: './vue/software-list/software-list.js',
      softwareRequest: './src/js/form-software-request.js',
      spacesCards: './src/js/spaces-cards.js',
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
          test: /\.css$/,
          loader: 'style!css'
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url',
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file',
        },
        {
          test: /\.html$/,
          loader: 'html'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader:'url'
        },
        {
          test:   /\.js$/,
          loader: 'babel',
          include: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'vue/course-reserves'),
            path.join(__dirname, 'vue/software-list')
          ]
        },
        {
          // Special handling for main stylesheet -- extract to CSS for performance
          // aka LibSass > Sprockets when compiling (more details in @480c1f6)
          test: /main\.scss$/,
          // The key is to disable css-loaders's @import and url handling
          // so it leaves assets alone (fonts, images)
          // -- https://github.com/webpack/css-loader#disable-behavior
          // loader: ExtractTextPlugin.extract('style', 'css?-import,-url!sass')
          loader: ExtractTextPlugin.extract('style', 'css?-url!sass')
        },
        {
          // For any other Sass file imported via Webpack
          test: /\.scss$/,
          exclude: path.join(__dirname, 'src/scss/main.scss'),
          loader: 'style!css!sass'
        },
        {
          test: /\.vue$/, // a regex for matching all files that end in `.vue`
          loader: 'vue'   // loader to use for matched files
        },
      ]
    },
  node: {
    // Create empty modules to avoid errors from csvtojson
    // -- https://github.com/vuejs-templates/webpack/issues/262#issuecomment-247135126
    // -- https://github.com/webpack/docs/wiki/Configuration#node
    child_process: 'empty',
    fs: 'empty'
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
    // Extract compiled CSS from bundle
    new ExtractTextPlugin('../stylesheets/[name].css'),
    // Remove extraneous bundle leftover after extracting CSS
    new WebpackShellPlugin({
      onBuildExit:['rm public/javascripts/main.bundle.js']
    })
  ],
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'src/scss')]
  }
};
