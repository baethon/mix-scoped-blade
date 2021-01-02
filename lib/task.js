const concat = require('concat')
const mix = require('laravel-mix')
const File = require('laravel-mix/src/File')
const BaseTask = require('laravel-mix/src/tasks/Task')
const FileCollection = require('laravel-mix/src/FileCollection')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const Compiler = require('./compiler')

class Task extends BaseTask {
  constructor (data) {
    super(data)

    this.compiledAllFiles = false
    this.files = new FileCollection([data.watch])
    this.scssCollectionPattern = path.join(
      data.paths.scss.path(),
      'scope-*.scss'
    )
  }

  run () {
    this.compileAllFiles()
  }

  onChange (updatedFile) {
    this._compileFile(new File(updatedFile))
    return this._concatScssFiles()
  }

  compileAllFiles () {
    if (this.compiledAllFiles) {
      return
    }

    // @TODO clear all compiled files

    this.compiledAllFiles = true
    this.files.get()
      .map(path => glob.sync(path, { nodir: true }))
      .flat()
      .forEach(path => {
        this._compileFile(new File(path))
      })

    return this._concatScssFiles()
  }

  /**
   * @param {File} file
   */
  _compileFile (file) {
    /** @type {DestFolders} */
    const { paths } = this.data
    const compiler = new Compiler(file.path())
    const viewName = file.relativePath().replace(/^.+\/views\//, '')
      .replace('.scoped.blade.php', '.blade.php')

    const destView = new File(path.join(paths.views.path(), viewName))
    const destScss = new File(path.join(paths.scss.path(), `scope-${compiler.scopeId}.scss`))

    destView.makeDirectories()
      .write(compiler.html)
    destScss.makeDirectories()
      .write(compiler.style)
  }

  _concatScssFiles () {
    return concat(glob.sync(this.scssCollectionPattern), this.data.paths.scssIndex.path())
  }
}

module.exports = Task
