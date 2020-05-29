'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  /*LCORD_API_Url: '"http://13.125.18.161:3000"',*/
  LCORD_API_Url: '"http://localhost:3000"',
})
