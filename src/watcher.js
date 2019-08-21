import Dep, { pushTarget, popTarget } from './dep'

function queueWatcher (watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    watcher.run()
  }
}

class Watcher {
  constructor (vm, expOrFn, cb) {
    debugger
      Dep.target = this;
      this.vm = vm
      this.cb = cb
      this.getter = expOrFn
      this.value = this.lazy ? undefined : this.get()
  }

  get () {
    debugger
    pushTarget(this)
    let value
    const vm = this.vm

    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      console.log(e)
    } finally {
      popTarget()
    }
    return value
  }

  update () {
      console.log("视图更新啦～");
      queueWatcher(this)
  }

  run () {
    this.cb()
  }
}


export {
  Watcher
}