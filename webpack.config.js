const Path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const minifyPrivatesTransformer = require("ts-transformer-minify-privates")
  .default;
const TerserPlugin = require("terser-webpack-plugin");

const sassRegex = /\.(scss|sass)$/;
const sassGlobalRegex = /\.global\.(scss|sass)$/;

module.exports = ({ NODE_ENV }) => {
  const isDevelopment = NODE_ENV === "development";
  const isProduction = NODE_ENV === "production";

  const classNamePattern = isDevelopment
    ? "[path][name]__[local]"
    : "[hash:base64:6]";

  return {
    entry: {
      main: "./src/index.ts"
    },
    output: {
      path: Path.join(__dirname, "build"),
      filename: "js/[name].js",
      chunkFilename: "js/[name].bundle.js"
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            mangle: {
              properties: {
                regex: /^_private_.+$/
              }
            }
          }
        })
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        { from: Path.resolve(__dirname, "./src/assets"), to: "assets" }
      ]),
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ],
    resolve: {
      alias: {
        "~": "./src"
      },
      extensions: [".tsx", ".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              getCustomTransformers: program => ({
                before: [minifyPrivatesTransformer(program)]
              })
            }
          }
        },
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
          loader: "arraybuffer-loader"
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        },
        {
          test: sassGlobalRegex,
          use: [
            isDevelopment && "style-loader",
            isProduction && MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            {
              loader: "css-loader",
              options: {
                modules: false
              }
            },
            // Compiles Sass to CSS
            "sass-loader"
          ].filter(Boolean)
        },
        {
          test: sassRegex,
          exclude: sassGlobalRegex,
          use: [
            isDevelopment && "style-loader",
            isProduction && MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: classNamePattern
                }
              }
            },
            "sass-loader"
          ].filter(Boolean)
        },
        {
          test: /\.json$/,
          loader: "json-loader"
        }
      ]
    }
  };
};
