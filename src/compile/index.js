import generate from './parser/generate'
import parseHTML from './parser/parse-html'


function compile (template, options = {}) {
  const ast = parseHTML(template.trim(), options)

  const code = generate(ast, options)
  return {
    ast,
    render: code.render
  }
}

export default compile
