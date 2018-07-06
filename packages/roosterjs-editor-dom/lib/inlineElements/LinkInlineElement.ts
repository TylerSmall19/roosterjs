import NodeInlineElement from './NodeInlineElement';

// This is inline element presenting an html hyperlink
export default class LinkInlineElement extends NodeInlineElement {
    constructor(containerNode: Node) {
        super(containerNode);
    }
}
