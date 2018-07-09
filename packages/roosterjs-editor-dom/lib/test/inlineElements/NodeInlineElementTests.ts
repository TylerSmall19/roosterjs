import * as DomTestHelper from '../DomTestHelper';
import NodeBlockElement from '../../blockElements/NodeBlockElement';
import NodeInlineElement from '../../inlineElements/NodeInlineElement';
import InlineElement from '../../inlineElements/InlineElement';
import PartialInlineElement from '../../inlineElements/PartialInlineElement';
import Position from '../../selection/Position';
import TextInlineElement from '../../inlineElements/TextInlineElement';
import resolveInlineElement from '../../inlineElements/resolveInlineElement';
import { PositionType } from 'roosterjs-editor-types';

let testID = 'NodeInlineElement';

function createNodeInlineElement(inlineElementContent: string): InlineElement {
    let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
    let parentBlock = new NodeBlockElement(testDiv);
    let inlineElement = resolveInlineElement(testDiv.firstChild, parentBlock);

    return inlineElement;
}

describe('NodeInlineElement getTextContent()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span><span>hello</span>www.example.com</span>', () => {
        // Arrange
        let element = createNodeInlineElement('<span><span>hello</span>www.example.com</span>');

        // Act
        let textContent = element.getTextContent();

        // Assert
        expect(textContent).toBe('hellowww.example.com');
    });

    it('input = <a>www.example.com</a>', () => {
        // Arrange
        let element = createNodeInlineElement('<a>www.example.com</a>');

        // Act
        let textContent = element.getTextContent();

        // Assert
        expect(textContent).toBe('www.example.com');
    });

    it('input = <img>', () => {
        // Arrange
        let element = createNodeInlineElement('<img>');

        // Act
        let textContent = element.getTextContent();

        // Assert
        expect(textContent).toBe('');
    });
});

describe('NodeInlineElement getStartPosition()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let element = createNodeInlineElement('<span>www.example.com</span>');

        // Act
        let startPoint = element.getStartPosition();

        // Assert
        expect(startPoint.node.textContent).toBe('www.example.com');
        expect(startPoint.offset).toBe(0);
    });

    it('input = <span><a><span>part1</span>text</a>text<span>part2</span>part3</span>', () => {
        // Arrange
        let element = createNodeInlineElement(
            '<span><a><span>part1</span>text</a>text<span>part2</span>part3</span>'
        );

        // Act
        let startPoint = element.getStartPosition();

        // Assert
        expect(startPoint.node.textContent).toBe('part1');
        expect(startPoint.offset).toBe(0);
    });
});

describe('NodeInlineElement getEndPosition()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let element = createNodeInlineElement('<span>www.example.com</span>');

        // Act
        let endPoint = element.getEndPosition();

        // Assert
        expect(endPoint.node.textContent).toBe('www.example.com');
        expect(endPoint.offset).toBe(15);
    });

    it('input = <span>part1<span>part2</span><a><span>part3</span></a></span>', () => {
        // Arrange
        let element = createNodeInlineElement(
            '<span>part1<span>part2</span><a><span>part3</span></a></span>'
        );

        // Act
        let endPoint = element.getEndPosition();

        // Assert
        expect(endPoint.node.textContent).toBe('part3');
        expect(endPoint.offset).toBe(5);
    });

    it('input = <img>', () => {
        // Arrange
        let element = createNodeInlineElement('<img>');

        // Act
        let endPoint = element.getEndPosition();

        // Assert
        expect(endPoint.node.textContent).toBe('');
        expect(endPoint.isAtEnd).toBeTruthy();
    });
});

