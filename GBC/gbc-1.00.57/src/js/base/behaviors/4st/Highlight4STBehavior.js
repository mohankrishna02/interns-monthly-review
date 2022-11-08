/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('Highlight4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class Highlight4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.Highlight4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.Highlight4STBehavior.prototype */ {
        __name: "Highlight4STBehavior",

        usedStyleAttributes: ["highlightColor", "highlightCurrentCell", "highlightCurrentRow", "highlightTextColor"],
        watchedAttributes: {
          anchor: ['dialogType', 'focusOnField', 'currentRow'],
          parent: ['active']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var anchorNode = controller.getAnchorNode();

          if (widget && widget.updateHighlight) {

            // -- TABLE & SCROLLGRID WIDGET -------------------------------------------------
            // In DISPLAY ARRAY without FOCUSONFIELD
            //   highlightCurrentRow is enable by default (yes) but can be explicitly set to yes or no.
            //   highlightCurrentCell is ignored.
            // In DISPLAY ARRAY with FOCUSONFIELD
            //   highlightCurrentRow is disable by default (no) but can be explicitly set to yes or no.
            //   highlightCurrentCell is enable by default (yes) but can be explicitly set to yes or no.
            // In INPUT ARRAY
            //   highlightCurrentRow is disable by default (no) but can be explicitly set to yes or no.
            //   highlightCurrentCell is disable by default (no) but can be explicitly set to yes or no.
            // ---------------------------------------------------
            // -- LISTVIEW WIDGET -------------------------------------------------
            // In DISPLAY ARRAY
            //   highlightCurrentRow is disable by default (no) but can be explicitly set to yes or no.
            //   highlightCurrentCell is ignored
            // FOCUSONFIELD, INPUT ARRAY --> not managed
            // ---------------------------------------------------

            var highlightColorAttr = anchorNode.getStyleAttribute("highlightColor");
            var highlightCurrentCellAttr = anchorNode.getStyleAttribute("highlightCurrentCell");
            var highlightCurrentRowAttr = anchorNode.getStyleAttribute("highlightCurrentRow");
            var highlightTextColorAttr = anchorNode.getStyleAttribute("highlightTextColor");
            var dialogType = anchorNode.attribute("dialogType");

            if (!dialogType) { // in case of scrollgrid use the dialogType of first Matrix
              var node = anchorNode.findNodeWithAttribute(null, "dialogType");
              dialogType = node ? node.attribute("dialogType") : "DisplayArray";
            }

            var isDisplayArray = (dialogType === "DisplayArray");
            var isInputArray = (dialogType === "InputArray");
            var hasFocusOnField = false;
            if (anchorNode.getTag() === 'Table') {
              hasFocusOnField = anchorNode.attribute('focusOnField') === 1;
            } else {
              var matrix = anchorNode.findNodeWithAttribute('Matrix', 'currentRow', -1);
              hasFocusOnField = matrix && anchorNode.attribute('active') === 1;
            }
            var isListView = controller.isListView ? controller.isListView() : false;

            // Defines the highlight color of row
            widget.setHighlightColor(highlightColorAttr);

            // Defines the highlighted text color of row
            widget.setHighlightTextColor(highlightTextColorAttr);

            // set default values
            var highlightCurrentRow = false;
            var highlightCurrentCell = false;
            if (isDisplayArray) {
              if (hasFocusOnField) {
                highlightCurrentRow = false;
                highlightCurrentCell = true;
              } else {
                if (isListView) {
                  highlightCurrentRow = false;
                } else {
                  highlightCurrentRow = true;
                  highlightCurrentCell = highlightCurrentRow;

                }
              }
            } else if (isInputArray) {
              highlightCurrentRow = false;
              highlightCurrentCell = false;
            }

            // set 4ST values
            if (highlightCurrentRowAttr !== null) {
              highlightCurrentRow = this.isSAYesLike(highlightCurrentRowAttr);
            }
            if (highlightCurrentCellAttr !== null) {
              highlightCurrentCell = this.isSAYesLike(highlightCurrentCellAttr);
            }

            if (isDisplayArray && !hasFocusOnField) {
              highlightCurrentCell = highlightCurrentRow; // highlight cell should be equal at highlight row in this case
            }

            widget.setHighlightCurrentRow(highlightCurrentRow);

            if (widget.setHighlightCurrentCell) { // not implement for listview
              widget.setHighlightCurrentCell(highlightCurrentCell);
            }

            widget.updateHighlight();
          }
        }
      };
    });
  });
