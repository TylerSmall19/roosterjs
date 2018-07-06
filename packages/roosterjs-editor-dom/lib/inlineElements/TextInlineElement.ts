import NodeInlineElement from './NodeInlineElement';

/**
 * This refers to an inline element that represents a text node
 */
export default class TextInlineElement extends NodeInlineElement {
    constructor(containerNode: Node) {
        super(containerNode);
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    public isTextualInlineElement(): boolean {
        return true;
    }
}
