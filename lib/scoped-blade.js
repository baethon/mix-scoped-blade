const File = require('laravel-mix/src/File')
const Log = require('laravel-mix/src/Log')
const mix = require('laravel-mix')
const fs = require('fs')
const path = require('path')
const Task = require('./task')

class ScopedBlade {
  constructor () {
    this.registered = false
  }

  dependencies () {
    return ['concat', 'murmurhash'].concat()
  }

  name () {
    return 'scopedBlade'
  }

  register ({
    from = 'resources/views/**/*.scoped.blade.php',
    to = 'resources/scoped/',
    css = 'css/scoped.css',
  } = {}) {
    if (this.registered) {
      Log.feedback('scopedBlade() can be called only once')
      return
    }

    this.registered = true

    to = new File(to)
    this.paths = {
      views: new File(path.join(to.path(), 'views')),
      scss: new File(path.join(to.path(), 'scss')),
      scssIndex: new File(path.join(to.path(), 'scss', 'scoped.scss'))
    }

    this._setUp()
    const task = new Task({
      watch: from,
      paths: this.paths
    })

    Mix.addTask(task)
    Mix.listen('init', () => task.compileAllFiles())

    mix.sass(this.paths.scssIndex.path(), css)
  }

  boot () {
    this.paths.scssIndex.write('')
  }

  _setUp () {
    this.paths.views.makeDirectories()
    this.paths.scss.makeDirectories()
  }
}

module.exports = ScopedBlade
