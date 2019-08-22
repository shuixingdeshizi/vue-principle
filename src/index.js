import observe from './observe'
import mountComponent from './mountComponent'

function Vue (options = {}) {
  this.$el = options.el
  this.$options = options
  
  this._watchers = []
  this._watcher = null

  this._data = options.data
  observe(this._data)

  if (this.$el) {
    this.$mount(this.$el)
  }
}

Vue.prototype.$mount = function (el, hydrating) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  return mountComponent(this, el, hydrating)
}

Vue.prototype._render = function () {
  // 生成vnode
  const vm = this
  const { render } = vm.$options

  let vnode
  try {
    vnode = render.call(vm, vm.$createElement)
  } catch (e) {
    console.log(e)
  }

  if (!(vnode instanceof VNode)) {
    vnode = createEmptyVNode()
  }

  return vnode
}

Vue.prototype._update = function () {
  // vnode渲染
}

export default Vue
