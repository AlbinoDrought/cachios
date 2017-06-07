const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf.js');

const distPath = './dist';

const spinner = ora('building cachios...');
spinner.start();

rm(path.resolve(distPath), (err) => {
  if (err) throw err;
  webpack(webpackConfig, (werr, stats) => {
    spinner.stop();
    if (werr) throw werr;
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`);

    console.log(chalk.cyan(' Build complete.\n'));
    console.log(chalk.yellow('Successfully built cachios'));
  });
});
