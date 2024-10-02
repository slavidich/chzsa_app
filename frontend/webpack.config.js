const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

const devMode = process.argv[process.argv.indexOf('--mode') + 1] === 'development';
// плагины для оптимизации 
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports={
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: devMode ? '[name].bundle.js' : '[name].[contenthash].js',
        publicPath: '/',
    },
    mode: devMode ? 'development' : 'production',
    devServer:{
        historyApiFallback: true,
        host: '127.0.0.1',
    },
    optimization: {
        minimize: !devMode,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            name: false,
        },
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        }),
        !devMode && new MiniCssExtractPlugin(),
        !devMode && new CompressionPlugin(),
        !devMode && new BundleAnalyzerPlugin()
    ].filter(Boolean),
        
    module: {
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader", 
                    'sass-loader']
            },
            {
                test:/\.(webp)$/,
                use:[
                    {
                        loader: 'file-loader',
                        options:{
                            name:'[name].[ext]',
                            outputPath: 'img/',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg:{
                                progressive:true,
                                quality:65
                            }
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack']
            }
        ]
    },
    resolve:{
        extensions: ['.js', '.jsx'],
        alias:{
            '@': path.resolve(__dirname, 'src')
        }
    }
}