const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

const devMode = process.argv[process.argv.indexOf('--mode') + 1] === 'development';

module.exports={
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    devServer:{
        historyApiFallback: true,
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        }),
    ],
    module: {
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(scss|css)$/,
                use: ["style-loader","css-loader", 'sass-loader']
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
    }
}