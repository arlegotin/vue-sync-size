import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import babel from 'rollup-plugin-babel'

const extensions = ['.js']

export default [
  { 
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'default',
      },
      {
        file: pkg.module,
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