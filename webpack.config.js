const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',

            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',

            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new UglifyJSPlugin(),
    new MiniCssExtractPlugin({filename: 'style.css'}),
    new webpack.ProvidePlugin({
      d3: 'd3',
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      proxy: 'localhost:8000',
      files: ['**/*.php', '**/*.html', './dist/*.js', './dist/*.css']
    }, {
      reload: false
    })
  ],

  entry: './assets/js/index.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    alias: {
      style: path.resolve(__dirname, 'assets/scss'),
    },
    modules: [path.resolve(__dirname, 'assets/js'), 'node_modules']
  },

  mode: 'production',
  stats: 'errors-only'
};
