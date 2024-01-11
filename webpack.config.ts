import 'webpack-dev-server';
import * as webpack from 'webpack';
import { resolve } from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

type Mode = 'none' | 'production' | 'development' | undefined;

const NODE_ENV: Mode = process.env.NODE_ENV as Mode;

const PREFIX = NODE_ENV === 'production' ? '/client-routing-lib' : '';

const config: webpack.Configuration = {
  entry: { index: resolve(__dirname, './example/index.ts') },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.[chunkhash].js',
    clean: true,
    environment: {
      arrowFunction: false,
    },
    publicPath: NODE_ENV === 'production' ? '/client-routing-lib' : '/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/index.html',
    }),
    new HtmlWebpackPlugin({
      template: 'example/index.html',
      filename: '404.html',
    }),
    new webpack.DefinePlugin({
      PRODUCTION: NODE_ENV === 'production',
      PREFIX: JSON.stringify(PREFIX),
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
    watchFiles: ['example/index.html'],
    historyApiFallback: true,
  },
};

export default config;
