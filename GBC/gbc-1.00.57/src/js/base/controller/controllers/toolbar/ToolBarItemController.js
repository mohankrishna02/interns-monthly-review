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

modulum('ToolBarItemController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class ToolBarItemController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.ToolBarItemController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.ToolBarItemController.prototype */ {
        __name: "ToolBarItemController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.TextPosition4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledButtonVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.TextActionVMBehavior);

          // ScaleIcon requires that the image is already present
          this._addBehavior(cls.ScaleIcon4STBehavior, true);

          // ui behaviors
          this._addBehavior(cls.OnClickUIBehavior);
          this._addBehavior(cls.InterruptUIBehavior);
        },

        _getWidgetType: function(kind, active) {
          var type;
          var chromeBarTheme = this.isInChromeBar();

          if (chromeBarTheme) {
            type = "ChromeBarItem";
          } else {
            type = $super._getWidgetType.call(this, kind, active);
          }
          return type;
        }
      };
    });
    cls.ControllerFactory.register("ToolBarItem", cls.ToolBarItemController);

  });
