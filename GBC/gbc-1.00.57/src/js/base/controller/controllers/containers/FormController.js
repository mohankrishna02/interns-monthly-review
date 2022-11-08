/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FormController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class FormController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.FormController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.FormController.prototype */ {
        __name: "FormController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          if (this.getAnchorNode().getParentNode().isTraditional()) {
            this._addBehavior(cls.TraditionalFormSizingVMBehavior);
          }

          // 4st behaviors
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.VisibleIdVMBehavior);

          // ui behaviors
        },

        attachUI: function() {
          if (this._widget) {
            var layoutService = this.getAnchorNode().getApplication().layout;
            this._afterLayoutHandler = layoutService.afterLayout(function() {
              this._widget.removeClass("visibility-hidden");
              if (this._afterLayoutHandler) {
                this._afterLayoutHandler();
                this._afterLayoutHandler = null;
              }
            }.bind(this));
            this._widget.addClass("visibility-hidden");
          }
          $super.attachUI.call(this);
        },

        detachUI: function() {
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
            this._afterLayoutHandler = null;
          }
          $super.detachUI.call(this);
        },

        destroy: function() {
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
            this._afterLayoutHandler = null;
          }
          $super.destroy.call(this);
        }
      };
    });
    cls.ControllerFactory.register("Form", cls.FormController);

  });
