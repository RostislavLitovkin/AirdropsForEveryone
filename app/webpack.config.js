const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")


module.exports = {
    entry: './src/index.tsx', // Entry point for React TypeScript
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
      },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'], // Resolve these file extensions
    },
    plugins: [
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, ".")
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: "public" }],
          }),
    ],
    mode: 'development',
    experiments: {
        asyncWebAssembly: true
    }
};
