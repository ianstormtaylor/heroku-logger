
const logger = require('..')
const Logger = logger.Logger
const assert = require('assert')

/**
 * Examples.
 */

const example = new Logger({
  readable: true,
  color: true,
  level: 'debug',
})

example.debug('message', { data: [{ index: 1 }, { index: 2 }] })
example.info('message', { data: [{ index: 1 }, { index: 2 }] })
example.warn('message', { data: [{ index: 1 }, { index: 2 }] })
example.error('message', { data: [{ index: 1 }, { index: 2 }] })
example.error(new Error('An error occured!'))

/**
 * Tests.
 */

describe('heroku-logger', () => {

  it('should export `logger`', () => {
    assert(logger)
    assert(logger instanceof Logger)
  })

  it('should export `Logger`', () => {
    assert(Logger)
    assert(Logger.prototype)
  })

  it('should be instanciable', () => {
    const l = new Logger()
    assert(l instanceof Logger)
  })

  it('should initialize default config', () => {
    const l = new Logger()
    assert.deepEqual(l.config, {
      level: 'info',
      color: true,
      prefix: '',
      readable: true,
      threshold: 2,
      delimiter: '#',
    })
  })

  it('should override default config', () => {
    const l = new Logger({
      level: 'warn',
      color: false,
      prefix: 'foo',
      readable: false,
      threshold: 3,
      delimiter: '.',
    })
    assert.deepEqual(l.config, {
      level: 'warn',
      color: false,
      prefix: 'foo',
      readable: false,
      threshold: 3,
      delimiter: '.',
    })
  })

  it('should define `logger.debug`', () => {
    assert.equal(typeof logger.debug, 'function')
  })

  it('should define `logger.info`', () => {
    assert.equal(typeof logger.info, 'function')
  })

  it('should define `logger.warn`', () => {
    assert.equal(typeof logger.warn, 'function')
  })

  it('should define `logger.error`', () => {
    assert.equal(typeof logger.error, 'function')
  })

  it('should accept a delimiter option', () => {
    const l = new Logger({ delimiter: '.', color: false })
    const string = l.format('info', 'message', { key: { nested: 'value' }})
    assert.equal(string, '[info] message key.nested=value')
  })

  it('should not fail on circular data', () => {
    assert.doesNotThrow(() => {
      const data = { key: 'value' }
      data.data = data
      logger.format('info', 'message', data)
    })
  })

})
