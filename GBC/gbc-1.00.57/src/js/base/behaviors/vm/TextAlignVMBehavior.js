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

modulum('TextAlignVMBehavior', ['BehaviorBase'],
  function(context, cls) {

    /**
     * @class TextAlignVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TextAlignVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TextAlignVMBehavior.prototype */ {
        __name: "TextAlignVMBehavior",

        watchedAttributes: {
          anchor: ['numAlign'],
          container: ['numAlign'],
          decorator: ['justify']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var justifyNode = bindings.decorator ? bindings.decorator : bindings.anchor;
          var numAlignNode = bindings.container ? bindings.container : bindings.anchor;
          var widget = controller.getWidget();

          if (widget && widget.setTextAlign) {
            var textAlign = null;

            if (justifyNode.isAttributeSetByVM('justify')) {
              textAlign = justifyNode.attribute('justify');
            } else if (numAlignNode.attribute('numAlign') === 1) {
              textAlign = 'right';
            }

            widget.setTextAlign(textAlign);

          }
        }
      };
    });
  });
