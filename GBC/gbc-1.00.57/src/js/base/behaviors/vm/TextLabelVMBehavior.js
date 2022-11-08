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

modulum('TextLabelVMBehavior', ['BehaviorBase'],
  /**
   * Manage "Text" attribute only for Label widgets
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class TextLabelVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TextLabelVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TextLabelVMBehavior.prototype */ {
        __name: "TextLabelVMBehavior",

        watchedAttributes: {
          anchor: ['text']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setValue) { // for label the function to change text is setValue
            var textNode = controller.getAnchorNode();
            var text = textNode.attribute('text');
            widget.setValue(text);
          }
        }
      };
    });
  });
