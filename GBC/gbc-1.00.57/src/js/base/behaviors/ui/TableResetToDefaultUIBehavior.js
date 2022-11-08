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

modulum('TableResetToDefaultUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableResetToDefaultUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableResetToDefaultUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableResetToDefaultUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableResetToDefaultUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.clickHandle = widget.when(gbc.constants.widgetEvents.tableResetToDefault, this._resetToDefault.bind(this,
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
         * Reset table settings
         * @private
         */
        _resetToDefault: function(controller, data, opt) {
          controller.resetStoredSetting();
          var tableColumns = controller.getAnchorNode().getChildren("TableColumn");
          var widget = null;
          for (var i = 0; i < tableColumns.length; i++) {
            widget = tableColumns[i].getController().getWidget();
            // will reset order: ordering by AUI tree position
            widget.setOrder(i);

            //will reset any sorting on each column
            widget.emit(context.constants.widgetEvents.tableHeaderClick, "reset");

            //will reset size on each column
            widget.resetWidth();

            //will reset visible/hidden columns
            widget.emit(gbc.constants.widgetEvents.tableShowHideCol, "show");
          }
        }
      };
    });
  });
