import Watcher from './watcher'
import getOuterHTML from './getOuterHTML'
import noop from './noop'

function mountComponent (vm, el, hydrationg) {
  // if (!vm.$options.render) {
  //   vm.$options.render = createEmptyVNode
  // }

  let template = vm.$options.template

  if (!template) {
    template = getOuterHTML(el)
  }

  // callHook(vm, 'beforeMount')
  const updateComponent = function  () {
    const vnode = vm._render()
    vm._update(vnode, hydrationg)
  }

  new Watcher(vm, updateComponent, noop, {}, true)

  hydrationg = false

  if (vm.$vnode == null) {
    vm._isMounted = true
    // callHook(vm, 'mounted')
  }
  return vm
}

export default mountComponent