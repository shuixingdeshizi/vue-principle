import VNode from './vnode'

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

export default createTextVNode