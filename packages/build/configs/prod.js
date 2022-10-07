import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ManifestPlugin } from "@react-ssr/load";
import { RemoveLicensePlugin } from "../plugins/remove-license-plugin";

function resolve(dist) {
  return path.resolve(__dirname, dist);
}

export const prodConfig = {
  entry: resolve("../../client/src/index.js"),
  output: {
    path: resolve("../../../dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[id].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              configFile: resolve("../../../babel.config.js"),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new ManifestPlugin({ filename: "manifest.json" }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new RemoveLicensePlugin(),
  ],
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendors",
    },
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devtool: false,
};
