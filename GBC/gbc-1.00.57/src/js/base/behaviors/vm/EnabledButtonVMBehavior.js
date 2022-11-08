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

modulum('EnabledButtonVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's 'enabled' state
     * @class EnabledButtonVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.EnabledButtonVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.EnabledButtonVMBehavior.prototype */ {
        __name: "EnabledButtonVMBehavior",

        watchedAttributes: {
          parent: ['active'],
          anchor: ['active', 'actionActive', 'defaultView'],
          ui: ['runtimeStatus']
        },

        /**
         * Sets the widget 'enabled' or  'disabled' depending on the AUI tree state.
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var anchorNode = controller.getAnchorNode();
          var uiNode = anchorNode.getApplication().uiNode();
          var parentNode = controller.getNodeBindings().parent;

          var isInterrupt = anchorNode.attribute("name") === "interrupt";
          var isProcessing = uiNode.attribute("runtimeStatus") === "processing";

          if (widget && widget.setEnabled) {
            var hidden = anchorNode.isAttributePresent("hidden") ? anchorNode.attribute('hidden') : false;
            var activeValue = anchorNode.attribute('active');
            if (anchorNode.getParentNode().attribute("style") === "popup") {
              hidden = !activeValue;
            }

            if (anchorNode.isAttributePresent('actionActive')) {
              activeValue = activeValue || anchorNode.attribute('actionActive');
            }

            // When chromeBar theme is on, it changes some visibility behavior
            if (controller.isInChromeBar()) {
              var formNode = anchorNode.getAncestor("Form");
              if (formNode && formNode.attribute('hidden') === 1) {
                hidden = true;
              } else {
                if (parentNode.isAttributePresent('active')) {
                  hidden = hidden ? hidden : parentNode.attribute("active") === 0;
                }
                if (anchorNode.isAttributePresent('defaultView')) {
                  hidden = hidden ? hidden : anchorNode.attribute("defaultView") === "no";
                  hidden = hidden ? hidden : anchorNode.attribute("hidden") === 1;
                }
              }
            }

            var enabled = activeValue === 1;
            if (isInterrupt && !anchorNode.getApplication().action.hasAction("interrupt")) {
              enabled = isProcessing || enabled;
            }

            widget.setEnabled(enabled);

            //hide it if menu popup
            if (hidden && widget.setHidden) {
              widget.setHidden(hidden);
            } else if (widget.setHidden && controller.isInChromeBar()) {
              widget.setHidden(hidden);
            }
          }
        }
      };
    });
  });
