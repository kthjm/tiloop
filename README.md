# tiloop

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