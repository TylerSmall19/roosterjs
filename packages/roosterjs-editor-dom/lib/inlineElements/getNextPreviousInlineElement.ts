import InlineElement from './InlineElement';
import PartialInlineElement from './PartialInlineElement';
import resolveInlineElement from './resolveInlineElement';
import { getLeafSibling } from '../domWalker/getLeafSibling';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';

export default function getNextPreviousInlineElement(
    rootNode: Node,
    current: InlineElement,
    isNext: boolean
): InlineElement {
    let result: InlineElement;

    if (current instanceof PartialInlineElement) {
        result = current.getNextInlineElement();
    }
    if (!result && current) {
        // Get a leaf node after startNode and use that base to find next inline
        let node = current.getContainerNode();
        node = getLeafSibling(rootNode, node, isNext);
        return resolveInlineElement(node, getBlockElementAtNode(rootNode, node));
    }

    return result
}
