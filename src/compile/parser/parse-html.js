import createParseHTML from './create-parse-html'

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

function parseHTML (html) {

  const stack = []
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false

  createParseHTML(html, {
    start (tag, attrs, unary, start, end) {

      let element = createASTElement(tag, attrs, currentParent)


      if (!element.processed) {
        processFor(element)
        processIf(element)
      }

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
      if (!currentParent) {
        return
      }
      var children = currentParent.children;

      if (text) {
        var res;
        var child;
        if (res = parseText(text, delimiters)) {
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
  })
  return root
}

function createASTElement (tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: []
  }
}


function getAndRemoveAttr (el, name, removeFromMap) {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  return val
}

function makeAttrsMap (attrs) {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

function closeElement (element) {

}


function processFor (el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      extend(el, res)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `Invalid v-for expression: ${exp}`,
        el.rawAttrsMap['v-for']
      )
    }
  }
}

function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    el.if = exp
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif
    }
  }
}

function parseText (text) {

  var tokens = [];
  var rawTokens = [];
  var lastIndex = defaultTagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = defaultTagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
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
  }
}

export default parseHTML