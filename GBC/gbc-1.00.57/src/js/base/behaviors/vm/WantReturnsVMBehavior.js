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

modulum('WantReturnsVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling wantTabs attribute in textedit
     * @class WantReturnsVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WantReturnsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.WantReturnsVMBehavior.prototype */ {
        __name: "WantReturnsVMBehavior",

        watchedAttributes: {
          anchor: ['wantReturns']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setWantReturns) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var wantReturns = decoratorNode.attribute('wantReturns');
            widget.setWantReturns(wantReturns === 1);
          }
        }
      };
    });
  });
