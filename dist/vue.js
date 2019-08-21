(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  // 《响应式系统的基本原理》
  function observer(value) {
    if (!value || _typeof(value) !== 'object') {
      return;
    }

    Object.keys(value).forEach(function (key) {
      defineReactive(value, key, value[key]);
    });
  }

  function cb(val) {
    console.log("视图更新啦～", val);
  }

  function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        return val;
      },
      set: function reactiveSetter(newVal) {
        if (newVal === val) return;
        val = newVal;
        cb(newVal);
      }
    });
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true;
      watcher.run();
    }
  }

  var Watcher =
  /*#__PURE__*/
  function () {
    function Watcher(vm, expOrFn, cb) {
      _classCallCheck(this, Watcher);

      debugger;
      this.vm = vm;
      this.cb = cb;
      this.getter = expOrFn;
      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        debugger;
        var value;
        var vm = this.vm;

        try {
          value = this.getter.call(vm, vm);
        } catch (e) {
          console.log(e);
        } finally {
        }

        return value;
      }
    }, {
      key: "update",
      value: function update() {
        console.log("视图更新啦～");
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.cb();
      }
    }]);

    return Watcher;
  }();

  var VNode = function VNode(tag, data, children, text, elm) {
    _classCallCheck(this, VNode);

    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
  };

  function createEmptyVNode() {
    var node = new VNode();
    node.text = '';
    return node;
  }

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
  }

  function createElement(context, tag, data, children) {
    var vnode;

    if (typeof tag === 'string') {
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }

    return vnode;
  }

  function mountComponent(vm, el) {
    // callHook(vm, 'beforeMount')
    var updateComponent = function updateComponent() {
      debugger;

      var vnode = vm._render();

      vm._update(vnode);
    }; // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined


    new Watcher(vm, updateComponent); // callHook(vm, 'mounted')

    return vm;
  }

  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  var ncname = '[a-zA-Z_][\\w\\-\\.]*';
  var singleAttrIdentifier = /([^\s"'<>/=]+)/;
  var singleAttrAssign = /(?:=)/;
  var singleAttrValues = [/"([^"]*)"+/.source, /'([^']*)'+/.source, /([^\s"'=<>`]+)/.source];
  var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');
  var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
  var startTagOpen = new RegExp('^<' + qnameCapture);
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
  var stack = [];
  var currentParent, root;
  var index = 0;
  var html;

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function makeAttrsMap(attrs) {
    var map = {};

    for (var i = 0, l = attrs.length; i < l; i++) {
      map[attrs[i].name] = attrs[i].value;
    }

    return map;
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

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3]
        });
      }

      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function parseEndTag(tagName) {
    var pos;

    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
        break;
      }
    }

    if (pos >= 0) {
      if (pos > 0) {
        currentParent = stack[pos - 1];
      } else {
        currentParent = null;
      }

      stack.length = pos;
    }
  }

  function parseText(text) {
    if (!defaultTagRE.test(text)) return;
    var tokens = [];
    var lastIndex = defaultTagRE.lastIndex = 0;
    var match, index;

    while (match = defaultTagRE.exec(text)) {
      index = match.index;

      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }

      var exp = match[1].trim(); // tokens.push(`_s(${exp})`)

      tokens.push(String(exp));
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return tokens.join('+');
  }

  function getAndRemoveAttr(el, name) {
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

    return val;
  }

  function processFor(el) {
    var exp;

    if (exp = getAndRemoveAttr(el, 'v-for')) {
      var inMatch = exp.match(forAliasRE);
      el["for"] = inMatch[2].trim();
      el.alias = inMatch[1].trim();
    }
  }

  function processIf(el) {
    var exp = getAndRemoveAttr(el, 'v-if');

    if (exp) {
      el["if"] = exp;

      if (!el.ifConditions) {
        el.ifConditions = [];
      }

      el.ifConditions.push({
        exp: exp,
        block: el
      });
    }
  }

  function parseHTML() {
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1]);
          continue;
        }

        if (html.match(startTagOpen)) {
          var startTagMatch = parseStartTag();
          var element = {
            type: 1,
            tag: startTagMatch.tagName,
            lowerCasedTag: startTagMatch.tagName.toLowerCase(),
            attrsList: startTagMatch.attrs,
            attrsMap: makeAttrsMap(startTagMatch.attrs),
            parent: currentParent,
            children: []
          };
          processIf(element);
          processFor(element);

          if (!root) {
            root = element;
          }

          if (currentParent) {
            currentParent.children.push(element);
          }

          if (!startTagMatch.unarySlash) {
            stack.push(element);
            currentParent = element;
          }

          continue;
        }
      } else {
        var text = html.substring(0, textEnd);
        advance(textEnd);
        var expression = void 0;

        if (expression = parseText(text)) {
          currentParent.children.push({
            type: 2,
            text: text,
            expression: expression
          });
        } else {
          currentParent.children.push({
            type: 3,
            text: text
          });
        }

        continue;
      }
    }

    return root;
  }

  function parse(template) {
    html = template;
    return parseHTML();
  }

  function generate(rootAst) {
    function genIf(el) {
      el.ifProcessed = true;

      if (!el.ifConditions.length) {
        return '_createEmptyVNode()';
      }

      return "(".concat(el.ifConditions[0].exp, ")?").concat(genElement(el.ifConditions[0].block), ": _createEmptyVNode()");
    }

    function genFor(el) {
      el.forProcessed = true;
      var exp = el["for"];
      var alias = el.alias;
      var iterator1 = el.iterator1 ? ",".concat(el.iterator1) : '';
      var iterator2 = el.iterator2 ? ",".concat(el.iterator2) : '';
      return "_l((".concat(exp, "),") + "function(".concat(alias).concat(iterator1).concat(iterator2, "){") + "return ".concat(genElement(el)) + '})';
    }

    function genText(el) {
      debugger;
      return "_createTextVNode(".concat(el.expression, ")");
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

        var _code;

        _code = "_createElement('".concat(el.tag, "', {\n                staticClass: ").concat(el.attrsMap && el.attrsMap[':class'], ",\n                class: ").concat(el.attrsMap && el.attrsMap['class'], ",\n            }").concat(children ? ",".concat(children) : '', ")");
        return _code;
      }
    }

    var code = rootAst ? genElement(rootAst) : '_createElement("div")';
    return {
      render: "console.log(this);with(this){return ".concat(code, "}")
    };
  }

  function compileToFunctions(template) {
    debugger;
    var ast = parse(template.trim());
    console.log('ast', ast);
    var code = generate(ast);
    console.log('code', code);
    console.log(code.render);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    };
  }

  function Vue() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.$options = options;
    this._data = options.data || {};
    observer(this._data);
    Object.keys(this._data).forEach(function (key) {
      Object.defineProperty(_this, key, {
        configurable: true,
        enumerable: true,
        set: function proxySetter(val) {
          this._data[key] = val;
        },
        get: function proxyGetter() {
          return this._data[key];
        }
      });
    });
    this._createElement = createElement;
    this._createEmptyVNode = createEmptyVNode;
    this._createTextVNode = createTextVNode;
    this.$mount(options.el);
  }

  Vue.prototype.$mount = function (el) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    var options = this.$options;

    if (!options.render) {
      var template = options.template;

      if (template) ; else {
        template = getOuterHTML(el);
      }

      if (template) {
        var ref = compileToFunctions(template);
        var render = ref.render;
        console.log(render); // alert(typeof render)
        // var fn = new Function (render)
        // fn()

        options.render = new Function(render);
      }
    }

    return mountComponent(this);
  };

  Vue.prototype._render = function () {
    alert('render');
    debugger;
    var vm = this;
    var render = vm.$options.render;
    var vnode;

    try {
      vnode = render.call(vm, vm.$createElement);
    } catch (e) {
      debugger;
      console.log(e);
    }

    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }

    return vnode;
  };

  Vue.prototype._update = function (vnode) {
    console.log('_update');
  };

  return Vue;

}));
