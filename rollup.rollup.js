const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow')

rollup
  .rollup({
    input: './index.js',
    plugins: [flow(), babel()]
  })
  .then(bundle => {
    bundle.write({ format: 'cjs', file: `./cjs.js` })
    bundle.write({ format: 'es', file: `./es.js` })
  })
  .catch(err => console.error(err))
