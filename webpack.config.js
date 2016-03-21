// Using npm + Webpack to manage vendor dependencies
// -- for now Webpack is simply copying src files from modules to public/vendor
// -- no compiling and public/vendor is not tracked thanks to .gitignore
// -- provides some sanity for clean @import paths
// -- while tracking versions & dependencies via package.json

var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  context: __dirname,

  // entry: './app.js',

  // Vendorize the mixins & libraries
  output: {
    path: path.join(__dirname, 'public', 'vendor'),
    filename: 'bundle.js', // Not currently used but required for Webpack to run
    publicPath: '/public/vendor/'
  },

  plugins: [
    new CopyWebpackPlugin([
      // Bourbon
      { from: 'node_modules/bourbon/app/assets/stylesheets', to: 'bourbon' },
      // Breakpoint
      { from: 'node_modules/breakpoint-sass/stylesheets', to: 'breakpoint' },
      // Normalize
      { from: 'node_modules/normalize-scss/sass', to: 'normalize' },
      { from: 'node_modules/support-for/sass/_support-for.scss', to: 'normalize/' },
      // Susy
      { from: 'node_modules/susy/sass', to: 'susy' }
    ], {
        ignore: []
    })
  ]
};
