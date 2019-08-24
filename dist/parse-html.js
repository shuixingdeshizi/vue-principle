(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('shared/util'), require('web/compiler/util'), require('core/util/lang')) :
  typeof define === 'function' && define.amd ? define(['shared/util', 'web/compiler/util', 'core/util/lang'], factory) :
  (global = global || self, global.parseHTML = factory(global.util, global.util$1, global.lang));
}(this, function (util, util$1, lang) { 'use strict';

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
    }

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
          stack.push(element);
        } else {
          currentParent.children.push(element);
        }
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


      var exp = parseFilters(match[1].trim());
      tokens.push("_s(" + exp + ")");
      rawTokens.push({
        '@binding': exp
      });
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

  return parseHTML$1;

}));
