(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('shared/util'), require('web/compiler/util'), require('core/util/lang')) :
  typeof define === 'function' && define.amd ? define(['shared/util', 'web/compiler/util', 'core/util/lang'], factory) :
  (global = global || self, global.Vue = factory(global.util, global.util$1, global.lang));
}(this, function (util, util$1, lang) { 'use strict';

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

  var callbacks = [];
  var pending = false;

  function nextTick(cb) {
    callbacks.push(cb);

    if (!pending) {
      pending = true;
      setTimeout(flushCallbacks, 0);
    }
  }

  function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;

    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  var has = {};
  var queue = [];
  var waiting = false;

  function flushSchedulerQueue() {
    var watcher, id;

    for (var i = 0; i < queue.length; i++) {
      watcher = queue[i];
      id = watcher.id;
      has[id] = null;
      watcher.run();
    }

    waiting = false;
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true;
      queue.push(watcher);

      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
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
    function VNode(tag, data, children, text, elm, context) {
      _classCallCheck(this, VNode);

      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.parent = undefined;
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

  function genText(text) {
    return "_v(".concat(text.type === 2 ? text.expression // no need for () because already wrapped in _s()
    : JSON.stringify(text.text), ")");
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
      return children.map(genNode);
    }
  }

  function genElement(el) {
    var code;
    var attrs = JSON.stringify(el.attrsMap || {});
    var children = genChildren(el) || [];
    code = "_c('".concat(el.tag, "', ").concat(attrs, ", ").concat(children, ")");
    return code;
  }

  function generate(rootAst, options) {
    var code = rootAst ? genElement(rootAst) : '_c("div")';
    console.log(code);
    return {
      render: new Function("with(this){return ".concat(code, "}"))
    };
  }

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));

  function parseHTML(html, options) {
    var stack = [];
    var index = 0;

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          var tagName = endTagMatch[1];
          var start = index;
          advance(endTagMatch[0].length);
          var end = index;
          var pos = void 0; // Find the closest opened tag of the same type

          if (tagName) {
            for (pos = stack.length - 1; pos >= 0; pos--) {
              if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
                break;
              }
            }
          } else {
            // If no tag name is provided, clean shop
            pos = 0;
          }

          if (pos >= 0) {
            // Close all the open elements, up the stack
            for (var i = stack.length - 1; i >= pos; i--) {
              // TODO:
              if (options.end) {
                options.end(stack[i].tag, start, end);
              }
            } // Remove the open elements from the stack


            stack.length = pos;
          }

          continue;
        } // Start tag:


        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          var _tagName = startTagMatch.tagName;
          var unary = startTagMatch.unarySlash;
          var l = startTagMatch.attrs.length;
          var attrs = new Array(l);

          for (var _i = 0; _i < l; _i++) {
            var args = startTagMatch.attrs[_i];
            var value = args[3] || args[4] || args[5] || '';
            attrs[_i] = {
              name: args[1],
              value: value
            };
          }

          if (!unary) {
            stack.push({
              tag: _tagName,
              lowerCasedTag: _tagName.toLowerCase(),
              attrs: attrs,
              start: startTagMatch.start,
              end: startTagMatch.end
            });
          } // TODO:


          if (options.start) {
            options.start(_tagName, attrs, unary, startTagMatch.start, startTagMatch.end);
          }

          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } // parseEndTag()


    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          attr.start = index;
          advance(attr[0].length);
          attr.end = index;
          match.attrs.push(attr);
        }

        if (_end) {
          match.unarySlash = _end[1];
          advance(_end[0].length);
          match.end = index;
          return match;
        }
      }
    }
  }

  var createASTElement = function createASTElement(tag, attrs, parent) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      parent: parent,
      children: []
    };
  };
  var makeAttrsMap = function makeAttrsMap(attrs) {
    var map = {};

    for (var i = 0, l = attrs.length; i < l; i++) {
      map[attrs[i].name] = attrs[i].value;
    }

    return map;
  };
  var parseText = function parseText(text) {
    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
    var tokens = [];
    var rawTokens = [];
    var match;

    while (match = defaultTagRE.exec(text)) {
      var exp = match[1].trim(); // tokens.push(("_s(" + exp + ")"));

      tokens.push(exp);
    }

    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    };
  };

  function parseHTML$1(html) {
    var stack = [];
    var root;
    var currentParent;
    parseHTML(html, {
      start: function start(tag, attrs, unary, _start, end) {
        var element = createASTElement(tag, attrs, currentParent);

        if (!root) {
          root = element;
        }

        if (!currentParent) {
          currentParent = element;
        } else {
          currentParent.children.push(element);
        }

        stack.push(element);
      },
      end: function end(tag, start, _end) {
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
      },
      chars: function chars(text, start, end) {
        if (!currentParent || !text) {
          return;
        }

        var child;
        var res;

        if (res = parseText(text)) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          };
        } else {
          child = {
            type: 3,
            text: text
          };
        }

        currentParent.children.push(child);
      }
    });
    return root;
  }

  function compile(template) {
    var ast = parseHTML$1(template.trim());
    console.log('ast', ast);
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
    var vnode = new VNode(tag, data, children, undefined, undefined, context);
    return vnode;
  }

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
  }

  function patch(el, vnode) {
    el = typeof el === 'string' ? document.querySelector(el) : el; // TODO:

    function insertedVnodeQueue() {}

    el.innerHTML = '';
    createElm(vnode, insertedVnodeQueue, el);
  }

  function createElm(vnode, insertedVnodeQueue, parentElm) {
    vnode.elm = document.createElement(vnode.tag);

    if (vnode.data) {
      Object.keys(vnode.data).forEach(function (key) {
        var prop = key === 'class' ? 'className' : key;
        vnode.elm[prop] = vnode.data[key];
      });
    }

    createChildren(vnode, vnode.children, insertedVnodeQueue);
    insert(parentElm, vnode.elm);
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm);
      }
    } else {
      insert(vnode.elm, document.createTextNode(String(children.text)));
    }
  }

  function insert(parent, elm) {
    parent.appendChild(elm);
  }

  var makeMap = function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }

    return expectsLowerCase ? function (val) {
      return map[val.toLowerCase()];
    } : function (val) {
      return map[val];
    };
  };
  var isBuiltInTag = makeMap('slot,component', true);
  var toString = Object.prototype.toString;

  function Vue() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.$el = options.el;
    this.$options = options;
    this._watchers = [];
    this._watcher = null;
    this._data = options.data;
    observe(this._data);
    Object.keys(this._data).forEach(function (key) {
      Object.defineProperty(_this, key, {
        configurable: true,
        enumerable: true,
        set: function proxySetter(newVal) {
          this._data[key] = newVal;
        },
        get: function proxyGetter() {
          return this._data[key];
        }
      });
    });

    this.$createElement = function (a, b, c, d) {
      return createElement(_this, a, b, c);
    };

    this._c = function (a, b, c, d) {
      return createElement(_this, a, b, c);
    };

    this._v = createTextVNode;
    this._s = toString;
    this.__patch__ = patch;
    this.$mount(this.$options.el);
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
    vm._vnode = vnode;

    vm.__patch__(vm.$el, vnode);
  };

  return Vue;

}));
