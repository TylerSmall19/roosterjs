import * as DomTestHelper from '../DomTestHelper';
import BlockElement from '../../blockElements/BlockElement';
import BodyScoper from '../../contentTraverser/BodyScoper';
import ContentTraverser from '../../contentTraverser/ContentTraverser';
import Position from '../../selection/Position';
import SelectionScoper from '../../contentTraverser/SelectionScoper';
import SelectionBlockScoper from '../../contentTraverser/SelectionBlockScoper';
import TraversingScoper from '../../contentTraverser/TraversingScoper';
import { ContentPosition, PositionType } from 'roosterjs-editor-types';

let testID = 'ContentTraverser';

describe('ContentTraverser currentBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, scoper: TraversingScoper, testBlockElement: BlockElement) {
        // Arrange
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let currentBlockElement = contentTraverser.currentBlockElement;

        // Assert
        expect(currentBlockElement.equals(testBlockElement)).toBe(true);
    }

    it('input = <p>part1</p><p>part2</p>, scoper = BodyScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let scoper = new BodyScoper(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, scoper, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, scoper, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionBlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(rootNode, range, ContentPosition.End);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, scoper, testBlockElement);
    });
});

describe('ContentTraverser getNextBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p>, no nextBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement.equals(testBlockElement)).toBe(true);
        expect(contentTraverser.currentBlockElement).toBe(nextBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement outside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = new Position(rootNode.firstChild, 0);
        let endPoint = new Position(rootNode.firstChild, PositionType.End);
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement outside startBlockElement, scoper is SelectionBlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode);
        let scoper = new SelectionBlockScoper(rootNode, range, ContentPosition.Begin);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });
});

describe('ContentTraverser getPreviousBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p>, scoper = SelectionScoper, no previousBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper, previousBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);
        contentTraverser.getNextBlockElement();
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement.equals(testBlockElement)).toBe(true);
        expect(contentTraverser.currentBlockElement).toBe(previousBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper, previousBlockElement outside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = new Position(rootNode.lastChild, 0);
        let endPoint = new Position(rootNode.lastChild, PositionType.End);

        // range = '<p>part2</p>'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });
});

describe('ContentTraverser currentInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        scoper: TraversingScoper,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = new Position(node, startOffset);
        let endPoint = new Position(node, endOffset);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let inlineElement = contentTraverser.currentInlineElement;

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, startPosition = ContentPosition.Begin', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(rootNode, range, ContentPosition.Begin);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, startPosition = ContentPosition.End', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(rootNode, range, ContentPosition.End);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, startPosition = ContentPosition.SelectionStart', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );

        // range = '<span>part2</span>'
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let scoper = new SelectionBlockScoper(rootNode, range, ContentPosition.SelectionStart);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = BodyScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let scoper = new BodyScoper(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });
});

describe('ContentTraverser getNextInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        scoper: TraversingScoper,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = new Position(node, startOffset);
        let endPoint = new Position(node, endOffset);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                nextInlineElement,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
        expect(contentTraverser.currentInlineElement).toBe(nextInlineElement);
    }

    it('input = <p>part1</p>, no nextInlineElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = new Position(rootNode.firstChild, 0);
        let endPoint = new Position(rootNode.firstChild, PositionType.End);

        // range = '<p>part1</p>'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, part nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPoint = new Position(rootNode.firstChild, 0);
        let endPoint = new Position(rootNode.lastChild.firstChild, 2);

        // range = '<span>part1</span><span>pa'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = new SelectionScoper(rootNode, range);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 2, node);
    });

    it('input = <span>part1</span><span>part2</span>, nextInlineElement in startblock, scoper = selectionBlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in startblock, scoper = selectionBlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(rootNode, range, ContentPosition.Begin);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });
});

describe('ContentTraverser getPreviousInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        scoper: TraversingScoper,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = new Position(node, startOffset);
        let endPoint = new Position(node, endOffset);
        let contentTraverser = new ContentTraverser(scoper);
        contentTraverser.getNextInlineElement();

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                previousInlineElement,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
        expect(contentTraverser.currentInlineElement).toBe(previousInlineElement);
    }

    it('input = <p>part1</p>, no previousInlineElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = new Position(rootNode.lastChild, 0);
        let endPoint = new Position(rootNode.lastChild, PositionType.End);

        // range = '<p>part2</p>'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = new SelectionScoper(rootNode, range);
        let contentTraverser = new ContentTraverser(scoper);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, part previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPoint = new Position(rootNode.firstChild.firstChild, 3);
        let endPoint = new Position(rootNode.lastChild, PositionType.End);

        // range = 't1</span><span>part2</span>'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = new SelectionScoper(rootNode, range);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 3, 5, node);
    });
});
