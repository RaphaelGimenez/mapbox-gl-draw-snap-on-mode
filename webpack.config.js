const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    mode: "production",
    entry: "./src/index.ts",
    devtool: "source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      library: "mapboxGlDrawSnapOnMode",
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({ parallel: true })],
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
    plugins: [
      // new BundleAnalyzerPlugin({
      //   analyzerMode: "server",
      //   generateStatsFile: true,
      //   statsOptions: { source: false },
      // }),
    ],
    externals: {
      "@mapbox/mapbox-gl-draw": {
        commonjs: "@mapbox/mapbox-gl-draw", // CommonJS module
        commonjs2: "@mapbox/mapbox-gl-draw", // CommonJS2 module
        amd: "@mapbox/mapbox-gl-draw", // AMD module
        root: "MapboxDraw", // Global variable in a browser environment
      },
    },
  },
];
