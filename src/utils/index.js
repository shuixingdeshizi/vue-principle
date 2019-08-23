export const extend = function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

export const noop =  function noop () {}

export const warn = function (msg) {
  console.log(`[warn]: ${msg}`)
}

export const makeMap = function makeMap (str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

export const isBuiltInTag = makeMap('slot,component', true)

export function cached (fn) {
  const cache = Object.create(null)
  return (function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

export const no = (a, b, c) => false;