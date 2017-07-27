'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logfmt = require('logfmt');
var chalk = require('chalk');
var flatten = require('flat');

/**
 * Environment variables.
 *
 * @type {String}
 */

var _process$env = process.env,
    LOG_LEVEL = _process$env.LOG_LEVEL,
    NODE_ENV = _process$env.NODE_ENV;

/**
 * Logfmt helper.
 *
 * @type {Logfmt}
 */

var logfmt = new Logfmt();

/**
 * Log levels.
 *
 * @type {Object}
 */

var LEVELS = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
};

/**
 * Log level colors.
 *
 * @type {Object}
 */

var COLORS = {
  trace: chalk.gray,
  debug: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.bgRed.white
};

/**
 * Define the `Logger` class.
 *
 * @type {Logger}
 */

var Logger = function () {

  /**
   * Constructor.
   *
   * @param {Object} options
   */

  function Logger() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Logger);

    var _options$color = options.color,
        color = _options$color === undefined ? NODE_ENV != 'production' : _options$color,
        _options$level = options.level,
        level = _options$level === undefined ? LOG_LEVEL || 'info' : _options$level,
        _options$prefix = options.prefix,
        prefix = _options$prefix === undefined ? '' : _options$prefix,
        _options$readable = options.readable,
        readable = _options$readable === undefined ? NODE_ENV != 'production' : _options$readable;


    if (typeof level != 'string') {
      level = 'info';
    }

    level = level.toLowerCase();

    if (!(level in LEVELS)) {
      level = 'info';
    }

    if (typeof prefix != 'string') {
      prefix = String(prefix);
    }

    this.config = {
      level: level,
      prefix: prefix,
      color: !!color,
      readable: !!readable,
      threshold: LEVELS[level]
    };

    var _loop = function _loop(key) {
      _this[key] = function (message, data) {
        return _this.log(key, message, data);
      };
    };

    for (var key in LEVELS) {
      _loop(key);
    }
  }

  /**
   * Log to the console with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  _createClass(Logger, [{
    key: 'log',
    value: function log(level, message, data) {
      if (typeof level != 'string') {
        level = 'info';
      }

      level = level.toLowerCase();

      if (!(level in LEVELS)) {
        level = 'info';
      }

      if (typeof message != 'string') {
        message = String(message);
      }

      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != 'object') {
        data = {};
      }

      var _config = this.config,
          threshold = _config.threshold,
          prefix = _config.prefix;

      var value = LEVELS[level];
      if (value < threshold) return;

      var output = this.format(level, prefix + message, data);
      console.log(output); // eslint-disable-line no-console
    }

    /**
     * Format a log with `level`, `message` and `data`.
     *
     * @param {String} level
     * @param {String} message
     * @param {Object} data
     */

  }, {
    key: 'format',
    value: function format(level, message, data) {
      var _config2 = this.config,
          color = _config2.color,
          readable = _config2.readable;

      var value = LEVELS[level];
      var flat = flatten(data, { delimiter: '#' });
      var ctx = Object.assign({}, flat, { level: level, message: message });
      var string = logfmt.stringify(ctx);

      if (readable && color) {
        var tag = '' + COLORS[level]('[' + level + ']');
        var msg = value > 3 ? chalk.red(message) : message;
        var obj = '' + chalk.gray(string);
        return tag + ' ' + msg + ' ' + obj;
      } else if (readable) {
        return '[' + level + '] ' + message + ' ' + string;
      } else {
        return string;
      }
    }

    /**
     * Create a new logger, extending the current logger's config.
     *
     * @param {Object} options
     * @return {Logger}
     */

  }, {
    key: 'clone',
    value: function clone() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Logger(Object.assign({}, this.config, options));
    }
  }]);

  return Logger;
}();

/**
 * Create a logger singleton with sane defaults.
 *
 * @type {Logger}
 */

var logger = new Logger();

/**
 * Export.
 *
 * @type {Logger}
 */

module.exports = exports = logger;
exports.Logger = Logger;