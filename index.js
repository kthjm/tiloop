// @flow
import regeneratorRuntime from 'regenerator-runtime'

/* types */
type Length = number
type Index = number
type MaxIncrement = number
type IndexesAdded = Array<number>
type IndexesSub$Config = { length: Length, maxIncrement: MaxIncrement }

type TiloopFn$Config = {
  length: Length,
  maxIncrement: MaxIncrement,
  yielded: YieldedFn,
  promisify?: boolean,
  random?: boolean
}

type YieldedFn$Result = any
type YieldedFn = (arr: IndexesAdded) => YieldedFn$Result

type TiloopFn = (config: TiloopFn$Config) => I2FFn$Result

type I2FFn$Result = I2FFn$ResultFn | I2FFn$ResultAfn
type I2FFn$ResultFn = () => I2FFn$ResultFn$Result
type I2FFn$ResultAfn = () => Promise<I2FFn$ResultFn$Result>
type I2FFn$ResultFn$Result = IteratorResult<YieldedFn$Result, YieldedFn$Result> | { done: boolean, value: YieldedFn$Result }

interface IndexesSub {
  next(): IndexesAdded;
  done(): boolean;
  prepare(): void;
}

type CreateFn = (indexes: IndexesSub, yielded: YieldedFn) => CreateFn$Result
type CreateFn$Result = Iterator<YieldedFn$Result>
type I2FFn = (iterator: CreateFn$Result, promisify?: boolean) => I2FFn$Result

/* util */
const isFnc = (data: any): boolean %checks => typeof data === 'function'
const isNum = (data: any): boolean %checks => typeof data === 'number'

const throws = (message) => { throw new Error(message) }
const asserts = (condition: any, message: string) => !condition && throws(message)

function* numToArrGenerate(num: number): Iterable<number> {
  let from = 0
  while (from < num) {
    yield from
    from++
  }
}

const numToArr = (num: number): Array<number> => [...numToArrGenerate(num)]

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

    if (isFnc(indexes.prepare)){
      indexes.prepare()
    }
  }
}

export const create: CreateFn = (indexes, yielded) => {
  asserts(isFnc(indexes.next), 'tiloop first argument as indexes must have method:next')
  asserts(isFnc(indexes.done), 'tiloop first argument as indexes must have method:done')
  asserts(isFnc(yielded), 'tiloop second argument as yielded must be "function"')
  return loop(indexes, yielded)
}

export const i2f: I2FFn = (iterator, promisify) => !promisify ? i2fn(iterator) : i2afn(iterator)

const i2fn = (iterator): I2FFn$ResultFn =>
  () => {
    return iterator.next()
  }

const i2afn = (iterator): I2FFn$ResultAfn =>
  () => {
    const { value: promise, done } = iterator.next()
    return Promise.resolve(promise).then(value => ({ value, done }))
  }

const tiloop: TiloopFn = ({ length, maxIncrement, yielded, promisify, random } = {}) => {
  const Indexes = random ? IndexesRandom : IndexesZero
  const indexes = new Indexes({ length, maxIncrement })
  const iterator = create(indexes, yielded)
  return i2f(iterator, promisify)
}

export default tiloop