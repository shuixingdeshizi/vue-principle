import createParseHTML from './create-parse-html'
import {createASTElement, parseText} from './utils'

function parseHTML (html) {

  const stack = []
  let root
  let currentParent

  createParseHTML(html, {
    start (tag, attrs, unary, start, end) {

      let element = createASTElement(tag, attrs, currentParent)


      if (!root) {
        root = element
      }

      if (!currentParent) {
        currentParent = element
      } else {
        currentParent.children.push(element)
      }
      stack.push(element)
    },
    end (tag, start, end) {
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
    },
    chars: function chars (text, start, end) {
      if (!currentParent || !text) {
        return
      }

      var child
      var res
      if (res = parseText(text)) {
        child = {
          type: 2,
          expression: res.expression,
          tokens: res.tokens,
          text: text
        }
      } else {
        child = {
          type: 3,
          text: text
        }
      }

      
      currentParent.children.push(child);
    }
  })
  return root
}

export default parseHTML