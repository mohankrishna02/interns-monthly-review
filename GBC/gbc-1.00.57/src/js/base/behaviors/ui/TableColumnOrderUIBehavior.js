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

modulum('TableColumnOrderUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableColumnOrderUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnOrderUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableColumnOrderUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableColumnOrderUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.orderHandle = widget.when(gbc.constants.widgetEvents.tableOrderColumn, this._orderColumn.bind(this, controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.orderHandle) {
            data.orderHandle();
            data.orderHandle = null;
          }
        },

        /**
         * Order table column (send event to VM)
         * @private
         */
        _orderColumn: function(controller, data, opt) {
          var node = controller.getAnchorNode();
          var tabIndex = opt.data[0];

          var event = new cls.VMConfigureEvent(node.getId(), {
            tabIndex: tabIndex
          });
          node.getApplication().typeahead.event(event, node);

          controller.setStoredSetting("tabIndex", tabIndex);
        }
      };
    });
  });
