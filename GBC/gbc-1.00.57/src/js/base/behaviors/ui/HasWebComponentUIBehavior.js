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

modulum('HasWebComponentUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class HasWebComponentUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.HasWebComponentUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.HasWebComponentUIBehavior.prototype */ {
        /** @type {string} */
        __name: "HasWebComponentUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget() && controller.getWidget()._iframeElement) {
            var parentNode = controller.getAnchorNode().getParentNode();
            while (parentNode) {
              if (parentNode.getWidget() && parentNode.getWidget().setHasChildWebComponent) {
                parentNode.getWidget().setHasChildWebComponent(true);
              }
              parentNode = parentNode.getParentNode();
            }
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          //TODO many Webcomp

        }

      };
    });
  });
