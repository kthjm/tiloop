import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

const modules = rewire('./index.js')

describe('throws', () => {
  it('default as tiloop', () => {
    const tiloop = modules.default
    const f = () => {}
    const notFunctions = ['string', 10, true, undefined, null, {}, []]

    notFunctions.forEach(indexesExtend =>
      assert.throws(
        () => tiloop({ indexesExtend }),
        /tiloop first argument as indexes must have method:indexesExtend/
      )
    )

    notFunctions.forEach(done =>
      assert.throws(
        () => tiloop({ indexesExtend: f, done }),
        /tiloop first argument as indexes must have method:done/
      )
    )

    notFunctions.forEach(createValue =>
      assert.throws(
        () => tiloop({ indexesExtend: f, done: f }, createValue),
        /tiloop second argument as createValue must be/
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
        /Indexes as Super class arg:length must be "number"/
      )
    )

    assert.throws(
      () => new Indexes(-1, n),
      /Indexes as Super class arg:length must be >= 0/
    )

    notNumbers.forEach(maxIncrement =>
      assert.throws(
        () => new Indexes(n, maxIncrement),
        /Indexes as Super class arg:maxIncrement must be "number"/
      )
    )

    assert.throws(
      () => new Indexes(n, 0),
      /Indexes as Super class arg:maxIncrement must be > 0/
    )

    class IndexesNotHaveNowindex extends Indexes {
      constructor(length, maxIncrement) {
        super(length, maxIncrement)
      }
    }

    assert.throws(
      () => new IndexesNotHaveNowindex(n, n),
      /Indexes as Super class method:nowindex must be "function"/
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
    ;[...tiloop(indexes, ({ index, length }) => {})]
  }
})
