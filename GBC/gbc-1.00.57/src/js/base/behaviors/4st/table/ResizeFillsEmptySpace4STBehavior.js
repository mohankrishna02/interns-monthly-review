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

modulum('ResizeFillsEmptySpace4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ResizeFillsEmptySpace4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ResizeFillsEmptySpace4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ResizeFillsEmptySpace4STBehavior.prototype */ {
        __name: "ResizeFillsEmptySpace4STBehavior",

        usedStyleAttributes: ["resizeFillsEmptySpace"],

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();

          if (widget && widget.setResizeFillsEmptySpace) {
            var resizeFillsEmptySpace = tableNode.getStyleAttribute("resizeFillsEmptySpace");
            widget.setResizeFillsEmptySpace(this.isSAYesLike(resizeFillsEmptySpace));
          }
        }
      };
    });
  });
