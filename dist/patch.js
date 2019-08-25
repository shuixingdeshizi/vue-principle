(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.patch = factory());
}(this, function () { 'use strict';

  function patch(el, vnode) {
    el = typeof el === 'string' ? document.querySelector(el) : el; // TODO:

    function insertedVnodeQueue() {}

    el.innerHTML = '';
    createElm(vnode, insertedVnodeQueue, el);
  }

  function createElm(vnode, insertedVnodeQueue, parentElm) {
    vnode.elm = document.createElement(vnode.tag);

    if (vnode.data) {
      Object.keys(vnode.data).forEach(function (key) {
        var prop = key === 'class' ? 'className' : key;
        vnode.elm[prop] = vnode.data[key];
      });
    }

    createChildren(vnode, vnode.children, insertedVnodeQueue);
    insert(parentElm, vnode.elm);
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm);
      }
    } else {
      insert(vnode.elm, document.createTextNode(String(children.text)));
    }
  }

  function insert(parent, elm) {
    parent.appendChild(elm);
  }

  return patch;

}));
