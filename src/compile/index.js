import generate from './generate/index'
import parseHTML from './parse-html/index'


function compile (template, options = {}) {
  const ast = parseHTML(template.trim(), options)
  console.log('ast', ast)

  const code = generate(ast, options)

  return {
    ast,
    render: code.render
  }
}

export default compile
