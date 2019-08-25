import { makeMap, no } from 'shared/util'
import { isNonPhrasingTag } from 'web/compiler/util'
import { unicodeRegExp } from 'core/util/lang'

// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)


function parseHTML (html, options) {
  const stack = []
  let index = 0
  let root
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {



      function parseEndTag (tagName, start, end) {
        let pos, lowerCasedTagName
        if (start == null) start = index
        if (end == null) end = index
    
        // Find the closest opened tag of the same type
        if (tagName) {
          lowerCasedTagName = tagName.toLowerCase()
          for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].lowerCasedTag === lowerCasedTagName) {
              break
            }
          }
        } else {
          // If no tag name is provided, clean shop
          pos = 0
        }
    
        if (pos >= 0) {
          // Close all the open elements, up the stack
          for (let i = stack.length - 1; i >= pos; i--) {
            // TODO:
            if (options.end) {
              options.end(stack[i].tag, start, end)
            }
          }
    
          // Remove the open elements from the stack
          stack.length = pos
        }
      }


      // End tag:
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        const tagName = endTagMatch[1]
        const start = index
        advance(endTagMatch[0].length)
        const end = index

        let pos
        // Find the closest opened tag of the same type
        if (tagName) {
          for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
              break
            }
          }
        } else {
          // If no tag name is provided, clean shop
          pos = 0
        }
    
        if (pos >= 0) {
          // Close all the open elements, up the stack
          for (let i = stack.length - 1; i >= pos; i--) {

            // TODO:
            if (options.end) {
              options.end(stack[i].tag, start, end)
            }
          }
    
          // Remove the open elements from the stack
          stack.length = pos
        }

        continue

      }

      // Start tag:
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        const tagName = startTagMatch.tagName
        const unary = startTagMatch.unarySlash
    
        const l = startTagMatch.attrs.length
        const attrs = new Array(l)

        for (let i = 0; i < l; i++) {
          const args = startTagMatch.attrs[i]
          const value = args[3] || args[4] || args[5] || ''
          attrs[i] = {
            name: args[1],
            value: value
          }
        }
    
        if (!unary) {
          stack.push({ 
            tag: tagName, 
            lowerCasedTag: tagName.toLowerCase(), 
            attrs: attrs, 
            start: startTagMatch.start, 
            end: startTagMatch.end 
          })
        }


        // TODO:
  
        if (options.start) {
          options.start(tagName, attrs, unary, startTagMatch.start, startTagMatch.end)
        }
 
        continue
      }
    }

    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }

    if (textEnd < 0) {
      text = html
    }

    if (text) {
      advance(text.length)
    }

    if (options.chars && text) {
      options.chars(text, index - text.length, index)
    }

  }

  // parseEndTag()

  function advance (n) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      advance(start[0].length)
      let end, attr

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }
}

export default parseHTML
