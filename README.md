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
```js
import tiloop, { IndexesZero } from 'tiloop'

const iterator = tiloop(
  new IndexesZero({
    length: 3000,
    maxIncrement: 20
  }),
  (array) => {
    // result will be { value }
  }
)

const { value, done } = iterator.next()

```

## API

### `tiloop(indexes, yielded)`

`tiloop` create `iterator` that return `done` with last `value`.

In other words, using result as `iterable` not `iterator` **will lost the last `value`**😔.

```js
const iterator = tiloop(indexes,yielded) // done with last value
const array = [...tiloop(indexes,yielded)] // not includes last value
```

## Indexes
#### `IndexesZero({ length, maxIncrement })`
#### `IndexesRandom({ length, maxIncrement })`

and able to use with custom indexes.

```js
import { Indexes } from 'tiloop'

class MyIndexes extends Indexes {
  constructor({ length, maxIncrement }) {
    super(length, maxIncrement)
    this.index = 0
  }

  nextIndexes() {
    return this.indexesExtend(this.index)
  }

  prepare() {
    this.index += 10
  }
}
```

## License
MIT (http://opensource.org/licenses/MIT)