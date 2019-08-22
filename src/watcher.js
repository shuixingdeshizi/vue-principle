import {pushTarget, popTarget} from './dep'

let uid = 0

function Watcher (vm, expOrFn, cb, options, isRenderWatcher) {
  this.vm = vm

  if (isRenderWatcher) {
    vm._watcher = this
  }
  vm._watchers.push(this)

  if (options) {
    this.dirty = !!options.dirty
    this.lazy = !!options.lazy
    this.sync = !!options.sync
  }

  this.id = ++uid
  this.getter = expOrFn
  this.cb = cb

  this.value = this.lazy ? undefined : this.get()
}

Watcher.prototype.get = function () {
  pushTarget(this)
  const vm = this.vm
  let value = this.getter.call(vm, vm)
  popTarget()
  return value
}

Watcher.prototype.update = function () {
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}

Watcher.prototype.run = function () {
  const value = this.get()
  const oldVal = this.value
  if (value !== oldVal) {
    this.value = value
  }
}

export default Watcher