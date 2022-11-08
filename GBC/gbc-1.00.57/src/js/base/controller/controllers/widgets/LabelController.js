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

modulum('LabelController', ['ValueContainerControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class LabelController
     * @memberOf classes
     * @extends classes.ValueContainerControllerBase
     */
    cls.LabelController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      return /** @lends classes.LabelController.prototype */ {
        __name: "LabelController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          var decorator = this.getNodeBindings().decorator;
          var container = this.getNodeBindings().container;
          var isStatic = !decorator && !container;

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          if (this.isInTable()) {
            this._addBehavior(cls.TableSizeVMBehavior);
          }
          if (!this.isInTable() || this.isInFirstTableRow()) {
            this._addBehavior(cls.LayoutInfoVMBehavior);
          }
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          if (!isStatic) {
            this._addBehavior(cls.ActivePseudoSelectorBehavior);
            this._addBehavior(cls.DialogTypePseudoSelectorBehavior);
            if (this.isInMatrix()) {
              this._addBehavior(cls.MatrixCurrentRowVMBehavior);
            }
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
          this._addBehavior(cls.TextAlignVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.DisplayFormatVMBehavior); // must be set before value
          if (isStatic) {
            this._addBehavior(cls.TextLabelVMBehavior);
          } else {
            this._addBehavior(cls.ValueVMBehavior);
            this._addBehavior(cls.RequestFocusUIBehavior);
          }

          // ui behaviors
          if (this.isInTable()) {
            this._addBehavior(cls.TableImageVMBehavior);
            this._addBehavior(cls.RowSelectionUIBehavior);
            this._addBehavior(cls.TableItemCurrentRowVMBehavior);
          }

          //Put this 4st Behavior at the end since it's reformatting the value content
          this._addBehavior(cls.TextFormat4STBehavior);

        },

        /**
         * @inheritDoc
         */
        _createWidget: function(type) {
          // TODO why dont' call super._createWidget ?
          var styleNode = this.getNodeBindings().decorator ? this.getNodeBindings().decorator : this.getAnchorNode();
          return cls.WidgetFactory.createWidget(type, {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable(),
            inFirstTableRow: this.isInFirstTableRow(),
            inMatrix: this.isInMatrix(),
            inScrollGrid: this.isInScrollGrid()
          }, styleNode);
        }
      };
    });
    cls.ControllerFactory.register("Label", cls.LabelController);

  });
