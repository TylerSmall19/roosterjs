import { ChangeSource, PositionType } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { fromHtml } from 'roosterjs-editor-dom';

/**
 * Apply inline style to current selection
 * @param callback The callback function to apply style
 */
export default function applyInlineStyle(editor: Editor, callback: (element: HTMLElement) => any) {
    editor.focus();
    let range = editor.getSelectionRange();
    let collapsed = range && range.collapsed;

    if (collapsed) {
        editor.addUndoSnapshot();

        // Create a new span to hold the style.
        // Some content is needed to position selection into the span
        // for here, we inject ZWS - zero width space
        let element = fromHtml('<SPAN>\u200B</SPAN>', editor.getDocument())[0] as HTMLElement;
        callback(element);
        editor.insertNode(element);

        // reset selection to be after the ZWS (rather than selecting it)
        // This is needed so that the cursor still looks blinking inside editor
        // This also means an extra ZWS will be in editor
        editor.select(element, PositionType.End);
    } else {
        editor.addUndoSnapshot(() => {
            // This is start and end node that get the style. The start and end needs to be recorded so that selection
            // can be re-applied post-applying style
            let firstNode: Node;
            let lastNode: Node;
            let contentTraverser = editor.getSelectionTraverser();

            // Just loop through all inline elements in the selection and apply style for each
            let inlineElement = contentTraverser.currentInlineElement;
            while (inlineElement) {
                // Need to obtain next inline first. Applying styles changes DOM which may mess up with the navigation
                let nextInline = contentTraverser.getNextInlineElement();
                inlineElement.applyStyle(element => {
                    callback(element as HTMLElement);
                    firstNode = firstNode || element;
                    lastNode = element;
                });

                inlineElement = nextInline;
            }

            // When selectionStartNode/EndNode is set, it means there is DOM change. Re-create the selection
            if (firstNode && lastNode) {
                editor.select(firstNode, PositionType.Before, lastNode, PositionType.After);
            }
        }, ChangeSource.Format);
    }
}
