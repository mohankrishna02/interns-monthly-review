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

modulum('MatrixCurrentRowVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class MatrixCurrentRowVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.MatrixCurrentRowVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.MatrixCurrentRowVMBehavior.prototype */ {
        __name: "MatrixCurrentRowVMBehavior",

        watchedAttributes: {
          container: ['currentRow', 'offset', 'size'],
          ui: ['focus']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var bindings = controller.getNodeBindings();
          var matrixNode = bindings.container;
          var app = matrixNode.getApplication();
          if (widget && !app.typeahead.hasPendingNavigationCommands()) {
            var uiNode = app.uiNode();
            var currentRow = matrixNode.attribute("currentRow");
            var offset = matrixNode.attribute("offset");
            var size = matrixNode.attribute("size");
            var hasFocus = matrixNode.getId() === uiNode.attribute("focus");

            var addCurrentRowOnField = currentRow !== -1 && (currentRow < size && currentRow - offset === bindings.anchor.getIndex());

            var newCurrentRow = -1;
            // case of scrollgrid
            var matrixParent = matrixNode.getParentNode();
            var matrixParentWidget = matrixParent && matrixParent.getController() && matrixParent.getController().getWidget();
            while (matrixParent && matrixParentWidget && !matrixParentWidget.setCurrentRow) {
              matrixParent = matrixParent.getParentNode();
              matrixParentWidget = matrixParent && matrixParent.getController() && matrixParent.getController().getWidget();
            }

            if (matrixParentWidget && matrixParentWidget.setCurrentRow) {

              // if one matrix in scrollgrid has a currentRow equal to -1 --> focusOnField activated
              if (currentRow === -1 && matrixParent.attribute("active") === 1) {
                matrixParentWidget.setFocusOnField(true);
              }

              // scrollgrid
              var scrollGridCurrentRow = matrixParent.attribute('currentRow');
              var scrollGridOffset = matrixParent.attribute('offset');

              newCurrentRow = scrollGridCurrentRow - scrollGridOffset;
              matrixParentWidget.setCurrentRow(newCurrentRow);

              var isDisplayArray = (matrixNode.attribute("dialogType") === "DisplayArray");

              // add currentRow class on all filed in display array
              // add currentRow only on current matrix in input array
              // --> to simulate highlightCurrentCell style
              addCurrentRowOnField = addCurrentRowOnField && matrixParentWidget.isHighlightCurrentCell() && (isDisplayArray ||
                hasFocus);
            } else {
              // synchronize processed currentRow with VM currentRow
              if (matrixNode.getController().updateAllSiblingMatrixCurrentRow) {
                newCurrentRow = currentRow - offset;
                matrixNode.getController().updateAllSiblingMatrixCurrentRow(newCurrentRow);

              }
            }

            widget.toggleClass("currentRow", addCurrentRowOnField);

            var parentForm = matrixNode.getAncestor("Form");
            var visibleId = null;
            if (parentForm) {
              visibleId = parentForm.attribute("visibleId");
            }
            // if matrix has vm focus and no visibleId is set on its parent form, then we display it
            if (hasFocus && (!visibleId || visibleId === -1)) {
              controller.ensureVisible();
            }
          }
        }
      };
    });
  }
);
