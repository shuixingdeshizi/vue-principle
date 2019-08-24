/*!
 * Vue.js v1.0.0
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
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

  function generate(rootAst, options) {
    var state = new CodegenState(options);
    var code = rootAst ? genElement(rootAst, state) : '_c("div")';
    console.log(code);
    return {
      render: new Function("with(this){return ".concat(code, "}"))
    };
  }

  function genElement(el, state) {
    if (el.parent) {
      el.pre = el.pre || el.parent.pre;
    }

    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state);
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state);
    } else if (el["for"] && !el.forProcessed) {
      return genFor(el, state);
    } else if (el["if"] && !el.ifProcessed) {
      return genIf(el, state);
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
      return genChildren(el) || 'void 0';
    } else if (el.tag === 'slot') {
      return genSlot(el, state);
    } else {
      // component or element
      var code;

      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        var data;
        data = genData(el);
        var children = el.inlineTemplate ? null : genChildren(el);
        code = "_c('".concat(el.tag, "'").concat(data ? ",".concat(data) : '' // data
        ).concat(children ? ",".concat(children) : '' // children
        , ")");
      } // module transforms
      // for (let i = 0; i < state.transforms.length; i++) {
      //   code = state.transforms[i](el, code)
      // }


      return code;
    }
  }

  function genData(el) {
    var data = '{'; // const dirs = genDirectives(el, state)
    // if (dirs) data += dirs + ','
    // key

    if (el.key) {
      data += "key:".concat(el.key, ",");
    } // ref


    if (el.ref) {
      data += "ref:".concat(el.ref, ",");
    }

    if (el.refInFor) {
      data += "refInFor:true,";
    } // pre


    if (el.pre) {
      data += "pre:true,";
    } // record original tag name for components using "is" attribute


    if (el.component) {
      data += "tag:\"".concat(el.tag, "\",");
    } // // module data generation functions
    // for (let i = 0; i < state.dataGenFns.length; i++) {
    //   data += state.dataGenFns[i](el)
    // }
    // attributes


    if (el.attrs) {
      data += "attrs:".concat(genProps(el.attrs), ",");
    } // DOM props


    if (el.props) {
      data += "domProps:".concat(genProps(el.props), ",");
    } // event handlers


    if (el.events) {
      data += "".concat(genHandlers(el.events, false), ",");
    }

    if (el.nativeEvents) {
      data += "".concat(genHandlers(el.nativeEvents, true), ",");
    } // slot target
    // only for non-scoped slots


    if (el.slotTarget && !el.slotScope) {
      data += "slot:".concat(el.slotTarget, ",");
    } // scoped slots


    if (el.scopedSlots) {
      data += "".concat(genScopedSlots(el, el.scopedSlots, state), ",");
    } // component v-model


    if (el.model) {
      data += "model:{value:".concat(el.model.value, ",callback:").concat(el.model.callback, ",expression:").concat(el.model.expression, "},");
    } // inline-template


    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);

      if (inlineTemplate) {
        data += "".concat(inlineTemplate, ",");
      }
    }

    data = data.replace(/,$/, '') + '}'; // v-bind dynamic argument wrap
    // v-bind with dynamic arguments must be applied using the same v-bind object
    // merge helper so that class/style/mustUseProp attrs are handled correctly.

    if (el.dynamicAttrs) {
      data = "_b(".concat(data, ",\"").concat(el.tag, "\",").concat(genProps(el.dynamicAttrs), ")");
    } // v-bind data wrap


    if (el.wrapData) {
      data = el.wrapData(data);
    } // v-on data wrap


    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }

    return data;
  }

  function genNode(el) {
    if (el.type === 1) {
      return genElement(el);
    } else {
      return genText(el);
    }
  }

  function genText(text) {
    return "_v(".concat(text.type === 2 ? text.expression // no need for () because already wrapped in _s()
    : JSON.stringify(text.text), ")");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(genNode).join(','));
    }
  }

  var CodegenState = function CodegenState(options) {
    _classCallCheck(this, CodegenState);

    this.options = options;
    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  };

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
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
        // End tag:
        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        } // Start tag:


        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          var tagName = startTagMatch.tagName;
          var unary = startTagMatch.unarySlash;
          var l = startTagMatch.attrs.length;
          var attrs = new Array(l);

          for (var i = 0; i < l; i++) {
            var args = startTagMatch.attrs[i];
            var value = args[3] || args[4] || args[5] || '';
            attrs[i] = {
              name: args[1],
              value: value
            };
          }

          if (!unary) {
            stack.push({
              tag: tagName,
              lowerCasedTag: tagName.toLowerCase(),
              attrs: attrs,
              start: startTagMatch.start,
              end: startTagMatch.end
            });
          } // TODO:


          if (options.start) {
            options.start(tagName, attrs, unary, startTagMatch.start, startTagMatch.end);
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
        var end, attr;
        console.log(html.match(dynamicArgAttribute));
        console.log(html.match(attribute));

        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
          attr.start = index;
          advance(attr[0].length);
          attr.end = index;
          match.attrs.push(attr);
        }

        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match;
        }
      }
    }

    function parseEndTag(tagName, start, end) {
      var pos, lowerCasedTagName;
      if (start == null) start = index;
      if (end == null) end = index; // Find the closest opened tag of the same type

      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();

        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break;
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var _i = stack.length - 1; _i >= pos; _i--) {
          // TODO:
          if (options.end) {
            options.end(stack[_i].tag, start, end);
          }
        } // Remove the open elements from the stack


        stack.length = pos;
      }
    }
  }

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

  function parseHTML$1(html) {
    var stack = [];
    var root;
    var currentParent;
    parseHTML(html, {
      start: function start(tag, attrs, unary, _start, end) {
        var element = createASTElement(tag, attrs, currentParent);

        if (!element.processed) {
          processFor(element);
          processIf(element);
        }

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
        if (!currentParent) {
          return;
        }

        var children = currentParent.children;

        if (text) {
          var res;
          var child;

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

          if (child) {
            children.push(child);
          }
        }
      }
    });
    return root;
  }

  function createASTElement(tag, attrs, parent) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      rawAttrsMap: {},
      parent: parent,
      children: []
    };
  }

  function getAndRemoveAttr(el, name, removeFromMap) {
    var val;

    if ((val = el.attrsMap[name]) != null) {
      var list = el.attrsList;

      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break;
        }
      }
    }

    if (removeFromMap) {
      delete el.attrsMap[name];
    }

    return val;
  }

  function makeAttrsMap(attrs) {
    var map = {};

    for (var i = 0, l = attrs.length; i < l; i++) {
      map[attrs[i].name] = attrs[i].value;
    }

    return map;
  }

  function processFor(el) {
    var exp;

    if (exp = getAndRemoveAttr(el, 'v-for')) {
      var res = parseFor(exp);

      if (res) {
        extend(el, res);
      } else if (process.env.NODE_ENV !== 'production') {
        warn("Invalid v-for expression: ".concat(exp), el.rawAttrsMap['v-for']);
      }
    }
  }

  function processIf(el) {
    var exp = getAndRemoveAttr(el, 'v-if');

    if (exp) {
      el["if"] = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el["else"] = true;
      }

      var elseif = getAndRemoveAttr(el, 'v-else-if');

      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function parseText(text) {
    var tokens = [];
    var rawTokens = [];
    var lastIndex = defaultTagRE.lastIndex = 0;
    var match, index, tokenValue;

    while (match = defaultTagRE.exec(text)) {
      index = match.index; // push text token

      if (index > lastIndex) {
        rawTokens.push(tokenValue = text.slice(lastIndex, index));
        tokens.push(JSON.stringify(tokenValue));
      } // tag token
      // var exp = parseFilters(match[1].trim());
      // tokens.push(("_s(" + exp + ")"));
      // rawTokens.push({ '@binding': exp });


      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      rawTokens.push(tokenValue = text.slice(lastIndex));
      tokens.push(JSON.stringify(tokenValue));
    }

    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    };
  }

  function compile(template) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var ast = parseHTML$1(template.trim());
    var code = generate(ast, options);
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

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
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

    this._v = createTextVNode;

    this.__patch__ = function (el, vnode) {
      el = typeof el === 'string' ? el = document.querySelector(el) : el;
      var node = document.createElement(vnode.tag);
      el.innerHTML = '';
      el.appendChild(node);
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
