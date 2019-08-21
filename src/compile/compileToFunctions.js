  import { parse, generate } from './parse'


  function compileToFunctions (template) {
    debugger
    var ast = parse(template.trim())
    console.log('ast', ast)
    var code = generate(ast);
    console.log('code', code)
    console.log(code.render)
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  }

  export {
    compileToFunctions
  }