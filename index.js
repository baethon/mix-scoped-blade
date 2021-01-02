const mix = require('laravel-mix')
const ScopedBlade = require('./lib/scoped-blade')

mix.extend('scopedBlade', new ScopedBlade())
