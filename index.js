// @flow
import regeneratorRuntime from 'regenerator-runtime'

type Length = number
type Index = number
type MaxIncrement = number
type IndexesAdded = Array<number>

type YieldedFn$Result = any
type YieldedFn = (arr: IndexesAdded) => YieldedFn$Result
type Loop$Result = Iterable<YieldedFn$Result>

interface IndexesSub {
  next(): IndexesAdded;
  done(): boolean;
  prepare(): void;
}

type IndexesSub$Arg = {
  length: Length,
  maxIncrement: MaxIncrement
}

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

export default ({
  length,
  maxIncrement,
  yielded,
  random
}: {
  length: Length,
  maxIncrement: MaxIncrement,
  yielded: YieldedFn,
  random?: boolean
} = {}) => create(
  random
  ? new IndexesRandom({ length, maxIncrement })
  : new IndexesZero({ length, maxIncrement }),
  yielded
)

export const create = (indexes: IndexesSub, yielded: YieldedFn): Loop$Result => {
  asserts(isFnc(indexes.next), 'tiloop first argument as indexes must have method:next')
  asserts(isFnc(indexes.done), 'tiloop first argument as indexes must have method:done')
  asserts(isFnc(yielded), 'tiloop second argument as yielded must be "function"')
  return loop(indexes, yielded)
}

function* loop(indexes: IndexesSub, yielded: YieldedFn): Loop$Result {
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

export class Indexes {
  _length: Length
  _lastIndex: Index
  _maxIncrement: MaxIncrement
  indexes: Set<number>

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
  maxIncrement: number
  index: number

  constructor({ length, maxIncrement }: IndexesSub$Arg): void {
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
  length: number
  lastIndex: number
  index: number

  createIndex(times: number = 0): Index {
    const index = Math.round(this.lastIndex * Math.random())

    if (isNum(index) && !this.indexesHas(index)) return index

    if (times < 3) return this.createIndex(times + 1)

    const findedIndex: any = numToArr(this.length).find(num => !this.indexesHas(num))
    ;(findedIndex: Index)
    return findedIndex
  }

  constructor({ length, maxIncrement }: IndexesSub$Arg): void {
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