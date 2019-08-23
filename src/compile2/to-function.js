/* @flow */

import { extend } from '../util/index'
import createFunction from './create-function'

function createCompileToFunctionFn (compile) {
  const cache = Object.create(null)

  return function compileToFunctions (template, options, vm) {
    options = extend({}, options)
    delete options.warn

    // check cache
    const key = options.delimiters ? (String(options.delimiters) + template ): template

    if (cache[key]) {
      return cache[key]
    }

    // compile
    const compiled = compile(template, options)

    // turn code into functions
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    return (cache[key] = res)
  }
}

export default createCompileToFunctionFn
