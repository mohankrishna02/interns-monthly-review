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

modulum('DaysOff4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class DaysOff4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.DaysOff4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.DaysOff4STBehavior.prototype */ {
        __name: "DaysOff4STBehavior",

        usedStyleAttributes: ["daysOff"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setDisabledDays) {
            var daysOff = controller.getAnchorNode().getStyleAttribute('daysOff');
            widget.setDisabledDays(daysOff);
          }
        }
      };
    });
  });
