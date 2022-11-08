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

modulum('MenuActionController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class MenuActionController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.MenuActionController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.MenuActionController.prototype */ {
        __name: "MenuActionController",

        constructor: function(bindings) {
          $super.constructor.call(this, bindings);
        },

        _initBehaviors: function() {
          $super._initBehaviors.call(this);
          var anchor = this.getNodeBindings().anchor;

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.ActivePseudoSelectorBehavior);
          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.EnabledButtonVMBehavior);
          this._addBehavior(cls.ActionEnabledVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextActionVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          if (anchor.attribute('name') === 'close') {
            this._addBehavior(cls.WindowCanCloseVMBehavior);
          }

          // ScaleIcon requires that the image is already present
          this._addBehavior(cls.ScaleIcon4STBehavior, true);

          // ui behaviors
          this._addBehavior(cls.OnClickUIBehavior);
          this._addBehavior(cls.InterruptUIBehavior);

          // aria behaviors
          this._addBehavior(cls.NavigationAriaBehavior);

        },

        destroy: function() {
          $super.destroy.call(this);
        },

        _getWidgetType: function(kind, active) {
          var type;

          if (this.isInChromeBar()) {
            type = "ChromeBarItem";
          } else {
            type = $super._getWidgetType.call(this, kind, active);
          }
          return type;
        }

      };
    });
    cls.ControllerFactory.register("MenuAction", cls.MenuActionController);

  });
