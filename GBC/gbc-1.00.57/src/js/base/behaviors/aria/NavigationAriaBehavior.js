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

modulum('NavigationAriaBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * // TODO comment
     * @class NavigationAriaBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.NavigationAriaBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.NavigationAriaBehavior.prototype */ {
        __name: "NavigationAriaBehavior",

        watchedAttributes: {
          anchor: ['tabIndexRt']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var parent = bindings.parent;
          var anchor = bindings.anchor;
          var widget = anchor.getWidget();
          var visibleChildren = parent.getChildrenWithAttribute("MenuAction", "hidden", 0);
          var posInSet = anchor.attribute('tabIndexRt');
          widget.setAriaAttribute("posinset", posInSet);
          widget.setAriaAttribute("setsize", visibleChildren.length);
          widget.setAriaRole("menuitem");
        },

        /**
         * @inheritDoc
         */
        destroy: function(controller, data) {
          $super.destroy.call(this, controller, data);
        }
      };
    });
  });
