const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

const input = `./index.js`

const cjs_and_es = () =>
  rollup({
    input,
    plugins: [flow(), babel({ exclude: 'node_modules/**' }), commonjs()]
  }).then(bundle => {
    bundle.write({ format: 'cjs', file: './cjs.js' })
    bundle.write({ format: 'es', file: './es.js' })
  })

const umd = () =>
  rollup({
    input,
    plugins: [
      flow(),
      babel({ exclude: 'node_modules/**' }),
      resolve(),
      commonjs(),
      uglify({}, minify)
    ]
  }).then(bundle =>
    bundle.write({
      format: 'umd',
      file: './min.js',
      name: 'tiloop'
    })
  )

const build = () =>
  Promise.resolve()
    .then(cjs_and_es)
    .then(umd)
    .catch(err => console.error(err))

build()
