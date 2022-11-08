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

modulum('TableFrozenUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableFrozenUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableFrozenUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableFrozenUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableFrozenUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.leftFrozenHandle = widget.when(gbc.constants.widgetEvents.tableLeftFrozen, this._leftFrozen.bind(this, controller,
              data));
            data.rightFrozenHandle = widget.when(gbc.constants.widgetEvents.tableRightFrozen, this._rightFrozen.bind(this,
              controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.leftFrozenHandle) {
            data.leftFrozenHandle();
            data.leftFrozenHandle = null;
          }
          if (data.rightFrozenHandle) {
            data.rightFrozenHandle();
            data.rightFrozenHandle = null;
          }
        },

        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param opt left frozen column count
         * @private
         */
        _leftFrozen: function(controller, data, opt) {

          // Save left frozen columns count in stored settings
          var count = opt.data[0];
          controller.setStoredSetting("leftFrozen", count);
        },

        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param opt right frozen column count
         * @private
         */
        _rightFrozen: function(controller, data, opt) {

          // Save right frozen columns count in stored settings
          var count = opt.data[0];
          controller.setStoredSetting("rightFrozen", count);
        }
      };
    });
  });
