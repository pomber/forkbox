const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");
const webpack = require("webpack");

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
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
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
    }),
    // https://github.com/Microsoft/monaco-editor-webpack-plugin/issues/13#issuecomment-390806320
    new webpack.ContextReplacementPlugin(
      /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
      __dirname
    )
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
