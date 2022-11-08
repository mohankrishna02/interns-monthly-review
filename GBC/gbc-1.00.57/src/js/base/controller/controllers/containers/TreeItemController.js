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

modulum('TreeItemController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class TreeItemController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.TreeItemController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.TreeItemController.prototype */ {
        __name: "TreeItemController",

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // 4st behaviors

          // vm behaviors
          this._addBehavior(cls.TreeItemDecorationVMBehavior);
        },

        createWidget: function() {
          // TreeItems don't create own widgets, they simply act on the corresponding table column
          return null;
        }
      };
    });
    cls.ControllerFactory.register("TreeItem", cls.TreeItemController);
  });
