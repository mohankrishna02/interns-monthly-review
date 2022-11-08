/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableActionController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class TableActionController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.TableActionController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.TableActionController.prototype */ {
        __name: "TableActionController",

        /**
         * @inheritDoc
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // vm behaviors
          this._addBehavior(cls.EnabledButtonVMBehavior);
          this._addBehavior(cls.TextActionVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);

          // ui behaviors
          this._addBehavior(cls.OnClickUIBehavior);
        },

        /**
         * @inheritDoc
         */
        _getWidgetType: function(kind, active) {
          return "MenuLabel";
        }
      };
    });
    cls.ControllerFactory.register("TableAction", cls.TableActionController);

  });
