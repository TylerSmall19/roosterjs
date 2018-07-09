import InlineElement from './InlineElement';
import Position from '../selection/Position';
import contains from '../utils/contains';
import getTagOfNode from '../utils/getTagOfNode';
import isDocumentPosition from '../utils/isDocumentPosition';
import isNodeAfter from '../utils/isNodeAfter';
import wrap from '../utils/wrap';
import {
    DocumentPosition,
    NodeType,
    PositionType,
} from 'roosterjs-editor-types';
import { getNextLeafSibling, getPreviousLeafSibling } from '../domWalker/getLeafSibling';

/**
 * This presents an inline element that can be reprented by a single html node.
 * This serves as base for most inline element as it contains most implentation
 * of all operations that can happen on an inline element. Other sub inline elements mostly
 * just identify themself for a certain type
 */
class NodeInlineElement implements InlineElement {
    constructor(private containerNode: Node) {}

    /**
     * The text content for this inline element
     */
    public getTextContent(): string {
        // nodeValue is better way to retrieve content for a text. Others, just use textContent
        return this.containerNode.nodeType == NodeType.Text
            ? this.containerNode.nodeValue
            : this.containerNode.textContent;
    }

    /**
     * Get the container node
     */
    public getContainerNode(): Node {
        return this.containerNode;
    }

    /**
     * Get the start position of the inline element
     */
    public getStartPosition(): Position {
        // For a position, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        let firstChild = this.containerNode;
        while (firstChild.firstChild) {
            firstChild = firstChild.firstChild;
        }

        return new Position(firstChild, 0);
    }

    /**
     * Get the end position of the inline element
     */
    public getEndPosition(): Position {
        // For a position, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        let lastChild = this.containerNode;
        while (lastChild.lastChild) {
            lastChild = lastChild.lastChild;
        }
        return new Position(lastChild, PositionType.End);
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    public isTextualInlineElement(): boolean {
        return false;
    }

    /**
     * Checks if an inline element is after the current inline element
     */
    public isAfter(inlineElement: InlineElement): boolean {
        return inlineElement && isNodeAfter(this.containerNode, inlineElement.getContainerNode());
    }

    /**
     * Checks if an editor point is contained in the inline element
     */
    public contains(position: Position): boolean {
        let start = this.getStartPosition();
        let end = this.getEndPosition();
        return (
            position.isAfter(start) && end.isAfter(position)
        );
    }

    /**
     * Apply inline style to an inline element
     */
    public applyStyle(
        styler: (node: Node) => void,
        from?: Position,
        to?: Position
    ): void {
        let ownerDoc = this.containerNode.ownerDocument;

        let startNode: Node = null;
        let endNode: Node = null;
        let startOffset = 0;
        let endOffset = PositionType.End;

        // Adjust the start point
        if (from) {
            startNode = from.node;
            startOffset = from.offset;
            if (
                (startNode.nodeType == NodeType.Text &&
                    startOffset == startNode.nodeValue.length) ||
                (startNode.nodeType == NodeType.Element && startOffset == PositionType.End)
            ) {
                // The point is at the end of container element
                startNode = getNextLeafSibling(this.containerNode, startNode);
                startOffset = 0;
            }
        } else {
            startNode = this.containerNode;
            while (startNode.firstChild) {
                startNode = startNode.firstChild;
                startOffset = 0;
            }
        }

        // Adjust the end point
        if (to) {
            endNode = to.node;
            endOffset = to.offset;

            if (endOffset == 0) {
                // The point is at the begin of container element, use previous leaf
                // Set endOffset to end of node
                endNode = getPreviousLeafSibling(this.containerNode, endNode);
                endOffset =
                    endNode && endNode.nodeType == NodeType.Text
                        ? endNode.nodeValue.length
                        : PositionType.End;
            }
        } else {
            endNode = this.containerNode;
            while (endNode.lastChild) {
                endNode = endNode.lastChild;
            }

            endOffset =
                endNode && endNode.nodeType == NodeType.Text
                    ? endNode.nodeValue.length
                    : PositionType.End;
        }

        if (!startNode || !endNode) {
            // we need a valid start and end node, if either one is null, we will just exit
            // this isn't an error, it just tells the fact we don't see a good node to apply a style
            return;
        }

        while (contains(this.containerNode, startNode, true /*treatSameNodeAsContain*/)) {
            // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
            let nextLeafNode = getNextLeafSibling(this.containerNode, startNode);

            let withinRange =
                startNode == endNode ||
                isDocumentPosition(
                    startNode.compareDocumentPosition(endNode),
                    DocumentPosition.Following
                );
            if (!withinRange) {
                break;
            }

            // Apply the style
            // If a node has only white space and new line and is in table, we ignore it,
            // otherwise the table will be distorted
            if (
                startNode.nodeType == NodeType.Text &&
                startNode.nodeValue &&
                !(startNode.nodeValue.trim() == '' && getTagOfNode(startNode.parentNode) == 'TR')
            ) {
                let adjustedEndOffset =
                    startNode == endNode ? endOffset : startNode.nodeValue.length;
                if (adjustedEndOffset > startOffset) {
                    let len = adjustedEndOffset - startOffset;
                    let parentNode = startNode.parentNode;
                    if (
                        getTagOfNode(parentNode) == 'SPAN' &&
                        parentNode.textContent.length == len
                    ) {
                        // If the element is in a span and this element is everything of the parent
                        // apply the style on parent span
                        styler(parentNode);
                    } else if (len == startNode.nodeValue.length) {
                        // It is whole text node
                        styler(wrap(startNode, 'span'));
                    } else {
                        // It is partial of a text node
                        let newNode = ownerDoc.createElement('SPAN');
                        newNode.textContent = startNode.nodeValue.substring(
                            startOffset,
                            adjustedEndOffset
                        );

                        let range = ownerDoc.createRange();
                        range.setStart(startNode, startOffset);
                        range.setEnd(startNode, adjustedEndOffset);
                        range.deleteContents();
                        range.insertNode(newNode);
                        styler(newNode);
                    }
                }
            }

            startNode = nextLeafNode;
            startOffset = 0;
        }
    }
}

export default NodeInlineElement;
