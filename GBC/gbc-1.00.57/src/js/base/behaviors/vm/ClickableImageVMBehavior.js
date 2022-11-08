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

modulum('ClickableImageVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ClickableImageVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ClickableImageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ClickableImageVMBehavior.prototype */ {
        __name: "ClickableImageVMBehavior",

        watchedAttributes: {
          decorator: ['action', "actionActive"],
          anchor: ['action', "actionActive"]
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setClickableImage) {
            var imgNode = controller.getNodeBindings().decorator || controller.getNodeBindings().anchor;
            if (imgNode.isAttributeSetByVM('action') && imgNode.isAttributeSetByVM('actionActive')) {
              widget.setClickableImage(imgNode.attribute("action") && imgNode.attribute("actionActive"));
            }
          }
        }
      };
    });
  });
