import regeneratorRuntime from 'regenerator-runtime'

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(numToArrGenerate)
var _marked2 = /*#__PURE__*/ regeneratorRuntime.mark(loop)

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

//
var isFnc = function isFnc(data) {
  return typeof data === 'function'
}
var isNum = function isNum(data) {
  return typeof data === 'number'
}

var throws = function throws(message) {
  throw new Error(message)
}
var asserts = function asserts(condition, message) {
  return !condition && throws(message)
}

var numToArr = function numToArr(num) {
  return [].concat(_toConsumableArray(numToArrGenerate(num)))
}

function numToArrGenerate(num) {
  var from
  return regeneratorRuntime.wrap(
    function numToArrGenerate$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            from = 0

          case 1:
            if (!(from < num)) {
              _context.next = 7
              break
            }

            _context.next = 4
            return from

          case 4:
            from++
            _context.next = 1
            break

          case 7:
          case 'end':
            return _context.stop()
        }
      }
    },
    _marked,
    this
  )
}

var index = function() {
  var _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    length = _ref.length,
    maxIncrement = _ref.maxIncrement,
    yielded = _ref.yielded,
    random = _ref.random

  return create(
    random
      ? new IndexesRandom({ length: length, maxIncrement: maxIncrement })
      : new IndexesZero({ length: length, maxIncrement: maxIncrement }),
    yielded
  )
}

var create = function create(indexes, yielded) {
  asserts(
    isFnc(indexes.next),
    'tiloop first argument as indexes must have method:next'
  )
  asserts(
    isFnc(indexes.done),
    'tiloop first argument as indexes must have method:done'
  )
  asserts(
    isFnc(yielded),
    'tiloop second argument as yielded must be "function"'
  )
  return loop(indexes, yielded)
}

function loop(indexes, yielded) {
  var array
  return regeneratorRuntime.wrap(
    function loop$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            array = indexes.next()

            if (!indexes.done()) {
              _context2.next = 6
              break
            }

            return _context2.abrupt('return', yielded(array))

          case 6:
            _context2.next = 8
            return yielded(array)

          case 8:
            if (isFnc(indexes.prepare)) indexes.prepare()
            _context2.next = 0
            break

          case 11:
          case 'end':
            return _context2.stop()
        }
      }
    },
    _marked2,
    this
  )
}

var Indexes = (function() {
  function Indexes(length, maxIncrement) {
    _classCallCheck(this, Indexes)

    asserts(
      isNum(length) && length > 0,
      'Indexes arg length must be > 0 as "number"'
    )
    asserts(
      isNum(maxIncrement) && maxIncrement > 0,
      'Indexes arg maxIncrement must be > 0 as "number"'
    )
    this._length = length
    this._lastIndex = length - 1
    this._maxIncrement = maxIncrement
    this.indexes = new Set()
  }

  _createClass(Indexes, [
    {
      key: 'indexesHas',
      value: function indexesHas(index) {
        return this.indexes.has(index)
      }
    },
    {
      key: 'extendIndexes',
      value: function extendIndexes(index) {
        var _this = this

        var indexesAdded = numToArr(this._maxIncrement)
          .map(function(i) {
            return index + i
          })
          .filter(function(index) {
            return !_this.indexesHas(index) && index <= _this._lastIndex
          })

        // should not be but may be.
        asserts(
          indexesAdded.length,
          'indexesAdded.length === 0, but not still done'
        )

        indexesAdded.forEach(function(index) {
          return _this.indexes.add(index)
        })

        return indexesAdded
      }
    },
    {
      key: 'done',
      value: function done() {
        return this.indexes.size === this._length
      }
    }
  ])

  return Indexes
})()

var IndexesZero = (function(_Indexes) {
  _inherits(IndexesZero, _Indexes)

  function IndexesZero(_ref2) {
    var length = _ref2.length,
      maxIncrement = _ref2.maxIncrement

    _classCallCheck(this, IndexesZero)

    var _this2 = _possibleConstructorReturn(
      this,
      (IndexesZero.__proto__ || Object.getPrototypeOf(IndexesZero)).call(
        this,
        length,
        maxIncrement
      )
    )

    _this2.maxIncrement = maxIncrement
    _this2.index = 0
    return _this2
  }

  _createClass(IndexesZero, [
    {
      key: 'next',
      value: function next() {
        return this.extendIndexes(this.index)
      }
    },
    {
      key: 'prepare',
      value: function prepare() {
        this.index += this.maxIncrement
      }
    }
  ])

  return IndexesZero
})(Indexes)

var IndexesRandom = (function(_Indexes2) {
  _inherits(IndexesRandom, _Indexes2)

  _createClass(IndexesRandom, [
    {
      key: 'createIndex',
      value: function createIndex() {
        var _this4 = this

        var times =
          arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0

        var index = Math.round(this.lastIndex * Math.random())

        if (isNum(index) && !this.indexesHas(index)) return index

        if (times < 3) return this.createIndex(times + 1)

        var findedIndex = numToArr(this.length).find(function(num) {
          return !_this4.indexesHas(num)
        })
        return findedIndex
      }
    }
  ])

  function IndexesRandom(_ref3) {
    var length = _ref3.length,
      maxIncrement = _ref3.maxIncrement

    _classCallCheck(this, IndexesRandom)

    var _this3 = _possibleConstructorReturn(
      this,
      (IndexesRandom.__proto__ || Object.getPrototypeOf(IndexesRandom)).call(
        this,
        length,
        maxIncrement
      )
    )

    _this3.length = length
    _this3.lastIndex = length - 1
    _this3.index = _this3.createIndex()
    return _this3
  }

  _createClass(IndexesRandom, [
    {
      key: 'next',
      value: function next() {
        return this.extendIndexes(this.index)
      }
    },
    {
      key: 'prepare',
      value: function prepare() {
        this.index = this.createIndex()
      }
    }
  ])

  return IndexesRandom
})(Indexes)

export { create, Indexes, IndexesZero, IndexesRandom }
export default index
