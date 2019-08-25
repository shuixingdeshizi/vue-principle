import genElement from './gen-element'

function generate (rootAst, options) {
  const code = rootAst ? genElement(rootAst) : '_c("div")'
  console.log(code)
  return {
    render: new Function (`with(this){return ${code}}`),
  }
}

export default generate