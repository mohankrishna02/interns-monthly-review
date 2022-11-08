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

modulum('AutoScaleVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class AutoScaleVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.AutoScaleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.AutoScaleVMBehavior.prototype */ {
        __name: "AutoScaleVMBehavior",

        watchedAttributes: {
          decorator: ['autoScale', 'sizePolicy', 'stretch']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setAutoScale) {
            var bindings = controller.getNodeBindings();
            var node = bindings.decorator ? bindings.decorator : bindings.anchor;
            var autoScale = node.attribute('autoScale');
            var sizePolicy = node.attribute('sizePolicy');
            var hasStretch = node.isAttributeSetByVM('stretch');
            if (widget.setStretch) {
              widget.setStretch(hasStretch);
            }
            widget.setAutoScale(((sizePolicy === 'fixed' || hasStretch) && Boolean(autoScale)) || (sizePolicy === 'initial' &&
              Boolean(autoScale)));
          }
        }
      };
    });
  });
