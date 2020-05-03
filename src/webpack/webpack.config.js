/**
 * Base webpack config.  Returns an array of 2 configs.
 * 
 * Configs for handling Javascript and CSS are split to enable separately controlled
 * static asset builds.
 * 
 * Configs are named to be self-explanatory.
 */

const path = require('path');
const srcPath = path.resolve(__dirname, '../');

console.log('process.env.ENV mode is ' + process.env.NODE_ENV);
console.log(`Using [ ${srcPath} ] for srcPath`);

module.exports = [
  require('./js-config')(srcPath),
  // require('./webpack/scss-config')(srcPath),
];
