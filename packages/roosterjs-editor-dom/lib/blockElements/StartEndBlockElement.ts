import BlockElement from './BlockElement';
import InlineElement from '../inlineElements/InlineElement';
import isDocumentPosition from '../utils/isDocumentPosition';
import isNodeAfter from '../utils/isNodeAfter';
import resolveInlineElement from '../inlineElements/resolveInlineElement';
import { DocumentPosition } from 'roosterjs-editor-types';

/**
 * This reprents a block that is identified by a start and end node
 * This is for cases like <ced>Hello<BR>World</ced>
 * in that case, Hello<BR> is a block, World is another block
 * Such block cannot be represented by a NodeBlockElement since they don't chained up
 * to a single parent node, instead they have a start and end
 * This start and end must be in same sibling level and have same parent in DOM tree
 */
export default class StartEndBlockElement implements BlockElement {
    private firstInline: InlineElement;
    private lastInline: InlineElement;

    /**
     * Create a new instance of StartEndBlockElement class
     * @param rootNode rootNode of current scope
     * @param startNode startNode of this block element
     * @param endNode end nod of this block element
     */
    constructor(private rootNode: Node, private startNode: Node, private endNode: Node) {}

    /**
     * Gets the text content
     */
    public getTextContent(): string {
        let range = this.rootNode.ownerDocument.createRange();
        range.setStartBefore(this.startNode);
        range.setEndAfter(this.endNode);
        return range.toString();
    }

    /**
     * Get all nodes represented in a Node array
     * This only works for balanced node -- start and end is at same level
     */
    public getContentNodes(): Node[] {
        let currentNode = this.startNode;
        let allNodes: Node[] = [];
        if (currentNode.parentNode == this.endNode.parentNode) {
            // get a node array from start and end and do DIV wrapping
            while (currentNode) {
                allNodes.push(currentNode);
                if (currentNode == this.endNode) {
                    break;
                } else {
                    currentNode = currentNode.nextSibling;
                }
            }
        }

        return allNodes;
    }

    /**
     * Gets the start node
     */
    public getStartNode(): Node {
        return this.startNode;
    }

    /**
     * Gets the end node
     */
    public getEndNode(): Node {
        return this.endNode;
    }

    /**
     * Gets first inline
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            this.firstInline = resolveInlineElement(this.startNode, this);
        }

        return this.firstInline;
    }

    /**
     * Gets last inline
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = resolveInlineElement(this.endNode, this);
        }

        return this.lastInline;
    }

    /**
     * Checks equals of two blocks
     */
    public equals(blockElement: BlockElement): boolean {
        return (
            this.startNode == blockElement.getStartNode() &&
            this.endNode == blockElement.getEndNode()
        );
    }

    /**
     * Checks if this block element is after another block element
     */
    public isAfter(blockElement: BlockElement): boolean {
        return isNodeAfter(this.getStartNode(), blockElement.getEndNode());
    }

    /**
     * Checks if an inline falls inside this block element
     */
    public isInBlock(inlineElement: InlineElement): boolean {
        return this.contains(inlineElement.getContainerNode());
    }

    /**
     * Checks if an Html node is contained within the block
     */
    public contains(node: Node): boolean {
        let inBlock = node == this.startNode || node == this.endNode;
        if (!inBlock) {
            let startComparision: DocumentPosition = this.startNode.compareDocumentPosition(node);
            let endComparision: DocumentPosition = this.endNode.compareDocumentPosition(node);
            let inOrAfterStart =
                isDocumentPosition(startComparision, DocumentPosition.Following) ||
                isDocumentPosition(startComparision, DocumentPosition.ContainedBy);
            let inOrBeforeEnd =
                isDocumentPosition(endComparision, DocumentPosition.Preceding) ||
                isDocumentPosition(endComparision, DocumentPosition.ContainedBy);
            inBlock = inOrAfterStart && inOrBeforeEnd;
        }

        return inBlock;
    }
}