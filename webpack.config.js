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

//				options: {
//					presets: ['env']
//				}
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
      files: ['**/*.php', '**/*.html', './web/static/dist/*.js', './web/static/dist/*.css']
    }, {
      reload: false
    })
  ],

  entry: './assets/js/index.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  mode: 'production',
  stats: 'errors-only'
};
