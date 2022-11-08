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

modulum('WebComponentLayoutInfoVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class WebComponentLayoutInfoVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WebComponentLayoutInfoVMBehavior = context.oo.Singleton(cls.BehaviorBase, function() {
      return /** @lends classes.WebComponentLayoutInfoVMBehavior.prototype */ {
        __name: "WebComponentLayoutInfoVMBehavior",

        watchedAttributes: {
          anchor: ['height']
        },

        /**
         *
         */
        _apply: function(controller) {
          var widget = controller.getWidget(),
            anchorNode = controller.getNodeBindings().anchor,
            layoutInfoNode = controller.getNodeBindings().decorator || anchorNode;
          if (widget && widget.getLayoutInformation) {
            var info = widget.getLayoutInformation();
            if (info) {

              info.getStretched().setDefaultX(true);
              info.getStretched().setDefaultY(true);
              info.setXStretched(true);
              info.setYStretched(true);
              info.forcedMinimalWidth = 300;
              info.forcedMinimalHeight = 300;
              info.forceMinimalFixedHeight = !layoutInfoNode.attribute('height');
            }
          }
        }
      };
    });
  });
