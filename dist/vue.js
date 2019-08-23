/*!
 * Vue.js v1.0.0
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
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

  function noop() {}

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /* @flow */
  var VNode =
  /*#__PURE__*/
  function () {
    function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
      _classCallCheck(this, VNode);

      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.fnContext = undefined;
      this.fnOptions = undefined;
      this.fnScopeId = undefined;
      this.key = data && data.key;
      this.componentOptions = componentOptions;
      this.componentInstance = undefined;
      this.parent = undefined;
      this.raw = false;
      this.isStatic = false;
      this.isRootInsert = true;
      this.isComment = false;
      this.isCloned = false;
      this.isOnce = false;
      this.asyncFactory = asyncFactory;
      this.asyncMeta = undefined;
      this.isAsyncPlaceholder = false;
    } // DEPRECATED: alias for componentInstance for backwards compat.

    /* istanbul ignore next */


    _createClass(VNode, [{
      key: "child",
      get: function get() {
        return this.componentInstance;
      }
    }]);

    return VNode;
  }();

  function mountComponent(vm, el, hydrating) {
    // if (!vm.$options.render) {
    //   vm.$options.render = createEmptyVNode
    // }
    // let template = vm.$options.template
    // if (!template) {
    //   template = getOuterHTML(el)
    // }
    // callHook(vm, 'beforeMount')
    var updateComponent = function updateComponent() {
      var vnode = vm._render();

      vm._update(vnode, hydrating);
    };

    new Watcher(vm, updateComponent, noop, {}, true);
    hydrating = false;

    if (vm.$vnode == null) {
      vm._isMounted = true; // callHook(vm, 'mounted')
    }

    return vm;
  }

  function generate(rootAst) {
    var code = rootAst ? genElement(rootAst) : '_c("div")';
    console.log(code);
    return {
      render: new Function("with(this){return ".concat(code, "}"))
    };
  }

  function genNode(el) {
    if (el.type === 1) {
      return genElement(el);
    } else {
      return genText(el);
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(genNode).join(','));
    }
  }

  function genElement(el) {
    if (el["if"] && !el.ifProcessed) {
      return genIf(el);
    } else if (el["for"] && !el.forProcessed) {
      return genFor(el);
    } else {
      var children = genChildren(el);
      var code;
      code = "_c('".concat(el.tag, ",'{\n             staticClass: ").concat(el.attrsMap && el.attrsMap[':class'], ",\n             class: ").concat(el.attrsMap && el.attrsMap['class'], ",\n            }").concat(children ? ",".concat(children) : '', ")");
      return code;
    }
  }

  var ncname = '[a-zA-Z_][\\w]*';
  var qnamcCapture = '(' + ncname + ')';
  var startTagOpen = new RegExp('^<' + qnamcCapture);
  var startTagClose = new RegExp('^\s*(\/?)>');
  var endTag = new RegExp('^<\/' + qnamcCapture + '>');
  var singleAttrIdentifier = /([^\s"'<>/=]+)/;
  var singleAttrAssign = /(?:=)/;
  var singleAttrValues = [/"([^"]*)"+/.source, /'([^']*)'+/.source, /([^\s"'=<>`]+)/.source];
  var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');
  var index = 0;
  var stack = [];
  var html;
  var currentParent;
  var root;

  function parseHTML(template) {
    html = template;

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 匹配开始标签
        if (html.match(startTagOpen)) {
          var startTagMatch = parseStartTag();

          if (startTagMatch) {
            var element = {
              type: 1,
              tag: startTagMatch.tagName,
              lowerCasedtag: startTagMatch.tagName.toLowerCase(),
              parent: currentParent,
              children: [],
              attrsList: startTagMatch.attrs
            };

            if (!root) {
              root = element;
            }

            if (currentParent) {
              currentParent.children.push(element);
            }

            stack.push(element);
            currentParent = element;
            continue;
          }
        } // 匹配结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch);
          continue;
        }
      } else {
        var text = html.substring(0, textEnd);
        advance(text.length);
        currentParent.children.push({
          type: 3,
          text: text
        });
        continue;
      }
    }

    return root;
  }

  function advance(n) {
    index += n;
    html = html.substring(n);
  }
  /**
   * 匹配开始标签
   * @param {*} html 
   */


  function parseStartTag() {
    var start = html.match(startTagOpen);

    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index,
        end: ''
      };
      advance(start[0].length);
      var end, attr;

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3]
        });
      }

      if (end) {
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function parseEndTag(tagName) {
    var pos;

    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedtag === tagName[1].toLowerCase()) {
        break;
      }
    }

    if (pos >= 0) {
      stack.length = pos;
      currentParent = stack[pos - 1];
    }
  }

  function compile(template) {
    var ast = parseHTML(template.trim());
    var code = generate(ast);
    return {
      ast: ast,
      render: code.render
    };
  }

  /* @flow */
  // without getting yelled at by flow

  function createElement(context, tag, data, children) {
    return _createElement(context, tag, data, children);
  }

  function _createElement(context, tag, data, children) {
    var vnode;

    if (typeof tag === 'string') {
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    } else {
      vnode = createComponent(tag, data, context, children);
    }

    return vnode;
  }

  function Vue() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.$el = options.el;
    this.$options = options;
    this._watchers = [];
    this._watcher = null;
    this._data = options.data;
    observe(this._data);

    this.$createElement = function (a, b, c, d) {
      return createElement(_this, a, b, c);
    };

    this._c = function (a, b, c, d) {
      return createElement(_this, a, b, c);
    };

    this.__patch__ = function (el, vnode) {
      debugger;
      el = typeof el === 'string' ? el = document.querySelector(el) : el;
      var node = document.createElement(vnode.tag);
      el.innerHTML = '';
      el.appendChild(node);
      debugger;
    };

    if (this.$el) {
      this.$mount(this.$el);
    }
  }

  Vue.prototype.$mount = function (el, hydrating) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    var options = this.$options;

    if (!options.render) {
      var template = options.template;

      if (template) {
        if (template.nodeType) {
          template = template.innerHTML;
        }
      } else if (el) {
        var getOuterHTML = function getOuterHTML(el) {
          if (el.outerHTML) {
            return el.outerHTML;
          } else {
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true));
            return container.innerHTML;
          }
        };

        template = getOuterHTML(el);
      }

      if (template) {
        var ref = compile(template);
        var render = ref.render;
        options.render = render;
      }
    }

    return mountComponent(this, el, hydrating);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var _vm$$options = vm.$options,
        render = _vm$$options.render,
        _parentVnode = _vm$$options._parentVnode;
    vm.$vnode = _parentVnode;
    var vnode;

    try {
      // currentRenderingInstance = vm
      vnode = render.call(vm, vm.$createElement);
    } catch (e) {
      vnode = vm._vnode;
    } finally {// currentRenderingInstance = null
    }

    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    } // if (!(vnode instanceof VNode)) {
    //   vnode = createEmptyVNode()
    // }
    // set parent


    vnode.parent = _parentVnode;
    return vnode;
  };

  Vue.prototype._update = function (vnode) {
    // vnode渲染
    var vm = this;
    var prevVnode = vm._vnode;
    vm._vnode = vnode; // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.

    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
  };

  return Vue;

}));
