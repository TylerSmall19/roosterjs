import InlineElement from './InlineElement';
import Position from '../selection/Position';

/**
 * Represents an empty InlineElement.
 * This is used for ContentTraverser internally only.
 * An empty InlineElement means current position is at the end of a tag so nothing is included inside this element
 */
export default class EmptyInlineElement implements InlineElement {
    constructor(private position: Position) {}

    /**
     * Get the text content of this inline element
     */
    getTextContent(): string {
        return '';
    }

    /**
     * Get the container node of this inline element
     */
    getContainerNode(): Node {
        return this.position.node;
    }

    /**
     * Get the start position of this inline element
     */
    getStartPosition(): Position {
        return this.position;
    }

    /**
     * Get the end position of this inline element
     */
    getEndPosition(): Position {
        return this.position;
    }

    /**
     * Checks if the given inline element is after this inline element
     */
    isAfter(inlineElement: InlineElement): boolean {
        return this.position.isAfter(inlineElement.getEndPosition());
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    isTextualInlineElement(): boolean {
        return false;
    }

    /**
     * Checks if the given editor position is contained in this inline element
     */
    contains(position: Position): boolean {
        return false;
    }

    /**
     * Apply inline style to a region of an inline element.
     */
    applyStyle(
        styler: (node: Node) => void,
        from?: Position,
        to?: Position
    ): void {}
}
