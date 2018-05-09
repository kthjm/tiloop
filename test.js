import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

it('numToArr', () => {
  const numToArr = rewire('./index.js').__get__('numToArr')
  assert.deepEqual(numToArr(3), [0, 1, 2])
})

describe('tiloop', () => {
  const modules = rewire('./index.js')
  const { create } = modules
  const tiloop = modules.default

  const test = (random, expectConstructor) => () => {
    const loop = ({ constructor }) => assert.equal(constructor, expectConstructor)
    modules.__with__({ loop })(() => tiloop({ random, length: 5000, maxIncrement: 20, yielded: () => {} }))
  }

  it('!random', test(false, modules.IndexesZero))
  it('random', test(true, modules.IndexesRandom))
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