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

modulum('FolderController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class FolderController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.FolderController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.FolderController.prototype */ {
        __name: "FolderController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.TabPosition4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.CollapserPosition4STBehavior);

          // ui behaviors
          this._addBehavior(cls.ChangePageUIBehavior);

          var layoutService = this.getAnchorNode().getApplication().layout;
          this._afterLayoutHandler = layoutService.afterLayout(this.onAfterLayout.bind(this));
        },

        onAfterLayout: function() {
          if (this.getWidget() && this.getWidget().updateScrollersVisibility) {
            this.getWidget().updateScrollersVisibility();
          }
        },

        destroy: function() {
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
          }
          $super.destroy.call(this);
        }

      };
    });
    cls.ControllerFactory.register("Folder", cls.FolderController);

  });
