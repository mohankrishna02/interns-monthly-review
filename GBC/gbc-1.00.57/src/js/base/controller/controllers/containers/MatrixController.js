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

modulum('MatrixController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class MatrixController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.MatrixController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.MatrixController.prototype */ {
        __name: "MatrixController",
        _currentRow: 0,

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          this.setCurrentRow(this.getAnchorNode().attribute("currentRow"));
          // pseudo-selector behaviors
          this._addBehavior(cls.FocusCurrentCellPseudoSelectorBehavior);
          this._addBehavior(cls.OffsetPseudoSelectorBehavior);
        },

        /**
         * @inheritDoc
         */
        setFocus: function() {
          var widget = this.getCurrentInternalWidget();
          if (widget) {
            if (this.isInScrollGrid()) {
              var scrollGridNode = this.getAnchorNode().getAncestor('ScrollGrid');
              var scrollGridController = scrollGridNode.getController();
              // show filter when matrix is in scrollgrid
              scrollGridController.showReduceFilter();
            }
            widget.setFocus();
          } else {
            var appWidget = context.SessionService.getCurrent().getCurrentApplication().getUI().getWidget();
            if (appWidget) {
              var uiWidget = appWidget._uiWidget;
              if (uiWidget) {
                uiWidget.setFocus();
              }
            }
          }
        },

        setCurrentRow: function(currentRow) {
          this._currentRow = currentRow;
        },

        getCurrentRow: function() {
          return this._currentRow;
        },

        updateCurrentRow: function(matrixNode, currentRow) {
          // Check if we are in a ScrollGrid
          var scrollGridNode = matrixNode.getAncestor('ScrollGrid');
          var scrollGridWidget = scrollGridNode ? scrollGridNode.getController().getWidget() : null;
          if (scrollGridWidget && scrollGridWidget.setCurrentRow) { // SCROLLGRID
            if (currentRow === -1 && scrollGridNode.attribute("active") === 1) {
              // if one matrix in scrollgrid has a currentRow equal to -1 --> focusOnField activated
              scrollGridWidget.setFocusOnField(true);
            }
            scrollGridWidget.setCurrentRow(currentRow);
          } else { // SIMPLE MATRIX
            var dialogType = matrixNode.attribute('dialogType');
            var displayDialog = dialogType === "Display" || dialogType === "DisplayArray";
            if (matrixNode.getTag() === "Matrix" && displayDialog) {
              matrixNode.getController().updateAllSiblingMatrixCurrentRow(currentRow, true);
            }
          }
          return null;
        },

        updateAllSiblingMatrixCurrentRow: function(currentRow, updateCss) {
          var matrixParent = this.getAnchorNode().getParentNode();
          if (matrixParent) {
            var childrenMatrix = matrixParent.getChildren("Matrix");
            if (childrenMatrix) {
              for (var i = 0; i < childrenMatrix.length; i++) {
                // update processing current row
                var colMatrix = childrenMatrix[i];
                var matrixCtrl = colMatrix.getController();
                if (matrixCtrl) {
                  var previousRow = matrixCtrl.getCurrentRow();
                  if (matrixCtrl && matrixCtrl.setCurrentRow) {
                    matrixCtrl.setCurrentRow(currentRow);
                  }
                  // update current row css
                  if (updateCss) {
                    var valueList = colMatrix.getFirstChild("ValueList");
                    var widgets = valueList ? colMatrix.getFirstChild("ValueList").getChildren() : [];
                    if (currentRow <= widgets.length - 1 && previousRow <= widgets.length - 1) {

                      var previousWidget = widgets[previousRow];
                      if (previousWidget) {
                        previousWidget.getController().getWidget().removeClass("currentRow");
                      }
                      var newWidget = widgets[currentRow];
                      if (newWidget) {
                        newWidget.getController().getWidget().addClass("currentRow");
                      }
                    }
                  }
                }
              }
            }
          }
        },

        /**
         * Sends the updated value to the DVM
         * @private
         */
        sendWidgetValue: function(dirty) {
          var valueNode = this.getAnchorNode().getCurrentValueNode(true);
          if (valueNode) {
            var ctrl = valueNode.getController();
            ctrl.sendWidgetValue(dirty);
          }
        },
      };
    });
    cls.ControllerFactory.register("Matrix", cls.MatrixController);

  });
