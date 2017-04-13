var app_root = 'src';
var dist = '/www';

var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	app_root: app_root,
	entry: [
		'webpack-dev-server/client?http://localhost:8100',
		'webpack/hot/only-dev-server',
		'babel-polyfill',
		__dirname + '/' + app_root + '/index.js',
	],
	output: {
		path: __dirname + dist,
		publicPath: '',
		filename: 'bundle.js',
	},
	devtool: false,
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass'],
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css'],
			},
			{
				test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
				loader: 'file-loader?name=./fonts/[name].[ext]'
			},
		],
	},
	devServer: {
		contentBase: __dirname + dist,
	},
	plugins: [
		new CleanWebpackPlugin(['css/main.css', 'js/bundle.js'], {
			root: __dirname + dist,
			verbose: true,
			dry: false, // true for simulation
		}),
	],
};
