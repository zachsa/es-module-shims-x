import { rollup } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { readFileSync, rmSync, readdirSync } from 'fs'
import path from 'path'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

const directory = 'dist'
readdirSync(directory).forEach(file => {
  if (path.extname(file) === '.js') {
    rmSync(path.join(directory, file))
  }
})

const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'))

// Transpile
const bundle = await rollup({
  external: [],
  input: 'src/index.js',
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    json({}),
    commonjs({}),
    polyfillNode({}),
  ],
})

await Promise.resolve([
  // DEV
  bundle.write({
    file: 'dist/dev.index.js',
    format: 'iife',
    name: 'esmx',
    sourcemap: true,
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  }),

  // PROD
  bundle.write({
    sourcemap: true,
    banner: `/*!
  * ${name} ${version}
  */`,
    compact: true,
    file: 'dist/index.js',
    format: 'iife',
    plugins: [
      terser(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  }),
])
