
const Logfmt = require('logfmt')
const chalk = require('chalk')
const flatten = require('flat')

/**
 * Environment variables, with a client-side guard.
 *
 * @type {String}
 */

let LOG_LEVEL
let NODE_ENV

if (typeof process !== 'undefined') {
  LOG_LEVEL = process.env.LOG_LEVEL
  NODE_ENV = process.env.NODE_ENV
}

/**
 * Logfmt helper.
 *
 * @type {Logfmt}
 */

const logfmt = new Logfmt()

/**
 * Log levels.
 *
 * @type {Object}
 */

const LEVELS = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
}

/**
 * Log level colors.
 *
 * @type {Object}
 */

const COLORS = {
  trace: chalk.gray,
  debug: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.bgRed.white,
}

/**
 * Define the `Logger` class.
 *
 * @type {Logger}
 */

class Logger {

  /**
   * Constructor.
   *
   * @param {Object} options
   */

  constructor(options = {}) {
    let {
      color = (NODE_ENV != 'production'),
      level = (LOG_LEVEL || 'info'),
      prefix = '',
      readable = (NODE_ENV != 'production'),
    } = options

    if (typeof level != 'string') {
      level = 'info'
    }

    level = level.toLowerCase()

    if (!(level in LEVELS)) {
      level = 'info'
    }

    if (typeof prefix != 'string') {
      prefix = String(prefix)
    }

    this.config = {
      level,
      prefix,
      color: !!color,
      readable: !!readable,
      threshold: LEVELS[level],
    }

    for (const key in LEVELS) {
      this[key] = (message, data) => this.log(key, message, data)
    }
  }

  /**
   * Log to the console with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  log(level, message, data) {
    if (typeof level != 'string') {
      level = 'info'
    }

    level = level.toLowerCase()

    if (!(level in LEVELS)) {
      level = 'info'
    }

    if (typeof data != 'object') {
      data = {}
    }

    if (message instanceof Error) {
      data.error = message
      data.stack = message.stack
      message = message.message
    }

    if (typeof message != 'string') {
      message = String(message)
    }

    const { threshold, prefix } = this.config
    const value = LEVELS[level]
    if (value < threshold) return

    const output = this.format(level, prefix + message, data)
    console.log(output) // eslint-disable-line no-console
  }

  /**
   * Format a log with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  format(level, message, data) {
    const { color, readable } = this.config
    const value = LEVELS[level]
    const flat = flatten(data, { delimiter: '#' })
    const ctx = Object.assign({}, flat, { level, message })
    const string = logfmt.stringify(ctx)

    if (readable && color) {
      const tag = `${COLORS[level](`[${level}]`)}`
      const msg = value > 3 ? chalk.red(message) : message
      const obj = `${chalk.gray(string)}`
      return `${tag} ${msg} ${obj}`
    }

    else if (readable) {
      return `[${level}] ${message} ${string}`
    }

    else {
      return string
    }
  }

  /**
   * Create a new logger, extending the current logger's config.
   *
   * @param {Object} options
   * @return {Logger}
   */

  clone(options = {}) {
    return new Logger(Object.assign({},
      this.config,
      options
    ))
  }

}

/**
 * Create a logger singleton with sane defaults.
 *
 * @type {Logger}
 */

const logger = new Logger()

/**
 * Export.
 *
 * @type {Logger}
 */

module.exports = exports = logger
exports.Logger = Logger
