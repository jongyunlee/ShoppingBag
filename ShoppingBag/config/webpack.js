var webpack = require('webpack');
const path = require('path');

module.exports.webpack = {
    options: {
	entry: './assets/js/app.jsx',
	output: {
	    path: path.resolve(__dirname, '../.tmp/public/js'),
	    filename: 'bundle.jsx'
	},
	resolve: {
	    extension: ['', '.js', 'jsx', '.json']
	},
	stats: {
	    colors: true,
	    reasons: true,
	    chunks: false
	},
	module: {
	    loaders: [
		{
		    test: /\.jsx?$/,
		    loader: 'babel-loader'
		},
		{
		    test: /\.json$/,
		    loader: 'json-loader'
		}
	    ]
	}
    },

    watchOptions: {
	aggregateTimeout: 300
    }
}
