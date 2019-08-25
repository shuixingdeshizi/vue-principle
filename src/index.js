import observe from './observe'
import mountComponent from './mountComponent'
import compile from './compile'
import createElement from './vdom/create-element'
import createTextVNode from './vdom/create-text-vnode'
import patch from './compile/patch/index'
import { toString } from './utils/index'

function Vue (options = {}) {
  this.$el = options.el
  this.$options = options
  
  this._watchers = []
  this._watcher = null

  this._data = options.data
  observe(this._data)

  Object.keys(this._data).forEach(key => {
    let that = this
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      set: function proxySetter (newVal) {
        this._data[key] = newVal
      },
      get: function proxyGetter () {
        return this._data[key]
      }
    })
  })


  this.$createElement = (a, b, c, d) => createElement(this, a, b, c, d, true)
  this._c = (a, b, c, d) => createElement(this, a, b, c, d, false)

  this._v = createTextVNode;
  this._s = toString


  this.__patch__ = patch

  this.$mount(this.$options.el)
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
  vm._vnode = vnode;
  vm.__patch__(vm.$el, vnode);
}


export default Vue
