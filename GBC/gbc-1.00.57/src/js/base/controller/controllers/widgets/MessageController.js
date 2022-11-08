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

modulum('MessageController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class MessageController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.MessageController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.MessageController.prototype */ {
        __name: "MessageController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          this._addBehavior(cls.StyleVMBehavior);
          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);
          this._addBehavior(cls.TextFormat4STBehavior);
          // vm behaviors
          this._addBehavior(cls.ColorMessageVMBehavior);
          this._addBehavior(cls.BackgroundColorMessageVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.MessageTextVMBehavior);
          this._addBehavior(cls.DisplayMessageVMBehavior);
          // ui behaviors
        },

        /**
         * Avoid destruction of the shared message widget
         */
        destroy: function() {
          var messageService = this.getAnchorNode().getApplication().message;
          messageService.removeMessage(this.getAnchorNode().attribute("count"));
          if (this._widget) {
            this._widget.setHidden(true);
            this._widget = null;
          }
          $super.destroy.call(this);
        },

        /**
         * Override default method to use the shared message widget
         */
        createWidget: function() {
          this._widget = this.getAnchorNode().getParentNode().getController().getWidget().getMessageWidget();

          var messageService = this.getAnchorNode().getApplication().message;
          messageService.addMessage(this.getAnchorNode().attribute("count"), this._widget);
        }

      };
    });
    cls.ControllerFactory.register("Message", cls.MessageController);

  });
