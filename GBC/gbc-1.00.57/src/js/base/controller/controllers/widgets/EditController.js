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

modulum('EditController', ['ValueContainerControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class EditController
     * @memberOf classes
     * @extends classes.ValueContainerControllerBase
     */
    cls.EditController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      return /** @lends classes.EditController.prototype */ {
        __name: "EditController",

        /**
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          $super.constructor.call(this, bindings);
          this._setCompleterBindings(bindings);
        },

        _setCompleterBindings: function(bindings) {
          if (this.isInMatrix() || this.isInTable()) {
            bindings.completer = bindings.container._children[0]._children[0];
          } else {
            bindings.completer = bindings.decorator._children[0];
          }
        },

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.DialogTypeVMBehavior);
          if (this.isInTable()) {
            this._addBehavior(cls.TableSizeVMBehavior);
          }
          if (!this.isInTable() || this.isInFirstTableRow()) {
            this._addBehavior(cls.LayoutInfoVMBehavior);
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
          if (!this.isInTable()) {
            this._addBehavior(cls.Border4STBehavior);
          }
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.DisplayFormatVMBehavior); // must be set before value
          this._addBehavior(cls.TextAlignVMBehavior);
          this._addBehavior(cls.TextTransformVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.CursorsVMBehavior);
          this._addBehavior(cls.IsPasswordVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.MaxLengthVMBehavior);
          this._addBehavior(cls.KeyboardHintVMBehavior);
          this._addBehavior(cls.CompleterVMBehavior);
          this._addBehavior(cls.PictureVMBehavior);
          this._addBehavior(cls.PlaceholderVMBehavior);
          //Field Validation
          this._addBehavior(cls.NotNullVMBehavior);
          this._addBehavior(cls.RequiredVMBehavior);
          this._addBehavior(cls.IncludeVMBehavior);

          // ui behaviors
          this._addBehavior(cls.SendValueUIBehavior);
          this._addBehavior(cls.RequestFocusUIBehavior);
          if (this.isInTable()) {
            this._addBehavior(cls.TableImageVMBehavior);
            this._addBehavior(cls.RowSelectionUIBehavior);
            this._addBehavior(cls.TableItemCurrentRowVMBehavior);
          }
        },
        _getWidgetType: function(kind) {
          var type;
          if (kind === "Construct") {
            type = "DummyEdit";
          } else if (this.isInTable() && (kind === "Display" || kind === "DisplayArray") &&
            !(this.getNodeBindings().decorator.attribute("isPassword"))) {
            type = "Label";
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        },
      };
    });
    cls.ControllerFactory.register("Edit", cls.EditController);
    cls.ControllerFactory.register("XEdit", cls.EditController);

  });
