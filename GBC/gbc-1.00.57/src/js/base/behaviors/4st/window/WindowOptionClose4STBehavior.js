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

modulum('WindowOptionClose4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class WindowOptionClose4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WindowOptionClose4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.WindowOptionClose4STBehavior.prototype */ {
        __name: "WindowOptionClose4STBehavior",

        watchedAttributes: {
          ui: ['currentWindow']
        },
        usedStyleAttributes: ["windowOptionClose"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var windowNode = controller.getAnchorNode();

          var windowOptionClose = windowNode.getStyleAttribute("windowOptionClose");
          if (widget) {
            if (this.isSAYesLike(windowOptionClose)) {
              var currentWindow = controller.getAnchorNode() &&
                controller.getAnchorNode().getParentNode() &&
                controller.getAnchorNode().getParentNode().attribute("currentWindow");
              context.HostService.setClosableWindowActionActive(widget, currentWindow === controller.getAnchorNode().getId());
            } else if (windowOptionClose !== null) {
              context.HostService.setClosableWindowActionActive(widget, false);
            }
          }
        }
      };
    });
  });
