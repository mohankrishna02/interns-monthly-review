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

modulum('TableColumnHideUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableColumnHideUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnHideUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableColumnHideUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableColumnHideUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.clickHandle = widget.when(gbc.constants.widgetEvents.tableShowHideCol, this._showHideColumn.bind(this, controller,
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
         * Show or hide table column (send event to VM)
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param opt true to show the column, false to hide it, empty to toggle it
         * @private
         */
        _showHideColumn: function(controller, data, opt) {
          var node = controller.getAnchorNode();
          var widget = controller.getWidget();
          var columnIndex = widget.getColumnIndex();
          var hidden = context.constants.visibility.hiddenByUser;
          if (opt.data.length > 0 && opt.data[0] !== "toggle") {
            hidden = opt.data[0] === "show" ? context.constants.visibility.visible : context.constants.visibility.hiddenByUser;
          } else if (columnIndex > -1) {
            hidden = node.attribute('hidden') === context.constants.visibility.hiddenByUser ? context.constants.visibility.visible :
              hidden;
          }

          var event = new cls.VMConfigureEvent(node.getId(), {
            hidden: hidden
          });

          if (hidden === context.constants.visibility.visible || this._getNbColumnsVisible(node.getParentNode()) > 1) {
            node.getApplication().typeahead.event(event, node);

            controller.setStoredSetting("hidden", hidden === context.constants.visibility.hiddenByUser);
          }
        },

        /**
         * Returns the number of columns which are not hidden
         * @returns {number} number of visible columns
         */
        _getNbColumnsVisible: function(tableNode) {
          var nb = 0;
          var children = tableNode.getChildren();
          for (var c = 0; c < children.length; c++) {
            var n = children[c];
            if (n._tag === "TableColumn" && n.attribute('hidden') === 0) {
              nb++;
            }
          }
          return nb;
        }
      };
    });
  });
