
import genElement from './gen-element'
import genText from './gen-text'

function genNode (el) { 
  if (el.type === 1) {
    return genElement(el); 
  } else {
    return genText(el); 
  }
}

export default genNode