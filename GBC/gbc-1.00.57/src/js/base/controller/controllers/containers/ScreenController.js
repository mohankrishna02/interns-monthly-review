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

modulum('ScreenController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class ScreenController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.ScreenController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.ScreenController.prototype */ {
        __name: "ScreenController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);

          // ui behaviors
        },
        _getWidgetType: function() {
          var uiNode = this.getAnchorNode().getApplication().getNode(0);
          if (uiNode.attribute("uiMode") === "traditional") {
            return "TraditionalScreen";
          } else {
            return "Grid";
          }
        }
      };
    });
    cls.ControllerFactory.register("Screen", cls.ScreenController);

  });
