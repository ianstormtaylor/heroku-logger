
import logger from '..'
import { Logger } from '..'
import assert from 'assert'

/**
 * Examples.
 */

const example = new Logger({
  readable: true,
  color: true,
  level: 'trace',
})

example.trace('message', { nested: { key: 'value' }})
example.debug('message', { nested: { key: 'value' }})
example.info('message', { nested: { key: 'value' }})
example.warn('message', { nested: { key: 'value' }})
example.error('message', { nested: { key: 'value' }})
example.fatal('message', { nested: { key: 'value' }})

/**
 * Tests.
 */

describe('heroku-logger', () => {

  describe('interface', () => {

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

    it('should set config', () => {
      const l = new Logger()
      assert.deepEqual(l.config, {
        level: 'info',
        color: false,
        readable: false,
        threshold: 2,
      })
    })

    it('should define `logger.trace`', () => {
      assert.equal(typeof logger.trace, 'function')
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

    it('should define `logger.fatal`', () => {
      assert.equal(typeof logger.fatal, 'function')
    })

  })

})
