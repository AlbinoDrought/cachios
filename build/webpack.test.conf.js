const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

let webpackConfig = merge(baseConfig, {
    devtool: '#inline-source-map',
});

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;