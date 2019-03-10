process.env.NODE_ENV = 'development'
const merge = require('webpack-merge')
const common = require('./webpack.common.js');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


const devMode = process.env.NODE_ENV !== 'production'
//  打印webpack各个部分的运行速度，以此来确定优化点
const smp = new SpeedMeasurePlugin()


const config = merge(common, {
    mode: 'development',

    //  inline-source-map可以精确打印错误的位置，但体积比较大，适合在开发环境使用
    devtool: 'inline-source-map',
    devServer: {
        quiet: true, //  使用了FriendlyErrorsPlugin,关闭devserver的错误提示,
        port: 8080,
        compress: true, // 开启gzip压缩
        host: 'localhost',
        proxy: {

        },
        inline: true,
        hot: true,
    },  
    plugins: [
          //  将环境变量设为development
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        //  开启热替换，局部更新，devserver的热加载会刷新页面
        new webpack.HotModuleReplacementPlugin(),
          //  热加载时直接返回更新文件名，而不是文件的id。
          new webpack.NamedModulesPlugin(),

          new MiniCssExtractPlugin({
            filename: devMode? './css/[name].css': '[name].[hash].css',
            chunkFilename: devMode ? './css/[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: true
        }),

        new FriendlyErrorsPlugin({
            compilationSuccessInfo:{
                messages: ['running at http://localhost:8080']
            }
        })
    ]
})


module.exports = smp.wrap(config)
