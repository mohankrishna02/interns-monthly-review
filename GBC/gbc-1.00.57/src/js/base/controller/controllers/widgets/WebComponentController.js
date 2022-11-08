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

modulum('WebComponentController', ['ValueContainerControllerBase', 'ControllerFactory', 'WidgetFactory'],
  function(context, cls) {
    /**
     * @class WebComponentController
     * @memberOf classes
     * @extends classes.ValueContainerControllerBase
     */
    cls.WebComponentController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      return /** @lends classes.WebComponentController.prototype */ {
        __name: 'WebComponentController',

        /**
         * Initialize behaviors of the controller
         * @private
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          if (this.isInTable()) {
            this._addBehavior(cls.TableSizeVMBehavior);
          }
          if (!this.isInTable() || this.isInFirstTableRow()) {
            this._addBehavior(cls.LayoutInfoVMBehavior);
          }
          if (this.isInStack()) {
            this._addBehavior(cls.WebComponentLayoutInfoVMBehavior);
          }
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.ActivePseudoSelectorBehavior);
          this._addBehavior(cls.DialogTypePseudoSelectorBehavior);
          if (this.isInMatrix()) {
            this._addBehavior(cls.MatrixCurrentRowVMBehavior);
          }
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.PropertyVMBehavior);
          this._addBehavior(cls.ComponentTypeVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.WebComponentStateChangedVMBehavior);
          this._addBehavior(cls.WebComponentCursorsVMBehavior);

          // ui behaviors
          this._addBehavior(cls.SendValueUIBehavior);
          this._addBehavior(cls.RequestFocusUIBehavior);
          this._addBehavior(cls.OnActionUIBehavior);
          this._addBehavior(cls.OnDataUIBehavior);
          this._addBehavior(cls.HasWebComponentUIBehavior);
          this._addBehavior(cls.WebComponentKeyboardUIBehavior);
        }
      };
    });
    cls.ControllerFactory.register('WebComponent', cls.WebComponentController);
  });
