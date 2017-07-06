import Config from 'webpack-config'
import path from 'path'

// Plugins
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackShellPlugin from 'webpack-shell-plugin'

export default new Config().merge({
  context: __dirname,

  resolve: {
    alias: {
      doubleTapToGo: 'doubletaptogo/doubletaptogo.min.js',
      jquery: 'jquery/src/jquery',
      suiIcon: 'semantic-ui-css/components/icon.min.css'
    },
    extensions: ['', '.css', '.scss', '.js', '.vue'],
    root: [
      path.resolve('./src/js/vendor'),
      path.resolve('./src/scss')
    ]
  },
  entry: {
    allExperts: './src/js/all-experts.js',
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
    navSearch: './src/js/nav-search.js',
    softwareList: './vue/software-list/software-list.js',
    softwareRequest: './src/js/form-software-request.js',
    spacesCards: './src/js/spaces-cards.js',
    specialCollRegistration: './src/js/form-special-collections.js',
    spotlights: './src/js/spotlights.js',
    staffDirectory: './src/js/staff-directory.js',
    vendor: ['jquery', 'suiIcon', 'doubleTapToGo']
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
        loader: 'url'
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url'
      },
      {
        test: /\.js$/,
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
        loader: ExtractTextPlugin.extract('style', 'css?-minimize,-url!sass')
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
      }
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
    // Extract compiled CSS from bundle
    new ExtractTextPlugin('../stylesheets/[name].css'),
    // Remove extraneous bundle leftover after extracting CSS
    new WebpackShellPlugin({
      onBuildExit: ['rm public/javascripts/main.bundle.js']
    })
  ],
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'src/scss')]
  }
})
