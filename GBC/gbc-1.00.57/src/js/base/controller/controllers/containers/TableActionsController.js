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

modulum('TableActionsController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class TableActionsController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.TableActionsController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.TableActionsController.prototype */ {
        __name: "TableActionsController",

        /**
         * @inheritDoc
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // ui behaviors
          this._addBehavior(cls.ContextMenuUIBehavior);
        },

        /**
         * @inheritDoc
         */
        _getWidgetType: function(kind, active) {
          return "ContextMenu";
        }
      };
    });
    cls.ControllerFactory.register("TableActions", cls.TableActionsController);

  });
