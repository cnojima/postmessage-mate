/**
 * Webpack config to handle javascript assets explicitly.
 * 
 */
const path = require('path');
const webpack = require('webpack');

const publicPath = ''

/**
 * @param {!string} publicPath "/static/" folder as exposed by flask server
 */
module.exports = (srcPath) => {
  // let entrypoint filename be the output bundle name
  const fileName = '[name].bundle.js';

  return {
    name: 'js',
    mode: 'production',
    // no source maps in prod
    devtool: false,
    entry: {
      // main entrypoint for webpack
      PostMessageMate: `${srcPath}/js/PostMessageMate.js`,
    },
    output: {
      devtoolNamespace: 'postMessageMate',
      filename: fileName,
      path: `${__dirname}/../../extension/js`,
      publicPath: `${publicPath}/js`,
    },
    resolve: {
      // only find files with these extensions
      // jsx : React components
      // ts : TypeScript files
      extensions: ['.js','.jsx','.ts'],
      // enable less-verbose import
      alias: {
        actions    : path.normalize(`${srcPath}/js/actions/`),
        components : path.normalize(`${srcPath}/js/components/`),
        constants  : path.normalize(`${srcPath}/js/constants/`),
        containers : path.normalize(`${srcPath}/js/containers/`),
        hooks      : path.normalize(`${srcPath}/js/hooks/`),
        middleware : path.normalize(`${srcPath}/js/middleware/`),
        reducers   : path.normalize(`${srcPath}/js/reducers/`),
        utils      : path.normalize(`${srcPath}/js/utils/`),
        views      : path.normalize(`${srcPath}/js/views/`),
      }
    },
    module: {
      rules: [
        {
          // use preset-env to baseline ES2019 JS syntax conventions
          // to transpile back to ES5 for browsers
          test: /\.js[x]{0,1}$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        },
      ]
    },
    plugins: [
      // show progress on build
      new webpack.ProgressPlugin(),
    ],
    // reduce noise in console
    stats: { warnings:false },
    optimization: {
      // minimize artifact size
      minimize: false,
      // split bundles into common/vendor and app based on imports
      // splitChunks: {
      //   chunks: 'all',
      // },
    },
  };
}
