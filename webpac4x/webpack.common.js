const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/[name].[hash].js'
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              loader: 'babel-loader'
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name:'img/[name].[hash:7].[ext]'
              }
            },
            {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'media/[name].[hash:7].[ext]'
              }
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
              }
            },
            {
              test: /\.css$/,
              use: [
                {
                  loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                },
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1
                    
                  }
                },
                {
                  loader: 'postcss-loader'
                }
              ]
            },
            {
              test: /\.sass$/,
              use: [
                {
                  loader:process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                },
                {
                  loader: 'css-loader'
                
                },
                {
                  loader: 'postcss-loader'
                },
                {
                  loader: 'sass-loader'
                }
              ]
            }
          ]
    }
}