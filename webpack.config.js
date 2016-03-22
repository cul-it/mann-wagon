// Using npm + Webpack to manage vendor dependencies
// -- for now Webpack is simply copying src files from modules to public dir
// -- no compiling/preprocessing and copied files are not tracked thanks to .gitignore
// -- provides some sanity for clean @import paths while tracking versions & dependencies via package.json

var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var sassDir = 'stylesheets';
var sassVenDir = path.join(sassDir, 'vendor');

module.exports = {
  context: __dirname,

  // entry: './app.js',

  // Vendorize the mixins & libraries
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js', // Not currently used but required for Webpack to run
    publicPath: '/'
  },

  plugins: [
    new CopyWebpackPlugin([
      // Bitters
      { from: 'node_modules/Bitters/core', to: path.join(sassDir, 'base') },
      // Bourbon
      { from: 'node_modules/bourbon/core', to: path.join(sassVenDir, 'bourbon') },
      // Breakpoint
      { from: 'node_modules/breakpoint-sass/stylesheets', to: path.join(sassVenDir, 'breakpoint') },
      // Normalize
      { from: 'node_modules/normalize-scss/sass', to: path.join(sassVenDir, 'normalize') },
      { from: 'node_modules/support-for/sass/_support-for.scss', to: path.join(sassVenDir, 'normalize') },
      // Susy
      { from: 'node_modules/susy/sass', to: path.join(sassVenDir, 'susy') }
    ], {
        ignore: []
    })
  ]
};
