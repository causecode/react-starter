var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var isProduction = process.argv.indexOf('--production') != -1;
var path = require('path');

var plugins = [];

var entryPoints = [
    './src/index.tsx'
];

if (isProduction) {
    // Adding Production environment specific features.

    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    );
} else {
    // Adding Development environment specific features.
    entryPoints.push(
        'webpack/hot/only-dev-server'  // Used to enable hot reloading in webpack.
    );

    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    })
}

plugins.push(
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.ejs'
    }),
    new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true
    })
);

var config = {
    entry: entryPoints,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'bundle.[hash].min.js' : 'bundle.js',
        publicPath: '/'
    },
    devtool: 'source-map',
    devServer: {
		historyApiFallback: true
	},
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
            'node_modules'
        ],
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: "pre",
                loader: 'tslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'react-hot-loader',
                    'ts-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
                use: [
                    'url-loader?limit=100000'
                ]
            }
        ]
    },
    plugins: plugins
};

module.exports = config;