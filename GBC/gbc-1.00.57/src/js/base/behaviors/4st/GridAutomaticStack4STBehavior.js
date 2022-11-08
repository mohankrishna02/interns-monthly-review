/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('GridAutomaticStack4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * Defines the render behavior of the grid.
     * Values can be:
     *    "grid": works as a standard Genero grid.
     *    "stack": will stack all elements of the grid on one cojulnm depending on their position in the AUI.
     * @class GridAutomaticStack4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.GridAutomaticStack4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.GridAutomaticStack4STBehavior.prototype */ {
        __name: "GridAutomaticStack4STBehavior",

        usedStyleAttributes: ["customWidget"],

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.getLayoutInformation) {
            var GridAutomaticStackValue = controller.getAnchorNode().getStyleAttribute('customWidget') === "automaticStack";
            widget.getLayoutInformation().setGridAutomaticStack(GridAutomaticStackValue);
            return true;
          }
        }
      };
    });
  });
