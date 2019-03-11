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
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'
//  打印webpack各个部分的运行速度，以此来确定优化点
// const smp = new SpeedMeasurePlugin()


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
        }),


        //  该功能和splitChunks打包的库文件重复了，暂时不用
  //告诉 Webpack 使用了哪些动态链接库
    // new webpack.DllReferencePlugin({
    //   // 描述 vendor 动态链接库的文件内容
    //   manifest: require('./public/vendor/vendor.manifest.json'),
    //   context: __dirname,
    //   scope: 'xyz',
    // }),
    // // 该插件将把给定的 JS 或 CSS 文件添加到 webpack 配置的文件中，并将其放入资源列表 html webpack插件注入到生成的 html 中。
    // new AddAssetHtmlPlugin([
    //     {
    //         // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持 globby 字符串
    //         filepath: require.resolve(path.resolve(__dirname, 'public/vendor/vendor.dll.js')),
    //         // 文件输出目录
    //         outputPath: 'vendor',
    //         // 脚本或链接标记的公共路径
    //         publicPath: 'vendor'
    //     }
    // ]),
    ],
    optimization: {
        splitChunks: {
          chunks: 'async', 
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
            cacheGroups: {
              vendors: {
                //符合条件的放入当前缓存组
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all"
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
              parallel: os.cpus().length,
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
            }),
         
          ],
    }
})


// module.exports = smp.wrap(config)
module.exports = config