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

modulum('FirstDayOfWeek4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class FirstDayOfWeek4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.FirstDayOfWeek4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.FirstDayOfWeek4STBehavior.prototype */ {
        __name: "FirstDayOfWeek4STBehavior",

        usedStyleAttributes: ["firstDayOfWeek"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFirstDayOfWeek) {
            var firstDayOfWeek = controller.getAnchorNode().getStyleAttribute('firstDayOfWeek');
            widget.setFirstDayOfWeek(firstDayOfWeek);
          }
        }
      };
    });
  });
