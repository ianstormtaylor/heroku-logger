
import Logfmt from 'logfmt'
import chalk from 'chalk'
import flatten from 'flat'

/**
 * Environment variables.
 *
 * @type {String}
 */

const {
  LOG_LEVEL,
  NODE_ENV,
} = process.env

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
      readable = (NODE_ENV != 'production'),
    } = options

    if (typeof level != 'string') {
      level = 'info'
    }

    level = level.toLowerCase()

    if (!(level in LEVELS)) {
      level = 'info'
    }

    this.config = {
      level,
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

  log = (level, message, data) => {
    if (typeof level != 'string') {
      level = 'info'
    }

    level = level.toLowerCase()

    if (!(level in LEVELS)) {
      level = 'info'
    }

    if (typeof message != 'string') {
      message = String(message)
    }

    if (typeof data != 'object') {
      data = {}
    }

    const { threshold } = this.config
    const value = LEVELS[level]
    if (value < threshold) return

    const output = this.format(level, message, data)
    console.log(output) // eslint-disable-line no-console
  }

  /**
   * Format a log with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  format = (level, message, data) => {
    const { color, readable } = this.config
    const value = LEVELS[level]
    const flat = flatten(data, { delimiter: '#' })
    const ctx = { ...flat, level, message }
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

  clone = (options = {}) => {
    return new Logger({
      ...this.config,
      ...options,
    })
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

export default logger
export { Logger }
