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

modulum('BackgroundColorMessageVMBehavior', ['BackgroundColorVMBehavior'],
  function(context, cls) {
    /**
     * @class BackgroundColorMessageVMBehavior
     * @memberOf classes
     * @extends classes.BackgroundColorVMBehavior
     */
    cls.BackgroundColorMessageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.BackgroundColorMessageVMBehavior.prototype */ {
        __name: "BackgroundColorMessageVMBehavior",

        watchedAttributes: {
          anchor: ['color', 'reverse', 'type']
        },

        /**
         * Applies the background color only if it has been defined by the VM, use default value otherwise.
         */
        _apply: function(controller, data) {
          var messageNode = controller.getAnchorNode();
          var widget = controller.getWidget();
          if (widget) {
            widget.getElement().setAttribute("__" + widget.__name + "_type", messageNode.attribute('type'));
          }
          var isError = messageNode.attribute('type') === 'error';
          var kind = isError ? 'error' : 'message';
          var color = messageNode.getStyleAttribute("backgroundColor", [kind]);
          if (color) {
            controller.getWidget().setBackgroundColor(color);
          } else {
            if (messageNode.isAttributeSetByVM('color')) {
              cls.BackgroundColorVMBehavior._apply(controller, data);
            } else {
              if (isError) {
                widget.setBackgroundColor(context.ThemeService.getValue("theme-error-background-color"));
              } else {
                widget.setBackgroundColor("");
              }
            }
          }
        }
      };
    });
  });
