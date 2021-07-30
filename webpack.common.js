const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$|\.es6|\.jsx$/,
        exclude: /node_modules/
      },
      {
        test: /\.svg(\?.*$|$)/,
        use: [
          { loader: '@svgr/webpack', options: {} },
          { loader: 'url-loader', options: { limit: 8192 } }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules']
  }
};
