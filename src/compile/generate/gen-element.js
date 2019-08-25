
import genChildren from './gen-children'
function genElement (el) {
  let code
  let attrs = JSON.stringify(el.attrsMap || {})

  const children = genChildren(el) || []
  
  code = `_c('${el.tag}', ${attrs}, ${children})`

  return code
}

export default genElement