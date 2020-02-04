const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = () => {
	return {
		devtool: 'inline-source-map',
		mode: 'development',
		entry: './app.js',
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/
				},
				{
					test: /\.(png|jpg|gif)$/,
					loader: 'file-loader'
				}
			]
		},
		devServer: {
			contentBase: './dist',
			overlay: true,
			hot: true,
			historyApiFallback: true
		},
		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
				DEBUG: false
			}),
			new HtmlWebpackPlugin({
				template: 'index.html'
			}),
			new webpack.HotModuleReplacementPlugin(),
		//	new BundleAnalyzerPlugin()
		],
		resolve: {
			alias: {
				'$app': path.resolve(__dirname)
			}
		}
	};
};
