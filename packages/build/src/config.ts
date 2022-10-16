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

const isDev = process.env.NODE_ENV === "development";
const emptyPlugin = new EmptyPlugin();
const { chunksPath, regExp, resolvers } = __config__;

const configuration: Configuration = {
  entry: __resolve_client__("src/index.tsx"),
  output: {
    path: __resolve_dist__(),
    filename: "[name].[contenthash].js",
    chunkFilename: path.join(chunksPath.js, "[id].[contenthash].js"),
    clean: true,
    publicPath: "",
    hotUpdateChunkFilename: ".hot/[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: ".hot/[fullhash].hot-update.json",
    assetModuleFilename(pathData) {
      let filename = "";

      if (pathData.module) {
        const { request } = pathData.module as NormalModule;
        filename = __asset_name__(request);
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
              configFile: __resolve_root__("babel.config.js"),
              plugins: [
                [
                  __resolve_root__("lib/babel-plugin-file-loader.js"),
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
                  return __css_module_name__(name, ctx.resourcePath);
                },
                auto: true,
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: __resolve_root__("postcss.config.js"),
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
        test: regExp.image,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ManifestPlugin({ filename: "manifest.json" }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: path.join(chunksPath.css, "[id].[contenthash].css"),
    }),
    new RemoveLicensePlugin(),
    isDev ? new HotModuleReplacementPlugin() : emptyPlugin,
  ],
  mode: isDev ? "development" : "production",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: resolvers.client,
    modules: ["node_modules", __resolve_client__("public")],
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
