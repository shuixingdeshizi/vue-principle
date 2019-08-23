function generate (rootAst) {
  const code = rootAst ? genElement(rootAst) : '_c("div")'
  console.log(code) 
  return {
    render: new Function (`with(this){return ${code}}`),
  }
}

function genNode (el) { 
  if (el.type === 1) {
    return genElement(el); 
  } else {
    return genText(el); 
  }
}

function genChildren (el) { 
  const children = el.children;
  if (children && children.length > 0) {
    return `${children.map(genNode).join(',')}`;
  }
}

function genElement (el) {
  if (el.if && !el.ifProcessed) {
    return genIf(el);
  } else if (el.for && !el.forProcessed) {
    return genFor(el); 
  } else {
    const children = genChildren(el); let code;
    code = `_c('${el.tag},'{
             staticClass: ${el.attrsMap && el.attrsMap[':class']},
             class: ${el.attrsMap && el.attrsMap['class']},
            }${
              children ? `,${children}` : ''
            })`
    return code; 
  } 
}

export default generate