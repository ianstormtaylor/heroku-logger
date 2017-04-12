
import Logfmt from 'logfmt'
import chalk from 'chalk'
import is from 'is'
import flatten from 'flatten-obj'

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
 * Logger.
 *
 * @type {Logger}
 */

class Logger {

  /**
   * Constructor.
   *
   * @type {Object} options
   */

  constructor(options = {}) {
    let { color, level, readable } = options

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
   * Log a `message` with `data` at `level`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  log = (level, message, data = {}) => {
    level = level.toLowerCase()

    if (!(level in LEVELS)) {
      return this.log('info', message, data)
    }

    if (!is.string(message)) {
      message = message.toString()
    }

    if (!is.object(data)) {
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
    const flat = flatten(data, { separator: '#' })
    const ctx = {
      ...flat,
      level,
      message,
    }

    const formatted = logfmt.stringify(ctx)

    if (readable && color) {
      const tag = `${COLORS[level](`[${level}]`)}`
      const msg = value > 3 ? chalk.red(message) : message
      const obj = `${chalk.gray(formatted)}`
      return `${tag} ${msg} ${obj}`
    }

    else if (readable) {
      return `[${level}] ${message} ${formatted}`
    }

    else {
      return formatted
    }
  }

}

/**
 * Logger singleton.
 *
 * @type {Logger}
 */

const logger = new Logger({
  level: LOG_LEVEL || 'info',
  readable: NODE_ENV != 'production',
  color: NODE_ENV != 'production',
})

/**
 * Export.
 *
 * @type {Logger}
 */

export default logger
export { Logger }
