# tiloop

<!-- [![npm](https://img.shields.io/npm/v/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop)
[![npm](https://img.shields.io/npm/dm/tiloop.svg?style=flat-square)](https://www.npmjs.com/package/tiloop) -->
[![Build Status](https://img.shields.io/travis/kthjm/tiloop.svg?style=flat-square)](https://travis-ci.org/kthjm/tiloop)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/tiloop.svg?style=flat-square)](https://codecov.io/gh/kthjm/tiloop)
<!-- [![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/tiloop/dist/tiloop.min.js) -->

```js
import tiloop, { IndexesZero } from 'tiloop'

const iterator = tiloop(
  new IndexesZero({
    length: 3000,
    maxIncrement: 20
  }),
  ({ index, length }) => {

  }
)
```

```js
import { Indexes } from 'tiloop'

class MyIndexes extends Indexes {
  constructor({ length, maxIncrement }) {
    super(length, maxIncrement)
  }

  nowindex() {}
}
```