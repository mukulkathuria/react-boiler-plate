const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const port = process.env.PORT || 3000;

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public"),
  },
  resolve: {
    extensions: [".es6", ".js", ".jsx"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$|\.es6|\.jsx$/,
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    host: "localhost",
    port: port,
    historyApiFallback: true, // Page likely to severed when 404
  },
};
