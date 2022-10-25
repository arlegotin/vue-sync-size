import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

const extensions = ['.js']

export default [
  { 
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
      },
    ],
    plugins: [
      resolve({
        extensions,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
    ],
  },
]