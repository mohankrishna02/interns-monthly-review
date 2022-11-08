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

modulum('FontWeightVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class FontWeightVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FontWeightVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.FontWeightVMBehavior.prototype */ {
        __name: "FontWeightVMBehavior",

        watchedAttributes: {
          anchor: ['bold'],
          decorator: ['bold']
        },

        usedStyleAttributes: ["fontWeight"],

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFontWeight) {
            var bindings = controller.getNodeBindings();
            var boldNode = null;
            if (bindings.anchor.isAttributeSetByVM('bold')) {
              boldNode = bindings.anchor;
            } else if (bindings.decorator && bindings.decorator.isAttributeSetByVM('bold')) {
              boldNode = bindings.decorator;
            }
            if (boldNode) {
              var bold = boldNode.attribute('bold') === 1;
              widget.setFontWeight(bold ? "bold" : null);
            } else {
              var fontWeight = controller.getAnchorNode().getStyleAttribute('fontWeight');
              widget.setFontWeight(fontWeight);
            }
          }
        }
      };
    });
  }
);
