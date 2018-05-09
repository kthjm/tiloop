# tiloop

[![npm](https://img.shields.io/npm/v/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![npm](https://img.shields.io/npm/dm/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![Build Status](https://img.shields.io/travis/kthjm/tiloop.svg?style=flat-square)](https://travis-ci.org/kthjm/tiloop)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/tiloop.svg?style=flat-square)](https://codecov.io/gh/kthjm/tiloop)
[![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/tiloop/min.js)

Create iterator that have done coincident with covering all index of virtual array.

## Installation
```shell
yarn add tiloop
```

## Usage
### `tiloop(options)`
```js
import tiloop from 'tiloop'

const iterator = tiloop({
  length: 10000,
  maxIncrement: 30,
  random: true,
  yielded: (indexes) => { /* result will be value */ }
})

const { value, done } = iterator.next()
```
#### options
- `length`: require as `number`
- `maxIncrement`: require as `number`
- `yielded`: require as `function`
- `random`: as `boolean` [default: false]

#### Note
`iterator` created by `tiloop` has `done` with last `value`. In other words, using result as `iterable` (not `iterator`) **will lost the last `value`** 😔.

```js
const iterator = tiloop(indexes,yielded) // done with last value
const array = [...tiloop(indexes,yielded)] // not includes last value
```

### as modules
```js
import { create, IndexesZero, IndexesRandom } from 'tiloop'

const iterator = create(
  new IndexesZero({ length, maxIncrement }),
  yielded
)

const randomIterator = create(
  new IndexesRandom({ length, maxIncrement }),
  yielded
)
```
#### `IndexesZero({ length, maxIncrement })`
indexes increments 0 to length - 1.
#### `IndexesRandom({ length, maxIncrement })`
indexes increments random.

## License
MIT (http://opensource.org/licenses/MIT)
