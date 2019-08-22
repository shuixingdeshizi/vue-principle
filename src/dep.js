function Dep () {
    this.subs = []
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

Dep.prototype.notify = function () {
  this.subs.forEach(sub => {
    sub.update()
  })
}

function pushTarget (target) {
  // targetStack.push(target)
  Dep.target = target
}

function popTarget () {
  // targetStack.pop()
  Dep.target = null
}

export default Dep
export {
  pushTarget,
  popTarget
}