// 生成vnode树
function generate (rootAst, options) {
  const code = rootAst ? genElement(rootAst) : '_c("div")'
  console.log(code)
  return {
    render: new Function (`with(this){return ${code}}`),
  }
}

// 创建vnode
function genElement (el) {
  let code
  let attrs = JSON.stringify(el.attrsMap || {})

  const children = genChildren(el) || []
  
  code = `_c('${el.tag}', ${attrs}, ${children})`

  return code
}

// 子节点生成vnode
function genChildren (el) { 
  const children = el.children;
  if (children && children.length > 0) {
    return children.map(genNode);
  }
}

// 生成vnode
function genNode (el) { 
  if (el.type === 1) {
    return genElement(el); 
  } else {
    return genText(el); 
  }
}

function genText (text) {
  if (text.type === 2) {
    return `_v(${text.expression})`
  } else {
    return `_v(${JSON.stringify(text.text)})`
  }
}


export default generate