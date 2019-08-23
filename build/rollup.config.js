import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

import { name, version } from '../package.json'

const banner =
  '/*!\n' +
  ` * Vue.js v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} Evan You\n` +
  ' * Released under the MIT License.\n' +
  ' */'


const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'production': {
    moduleName: 'Vue',
    entry: './src/index.js',
    dest: 'dist/vue.min.js',
    format: 'umd',
    env: 'production',
    banner
  },
  'development': {
    moduleName: 'Vue',
    entry: './src/index.js',
    dest: 'dist/vue.js',
    format: 'umd',
    env: 'production',
    banner
  },
  'parseHTML': {
    moduleName: 'parseHTML',
    entry: './src/compile/parser/parse-html.js',
    dest: 'dist/parse-html.js',
    format: 'umd',
    env: 'production'
  }
}

function generateConfig (name) {
  const options = builds[name]
  const config = {
    input: options.entry,
    external: options.external,
    plugins: [
      json(),
      resolve({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ].concat(options.plugins || []),
    output: {
      file: options.dest,
      format: options.format,
      banner: options.banner,
      name: options.moduleName || 'Vue'
    }
  }
  return config
}

// export default {
//   input: './src/index.js',
//   output: {
//     file: file,
//     format: 'umd',
//     name: 'Vue'
//   },
//   plugins: [
//     json(),
//     resolve({
//       customResolveOptions: {
//         moduleDirectory: 'node_modules'
//       }
//     }),
//     babel({
//       exclude: 'node_modules/**'
//     })
//   ],
//   external: ['lodash']
// }

if (process.env.TARGET) {
  module.exports = generateConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
