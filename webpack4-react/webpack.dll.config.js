const path = require('path');
const webpack = require('webpack');
const CleanWebpaclPlugin = require('clean-webpack-plugin');
const FirendlyErrorePlugin = require('friendly-errors-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        // 将 lodash 模块作为入口编译成动态链接库
        vendor: ['react', 'react-dom']
    },
    output: {
        // 指定生成文件所在目录
        // 由于每次打包生产环境时会清空 dist 文件夹，因此这里我将它们存放在了 public 文件夹下
        path: path.resolve(__dirname, 'public/vendor'),
        // 指定文件名
        filename: '[name].dll.js',
        // 存放动态链接库的全局变量名称，例如对应 vendor 来说就是 vendor_dll_lib        // 这个名称需要与 DllPlugin 插件中的 name 属性值对应起来
        // 之所以在前面 _dll_lib 是为了防止全局变量冲突
        library: '[name]_dll_lib'
    },
    plugins: [
        // new CleanWebpaclPlugin(['vendor'], {
        //     root: path.resolve(__dirname, 'public')
        // }),
        new FirendlyErrorePlugin(),                // 接入 DllPlugin
        new webpack.DllPlugin({
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            // 由于每次打包生产环境时会清空 dist 文件夹，因此这里我将它们存放在了 public 文件夹下
            path: path.join(__dirname, 'public', 'vendor', '[name].manifest.json'),
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 vendor.manifest.json 中就有 "name": "vendor_dll_lib"            name: '[name]_dll_lib'
        })
    ],
    performance: {
        // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
        hints: "warning",        // 开发环境设置较大防止警告
        // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
        maxEntrypointSize: 5000000,         // 最大单个资源体积，默认250000 (bytes)
        maxAssetSize: 3000000
    }}