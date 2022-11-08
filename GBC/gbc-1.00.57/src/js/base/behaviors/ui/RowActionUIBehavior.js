/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('RowActionUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * Handling row action (double click on table/scrollgrid)
     * @class RowActionUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.RowActionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.RowActionUIBehavior.prototype */ {
        /** @type {string} */
        __name: "RowActionUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.rowActionHandle = controller.getWidget().when(gbc.constants.widgetEvents.rowAction, this._onRowAction.bind(
              this, controller, data));
          }
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.rowActionHandle) {
            data.rowActionHandle();
            data.rowActionHandle = null;
          }
        },

        /**
         * Creates an action event and sends it to the VM
         * @param controller
         * @param data
         * @private
         */
        _onRowAction: function(controller, data) {
          var anchorNode = controller.getAnchorNode();

          // Table case
          if (anchorNode.getTag().startsWith('Table')) {
            var tableNode = anchorNode.getTag() === 'Table' ? anchorNode : anchorNode.getParentNode();
            var active = tableNode.attribute('actionActive');
            var tableWidget = tableNode.getController().getWidget();
            var noEntry = anchorNode.attribute('noEntry');
            var doubleClickEnable = tableNode.attribute('doubleClick').length > 0 || tableWidget.isDisplayMode();

            if (tableWidget && active && doubleClickEnable && (tableWidget.isDisplayMode() || noEntry === 1)) {
              anchorNode.getApplication().action.execute(tableNode.getId());
            }
          }
          // Scrollgrid case
          else if (anchorNode.getTag() === 'ScrollGrid') {
            if (anchorNode.isAttributeSetByVM("doubleClick")) {
              anchorNode.getApplication().action.execute(anchorNode.getId());
            } else {
              var matrix = anchorNode.getFirstChild('Matrix');
              if (matrix && matrix.attribute('dialogType').indexOf('Display') !== -1) {
                // TODO GBC-1760 we should use ActionApplicationService to search an action
                var dialog = anchorNode.getAncestor('Window').getActiveDialog();
                var acceptAction = dialog.getFirstChildWithAttribute(null, 'name', 'accept');
                if (acceptAction) {
                  anchorNode.getApplication().action.execute(acceptAction.getId());
                }
              }
            }
          }
        }
      };
    });
  });
