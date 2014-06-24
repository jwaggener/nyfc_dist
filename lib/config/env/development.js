'use strict';

var env = require('node-env-file');
env('.env');

module.exports = {
		env: 'development'
};