import observe from './observe'
import mountComponent from './mountComponent'
import compile from './compile'
import createElement from './vdom/create-element'
import createTextVNode from './vdom/create-text-vnode'

function Vue (options = {}) {
  this.$el = options.el
  this.$options = options
  
  this._watchers = []
  this._watcher = null

  this._data = options.data
  observe(this._data)

  this.$createElement = (a, b, c, d) => createElement(this, a, b, c, d, true)
  this._c = (a, b, c, d) => createElement(this, a, b, c, d, false)

  this._v = createTextVNode;


  this.__patch__ = function (el, vnode) {
    el = typeof el === 'string' ? el = document.querySelector(el) : el
    var node = document.createElement(vnode.tag)
    el.innerHTML = ''
    el.appendChild(node)
  }

  
  if (this.$el) {
    this.$mount(this.$el)
  }
}

Vue.prototype.$mount = function (el, hydrating) {
  el = typeof el === 'string' ? document.querySelector(el) : el


  var options = this.$options
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (template.nodeType) {
        template = template.innerHTML;
      }
    } else if (el) {

      function getOuterHTML (el) {
        if (el.outerHTML) {
          return el.outerHTML
        } else {
          const container = document.createElement('div')
          container.appendChild(el.cloneNode(true))
          return container.innerHTML
        }
      }
     
      template = getOuterHTML(el)
    }

    if (template) {
      var ref = compile(template)
      var render = ref.render;
      options.render = render;
    }
  }

  return mountComponent(this, el, hydrating)
}

Vue.prototype._render = function () {
  const vm = this

  const { render, _parentVnode } = vm.$options

  vm.$vnode = _parentVnode

  let vnode
  try {
    // currentRenderingInstance = vm
    vnode = render.call(vm, vm.$createElement)
  } catch (e) {
    vnode = vm._vnode
  } finally {
    // currentRenderingInstance = null
  }

  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0]
  }

  // if (!(vnode instanceof VNode)) {
  //   vnode = createEmptyVNode()
  // }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}

Vue.prototype._update = function (vnode) {

  // vnode渲染

  var vm = this;
  var prevVnode = vm._vnode;
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode);
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
}

export default Vue
