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

modulum('ScrollAreaController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class ScrollAreaController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.ScrollAreaController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.ScrollAreaController.prototype */ {
        __name: "ScrollAreaController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Reverse4STBehavior);
          this._addBehavior(cls.ThinScrollBarDisplayTime4STBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.ScrollVMBehavior);

          // ui behaviors
          this._addBehavior(cls.ScrollUIBehavior);
        },

        /**
         * @inheritDoc
         */
        sendWidgetValue: function(dirty) {
          var ui = this.getUINode();
          var focusedNode = ui.getApplication().getNode(ui.attribute('focus'));
          var focusedWidgetController = focusedNode.getController();
          focusedWidgetController.sendWidgetValue(dirty);
        }
      };
    });
    cls.ControllerFactory.register("ScrollArea", cls.ScrollAreaController);

  });
