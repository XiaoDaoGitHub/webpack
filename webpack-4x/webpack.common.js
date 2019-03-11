const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function cssLoader() {
  let ret = [],
    type = arguments[0]
  arguments = Array.prototype.slice.call(arguments, 1)
  for (let i = 0; i < arguments.length; i++) {
    if (i == 0 && !type) {
      ret.push({
        loader: arguments[i],
        options: {
          publicPath: '../'
        }
      })
    } else {
      ret.push({
        loader: arguments[i]
      })
    }

  }
  return ret
}

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js'
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
          name: 'img/[name].[hash:7].[ext]'
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
        use: cssLoader(process.env.NODE_ENV !== 'production', process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader')
      },
      {
        test: /\.sass$/,
        use: cssLoader(process.env.NODE_ENV !== 'production', process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader')
      }
    ]
  }
}