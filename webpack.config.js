const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");

module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    path: path.resolve(__dirname, "dist-static"),
    filename: "[name].[chunkhash].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("dist-static", {}),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      filename: "index.html"
    }),
    new WebpackMd5Hash(),
    new MonacoWebpackPlugin(),
    new DotenvPlugin({
      systemvars: true
    })
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    overlay: true,
    proxy: {
      "/.netlify/functions": {
        target: "http://localhost:9000",
        pathRewrite: {
          "^/\\.netlify/functions": ""
        }
      }
    }
  },
  node: {
    fs: "empty",
    module: "empty"
  }
};
