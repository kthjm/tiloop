// @flow
export type Length = number
export type Index = number
export type MaxIncrement = number
export type IndexesAdded = Array<number>

export type IndexesSub$Config = { length: Length, maxIncrement: MaxIncrement }

export interface IndexesSub {
  next(): IndexesAdded;
  done(): boolean;
  prepare(): void;
}

export type TiloopFn$Config = {
  length: Length,
  maxIncrement: MaxIncrement,
  yielded: YieldedFn,
  promisify?: boolean,
  random?: boolean
}

export type TiloopFn = (config: TiloopFn$Config) => I2FFn$Result

export type YieldedFn$Result = any
export type YieldedFn = (arr: IndexesAdded) => YieldedFn$Result

export type CreateFn$Result = Iterator<YieldedFn$Result>
export type CreateFn = (indexes: IndexesSub, yielded: YieldedFn) => CreateFn$Result

export type I2FFn$ResultFn$Result =
  IteratorResult<YieldedFn$Result, YieldedFn$Result> |
  { done: boolean, value: YieldedFn$Result }
  
export type I2FFn$ResultFn = () => I2FFn$ResultFn$Result
export type I2FFn$ResultFnP = () => Promise<I2FFn$ResultFn$Result>
export type I2FFn$Result = I2FFn$ResultFn | I2FFn$ResultFnP
export type I2FFn = (iterator: CreateFn$Result, promisify?: boolean) => I2FFn$Result