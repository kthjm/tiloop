import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

it('numToArr', () => {
  const numToArr = rewire('./index.js').__get__('numToArr')
  assert.deepEqual(numToArr(3), [0, 1, 2])
})

describe('indexes.indexes.size === length', () => {
  const modules = rewire('./index.js')
  const { create } = modules
  const yielded = array => assert.ok(Array.isArray(array))
  const justToArray = (indexes) => [...create(indexes, yielded)]

  const test = (Indexes) => () => {
    const length = 5000
    const indexes = new Indexes({ length, maxIncrement: 3 })
    justToArray(indexes)
    assert.ok(indexes.indexes.size === length)
  }

  it('IndexesZero', test(modules.IndexesZero))
  it('IndexesRandom', test(modules.IndexesRandom))
})

describe('tiloop', () => {
  const modules = rewire('./index.js')
  const tiloop = modules.default

  // common options
  const length = 1000
  const maxIncrement = 20

  describe('{ random }', () => {
    const test = (random, expectConstructor) => () => {
      const yielded = () => {}
      const loop = ({ constructor }) => assert.equal(constructor, expectConstructor)
      modules.__with__({ loop })(() => tiloop({ random, length, maxIncrement, yielded }))
    }

    it('false', test(false, modules.IndexesZero))
    it('true', test(true, modules.IndexesRandom))
  })

  describe('{ promisify }', () => {
    const value = 'value'

    it('false', () => {
      const yielded = () => value

      const fn = tiloop({ promisify: false, length, maxIncrement, yielded })
      const result = fn()

      assert.ok(typeof result.done === 'boolean')
      assert.ok(result.value, value)
    })

    it('true', () => {
      const yielded = () => new Promise(resolve => setTimeout(() => resolve(value), 500))

      const afn = tiloop({ promisify: true, length, maxIncrement, yielded })
      const promise = afn()
      assert.equal(promise.constructor, Promise)

      return promise.then(result => {
        assert.ok(typeof result.done === 'boolean')
        assert.ok(result.value, value)
      })
    })
  })

  describe('run till done', () => {
    const recursiveTillDone = (iterate) =>
      Promise.resolve(iterate()).then(({ done }) =>
        !done &&
        recursiveTillDone(iterate)
      )

    const test = ({ random, promisify } = {}) => () => {
      const set = new Set()
      const addIndexes = (indexes) => indexes.forEach(index => set.add(index))

      const yielded = !promisify
      ? (indexes) => addIndexes(indexes)
      : (indexes) => new Promise(resolve =>
        setTimeout(
          () => resolve(addIndexes(indexes)),
          10
        )
      )

      const iterate = tiloop({ length, maxIncrement, yielded, random, promisify })

      return recursiveTillDone(iterate).then(() =>
        assert.equal(set.size, length)
      )
    }

    it('{}', test())
    it('{ random }', test({ random: true }))
    it('{ promisify }', test({ promisify: true }))
    it('{ random, promisify }', test({ random: true, promisify: true }))
  })

})

describe('throws', () => {
  const modules = rewire('./index.js')

  it('tiloop', () => assert.throws(() => modules.default()))

  it('default as tiloop', () => {
    const { create } = modules
    const f = () => {}
    const notFunctions = ['string', 10, true, undefined, null, {}, []]
    notFunctions.forEach(nextIndexes => assert.throws(() => create({ nextIndexes })))
    notFunctions.forEach(done => assert.throws(() => create({ nextIndexes: f, done })))
    notFunctions.forEach(user => assert.throws(() => create({ nextIndexes: f, done: f }, user)))
  })

  it('Indexes', () => {
    const Indexes = modules.Indexes
    const n = 10
    const notNumbers = ['string', true, undefined, null, {}, [], () => {}]
    notNumbers.forEach(length => assert.throws(() => new Indexes(length, n)))
    assert.throws(() => new Indexes(0, n))
    notNumbers.forEach(maxIncrement => assert.throws(() => new Indexes(n, maxIncrement)))
    assert.throws(() => new Indexes(n, 0))
  })
})