import { observer } from './observe'

import { Watcher } from './watcher'

import { render } from './render'

import { mountComponent } from './mountComponent'

import VNode, { createEmptyVNode, createTextVNode, createElement } from './vnode/index'

import { getOuterHTML }  from './getOuterHTML'

import { compileToFunctions } from './compile/compileToFunctions'


function Vue (options = {}) {
  this.$options = options
  this._data = options.data || {}
  observer(this._data)

  Object.keys(this._data).forEach((key) => {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      set: function proxySetter (val) {
        this._data[key] = val
      },
      get: function proxyGetter () {
        return this._data[key]
      }
    })
  })

  this._createElement = createElement
  this._createEmptyVNode = createEmptyVNode
  this._createTextVNode = createTextVNode

  this.$mount(options.el)

}

Vue.prototype.$mount = function (el) {
  el = typeof el === 'string' ? document.querySelector(el) : el

  var options = this.$options

  if (!options.render) {
    var template = options.template
    if (template) {

    } else {
      template = getOuterHTML(el)
    }

    if (template) {
      var ref = compileToFunctions(template);

      var render = ref.render
      console.log(render)
      // alert(typeof render)
      // var fn = new Function (render)
      // fn()
      options.render = new Function (render)
    }
  }

  return mountComponent(this, el)
}

Vue.prototype._render = function () {
  alert('render')
  debugger
  const vm = this
  const { render } = vm.$options

  let vnode
  try {
    vnode = render.call(vm, vm.$createElement)
  } catch (e) {
    debugger
    console.log(e)
  }

  if (!(vnode instanceof VNode)) {
    vnode = createEmptyVNode()
  }
  return vnode
}


Vue.prototype._update = function (vnode) {
  console.log('_update')
}



export default Vue