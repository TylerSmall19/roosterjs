import BlockElement from '../blockElements/BlockElement';
import ImageInlineElement from './ImageInlineElement';
import InlineElement from './InlineElement';
import LinkInlineElement from './LinkInlineElement';
import NodeInlineElement from './NodeInlineElement';
import TextInlineElement from './TextInlineElement';
import getTagOfNode from '../utils/getTagOfNode';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Resolve an inline element by a leaf node
 * @param node The node to resolve from
 * @param parentBlock The parent block element
 */
export default function resolveInlineElement(
    node: Node,
    parentBlock: BlockElement
): InlineElement {
    if (!node || !parentBlock) {
        return null;
    }
    let nodeChain = [node];
    for (
        let parent = node.parentNode;
        parent && parentBlock.contains(parent);
        parent = parent.parentNode
    ) {
        nodeChain.push(parent);
    }

    let inlineElement: InlineElement;

    for (let i = nodeChain.length - 1; i >= 0 && !inlineElement; i--) {
        let currentNode = nodeChain[i];
        let tag = getTagOfNode(currentNode);
        if (tag == 'A') {
            inlineElement = new LinkInlineElement(currentNode);
        } else if (tag == 'IMG') {
            inlineElement = new ImageInlineElement(currentNode);
        } else if (currentNode.nodeType == NodeType.Text) {
            inlineElement = new TextInlineElement(currentNode);
        }
    }

    return inlineElement || new NodeInlineElement(node);
}
