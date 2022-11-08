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

modulum('TableColumnSortUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableColumnSortUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnSortUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableColumnSortUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableColumnSortUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.clickHandle = widget.when(gbc.constants.widgetEvents.tableHeaderClick, this._sortColumn.bind(this, controller,
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
         * Sort table column (send event to VM)
         * @private
         */
        _sortColumn: function(controller, data, opt) {
          var node = controller.getAnchorNode();

          var reset = opt.data.length > 0 && opt.data[0] === "reset";

          var tableNode = node.getParentNode();
          var widget = controller.getWidget();
          var columnIndex = widget.getColumnIndex();
          var sortType = "";
          if (columnIndex > -1) {
            sortType = tableNode.attribute('sortType') === "asc" ? "desc" : "asc";
          }

          //reset sort order
          columnIndex = reset ? -1 : columnIndex;

          var event = new cls.VMConfigureEvent(tableNode.getId(), {
            sortColumn: columnIndex,
            sortType: sortType
          });
          node.getApplication().typeahead.event(event, tableNode);

          tableNode.getController().setStoredSetting("sortColumn", columnIndex);
          tableNode.getController().setStoredSetting("sortType", sortType);
        }
      };
    });
  });
