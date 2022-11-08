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

modulum('ButtonController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class ButtonController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.ButtonController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.ButtonController.prototype */ {
        __name: "ButtonController",
        _imageReadyHandler: null,
        /**
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          this.scrollGridLineController = bindings.additionalBindings && bindings.additionalBindings.scrollGridLineController;

          $super.constructor.call(this, bindings);
        },

        destroy: function() {
          if (this._imageReadyHandler) {
            this._imageReadyHandler();
            this._imageReadyHandler = null;
          }
          $super.destroy.call(this);
        },

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.ActivePseudoSelectorBehavior);
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.ButtonType4STBehavior);
          this._addBehavior(cls.DefaultTTFColor4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          this._addBehavior(cls.Alignment4STBehavior);
          this._addBehavior(cls.TextButtonVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledButtonVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);

          this._addBehavior(cls.TitleVMBehavior);

          // ScaleIcon requires that the image is already present
          this._addBehavior(cls.ScaleIcon4STBehavior, false);

          // ui behaviors
          if (this.scrollGridLineController) {
            this._addBehavior(cls.ButtonRequestFocusUIBehavior);
          }
          this._addBehavior(cls.OnClickUIBehavior);
          this._addBehavior(cls.InterruptUIBehavior);
        },
        _createWidget: function(type) {
          if (this._imageReadyHandler) {
            this._imageReadyHandler();
            this._imageReadyHandler = null;
          }
          var button = $super._createWidget.call(this, type);
          this._imageReadyHandler = button.when(context.constants.widgetEvents.ready, this._imageLoaded.bind(this));
          return button;
        },
        _imageLoaded: function(event, src, hasMeasure) {
          if (!hasMeasure) {
            this.getWidget().getLayoutEngine().forceMeasurement();
            this.getAnchorNode().getApplication().getUI().getWidget().getLayoutInformation().invalidateMeasure();
          }
          this.getAnchorNode().getApplication().layout.refreshLayout();
        }
      };
    });
    cls.ControllerFactory.register("Button", cls.ButtonController);

  });
