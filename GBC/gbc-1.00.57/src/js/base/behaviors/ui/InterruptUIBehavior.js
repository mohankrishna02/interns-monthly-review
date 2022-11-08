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

modulum('InterruptUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class InterruptUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.InterruptUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.InterruptUIBehavior.prototype */ {
        /** @type {string} */
        __name: "InterruptUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var node = controller.getAnchorNode();
          if (node.attribute('name') === 'interrupt') {
            var widget = controller.getWidget();
            if (widget) {
              var application = node && node.getApplication();
              if (application && application.action) {
                application.action.registerInterruptWidget(widget);
              }
              if (!application.action.hasAction("interrupt")) {
                widget.setInterruptable(true);
                data.actionHandle = widget.when(gbc.constants.widgetEvents.click, this._onAction.bind(this, controller, data));
              }
            }
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            var node = controller.getAnchorNode();
            var application = node && node.getApplication();
            if (application && application.action) {
              application.action.unregisterInterruptWidget(widget);
            }
            widget.setInterruptable(false);
          }
          if (this.actionHandle) {
            this.actionHandle();
            this.actionHandle = null;
          }
        },
        /**
         * Creates an action event and sends it to the VM
         */
        _onAction: function(controller) {
          var node = controller.getAnchorNode(),
            application = node && node.getApplication();
          if (application) {
            if (application.isIdle()) {
              application.action.executeByName("interrupt");
            } else if (!application.action.hasAction("interrupt")) {
              application.interrupt();
            }
          }
        }
      };
    });
  });
