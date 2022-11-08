/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableCopyCurrentUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableCopyCurrentUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableCopyCurrentUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableCopyCurrentUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableCopyCurrentUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.copyHandle = widget.when(gbc.constants.widgetEvents.copy, this._copyCurrent.bind(this, controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.copyHandle) {
            data.copyHandle();
            data.copyHandle = null;
          }
        },

        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @private
         */
        _copyCurrent: function(controller, data) {
          var tableWidget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          var multiRowSelection = (tableNode.attribute('multiRowSelection') !== 0);

          var app = tableNode.getApplication();
          var vmEvent = null;
          var copyKey = "control-c";

          // search action in active dialog
          // TODO GBC-1760 we should use ActionApplicationService to search an action
          var actionNode = app.getActiveDialogAction(copyKey);
          if (actionNode) {
            vmEvent = new cls.VMActionEvent(actionNode.getId());
          } else {
            // search action in default action list
            actionNode = app.getDefaultAction(copyKey);
            if (actionNode) {
              vmEvent = new cls.VMKeyEvent(copyKey);
            }
          }
          // an action is found for CTRL-C and it's not "editcopy"
          // send the action event and quit
          if (vmEvent && actionNode.attribute('name') !== "editcopy") {
            app.typeahead.event(vmEvent, tableNode);
            return;
          }

          // if current row is visible and multirowselection off use native GBC copy
          if (!multiRowSelection && tableWidget && tableWidget.isCurrentRowVisible()) {
            if (tableWidget.hasFocusOnField()) {
              tableWidget._copyCurrentCellInClipboard();
            } else {
              tableWidget._copyCurrentRowInClipboard();
            }
          } else if (vmEvent) { // an action is found and it's "editcopy" sent it to VM
            app.typeahead.event(vmEvent, tableNode);
          }
        }
      };
    });
  });