describe('NodeInlineElement isAfter()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('element2 is after element1, both elements are in same BlockElement', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>node1</span><span>text</span><span>node2</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element1 = resolveInlineElement(testDiv.firstChild, parentBlock);
        let element2 = resolveInlineElement(testDiv.lastChild, parentBlock);

        // Act
        let isElement2AfterElement1 = element2.isAfter(element1);
        let isElement1AfterElement2 = element1.isAfter(element2);

        // Assert
        expect(isElement2AfterElement1).toBe(true);
        expect(isElement1AfterElement2).toBe(false);
    });

    it('element2 is after element1, and each element is in differnt BlockElement', () => {
        // Arrange
        let div = DomTestHelper.createElementFromContent(testID, '');
        let testDiv1 = DomTestHelper.createElementFromContent(
            'testDiv1',
            '<span>node1</span><span>text</span>'
        );
        let testDiv2 = DomTestHelper.createElementFromContent('testDiv2', '<span>node2</span>');
        div.appendChild(testDiv2);
        div.insertBefore(testDiv1, testDiv2);
        let parentBlock1 = new NodeBlockElement(testDiv1);
        let parentBlock2 = new NodeBlockElement(testDiv2);
        let element1 = resolveInlineElement(testDiv1.firstChild, parentBlock1);
        let element2 = resolveInlineElement(testDiv2.firstChild, parentBlock2);

        // Act
        let isElement2AfterElement1 = element2.isAfter(element1);
        let isElement1AfterElement2 = element1.isAfter(element2);

        // Assert
        expect(isElement2AfterElement1).toBe(true);
        expect(isElement1AfterElement2).toBe(false);
    });
});

describe('NodeInlineElement contains()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('element contains editorPoint', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span><a><span>part1</span>text</a>text<span>part2</span>part3</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild, parentBlock);
        let editorPoint = new Position(testDiv.firstChild.lastChild, PositionType.End);

        // Act
        let elementContainsEditorPoint = element.contains(editorPoint);

        // Assert
        expect(elementContainsEditorPoint).toBe(true);
    });

    it('element does not contain editorPoint', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span><a><span>part1</span>text</a>text<span>part2</span>part3</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild.firstChild, parentBlock);
        let editorPoint = new Position(testDiv.firstChild.lastChild, PositionType.End);

        // Act
        let elementContainsEditorPoint = element.contains(editorPoint);

        // Assert
        expect(elementContainsEditorPoint).toBe(false);
    });
});

describe('NodeInlineElement applyStyle()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function getInnerHTML(element: InlineElement): string {
        let htmlElement = element.getContainerNode() as HTMLElement;
        let wrapper = document.createElement('div');
        wrapper.appendChild(htmlElement);
        return wrapper.innerHTML;
    }

    it('fromPoint = null, toPoint = null', () => {
        // Arrange
        let element = createNodeInlineElement('<span>www.example.com</span>');
        let mockColor = 'red';

        // Act
        element.applyStyle(function(node: HTMLElement) {
            node.style.color = mockColor;
        });

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span style="color: red;">www.example.com</span>');
    });

    it('fromPoint != null, toPoint != null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild, parentBlock);
        let fromPoint = new Position(testDiv.firstChild.firstChild, 3);
        let toPoint = new Position(testDiv.firstChild.lastChild, 11);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPoint,
            toPoint
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www<span style="color: red;">.example</span>.com</span>');
    });

    it('fromPoint != null, toPoint = null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild, parentBlock);
        let fromPoint = new Position(testDiv.firstChild.firstChild, 3);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPoint,
            null /*toPoint*/
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www<span style="color: red;">.example.com</span></span>');
    });

    it('fromPoint = null, toPoint != null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild, parentBlock);
        let toPoint = new Position(testDiv.firstChild.firstChild, 11);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            null /*fromPoint*/,
            toPoint
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span><span style="color: red;">www.example</span>.com</span>');
    });

    it('fromPoint != null, toPoint != null, fromPoint = toPoint', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild, parentBlock);
        let fromPoint = new Position(testDiv.firstChild.firstChild, 3);
        let toPoint = new Position(testDiv.firstChild.firstChild, 3);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPoint,
            toPoint
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www.example.com</span>');
    });

    it('fromPoint != null, toPoint != null, fromPoint is after toPoint', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = resolveInlineElement(testDiv.firstChild, parentBlock);
        let fromPoint = new Position(testDiv.firstChild.firstChild, 4);
        let toPoint = new Position(testDiv.firstChild.firstChild, 3);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPoint,
            toPoint
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www.example.com</span>');
    });
});

describe('isTextualInlineElement()', () => {
    it('input = <TextInlineElement>', () => {
        runTest(new TextInlineElement(null), true);
    });

    it('input = <PartialInlineElement>{}', () => {
        runTest(new PartialInlineElement(new NodeInlineElement(null)), false);
    });

    it('input = PartialInlineElement with TextInlineElement as decoratedInline', () => {
        let mockInlineElement = new PartialInlineElement(new TextInlineElement(null));
        runTest(mockInlineElement, true);
    });

    function runTest(input: InlineElement, output: boolean) {
        let result = input.isTextualInlineElement();
        expect(result).toBe(output);
    }
});
