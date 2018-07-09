import NodeBlockElement from '../blockElements/NodeBlockElement';
import InlineElement from '../inlineElements/InlineElement';
import Position from '../selection/Position';
import StartEndBlockElement from '../blockElements/StartEndBlockElement';
import resolveInlineElement from '../inlineElements/resolveInlineElement';

// Create element with content and id and insert the element in the DOM
export function createElementFromContent(id: string, content: string): HTMLElement {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);
    node.innerHTML = content;

    return node;
}

// Remove the element with id from the DOM
export function removeElement(id: string) {
    let node = document.getElementById(id);
    if (node) {
        node.parentNode.removeChild(node);
    }
}

// Run test for the method with one parameter
export function runTestMethod1(input: any, output: any, testMethod: (input: any) => any) {
    // Act
    let result = testMethod(input);

    // Assert
    expect(result).toBe(output);
}

// Run test for the method with two parameters
export function runTestMethod2(
    input: [any, any],
    output: any,
    testMethod: (input1: any, input2: any) => any
) {
    // Act
    let result = testMethod(input[0], input[1]);

    // Assert
    expect(result).toBe(output);
}

// Check inlineElement equality based on startPoint, endPoint and textContent
export function isInlineElementEqual(
    element: InlineElement,
    startPoint: Position,
    endPoint: Position,
    textContent: string
): boolean {
    return (
        element.getStartPosition().equalTo(startPoint) &&
        element.getEndPosition().equalTo(endPoint) &&
        element.getTextContent() == textContent
    );
}

// Check if two editor points are equal
export function isEditorPointEqual(point1: Position, point2: Position): boolean {
    return point1.node.isEqualNode(point2.node) && point1.offset == point2.offset;
}

// Create NodeBlockElement from given HTMLElement
export function createNodeBlockElementWithDiv(testDiv: HTMLElement): NodeBlockElement {
    let nodeBlockElement = new NodeBlockElement(testDiv);
    return nodeBlockElement;
}

// Create StartEndBlockElement with start and end nodes
export function createStartEndBlockElementWithStartEndNode(
    rootNode: HTMLElement,
    startNode: Node,
    endNode: Node
): StartEndBlockElement {
    let startEndBlockElement = new StartEndBlockElement(rootNode, startNode, endNode);
    return startEndBlockElement;
}

// Create inlineElement from node
export function createInlineElementFromNode(node: Node, rootNode: Node): InlineElement {
    let parentBlock = new NodeBlockElement(node);
    let inlineElement = resolveInlineElement(node, parentBlock);
    return inlineElement;
}

// Create range from child nodes of given node
export function createRangeFromChildNodes(node: Node): Range {
    let selectionRange = new Range();
    selectionRange.setStartBefore(node.firstChild);
    selectionRange.setEndAfter(node.lastChild);
    return selectionRange;
}

// Create range from start and end point
export function createRangeWithStartEndNode(startPoint: Position, endPoint: Position): Range {
    let selectionRange = new Range();
    selectionRange.setStart(startPoint.node, startPoint.offset);
    selectionRange.setEnd(endPoint.node, endPoint.offset);
    return selectionRange;
}

// Create range from given HTMLElement
export function createRangeWithDiv(testDiv: HTMLElement): Range {
    let selectionRange = new Range();
    selectionRange.setStartBefore(testDiv);
    selectionRange.setEndAfter(testDiv);
    return selectionRange;
}
