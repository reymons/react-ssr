import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ManifestPlugin } from "@react-ssr/load";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import { RemoveLicensePlugin } from "./plugins/remove-license-plugin";
import { EmptyPlugin } from "./plugins/empty-plugin";

function resolve(dist: string) {
  return path.resolve(__dirname, dist);
}

const isDev = process.env.NODE_ENV === "development";
const emptyPlugin = new EmptyPlugin();

export const config = {
  entry: [resolve("../../client/src/index.tsx")],
  output: {
    path: resolve("../../../dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[id].[contenthash].js",
    clean: true,
    publicPath: "/",
    hotUpdateChunkFilename: ".hot/[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: ".hot/[fullhash].hot-update.json",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
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
    isDev ? new HotModuleReplacementPlugin() : emptyPlugin,
  ],
  mode: isDev ? "development" : "production",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  optimization: {
    splitChunks: isDev
      ? false
      : {
          chunks: "all",
          name: "vendors",
        },
  },
  devtool: isDev ? "source-map" : false,
} as Required<Configuration>;
