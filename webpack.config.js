var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var sassDir = path.join('../stylesheets', 'vendor');
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
  // Vendorize the Sass mixins & libraries
  plugins: [
    new CopyWebpackPlugin([
      // Accoutrement Color
      { from: 'node_modules/accoutrement-color/sass', to: path.join(sassDir, 'accoutrement-color') },
      // Bitters
      { from: 'node_modules/Bitters/core', to: path.join(sassDir, 'bitters') },
      // Bourbon
      { from: 'node_modules/bourbon/core', to: path.join(sassDir, 'bourbon') },
      // Breakpoint
      { from: 'node_modules/breakpoint-sass/stylesheets', to: path.join(sassDir, 'breakpoint') },
      // Font Awesome
      { context: 'node_modules/font-awesome/scss', from: '_*', to: path.join(sassDir, 'font-awesome') },
      { from: 'node_modules/font-awesome/scss/font-awesome.scss', to: path.join(sassDir, 'font-awesome', '_font-awesome.scss') },
      { from: 'node_modules/font-awesome/fonts', to: fontsDir },
       // MathSass
      { from: 'node_modules/mathsass/dist', to: path.join(sassDir, 'mathsass') },
      // Normalize
      { from: 'node_modules/normalize-scss/sass', to: path.join(sassDir, 'normalize') },
      { from: 'node_modules/support-for/sass/_support-for.scss', to: path.join(sassDir, 'normalize') },
      // Semantic-UI
      { from: 'node_modules/semantic-ui-css/components/button.css', to: path.join(sassDir, 'semantic-ui', '_button.scss') },
      { from: 'node_modules/semantic-ui-css/components/card.css', to: path.join(sassDir, 'semantic-ui', '_card.scss') },
      { from: 'node_modules/semantic-ui-css/components/input.css', to: path.join(sassDir, 'semantic-ui', '_input.scss') },
      { from: 'node_modules/semantic-ui-css/components/label.css', to: path.join(sassDir, 'semantic-ui', '_label.scss') },
      { from: 'node_modules/semantic-ui-css/components/menu.css', to: path.join(sassDir, 'semantic-ui', '_menu.scss') },
      // Susy
      { from: 'node_modules/susy/sass', to: path.join(sassDir, 'susy') }
    ], {
        ignore: []
    }),
    new ExtractTextPlugin('../stylesheets/[name].css')
  ]
};
