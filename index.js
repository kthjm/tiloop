// @flow
import regeneratorRuntime from 'regenerator-runtime'
import {
  type TiloopFn,
  type CreateFn,
  type I2FFn$ResultFn,
  type I2FFn$ResultFnP,
  type I2FFn,
  type Length,
  type Index,
  type MaxIncrement,
  type IndexesAdded,
  type IndexesSub$Config
} from './types.js'

/* util */

const isFnc = (data: any): boolean %checks => typeof data === 'function'
const isNum = (data: any): boolean %checks => typeof data === 'number'

const throws = (message) => { throw new Error(message) }
const asserts = (condition: any, message: string) => !condition && throws(message)

const numToArr = (num: number): Array<number> => [...numToArrGenerate(num)]

function* numToArrGenerate(num: number): Iterable<number> {
  let from = 0
  while (from < num) {
    yield from
    from++
  }
}

/* Indexes classes */

export class Indexes {
  _length: Length
  _lastIndex: Index
  _maxIncrement: MaxIncrement
  indexes: Set<Index>

  constructor(length: Length, maxIncrement: MaxIncrement): void {
    asserts(isNum(length) && length > 0, 'Indexes arg length must be > 0 as "number"')
    asserts(isNum(maxIncrement) && maxIncrement > 0, 'Indexes arg maxIncrement must be > 0 as "number"')
    this._length = length
    this._lastIndex = length - 1
    this._maxIncrement = maxIncrement
    this.indexes = new Set()
  }

  indexesHas(index: Index): boolean {
    return this.indexes.has(index)
  }

  extendIndexes(index: Index): IndexesAdded {
    const indexesAdded =
    numToArr(this._maxIncrement)
    .map(i => index + i)
    .filter(index =>
      !this.indexesHas(index) &&
      index <= this._lastIndex
    )

    // should not be but may be.
    asserts(indexesAdded.length, 'indexesAdded.length === 0, but not still done')

    indexesAdded.forEach(index => this.indexes.add(index))

    return indexesAdded
  }

  done(): boolean {
    return this.indexes.size === this._length
  }
}

export class IndexesZero extends Indexes {
  maxIncrement: MaxIncrement
  index: Index

  constructor({ length, maxIncrement }: IndexesSub$Config): void {
    super(length, maxIncrement)
    this.maxIncrement = maxIncrement
    this.index = 0
  }

  next(): IndexesAdded {
    return this.extendIndexes(this.index)
  }

  prepare(): void {
    this.index += this.maxIncrement
  }
}

export class IndexesRandom extends Indexes {
  length: Length
  lastIndex: Index
  index: Index

  createIndex(times: number = 0): Index {
    const index = Math.round(this.lastIndex * Math.random())

    if (isNum(index) && !this.indexesHas(index)) return index

    if (times < 3) return this.createIndex(times + 1)

    const findedIndex: any = numToArr(this.length).find(num => !this.indexesHas(num))
    ;(findedIndex: Index)
    return findedIndex
  }

  constructor({ length, maxIncrement }: IndexesSub$Config): void {
    super(length, maxIncrement)
    this.length = length
    this.lastIndex = length - 1
    this.index = this.createIndex()
  }

  next(): IndexesAdded {
    return this.extendIndexes(this.index)
  }

  prepare(): void {
    this.index = this.createIndex()
  }
}

/* cores */

function* loop(indexes, yielded) {
  while (true) {
    const array = indexes.next()
    if (indexes.done()) {
      return yielded(array)
    } else {
      yield yielded(array)
    }
    if (isFnc(indexes.prepare)) indexes.prepare()
  }
}

export const create: CreateFn = (indexes, yielded) => {
  asserts(isFnc(indexes.next), 'tiloop first argument as indexes must have method:next')
  asserts(isFnc(indexes.done), 'tiloop first argument as indexes must have method:done')
  asserts(isFnc(yielded), 'tiloop second argument as yielded must be "function"')
  return loop(indexes, yielded)
}

export const i2f: I2FFn = (iterator, promisify) => {
  let result: any
  if (!promisify) {
    const resultFn: I2FFn$ResultFn = () => iterator.next()
    result = resultFn
  } else {
    const resultFnP: I2FFn$ResultFnP = () => {
      const { value: promise, done } = iterator.next()
      return Promise.resolve(promise).then(value => ({ value, done }))
    }
    result = resultFnP
  }
  return result
}

const tiloop: TiloopFn = ({ length, maxIncrement, yielded, promisify, random } = {}) => {
  const Indexes = random ? IndexesRandom : IndexesZero
  const iterator = create(new Indexes({ length, maxIncrement }), yielded)
  return i2f(iterator, promisify)
}

export default tiloop