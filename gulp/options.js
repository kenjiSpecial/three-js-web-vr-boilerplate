'use strict';

var options = require('minimist')(process.argv.slice(2));
var pckg = require('../package.json');

options = require('defaults')(options, {
    debug: true,
    watch: false,
    minify: false,
    useProxy: false,
    env: 'dev',
});

if (options.staging) {
    options.debug = false;
    options.minify = true;
    options.env = 'staging';
}

if (options.internal) {
    options.debug = false;
    options.minify = true;
    options.env = 'internal';
}

if (options.live) {
    options.debug = false;
    options.minify = true;
    options.env = 'live';
}

module.exports = options;
