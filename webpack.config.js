const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ServerAddress = require('./serverAddress');

const outputDirectory = 'public';
const serverDir = ServerAddress.apiPort ? `http://${ServerAddress.server}:${ServerAddress.apiPort}` : `http://${ServerAddress.server}`;
module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    port: ServerAddress.clientPort,
    open: true,
    proxy: {
      '/api': serverDir
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public_dev/index.html',
      favicon: './public_dev/favicon.ico'
    }),
    // new UglifyJsPlugin()
  ]
};
