
function genData (el) {
  let data = '{'

  if (el.attrs) {
    data += `attrsMap:${genProps(el.attrsMap)},`
  }

  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }

  // component v-model
  if (el.model) {
    data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`
  }

  data = data.replace(/,$/, '')
  data += '}'
  return data
}

export default genData