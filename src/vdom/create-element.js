/* @flow */

import VNode from './vnode'

const ALWAYS_NORMALIZE = 2

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (context, tag, data, children) {
  return _createElement(context, tag, data, children)
}

function _createElement (context, tag, data, children) {
  let vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  return vnode
}

export default createElement