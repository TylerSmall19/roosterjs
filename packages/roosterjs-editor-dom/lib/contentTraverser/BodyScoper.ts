import BlockElement from '../blockElements/BlockElement';
import InlineElement from '../inlineElements/InlineElement';
import TraversingScoper from './TraversingScoper';
import contains from '../utils/contains';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getFirstLastBlockElement from '../blockElements/getFirstLastBlockElement';
import resolveInlineElement from '../inlineElements/resolveInlineElement';
import { getFirstLeafNode } from '../domWalker/getLeafNode';

/**
 * provides scoper for traversing the entire editor body starting from the beginning
 */
class BodyScoper implements TraversingScoper {
    /**
     * Construct a new instance of BodyScoper class
     * @param rootNode Root node of the body
     */
    constructor(public rootNode: Node) {}

    /**
     * Get the start block element
     */
    public getStartBlockElement(): BlockElement {
        return getFirstLastBlockElement(this.rootNode, true /*isFirst*/);
    }

    /**
     * Get the start inline element
     */
    public getStartInlineElement(): InlineElement {
        let node = getFirstLeafNode(this.rootNode);
        if (node) {
            let block = getBlockElementAtNode(this.rootNode, node);
            return resolveInlineElement(node, block);
        }
        return null;
    }

    /**
     * Since the scope is global, all blocks under the root node are in scope
     */
    public isBlockInScope(blockElement: BlockElement): boolean {
        return contains(this.rootNode, blockElement.getStartNode());
    }

    /**
     * Since we're at body scope, inline elements never need to be trimmed
     */
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        return inlineElement;
    }
}

export default BodyScoper;
