/**
 * note:
 * Webpack dev Server had a problem with `umd` builds,
 * so v4 beta is used to fix that.
 *
 * it also possible to use the `3.11.0` version as well with `hot` and `injectClient` set to `false`.
 */

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    mode: "development",
    // devServer: {
    //   static: path.join(__dirname, "docs"),
    //   compress: true,
    //   port: 9000,
    //   hot: true,
    // },
    entry: "./src/index.ts",
    devtool: "source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      library: "mapboxGlDrawSnapOnMode",
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  },
];
