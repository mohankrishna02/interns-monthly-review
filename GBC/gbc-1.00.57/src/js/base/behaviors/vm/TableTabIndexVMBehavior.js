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

modulum('TableTabIndexVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TableTabIndexVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableTabIndexVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableTabIndexVMBehavior.prototype */ {
        __name: "TableTabIndexVMBehavior",

        watchedAttributes: {
          anchor: ['tabIndex']
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         */
        setup: function(controller, data) {
          data.firstApply = true;
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setOrder) {

            if (data
              .firstApply) { // first time we receive tabIndex we load visual index from stored settings and resent new index to VM
              var storedTabIndex = controller.getStoredSetting("tabIndex");
              if (storedTabIndex && storedTabIndex >= 0) {
                widget.emit(context.constants.widgetEvents.tableOrderColumn,
                  storedTabIndex); // Emit an event to send the col tabIndex to VM
                widget.setOrder(storedTabIndex);
              }
            }
          }
          data.firstApply = false;
        }
      };
    });
  });
