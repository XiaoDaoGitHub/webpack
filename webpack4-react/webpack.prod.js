process.env.NODE_ENV = 'production'
const merge = require('webpack-merge')
const common = require('./webpack.common.js');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); 
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const devMode = process.env.NODE_ENV !== 'production'
//  打印webpack各个部分的运行速度，以此来确定优化点
const smp = new SpeedMeasurePlugin()


const config = merge(common, {
    mode: 'production',

    //  生产环境使用体积较小的source-map
    devtool: 'source-map',

    plugins: [
        //  将环境变量设为production
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        new CleanWebpackPlugin(),

        // 在没有增加减少第三方库的情况下让vendors无限期缓存下去
        new webpack.HashedModuleIdsPlugin(),

        // 进行一些预编译，加快速度
        new webpack.optimize.ModuleConcatenationPlugin(),

        //  用来提取js中的css到单独文件中，该插件不能和style-loader公用，且只适合在production下使用
        new MiniCssExtractPlugin({
            filename: devMode? '[name].css': './css/[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : './css/[id].[hash].css',
        }),

        //  压缩css
        new OptimizeCSSAssetsPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: true,
            minify: {
                //  移除注释
                removeComments: true,

                // 折叠空格区域
                collapseWhitespace: true,

                // 尽可能删除属性周围的引号
                removeAttributeQuotes: true
            }
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',   // initial、async和all
            minSize: 30000,   // 形成一个新代码块最小的体积
            maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            maxInitialRequests: 3,   // 最大初始化请求数
            automaticNameDelimiter: '~',   // 打包分割符
            name: true,
            cacheGroups: {
              reactBase: { // 项目基本框架等
                chunks: 'all',
                test: (module) => {
                    return /react|redux|prop-types/.test(module.context);
                },
                priority: 100,
                name: 'vendors',
              },
              common: {
                test: /[\\/]node_modules[\\/]/,
                name: 'common',
                chunks: 'initial',
                priority: 2,
                minChunks: 2,
              },
              styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                enforce: true
              }
            }
          },
          minimizer: [
            new UglifyJsPlugin({
              parallel: os.cpus().length - 1,  // 使用多进程并行运行来提高构建速度
              cache:true,
              sourceMap:true,  
              uglifyOptions: {
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                },
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                }
              }
            })
          ],
    }
})


module.exports = smp.wrap(config)