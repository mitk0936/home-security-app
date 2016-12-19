var app_root = 'src';
var dist = '/dist';

var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	app_root: app_root,
	entry: [
		'webpack-dev-server/client?http://localhost:8080',
		'webpack/hot/only-dev-server',
		'babel-polyfill',
		__dirname + '/' + app_root + '/index.js',
	],
	output: {
		path: __dirname + dist + '/js',
		publicPath: 'js/',
		filename: 'bundle.js',
	},
	devtool: 'source-map',
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
			}
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
