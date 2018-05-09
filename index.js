// @flow
import regeneratorRuntime from 'regenerator-runtime'

type Length = number
type Index = number
type MaxIncrement = number
type IndexesAdded = Array<number>

type Argument$Sub = {
  length: Length,
  maxIncrement: MaxIncrement
}

type IndexesSub = {
  nextIndexes: () => IndexesAdded,
  done: () => boolean,
  prepare?: () => void
}

type YieldedFn$Result = any
type YieldedFn = (arr: IndexesAdded) => YieldedFn$Result
type Loop$Result = Iterable<YieldedFn$Result>

const isFnc = (data: any): boolean %checks => typeof data === 'function'
const isNum = (data: any): boolean %checks => typeof data === 'number'

const asserts = (condition: any, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

function* numToArrGenerate(num: number): Iterable<number> {
  let from = 0
  while (from < num) {
    yield from
    from++
  }
}

const numToArr = (num: number): Array<number> => [...numToArrGenerate(num)]

export default  (indexes: IndexesSub, user: YieldedFn): Loop$Result => {
  asserts(isFnc(indexes.nextIndexes), 'tiloop first argument as indexes must have method:nextIndexes')
  asserts(isFnc(indexes.done), 'tiloop first argument as indexes must have method:done')
  asserts(isFnc(user), 'tiloop second argument as user must be "function"')
  return loop(indexes, user)
}

function* loop(indexes: IndexesSub, user: YieldedFn): Loop$Result {
  while (true) {
    const array = indexes.nextIndexes()

    if (indexes.done()) {
      return user(array)
    } else {
      yield user(array)
    }

    if (isFnc(indexes.prepare)) {
      indexes.prepare()
    }
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

  indexesHas(index: number): boolean {
    return this.indexes.has(index)
  }

  indexesExtend(index: number): IndexesAdded {
    const indexesAdded =
    numToArr(this._maxIncrement)
    .map(i => index + i)
    .filter(preindex => !this.indexesHas(preindex) && preindex <= this._lastIndex)

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
  index: number
  maxIncrement: number

  constructor({ length, maxIncrement }: Argument$Sub): void {
    super(length, maxIncrement)
    this.index = 0
    this.maxIncrement = maxIncrement
  }

  nextIndexes(): IndexesAdded {
    return this.indexesExtend(this.index)
  }

  prepare(): void {
    this.index += this.maxIncrement
  }
}

export class IndexesRandom extends Indexes {
  length: number
  lastIndex: number
  index: number

  constructor({ length, maxIncrement }: Argument$Sub): void {
    super(length, maxIncrement)
    this.length = length
    this.lastIndex = length - 1
    this.index = this.createIndex()
  }

  createIndex(times: number = 0): number {
    const index = Math.round(this.lastIndex * Math.random())
    if (typeof index === 'number' && !this.indexesHas(index)) {
      return index
    } else if (times < 3) {
      times++
      return this.createIndex(times)
    } else {
      const nowMinimumIndex: any = numToArr(this.length).find(num => !this.indexesHas(num))
      ;(nowMinimumIndex: number)
      return nowMinimumIndex
    }
  }

  nextIndexes(): IndexesAdded {
    return this.indexesExtend(this.index)
  }

  prepare(): void {
    this.index = this.createIndex()
  }
}