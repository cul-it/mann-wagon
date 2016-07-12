var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var fontsDir = path.join('../fonts');

module.exports = {
  context: __dirname,

  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    }
  },
  entry: {
      bookedReserve: './src/js/booked-reserve.js',
      eventsPage: './vue/events/events-page/events-page.js',
      homePageEvents: './vue/events/homepage-events/homepage-events.js',
      hoursNav: './src/js/hours-nav.js',
      jqueryLocal: './src/js/jquery-local.js',
      main: './src/scss/main.scss',
      purchaseRequest: './src/js/purchase-request.js',
      spacesQuiet: './src/js/spaces-quiet.js'
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
          // loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
          // loader: ExtractTextPlugin.extract('raw!sass')
          // loader: ExtractTextPlugin.extract('style!css!sass')
          // loader: ExtractTextPlugin.extract('style', 'css?-import!sass')
          loader: ExtractTextPlugin.extract('style', 'css?-import,-url!sass')
        },
        {
          test: /\.vue$/, // a regex for matching all files that end in `.vue`
          loader: 'vue'   // loader to use for matched files
        },
      ]
    },
  // Copy over FontAwesome fonts
  plugins: [
    new CopyWebpackPlugin([
      { from: 'node_modules/font-awesome/fonts', to: fontsDir },
    ], {
        ignore: []
    }),
    new ExtractTextPlugin('../stylesheets/[name].css')
  ]
};
