const path = require('path');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const SRC_DIR = path.join(__dirname, 'src');
const PUB_DIR = path.join(__dirname, 'public');
const build_dir = path.join(__dirname, 'build');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[hash].bundle.js',
    path: build_dir,
    publicPath: './'
  },
  optimization: {
    minimize: true,
    moduleIds: 'size',
    removeAvailableModules: true,
    runtimeChunk: {
      name: (entrypoint) => `runtimechunk~${entrypoint.name}`
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false,
        parallel: true
      }),
      new HtmlWebpackPlugin({
        template: `${PUB_DIR}/index.html`,
        // favicon: `${PUB_DIR}/favicon.ico`,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          removeAttributeQuotes: true
        }
      })
    ]
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 400000
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[contenthash].css'
    }),
    new CleanWebpackPlugin(),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: SRC_DIR,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'static/images'
            }
          }
        ]
      }
    ]
  }
});
