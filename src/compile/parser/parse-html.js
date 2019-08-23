const ncname = '[a-zA-Z_][\\w]*'

const qnamcCapture = '(' + ncname + ')'

const startTagOpen = new RegExp('^<' + qnamcCapture)

const startTagClose = new RegExp('^\s*(\/?)>')

const endTag = new RegExp('^<\/' + qnamcCapture + '>')

const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
  /"([^"]*)"+/.source,
  /'([^']*)'+/.source,
  /([^\s"'=<>`]+)/.source
]
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)



var index = 0
const stack = []
var html
var currentParent
var root

function parseHTML (template) {
  html = template
  while (html) {
    var textEnd = html.indexOf('<')

    if (textEnd === 0) {
      // 匹配开始标签
      if (html.match(startTagOpen)) {
        const startTagMatch = parseStartTag()
  
        if (startTagMatch) {
          const element = {
            type: 1,
            tag: startTagMatch.tagName,
            lowerCasedtag: startTagMatch.tagName.toLowerCase(),
            parent: currentParent,
            children: [],
            attrsList: startTagMatch.attrs
          }
  
          if (!root) {
            root = element
          }
  
          if (currentParent) {
            currentParent.children.push(element)
          }
  
          stack.push(element)
          currentParent = element
          continue
        
        }
      }
  
      // 匹配结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        parseEndTag(endTagMatch)
        continue
      }
    } else {
      var text = html.substring(0, textEnd)
      advance(text.length)
      currentParent.children.push({
        type: 3,
        text
      })
      continue
    }
  }
  return root
}


function advance (n) {
  index += n
  html = html.substring(n)
}

/**
 * 匹配开始标签
 * @param {*} html 
 */
function parseStartTag () {

  const start = html.match(startTagOpen)

  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
      start: index,
      end: ''
    }
    advance(start[0].length)

    let end, attr
    
    while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      advance(attr[0].length)
      match.attrs.push({
        name: attr[1],
        value: attr[3]
      })
    }

    if (end) {
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}

function parseEndTag (tagName) {
  var pos 

  for (pos = stack.length - 1; pos >=0; pos--) {
    if (stack[pos].lowerCasedtag === tagName[1].toLowerCase()) {
      break
    }
  }

  if (pos >= 0) {
    stack.length = pos
    currentParent = stack[pos - 1]
  }
}


export default parseHTML