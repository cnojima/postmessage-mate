/**
 * Overloads base webpack.config.js
 * Used with `npm run start:dev` to start webpack-dev-server serving hot-module-reload on top of DataDashboard views.
 */
const path = require('path');
const configs = require('./webpack.config.js');

module.exports = configs.map(config => {
	return {
		...config,
		mode: 'development',
		// enable source-maps in bundle output
		// devtool: 'eval-source-map',
		// webpack-dev-server, on port 9001
		devServer: {
			// reduce noise in console
			clientLogLevel: 'info',
			// maps request path to basepath `/static`
			// publicPath: '/static',
			// also reload view when contents under `/static` are changed
			// i.e., other JS/CSS/etc. files in `app/static/` that aren't being controlled by webpack
			// watchContentBase: true,
			// listening port
			// port: 9001,
			// proxies requests outside of the `publicPath` to the flask server
			// assumes flask is running locally on port 5000
			// proxy: {
			// 	'!(/static/[js|css]/**/**.*)': {
			// 		target: 'http://127.0.0.1:5000',
			// 	},
			// },
		},
		optimization: {
			// don't bother minimizing output - faster HMR
			minimize: false
		},
	}
});
