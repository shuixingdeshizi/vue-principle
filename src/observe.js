import Dep from './dep'

function observe (value) {
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

function defineReactive (obj, key, val) {
  var dep = new Dep()

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function reactiveGetter () {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal !== val) {
        val = newVal
        dep.notify()
      }
    }
  })
}

export default observe
