/* @flow */

import { extend } from '../util/index'
import createCompileToFunctionFn from './to-function'

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (template, options) {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []


      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }

        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      finalOptions.warn = warn

      const compiled = baseCompile(template.trim(), finalOptions)

      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

export default createCompilerCreator