var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var config = require('./config.js');

// backend
// var nodeModules = fs.readdirSync(path.join(__dirname, 'node_modules'))
// .filter(function(x) {
//   return ['.bin'].indexOf(x) === -1;
// });
let entry = process.env.NODE_ENV !== 'production' ? './server/index.dev.js' : './server.js';
nodeModules = [ 'express', 'webpack', 'mongoose' ];
var serverConfig = {
  context: __dirname + '/src',
  entry: [ entry ],
  target: 'node',
  output: { path: __dirname + '/dist', filename: 'server.js' },
  node: { __dirname: false, __filename: false },
  externals: [
    function(context, request, callback) {
      var pathStart = request.split('/')[0];
      if (nodeModules.indexOf(pathStart) >= 0 && request != 'webpack/hot/signal.js') {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    }
  ],
  plugins: [
    new webpack.BannerPlugin({
      banner: "require('source-map-support').install();",
      raw: true,
      entryOnly: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        //Check for all js files
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ [ 'es2015' ], 'stage-0' ],
              plugins: [ [ 'transform-runtime', { polyfill: true, regenerator: true } ] ]
            }
          }
        ]
      }
    ]
  }
};
if (process.env.NODE_ENV !== 'production') {
  //defaultConfig.devtool = '#eval-source-map';
  serverConfig.devtool = 'source-map';
  // serverConfig.debug = true;
}
module.exports = webpack(serverConfig);
