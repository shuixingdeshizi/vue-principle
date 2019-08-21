class VNode {
  constructor (tag, data, children, text, elm) {
      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
  }
}

function createEmptyVNode () {
  const node = new VNode();
  node.text = '';
  return node;
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

function cloneVNode (node) {
  const cloneVnode = new VNode(
      node.tag,
      node.data,
      node.children,
      node.text,
      node.elm
  );
  
  return cloneVnode;
}

function createElement (
  context,
  tag,
  data,
  children
) {

  var vnode
  if (typeof tag === 'string') {

      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
  } else {
    // direct component options / constructor
    // vnode = createComponent(tag, data, context, children);
  }
  return vnode
}


export default VNode

export {
  createEmptyVNode,
  createTextVNode,
  cloneVNode,
  createElement
}