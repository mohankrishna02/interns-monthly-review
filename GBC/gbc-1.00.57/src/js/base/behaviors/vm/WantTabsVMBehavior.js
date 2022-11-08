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

modulum('WantTabsVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling wantTabs attribute in textedit
     * @class WantTabsVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WantTabsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.WantTabsVMBehavior.prototype */ {
        __name: "WantTabsVMBehavior",

        watchedAttributes: {
          anchor: ['wantTabs']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setWantTabs) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var wantTabs = decoratorNode.attribute('wantTabs');
            widget.setWantTabs(wantTabs === 1);
          }
        }
      };
    });
  });
