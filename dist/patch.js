(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.patch = factory());
}(this, function () { 'use strict';

  function patch(el, vnode) {
    el = typeof el === 'string' ? document.querySelector(el) : el; // TODO:

    function insertedVnodeQueue() {}

    createElm(vnode, insertedVnodeQueue, el); //   el = typeof el === 'string' ? el = document.querySelector(el) : el
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

  function createElm(vnode, insertedVnodeQueue, parentElm) {
    vnode.elm = document.createElement(vnode.tagName);
    createChildren(vnode, children, insertedVnodeQueue);
    insert(parentElm, vnode.elm);
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm);
      }
    }
  }

  function insert(parent, elm) {
    parent.appendChild(elm);
  }

  return patch;

}));
