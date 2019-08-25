(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.generate = factory());
}(this, function () { 'use strict';

  function genData(el) {
    var data = '{';

    if (el.attrs) {
      data += "attrsMap:".concat(genProps(el.attrsMap), ",");
    } // event handlers


    if (el.events) {
      data += "".concat(genHandlers(el.events, false), ",");
    } // component v-model


    if (el.model) {
      data += "model:{value:".concat(el.model.value, ",callback:").concat(el.model.callback, ",expression:").concat(el.model.expression, "},");
    }

    data = data.replace(/,$/, '');
    data += '}';
    return data;
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
      return "".concat(children.map(genNode).join(','));
    }
  }

  function genElement(el, state) {
    var code;
    var data = genData(el) || '';
    var children = genChildren(el) || '';
    code = "_c('".concat(el.tag, "', ").concat(data, ", '").concat(children, "')");
    return code;
  }

  function generate(rootAst, options) {
    var code = rootAst ? genElement(rootAst) : '_c("div")';
    console.log(code);
    return {
      render: new Function("with(this){return ".concat(code, "}"))
    };
  }

  return generate;

}));
