function patch (el, vnode) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  // TODO:
  function insertedVnodeQueue () {}

  el.innerHTML = ''
  createElm(vnode, insertedVnodeQueue, el)
}

// 创建元素
function createElm (vnode, insertedVnodeQueue, parentElm) {
  vnode.elm = document.createElement(vnode.tag)

  if (vnode.data) {
    Object.keys(vnode.data).forEach(key => {
      var prop = key === 'class' ? 'className' : key
      vnode.elm[prop] = vnode.data[key]
    })
  }

  createChildren(vnode, vnode.children, insertedVnodeQueue)
  insert(parentElm, vnode.elm)
}

// 创建子元系
function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm)
    }
  } else {
    insert(vnode.elm, document.createTextNode(String(children.text)))
  }
}

// 插入元素
function insert (parent, elm) {
  parent.appendChild(elm)
}

export default patch