import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

const modules = rewire('./index.js')

it('numToArr', () => {
  const numToArr = modules.__get__('numToArr')
  assert.deepEqual(numToArr(3), [0, 1, 2])
})

describe('throws', () => {
  it('default as tiloop', () => {
    const tiloop = modules.default
    const f = () => {}
    const notFunctions = ['string', 10, true, undefined, null, {}, []]

    notFunctions.forEach(nextIndexes =>
      assert.throws(
        () => tiloop({ nextIndexes }),
        /tiloop first argument as indexes must have method:nextIndexes/
      )
    )

    notFunctions.forEach(done =>
      assert.throws(
        () => tiloop({ nextIndexes: f, done }),
        /tiloop first argument as indexes must have method:done/
      )
    )

    notFunctions.forEach(user =>
      assert.throws(
        () => tiloop({ nextIndexes: f, done: f }, user),
        /tiloop second argument as user must be/
      )
    )
  })

  it('Indexes', () => {
    const Indexes = modules.Indexes
    const n = 10
    const notNumbers = ['string', true, undefined, null, {}, [], () => {}]

    notNumbers.forEach(length =>
      assert.throws(
        () => new Indexes(length, n),
        /Indexes as Super class that first arg:length must be "number"/
      )
    )

    assert.throws(
      () => new Indexes(-1, n),
      /Indexes as Super class that first arg:length must be >= 0/
    )

    notNumbers.forEach(maxIncrement =>
      assert.throws(
        () => new Indexes(n, maxIncrement),
        /Indexes as Super class that second arg:maxIncrement must be "number"/
      )
    )

    assert.throws(
      () => new Indexes(n, 0),
      /Indexes as Super class that second arg:maxIncrement must be > 0/
    )
  })
})

describe('indexes.indexes.size === length', () => {
  const tiloop = modules.default
  const length = 1000
  const maxIncrement = 3

  it('IndexesZero', () => {
    const IndexesZero = modules.IndexesZero
    const indexes = new IndexesZero({ length, maxIncrement })
    justToArray(indexes)
    assert.ok(indexes.indexes.size === length)
  })

  it('IndexesRandom', () => {
    const IndexesRandom = modules.IndexesRandom
    const indexes = new IndexesRandom({ length, maxIncrement })
    justToArray(indexes)
    assert.ok(indexes.indexes.size === length)
  })

  function justToArray(indexes) {
    ;[...tiloop(indexes, array => {})]
  }
})
