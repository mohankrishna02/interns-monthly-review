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

modulum('HBoxController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class HBoxController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.HBoxController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.HBoxController.prototype */ {
        __name: "HBoxController",

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Reverse4STBehavior);
          this._addBehavior(cls.SplitViewArrows4STBehavior);
          this._addBehavior(cls.SplitViewDots4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.SplitterVMBehavior);
          // ui behaviors
          this._addBehavior(cls.OnSplitterUIBehavior);
        },

        /**
         * @inheritDoc
         */
        _createWidget: function(type) {
          return cls.WidgetFactory.createWidget(type, {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable(),
            inMatrix: this.isInMatrix(),
            inScrollGrid: this.isInScrollGrid(),
            uiWidget: this.getUINode().getController().getWidget()
          }, this.getAnchorNode());
        },

        _getWidgetType: function() {
          // Create splitview widget if 4ST attribute is set.
          // Let widget enable/disable splitview mechanism depending of screen size dynamically
          var isHBoxSplitView = this.getAnchorNode()._initialStyleAttributes.splitViewRendering === "yes";
          var type = "HBox";
          if (isHBoxSplitView) {
            type = "HBoxSplitView";
          }
          return type;
        },
        /**
         * @inheritDoc
         */
        ensureVisible: function(executeAction) {
          var widget = this.getAnchorNode().getWidget();
          widget.emit(context.constants.widgetEvents.splitViewChange, widget);
          return $super.ensureVisible.call(this, executeAction);
        }
      };
    });
    cls.ControllerFactory.register("HBox", cls.HBoxController);

  });
