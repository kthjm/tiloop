# tiloop

[![npm](https://img.shields.io/npm/v/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![npm](https://img.shields.io/npm/dm/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![Build Status](https://img.shields.io/travis/kthjm/tiloop.svg?style=flat-square)](https://travis-ci.org/kthjm/tiloop)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/tiloop.svg?style=flat-square)](https://codecov.io/gh/kthjm/tiloop)
[![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/tiloop/min.js)

Higher order function creates a function contain a iterator that yield last value coincident with done.

## Installation
```shell
yarn add tiloop
```

## Usage
```js
import tiloop from 'tiloop'

const fn = tiloop({
  length: 10000,
  maxIncrement: 4,
  yielded: (indexes) => indexes
})

fn() // { done: false, value: [0, 1, 2, 3] }
fn() // { done: false, value: [4, 5, 6, 7] }
...
fn() // { done: true, value: [9996, 9997, 9998, 9999] }
```
### `tiloop(config)`

#### `length: number`
Used for determine virtual-array length. (required)

#### `maxIncrement: number`
Used for determine increment in every `yield`. (required)

#### `yielded: (array) => value`
Used for `yield`. (required)

#### `promisify: boolean`
Whether `Promise.resolve()` to `value`. [default: `false`]

#### `random: boolean`
Whether increment indexes by random. [default: `false`]

## modules
```js
import { create, IndexesZero, i2f } from 'tiloop'

const indexes = new IndexesZero({ length, maxIncrement })
const iterator = create(indexes, (array) => {})
const afn = i2f(iterator, true)
```
#### `create(indexes, yielded)`
create iterator.

#### `IndexesZero({ length, maxIncrement })`
indexes increments 0 to length - 1.

#### `IndexesRandom({ length, maxIncrement })`
indexes increments random.

#### `i2f(iterator[, promisify])`
iterator to function.

### Note
`iterator` made by `create` has done with last `value`. In other words, using result as `iterable` (not `iterator`) **will lost the last `value`** 😔.

```js
const iterator = create(indexes,yielded) // done with last value
const array = [...create(indexes,yielded)] // not includes last value
```

## License
MIT (http://opensource.org/licenses/MIT)
