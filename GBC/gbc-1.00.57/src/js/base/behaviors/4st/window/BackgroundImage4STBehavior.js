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

modulum('BackgroundImage4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class BackgroundImage4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.BackgroundImage4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.BackgroundImage4STBehavior.prototype */ {
        __name: "BackgroundImage4STBehavior",

        usedStyleAttributes: ["backgroundImage"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var windowNode = controller.getAnchorNode();

          var backgroundImage = windowNode.getStyleAttribute("backgroundImage");
          if (widget && widget.setBackgroundImage) {
            widget.setBackgroundImage(backgroundImage);
          }
        }
      };
    });
  });
