const murmurhash = require('murmurhash')
const fs = require('fs')

class Compiler {
  /**
   * @param {String} filePath
   */
  constructor (filePath) {
    fs.accessSync(filePath, fs.constants.R_OK)

    this.filePath = filePath
    this.chunks = {}
  }

  get scopeId () {
    return murmurhash.v3(this.filePath)
  }

  get html () {
    return this._getChunk('html')
  }

  get style () {
    return this._getChunk('style')
  }

  _getChunk (name) {
    if (!this.chunks[name]) {
      this._parseChunks()
    }

    return this.chunks[name]
  }

  _parseChunks () {
    const regex = /<style[^>]+scoped[^>]*>(.+)<\/style>/s
    const contents = fs.readFileSync(this.filePath)
      .toString('utf-8')

    const matches = regex.exec(contents)

    if (! matches) {
      this.chunks.html = this._wrapHtml(contents)
      this.chunks.style = this._wrapStyle('')
      return
    }

    const [, style] = matches

    this.chunks.html = this._wrapHtml(contents.replace(regex, '').trim())
    this.chunks.style = this._wrapStyle(style.trim())
  }

  _wrapHtml (html) {
    return `<div ${this.scopeTag}="">${html}</div>`
  }

  _wrapStyle (style) {
    return `[${this.scopeTag}] {
      ${style}
    }`
  }

  get scopeTag () {
    return `data-b-${this.scopeId}`
  }
}

module.exports = Compiler
