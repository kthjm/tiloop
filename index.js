// @flow
import regeneratorRuntime from 'regenerator-runtime'

const isFnc = data => typeof data === 'function'
const isNum = data => typeof data === 'number'

const throwing = (isThrow, message, isType) => {
  if (isThrow) {
    if (isType) {
      throw new TypeError(message)
    } else {
      throw new Error(message)
    }
  }
}

function* numToArrGenerate(num) {
  let from = 0
  while (from < num) {
    yield from
    from++
  }
}

const numToArr = num => [...numToArrGenerate(num)]

export class Indexes {
  constructor(length, maxIncrement) {
    throwing(
      !isNum(length),
      'Indexes as Super class arg:length must be "number"'
    )
    throwing(length < 0, 'Indexes as Super class arg:length must be >= 0')
    throwing(
      !isNum(maxIncrement),
      'Indexes as Super class arg:maxIncrement must be "number"'
    )
    throwing(
      maxIncrement <= 0,
      'Indexes as Super class arg:maxIncrement must be > 0'
    )
    throwing(
      !isFnc(this.nowindex),
      'Indexes as Super class method:nowindex must be "function"'
    )

    this._length = length
    this._maxIncrement = maxIncrement
    this.indexes = new Set()
  }

  indexesAdd(index) {
    this.indexes.add(index)
  }

  indexesHas(index) {
    return this.indexes.has(index)
  }

  indexesExtend() {
    const index = this.nowindex()
    const maxIncrement = this._maxIncrement
    const lastIndex = this._length - 1

    const indexesAdded = numToArr(maxIncrement)
      .map(i => index + i)
      .filter(preindex => !this.indexesHas(preindex) && preindex <= lastIndex)

    // should not be but may be.
    throwing(
      !indexesAdded.length,
      'indexesAdded.length === 0, but not still done'
    )

    indexesAdded.forEach(index => this.indexesAdd(index))
    return { index, length: indexesAdded.length }
  }

  done() {
    return this.indexes.size >= this._length
  }
}

export class IndexesZero extends Indexes {
  constructor({ length, maxIncrement }) {
    super(length, maxIncrement)
    this.index = 0
    this.maxIncrement = maxIncrement
  }

  nowindex() {
    return this.index
  }

  prepare() {
    this.index += this.maxIncrement
  }
}

export class IndexesRandom extends Indexes {
  constructor({ length, maxIncrement }) {
    super(length, maxIncrement)
    this.lastIndex = length - 1
    this.index = this.createIndex()
  }

  createIndex() {
    const index = Math.round(this.lastIndex * Math.random())
    return typeof index === 'number' && !this.indexesHas(index)
      ? index
      : this.createIndex()
  }

  nowindex() {
    return this.index
  }

  prepare() {
    this.index = this.createIndex()
  }
}

const tiloop = (indexes, createValue) => {
  throwing(
    !isFnc(indexes.indexesExtend),
    'tiloop first argument as indexes must have method:indexesExtend'
  )
  throwing(
    !isFnc(indexes.done),
    'tiloop first argument as indexes must have method:done'
  )
  throwing(
    !isFnc(createValue),
    'tiloop second argument as createValue must be "function"'
  )

  return loop(indexes, createValue)
}

function* loop(indexes, createValue) {
  while (true) {
    const result = indexes.indexesExtend()
    const value = createValue(result)

    if (indexes.done()) {
      return value
    } else {
      yield value
    }

    if (typeof indexes.prepare === 'function') {
      indexes.prepare()
    }
  }
}

export default tiloop
