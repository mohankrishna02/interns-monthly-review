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

modulum('DefaultTTFColor4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class DefaultTTFColor4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.DefaultTTFColor4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.DefaultTTFColor4STBehavior.prototype */ {
        __name: "DefaultTTFColor4STBehavior",

        usedStyleAttributes: ["defaultTTFColor"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setDefaultColor) {
            var winNode = controller.getAnchorNode().getAncestor("Window");
            var color = winNode.getStyleAttribute('defaultTTFColor');
            widget.setDefaultColor(color);
          }
        }
      };
    });
  });
