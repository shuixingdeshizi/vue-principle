(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, function () { 'use strict';

  function Dep() {
    this.subs = [];
  }

  Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.notify = function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  };

  function pushTarget(target) {
    // targetStack.push(target)
    Dep.target = target;
  }

  function popTarget() {
    // targetStack.pop()
    Dep.target = null;
  }

  function observe(value) {
    Object.keys(value).forEach(function (key) {
      defineReactive(value, key, value[key]);
    });
  }

  function defineReactive(obj, key, val) {
    var dep = new Dep();
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: function reactiveGetter() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }

        return val;
      },
      set: function reactiveSetter(newVal) {
        if (newVal !== val) {
          val = newVal;
          dep.notify();
        }
      }
    });
  }

  var uid = 0;

  function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;

    if (isRenderWatcher) {
      vm._watcher = this;
    }

    vm._watchers.push(this);

    if (options) {
      this.dirty = !!options.dirty;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    }

    this.id = ++uid;
    this.getter = expOrFn;
    this.cb = cb;
    this.value = this.lazy ? undefined : this.get();
  }

  Watcher.prototype.get = function () {
    pushTarget(this);
    var vm = this.vm;
    var value = this.getter.call(vm, vm);
    popTarget();
    return value;
  };

  Watcher.prototype.update = function () {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  Watcher.prototype.run = function () {
    var value = this.get();
    var oldVal = this.value;

    if (value !== oldVal) {
      this.value = value;
    }
  };

  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  function noop() {}

  function mountComponent(vm, el, hydrationg) {
    // if (!vm.$options.render) {
    //   vm.$options.render = createEmptyVNode
    // }
    var template = vm.$options.template;

    if (!template) {
      template = getOuterHTML(el);
    } // callHook(vm, 'beforeMount')


    var updateComponent = function updateComponent() {
      var vnode = vm._render();

      vm._update(vnode, hydrationg);
    };

    new Watcher(vm, updateComponent, noop, {}, true);
    hydrationg = false;

    if (vm.$vnode == null) {
      vm._isMounted = true; // callHook(vm, 'mounted')
    }

    return vm;
  }

  function Vue() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.$el = options.el;
    this.$options = options;
    this._watchers = [];
    this._watcher = null;
    this._data = options.data;
    observe(this._data);

    if (this.$el) {
      this.$mount(this.$el);
    }
  }

  Vue.prototype.$mount = function (el, hydrating) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    return mountComponent(this, el, hydrating);
  };

  Vue.prototype._render = function () {
    // 生成vnode
    var vm = this;
    var render = vm.$options.render;
    var vnode;

    try {
      vnode = render.call(vm, vm.$createElement);
    } catch (e) {
      console.log(e);
    }

    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }

    return vnode;
  };

  Vue.prototype._update = function () {// vnode渲染
  };

  return Vue;

}));
