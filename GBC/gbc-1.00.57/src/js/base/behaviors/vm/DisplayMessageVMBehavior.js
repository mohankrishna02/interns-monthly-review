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

modulum('DisplayMessageVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class DisplayMessageVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.DisplayMessageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.DisplayMessageVMBehavior.prototype */ {
        __name: "DisplayMessageVMBehavior",

        watchedAttributes: {
          anchor: ['count', 'hidden']
        },

        _hideHandler: null,

        /**
         * Re-applies all controller's behaviors as all messages share the same widget
         */
        _apply: function(controller, data) {
          if (!data.isApplying) {
            data.isApplying = true;
            var widget = controller.getWidget();
            controller.applyBehaviors(null, true);
            widget.setHidden(false);
            data.isApplying = false;

            var bindings = controller.getNodeBindings();
            var messageService = bindings.anchor.getApplication().message;

            // No need to keep track of this, it is executed once (last param of "when" method set to 'true')
            controller.getAnchorNode().getApplication().layout.when(context.constants.widgetEvents.afterLayoutFocusRestored,
              function() {
                messageService.handlePositions();
              }.bind(this), true);

            if (this._hideHandler) {
              this._hideHandler();
            }
            this._hideHandler = widget.when("hide.MessageWidget", function() {
              messageService.handlePositions();
            }.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        _detach: function(controller, data) {
          if (this._hideHandler) {
            this._hideHandler();
            this._hideHandler = null;
          }
        }
      };
    });
  });
