import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ManifestPlugin } from "@react-ssr/load";
import { Configuration } from "webpack";
import { RemoveLicensePlugin } from "../plugins/remove-license-plugin";

function resolve(dist: string) {
  return path.resolve(__dirname, dist);
}

export const prodConfig: Configuration = {
  entry: resolve("../../client/src/index.tsx"),
  output: {
    path: resolve("../../../dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[id].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
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
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  devtool: false,
};
