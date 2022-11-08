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

modulum('UserInterfaceController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class UserInterfaceController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.UserInterfaceController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.UserInterfaceController.prototype */ {
        __name: "UserInterfaceController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // vm behaviors
          this._addBehavior(cls.FocusPseudoSelectorBehavior);
          this._addBehavior(cls.RuntimeStatusVMBehavior);
          this._addBehavior(cls.ApplicationTitleVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.CurrentWindowVMBehavior);
          this._addBehavior(cls.StartMenuPositionUIBehavior);
          this._addBehavior(cls.ImageVMBehavior);
          this._addBehavior(cls.DBDateVMBehavior);
          this._addBehavior(cls.CurrentTitleVMBehavior);

          // 4st behaviors
          this._addBehavior(cls.Reverse4STBehavior);
          this._addBehavior(cls.BrowserMultiPage4STBehavior);

        },
        _createWidget: function(type) {
          var widget = $super._createWidget.call(this, type);
          widget.setSidebarWidget(this.getNodeBindings().anchor.getApplication().getUI().getWidget().getSidebarWidget());

          // Hack to prevent firefox to relayout and change richtext cursors
          var messageWidget = widget.getMessageWidget();
          messageWidget.setDummyMessage();
          widget.addChildWidget(messageWidget);

          return widget;
        }
      };
    });
    cls.ControllerFactory.register("UserInterface", cls.UserInterfaceController);

  });
