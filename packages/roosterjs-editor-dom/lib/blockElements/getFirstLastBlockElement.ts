import BlockElement from './BlockElement';
import getBlockElementAtNode from './getBlockElementAtNode';

export default function getFirstLastBlockElement(rootNode: Node, isFirst: boolean): BlockElement {
    let getChild = isFirst ? (node: Node) => node.firstChild : (node: Node) => node.lastChild;
    let node = getChild(rootNode);
    while (node && getChild(node)) {
        node = getChild(node);
    }

    return node ? getBlockElementAtNode(rootNode, node) : null;
}
