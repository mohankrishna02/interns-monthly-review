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

modulum('WindowController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class WindowController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.WindowController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.WindowController.prototype */ {
        __name: "WindowController",
        _isWidgetOwner: true,

        constructor: function(bindings) {
          $super.constructor.call(this, bindings);
        },
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // vm behaviors
          this._addBehavior(cls.WindowTitleVMBehavior);
          this._addBehavior(cls.WindowParentVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.WindowTypeVMBehavior);
          this._addBehavior(cls.CurrentTitleVMBehavior);

          // 4st behaviors
          this._addBehavior(cls.WindowOptionClose4STBehavior);
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.ToolBarPosition4STBehavior);
          this._addBehavior(cls.StartMenuPosition4STBehavior);
          this._addBehavior(cls.BackgroundImage4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);
          this._addBehavior(cls.Position4STBehavior); // to keep after Reverse4STBehavior

          // ui behaviors
          this._addBehavior(cls.WindowCloseUIBehavior);

          this._addBehavior(cls.Sizable4STBehavior);
          this._addBehavior(cls.TabbedContainer4STBehavior);
        },

        // TODO incompatible override
        createWidget: function() {
          var anchorNode = this.getAnchorNode();
          if (anchorNode.isTraditional()) {
            var firstTraditionalWindow = anchorNode.getFirstTraditionalWindow();
            this._isWidgetOwner = firstTraditionalWindow === anchorNode;
            if (this._isWidgetOwner) {
              this._widget = cls.WidgetFactory.createWidget("Window", {
                appHash: this.getAnchorNode().getApplication().applicationHash,
                appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
                auiTag: anchorNode.getId(),
                chromeBar: anchorNode.getParentNode().getWidget().getChromeBarWidget()
              }, anchorNode);
              this._widget.addClass("gbc_TraditionalContainerWindow");
            } else {
              this._widget = firstTraditionalWindow.getController().getWidget();
            }
          } else {
            this._widget = cls.WidgetFactory.createWidget("Window", {
              appHash: this.getAnchorNode().getApplication().applicationHash,
              appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
              auiTag: anchorNode.getId(),
              chromeBar: anchorNode.getParentNode().getWidget().getChromeBarWidget()
            }, anchorNode);
          }

          this._widget.isModal = anchorNode.isModal();
          if (this._widget.isModal && anchorNode._attributes.parent > 0) {
            this._widget._parentWindowWidgetForModal = anchorNode.getParentNode().getFirstChildWithId(anchorNode._attributes.parent)
              .getWidget();
          }

          // Hack to prevent firefox to relayout and change richtext cursors
          var messageWidget = this._widget.getMessageWidget();
          messageWidget.setDummyMessage();
          this._widget.addChildWidget(messageWidget);
        },

        setStyleBasedBehaviorsDirty: function(noUsageCheck, noRecurse) {
          $super.setStyleBasedBehaviorsDirty.call(this, noUsageCheck, noRecurse);
          this._widget.isModal = this.getAnchorNode().isModal();
        },

        attachUI: function() {
          if (this._isWidgetOwner) {
            $super.attachUI.call(this);
          }
        },

        detachUI: function() {
          if (this._isWidgetOwner) {
            $super.detachUI.call(this);
          }
        }
      };
    });
    cls.ControllerFactory.register("Window", cls.WindowController);

  });
