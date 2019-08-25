export const createASTElement =  (tag, attrs, parent) => {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}

export const getAndRemoveAttr = (el, name, removeFromMap) => {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  return val
}

export const makeAttrsMap = (attrs) => {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}


export const parseText = (text) => {
  const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

  var tokens = [];
  var rawTokens = [];
  var match
  while ((match = defaultTagRE.exec(text))) {
    var exp = match[1].trim();
    // tokens.push(("_s(" + exp + ")"));
    tokens.push(exp)
  }

  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}