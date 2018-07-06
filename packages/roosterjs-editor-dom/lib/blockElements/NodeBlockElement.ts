import BlockElement from './BlockElement';
import InlineElement from '../inlineElements/InlineElement';
import isDocumentPosition from '../utils/isDocumentPosition';
import isNodeAfter from '../utils/isNodeAfter';
import resolveInlineElement from '../inlineElements/resolveInlineElement';
import { DocumentPosition } from 'roosterjs-editor-types';
import { getFirstLeafNode, getLastLeafNode } from '../domWalker/getLeafNode';

/**
 * This presents a content block that can be reprented by a single html block type element.
 * In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
 */
export default class NodeBlockElement implements BlockElement {
    private firstInline: InlineElement;
    private lastInline: InlineElement;

    constructor(private containerNode: Node) {}

    /**
     * Get the text content in the block
     */
    public getTextContent(): string {
        return this.containerNode.textContent;
    }

    /**
     * Get the start node of the block
     * For NodeBlockElement, start and end essentially refers to same node
     */
    public getStartNode(): Node {
        return this.containerNode;
    }

    /**
     * Get the end node of the block
     * For NodeBlockElement, start and end essentially refers to same node
     */
    public getEndNode(): Node {
        return this.containerNode;
    }

    /**
     * Get all nodes represented in a Node array
     */
    public getContentNodes(): Node[] {
        return [this.containerNode];
    }

    /**
     * Get the first inline element in the block
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            let node = getFirstLeafNode(this.containerNode);
            this.firstInline = node && resolveInlineElement(node, this);
        }

        return this.firstInline;
    }

    /**
     * Get the last inline element in the block
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            let node = getLastLeafNode(this.containerNode);
            this.lastInline = node && resolveInlineElement(node, this);
        }

        return this.lastInline;
    }

    /**
     * Checks if it refers to same block
     */
    public equals(blockElement: BlockElement): boolean {
        // Ideally there is only one unique way to generate a block so we only need to compare the startNode
        return this.containerNode == blockElement.getStartNode();
    }

    /**
     * Checks if a block is after the current block
     */
    public isAfter(blockElement: BlockElement): boolean {
        // if the block's startNode is after current node endEnd, we say it is after
        return isNodeAfter(this.containerNode, blockElement.getEndNode());
    }

    /**
     * Checks if an inline element falls within the block
     */
    public isInBlock(inlineElement: InlineElement): boolean {
        return this.contains(inlineElement.getContainerNode());
    }

    /**
     * Checks if a certain html node is within the block
     */
    public contains(node: Node): boolean {
        // if it is same node or it is being contained, we say it is contained.
        let documentPosition = this.containerNode.compareDocumentPosition(node) as DocumentPosition;
        return (
            documentPosition == DocumentPosition.Same ||
            isDocumentPosition(documentPosition, DocumentPosition.ContainedBy)
        );
    }
}
