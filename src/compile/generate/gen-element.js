
import genData from './gen-data'
import genChildren from './gen-children'
function genElement (el, state) {
  let code
  let data = genData(el) || ''

  const children = genChildren(el) || []
  
  code = `_c('${el.tag}', ${data}, ${children})`

  return code
}

export default genElement