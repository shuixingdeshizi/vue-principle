function patch (el, vnode) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  // TODO:
  function insertedVnodeQueue () {}
  createElm(vnode, insertedVnodeQueue, el)

//   el = typeof el === 'string' ? el = document.querySelector(el) : el
//   var node = document.createElement(vnode.tag)
//   el.innerHTML = ''
//   console.log(node)
//   el.appendChild(node)
// }


// if (this.$el) {
//   this.$mount(this.$el)
// }

// var code = "prize"

// this.testFn = new Function (`with(this){return ${code}}`)
// var demo = this.testFn()
// console.log(demo)
}

function createElm (vnode, insertedVnodeQueue, parentElm) {
  vnode.elm = document.createElement(vnode.tag)
  createChildren(vnode, vnode.children, insertedVnodeQueue)
  insert(parentElm, vnode.elm)
}

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm)
    }
  }
}

function insert (parent, elm) {
  parent.appendChild(elm)
}

export default patch