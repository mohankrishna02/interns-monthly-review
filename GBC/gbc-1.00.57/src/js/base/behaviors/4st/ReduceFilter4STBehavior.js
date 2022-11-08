/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ReduceFilter4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ReduceFilter4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.ReduceFilter4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ReduceFilter4STBehavior.prototype */ {
        __name: "ReduceFilter4STBehavior",

        usedStyleAttributes: ["reduceFilter"],
        watchedAttributes: {
          anchor: ['noFilter']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setReduceFilter) {

            var noFilter = controller.getAnchorNode().attribute("noFilter") === 1;
            var reduceFilter = controller.getAnchorNode().getStyleAttribute('reduceFilter');

            if (reduceFilter === null) { // reduceFilter is not defined in 4ST use theme default value
              reduceFilter = context.ThemeService.getValue("theme-default-reduceFilter");
            } else {
              reduceFilter = this.isSAYesLike(reduceFilter);
            }

            widget.setReduceFilter(reduceFilter && !noFilter);
          }
        }
      };
    });
  });
