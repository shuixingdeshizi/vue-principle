import { createEmptyVNode } from './vnode/index'
import { Watcher } from './watcher'

function mountComponent (vm, el) {

  // callHook(vm, 'beforeMount')

  let updateComponent = () => {
    debugger
    const vnode = vm._render()
    vm._update(vnode)
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent)

  // callHook(vm, 'mounted')
  return vm
}



export { mountComponent }
