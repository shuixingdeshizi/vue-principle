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
  var no = function no(a, b, c) {
    return false;
  };

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a\u2010zA\u2010Z_][\\w\\\u2010\\.]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var doctype = /^<!DOCTYPE [^>]+>/i; // #7298: escape - to avoid being passed as HTML comment when inlined in page

  var comment = /^<!\--/;
  var conditionalComment = /^<!\[/; // Special Elements (can contain anything)

  var isPlainTextElement = makeMap('script,style,textarea', true);
  var reCache = {};
  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
  };
  var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g; // #5992

  var isIgnoreNewlineTag = makeMap('pre,textarea', true);

  var shouldIgnoreFirstNewline = function shouldIgnoreFirstNewline(tag, html) {
    return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
  };

  function decodeAttr(value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) {
      return decodingMap[match];
    });
  }

  function parseHTML(html) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag = options.isUnaryTag || no;
    var canBeLeftOpenTag = options.canBeLeftOpenTag || no;
    var index = 0;
    var last, lastTag;

    while (html) {
      last = html; // Make sure we're not in a plaintext content element like script/style

      if (!lastTag || !isPlainTextElement(lastTag)) {
        var textEnd = html.indexOf('<');

        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              if (options.shouldKeepComment) {
                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
              }

              advance(commentEnd + 3);
              continue;
            }
          } // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment


          if (conditionalComment.test(html)) {
            var conditionalEnd = html.indexOf(']>');

            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue;
            }
          } // Doctype:


          var doctypeMatch = html.match(doctype);

          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue;
          } // End tag:


          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            var curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue;
          } // Start tag:


          var startTagMatch = parseStartTag();

          if (startTagMatch) {
            handleStartTag(startTagMatch);

            if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
              advance(1);
            }

            continue;
          }
        }

        var text = void 0,
            rest = void 0,
            next = void 0;

        if (textEnd >= 0) {
          rest = html.slice(textEnd);

          while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) break;
            textEnd += next;
            rest = html.slice(textEnd);
          }

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
      } else {
        (function () {
          var endTagLength = 0;
          var stackedTag = lastTag.toLowerCase();
          var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
          var rest = html.replace(reStackedTag, function (all, text, endTag) {
            endTagLength = endTag.length;

            if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
              text = text.replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
              .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
            }

            if (shouldIgnoreFirstNewline(stackedTag, text)) {
              text = text.slice(1);
            }

            if (options.chars) {
              options.chars(text);
            }

            return '';
          });
          index += html.length - rest.length;
          html = rest;
          parseEndTag(stackedTag, index - endTagLength, index);
        })();
      }

      if (html === last) {
        options.chars && options.chars(html);
        break;
      }
    } // Clean up any remaining tags


    parseEndTag();

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

    function handleStartTag(match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;
      var unary = isUnaryTag(tagName) || !!unarySlash;
      var l = match.attrs.length;
      var attrs = new Array(l);

      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        var value = args[3] || args[4] || args[5] || '';
        var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href' ? options.shouldDecodeNewlinesForHref : options.shouldDecodeNewlines;
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        };
      }

      if (!unary) {
        stack.push({
          tag: tagName,
          lowerCasedTag: tagName.toLowerCase(),
          attrs: attrs,
          start: match.start,
          end: match.end
        });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
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
        for (var i = stack.length - 1; i >= pos; i--) {
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        } // Remove the open elements from the stack


        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }

        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  function compile(template) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var ast = parseHTML(template.trim(), options);
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
