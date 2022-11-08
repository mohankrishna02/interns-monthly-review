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

modulum('CheckBoxController', ['ValueContainerControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class CheckBoxController
     * @memberOf classes
     * @extends classes.ValueContainerControllerBase
     */
    cls.CheckBoxController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      return /** @lends classes.CheckBoxController.prototype */ {
        __name: "CheckBoxController",
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
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.CheckBoxValuesVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
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
        _createWidget: function(type) {
          var checkBox = $super._createWidget.call(this, type);

          if (checkBox.setCheckedValue) {
            checkBox.setCheckedValue(this.getNodeBindings().decorator.attribute("valueChecked"));
          }
          if (checkBox.setUncheckedValue) {
            checkBox.setUncheckedValue(this.getNodeBindings().decorator.attribute("valueUnchecked"));
          }
          if (checkBox.setIndeterminateValue) {
            checkBox.setIndeterminateValue('');
          }
          return checkBox;
        }
      };
    });
    cls.ControllerFactory.register("CheckBox", cls.CheckBoxController);

  });
