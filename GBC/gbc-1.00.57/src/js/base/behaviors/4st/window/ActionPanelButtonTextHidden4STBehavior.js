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

modulum('ActionPanelButtonTextHidden4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ActionPanelButtonTextHidden4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ActionPanelButtonTextHidden4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ActionPanelButtonTextHidden4STBehavior.prototype */ {
        __name: "ActionPanelButtonTextHidden4STBehavior",

        usedStyleAttributes: ["actionPanelButtonTextHidden", "ringMenuButtonTextHidden"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var panelNode = controller.getAnchorNode();

          var buttonTextHidden = null;
          if (panelNode.getTag() === 'Menu') {
            buttonTextHidden = panelNode.getStyleAttribute("ringMenuButtonTextHidden");
          } else {
            buttonTextHidden = panelNode.getStyleAttribute("actionPanelButtonTextHidden");
          }
          if (widget) {
            var i = 0,
              children = widget.getChildren(),
              len = children.length;
            for (; i < len; i++) {
              var child = children[i];
              if (child && child.setTextHidden) {
                child.setTextHidden(buttonTextHidden);
              }
            }
          }
        }
      };
    });
  });
