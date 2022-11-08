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

modulum('CanvasController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class CanvasController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.CanvasController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.CanvasController.prototype */ {
        __name: "CanvasController",
        _afterLayoutHandler: null,

        _initBehaviors: function() {
          $super._initBehaviors.call(this);
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          var layoutService = this.getAnchorNode().getApplication().layout;
          this._afterLayoutHandler = layoutService.afterLayout(this.onAfterLayout.bind(this));
        },

        destroy: function() {
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
          }
          $super.destroy.call(this);
        },

        onAfterLayout: function() {
          var children = this.getAnchorNode().getChildren();
          for (var i = 0; i < children.length; ++i) {
            var ctrl = children[i].getController();
            if (ctrl.onAfterLayout) {
              ctrl.onAfterLayout();
            }
          }
        }
      };
    });
    cls.ControllerFactory.register("Canvas", cls.CanvasController);

  });
