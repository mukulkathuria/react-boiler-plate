const path = require('path');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const SRC_DIR = path.join(__dirname, 'src');
const PUB_DIR = path.join(__dirname, 'public');
const build_dir = path.join(__dirname, 'build');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: build_dir,
    publicPath: './'
  },
  optimization: {
    minimize: true,
    moduleIds: 'deterministic', // deterministic for better caching
    removeAvailableModules: true,
    runtimeChunk: {
      name: (entrypoint) => `runtimechunk~${entrypoint.name}`
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
          enforce: true
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20
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
    }),
    new BundleAnalyzerPlugin(), // Optional: use to analyze your bundle size
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/,
      algorithm: 'brotliCompress', // or 'gzip' for gzip compression
      compressionOptions: {
        level: 11
      },
      threshold: 8192, // only compress files larger than 8KB
      minRatio: 0.8 // only compress files that are compressed better
    }),
    new HtmlWebpackPlugin({
      template: `${PUB_DIR}/index.html`,
      // favicon: `${PUB_DIR}/favicon.ico`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
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
        type: 'asset/resource', // modern asset handling
        parser: {
          dataUrlCondition: {
            maxSize: 8192 // 8 KB (convert small images to base64)
          }
        },
        generator: {
          filename: 'static/images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // modern asset handling for fonts
        generator: {
          filename: 'static/fonts/[name].[hash][ext]'
        }
      }
    ]
  }
});
