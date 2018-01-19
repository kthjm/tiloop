// @flow
import regeneratorRuntime from 'regenerator-runtime'

const isFnc = (data: any): boolean => typeof data === 'function'
const isNum = (data: any): boolean => typeof data === 'number'

const throwing = (
  isThrow: boolean,
  message: string,
  isType?: boolean
): void => {
  if (isThrow) {
    throw isType ? new TypeError(message) : new Error(message)
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

type Length = number
type MaxIncrement = number
type IndexesAdded = Array<number>

export class Indexes {
  _length: Length
  _maxIncrement: MaxIncrement
  indexes: Set<number>

  constructor(length: Length, maxIncrement: MaxIncrement): void {
    throwing(
      !isNum(length),
      'Indexes as Super class that first arg:length must be "number"',
      true
    )
    throwing(
      length < 0,
      'Indexes as Super class that first arg:length must be >= 0'
    )
    throwing(
      !isNum(maxIncrement),
      'Indexes as Super class that second arg:maxIncrement must be "number"',
      true
    )
    throwing(
      maxIncrement <= 0,
      'Indexes as Super class that second arg:maxIncrement must be > 0'
    )

    this._length = length
    this._maxIncrement = maxIncrement
    this.indexes = new Set()
  }

  indexesAdd(index: number): void {
    this.indexes.add(index)
  }

  indexesHas(index: number): boolean {
    return this.indexes.has(index)
  }

  indexesExtend(index: number): IndexesAdded {
    const maxIncrement = this._maxIncrement
    const lastIndex = this._length - 1

    const indexesAdded: IndexesAdded = numToArr(maxIncrement)
      .map(i => index + i)
      .filter(preindex => !this.indexesHas(preindex) && preindex <= lastIndex)

    // should not be but may be.
    throwing(
      !indexesAdded.length,
      'indexesAdded.length === 0, but not still done'
    )

    indexesAdded.forEach(index => this.indexesAdd(index))
    return indexesAdded
  }

  done(): boolean {
    return this.indexes.size === this._length
  }
}

type Argument$Sub = { length: Length, maxIncrement: MaxIncrement }

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
      const nowMinimumIndex: any = numToArr(this.length).find(
        num => !this.indexesHas(num)
      )
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

type IndexesSub = {
  nextIndexes: () => IndexesAdded,
  done: () => boolean,
  prepare?: () => void
}

const tiloop = (indexes: IndexesSub, user: UserFn): Loop$Result => {
  throwing(
    !isFnc(indexes.nextIndexes),
    'tiloop first argument as indexes must have method:nextIndexes',
    true
  )
  throwing(
    !isFnc(indexes.done),
    'tiloop first argument as indexes must have method:done',
    true
  )
  throwing(
    !isFnc(user),
    'tiloop second argument as user must be "function"',
    true
  )

  return loop(indexes, user)
}

function* loop(indexes: IndexesSub, user: UserFn): Loop$Result {
  while (true) {
    const array = indexes.nextIndexes()
    const value = user(array)

    if (indexes.done()) {
      return value
    } else {
      yield value
    }

    if (indexes.prepare && isFnc(indexes.prepare)) {
      indexes.prepare()
    }
  }
}

type UserFn = (arr: IndexesAdded) => UserFn$Result
type UserFn$Result = any
type Loop$Result = Iterable<UserFn$Result>

export default tiloop
