
/**
 * Polyfills.
 */

import 'babel-polyfill'

/**
 * Dependencies.
 */

import Contents from '..'
import RESOURCES from '../lib/resources'
import assert from 'assert'

/**
 * Tests.
 */

describe('contents-node', () => {

  it('should export `Contents`', () => {
    assert(Contents)
    assert(Contents.prototype)
  })

  it('should be instanciable', () => {
    const contents = new Contents()
    assert(contents instanceof Contents)
  })

  it('should expose each resource', () => {
    const contents = new Contents()

    for (const kind in RESOURCES) {
      assert(contents[kind])
    }
  })

  it('should expose methods on each resource', () => {
    const contents = new Contents()

    for (const kind in RESOURCES) {
      const resource = RESOURCES[kind]

      for (const method in resource) {
        assert(contents[kind][method])
      }
    }
  })

})
