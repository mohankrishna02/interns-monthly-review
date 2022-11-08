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

modulum('DateEditController', ['ValueContainerControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class DateEditController
     * @memberOf classes
     * @extends classes.ValueContainerControllerBase
     */
    cls.DateEditController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      return /** @lends classes.DateEditController.prototype */ {
        __name: "DateEditController",
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
          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.FirstDayOfWeek4STBehavior);
          this._addBehavior(cls.DaysOff4STBehavior);
          this._addBehavior(cls.ShowWeekNumber4STBehavior);
          this._addBehavior(cls.CalendarType4STBehavior);
          this._addBehavior(cls.ButtonIcon4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextAlignVMBehavior);
          this._addBehavior(cls.TextTransformVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.CursorsVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.MaxLengthVMBehavior);
          this._addBehavior(cls.PlaceholderVMBehavior);
          //Field Validation
          this._addBehavior(cls.NotNullVMBehavior);
          this._addBehavior(cls.RequiredVMBehavior);
          this._addBehavior(cls.IncludeVMBehavior);

          /* WARNING : Format & Picture have to be set before value */
          this._addBehavior(cls.FormatVMBehavior);
          this._addBehavior(cls.PictureVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.EnabledVMBehavior);

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
            type = "DummyDateEdit";
          } else if (this.isInTable() && (kind === "Display" || kind === "DisplayArray")) {
            type = "Label";
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        }
      };
    });
    cls.ControllerFactory.register("DateEdit", cls.DateEditController);

  });
