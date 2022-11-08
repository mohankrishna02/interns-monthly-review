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

modulum('TableCurrentVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TableCurrentVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableCurrentVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableCurrentVMBehavior.prototype */ {
        __name: "TableCurrentVMBehavior",

        watchedAttributes: {
          anchor: ['currentRow', 'currentColumn', 'offset']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setCurrentRow) {
            var tableNode = controller.getAnchorNode();
            var app = tableNode.getApplication();
            var uiNode = app.uiNode();
            var currentRow = tableNode.attribute('currentRow');

            if (!app.typeahead.hasPendingNavigationCommands()) {
              var offset = tableNode.attribute('offset');
              var size = tableNode.attribute('size');
              var localCurrentRow = currentRow - offset;

              var ensureRowVisible = (currentRow !== data.oldCurrentRow && localCurrentRow === 0 && size > 0);
              widget.setCurrentRow(localCurrentRow, ensureRowVisible);

              if (widget.setCurrentColumn) {
                var currentColumn = tableNode.attribute('currentColumn');
                widget.setCurrentColumn(currentColumn);
              }
            }

            var hasFocus = tableNode.getId() === uiNode.attribute("focus");
            var parentForm = tableNode.getAncestor("Form");
            var visibleId = null;
            if (parentForm) {
              visibleId = parentForm.attribute("visibleId");
            }
            // if table has vm focus and no visibleId is set on its parent form, then we display it
            if (hasFocus && (!visibleId || visibleId === -1)) {
              controller.ensureVisible();
            }

            // =====================================
            if (controller.updateMultiRowSelectionRoot) {
              controller.multiRowSelectionRoot = currentRow;
            }
            controller.updateMultiRowSelectionRoot = true;
            // =====================================

            data.oldCurrentRow = currentRow;
          }
        }
      };
    });
  });
