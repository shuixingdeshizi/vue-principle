(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('shared/util'), require('web/compiler/util'), require('core/util/lang')) :
  typeof define === 'function' && define.amd ? define(['shared/util', 'web/compiler/util', 'core/util/lang'], factory) :
  (global = global || self, global.parseHTML = factory(global.util, global.util$1, global.lang));
}(this, function (util, util$1, lang) { 'use strict';

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

        var child = {
          type: 3,
          text: text
        };
        currentParent.children.push(child);
      }
    });
    return root;
  }

  return parseHTML$1;

}));
