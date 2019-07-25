const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',

	entry: './src/index.ts',

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd',
	},

	devtool: 'source-map',

	plugins: [new webpack.ProgressPlugin()/*, new HtmlWebpackPlugin()*/],

	module: {
		rules: [
			{
				test: /.(ts|tsx)?$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: [/node_modules/]
			}
		]
	},

	/*
	TODO:
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},
	*/

	devServer: {
		open: true
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
};

// TODO: Is it somehow possible to run webpack and webpack-dev-server with one command
