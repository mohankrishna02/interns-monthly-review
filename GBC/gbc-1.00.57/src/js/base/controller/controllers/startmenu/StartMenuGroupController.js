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

modulum('StartMenuGroupController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class StartMenuGroupController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.StartMenuGroupController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.StartMenuGroupController.prototype */ {
        __name: "StartMenuGroupController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.DisabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
        },
        _getWidgetType: function(kind) {
          var parent = this.getAnchorNode().getAncestor("StartMenu");
          var type = null;
          if (parent) {
            type = parent.getController()._getWidgetType(kind) + "Group";
          }
          return type;
        }
      };
    });
    cls.ControllerFactory.register("StartMenuGroup", cls.StartMenuGroupController);

  });
