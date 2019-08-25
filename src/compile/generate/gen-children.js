import genNode from './gen-node'

function genChildren (el) { 
  const children = el.children;
  if (children && children.length > 0) {
    return `${children.map(genNode).join(',')}`;
  }
}

export default genChildren