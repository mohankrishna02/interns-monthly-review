/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableColumnAfterLastItemClickUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableColumnAfterLastItemClickUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnAfterLastItemClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableColumnAfterLastItemClickUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableColumnAfterLastItemClickUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.clickHandle = widget.when(gbc.constants.widgetEvents.tableColumnAfterLastItemClick, this._onClick.bind(this,
              controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.clickHandle) {
            data.clickHandle();
            data.clickHandle = null;
          }
        },

        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {Object} data

         * @private
         */
        _onClick: function(controller, data) {

          var tableColumnNode = controller.getAnchorNode();

          if (tableColumnNode.attribute('active') === 0) {
            return; // Nothing to do
          }

          var tableNode = tableColumnNode.getParentNode();
          var app = tableNode.getApplication();

          if (tableColumnNode.attribute("dialogType") === "DisplayArray") {
            app.typeahead.focus(tableNode); // only set the focus on the table
            return;
          } else { // not a display array
            if (tableColumnNode.attribute('noEntry') === 1) {
              return; // Nothing to do
            }

            var tableController = tableNode.getController();

            // send current value node value of the table if not already done before requesting focus change
            tableController.sendWidgetValue();

            // when click after the last row, we must send currentRow = size to VM
            var columnIndex = tableColumnNode.getIndex('TableColumn');
            var rowIndex = tableNode.attribute("size");

            var event = new cls.VMConfigureEvent(tableNode.getId(), {
              currentColumn: columnIndex,
              currentRow: rowIndex
            });

            app.typeahead.event(event, tableColumnNode);
          }
        }
      };
    });
  });
