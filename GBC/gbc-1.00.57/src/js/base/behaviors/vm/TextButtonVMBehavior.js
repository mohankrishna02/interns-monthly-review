/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TextButtonVMBehavior', ['BehaviorBase'],
  /**
   * Manage "Text" attribute only for Button
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class TextButtonVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TextButtonVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TextButtonVMBehavior.prototype */ {
        __name: "TextButtonVMBehavior",

        watchedAttributes: {
          anchor: ['text', 'name', 'actionIdRef']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setText) {
            var anchorNode = controller.getAnchorNode();
            var text = anchorNode.attribute('text');
            var isTextDefined = anchorNode.isAttributeSetByVM('text');
            if (!isTextDefined) { // for actions if there is no text we use name attribute
              var actionName = anchorNode.attribute('name');
              if (actionName) {
                var actionNode = anchorNode.getApplication().getActionApplicationService().getActiveDialogAction(actionName);
                if (actionNode) {
                  text = actionNode.attribute('text');
                }
              }
            }
            //remove first occurence of & symbol (quick shortcut not available in webclient)
            text = text.toString().replace(/&(.)/g, "$1");
            widget.setText(text);
          }
        }
      };
    });
  });
