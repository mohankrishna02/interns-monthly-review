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

modulum('ActionPanelPosition4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ActionPanelPosition4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ActionPanelPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ActionPanelPosition4STBehavior.prototype */ {
        __name: "ActionPanelPosition4STBehavior",

        usedStyleAttributes: ["actionPanelPosition"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var panelNode = controller.getAnchorNode();
          var isInChromeBar = controller.isInChromeBar();

          var actionPanelPosition = panelNode.getStyleAttribute("actionPanelPosition");
          if (widget && widget.setActionPanelPosition) {
            if (!isInChromeBar) {
              if (actionPanelPosition) {
                widget.setActionPanelPosition(actionPanelPosition);
              } else {
                widget.setActionPanelPosition('right');
              }
            }
          }
        }
      };
    });
  });
