/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { default: merge } = require('webpack-merge');
const common = require('./webpack.common');

const port = process.env.PORT || 3000;

const SRC_DIR = path.join(__dirname, 'src');
const PUB_DIR = path.join(__dirname, 'public');

module.exports = merge(common, {
  entry: `${SRC_DIR}/index.jsx`,
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: SRC_DIR,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // alwaysWriteToDisk: true,
      template: `${PUB_DIR}/index.html`
      // favicon: `${PUB_DIR}/favicon.ico`
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port,
    open: true,
    openPage: `http://localhost:${port}/`,
    historyApiFallback: true,
    quiet: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: false,
      warnings: true,
      publicPath: false
    }
  }
});
