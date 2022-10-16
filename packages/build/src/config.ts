import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ManifestPlugin } from "@react-ssr/load";
import {
  Configuration,
  HotModuleReplacementPlugin,
  NormalModule,
} from "webpack";
import { RemoveLicensePlugin } from "./plugins/remove-license-plugin";
import { EmptyPlugin } from "./plugins/empty-plugin";
import getModuleName from "../../../lib/get-module-names";
import getAssetName from "../../../lib/get-asset-name";
import dict from "../../../lib/dict";
import resolvers from "../../../lib/resolvers";

function resolve(dist: string, clientPath = true) {
  return path.resolve(__dirname, clientPath ? `../../client/${dist}` : dist);
}

const isDev = process.env.NODE_ENV === "development";
const emptyPlugin = new EmptyPlugin();

const configuration: Configuration = {
  entry: [resolve("src/index.tsx")],
  output: {
    path: resolve("../../../dist", false),
    filename: "[name].[contenthash].js",
    chunkFilename: "[id].[contenthash].js",
    clean: true,
    publicPath: "/",
    hotUpdateChunkFilename: ".hot/[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: ".hot/[fullhash].hot-update.json",
    assetModuleFilename(pathData) {
      let filename = "";

      if (pathData.module) {
        const { request } = pathData.module as NormalModule;
        filename = getAssetName(request);
      }

      return filename;
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              configFile: resolve("../../../babel.config.js", false),
              plugins: [
                [
                  resolve("../../../lib/babel-plugin-file-loader.js", false),
                  {
                    isWebpack: true,
                  },
                ],
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                getLocalIdent(ctx: any, _: any, name: string) {
                  return getModuleName(name, ctx.resourcePath);
                },
                auto: true,
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: resolve("../../../postcss.config.js", false),
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              additionalData: `
                @import "@styles/variables";
              `,
            },
          },
        ],
      },
      {
        test: dict.imgRegExp,
        type: "asset/resource",
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
    alias: resolvers.client,
    modules: ["node_modules", resolve("public")],
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
};

export const config = configuration as Required<Configuration>;
