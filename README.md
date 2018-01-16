# tiloop

[![npm](https://img.shields.io/npm/v/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![npm](https://img.shields.io/npm/dm/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![Build Status](https://img.shields.io/travis/kthjm/tiloop.svg?style=flat-square)](https://travis-ci.org/kthjm/tiloop)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/tiloop.svg?style=flat-square)](https://codecov.io/gh/kthjm/tiloop)

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
    // result will be { value } = iterator.next()
  }
)
```

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

## Indexes
- `IndexesZero({ length, maxIncrement })`

- `IndexesRandom({ length, maxIncrement })`

## License
MIT (http://opensource.org/licenses/MIT)