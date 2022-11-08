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

modulum('WantFixedPageSizeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the stretchable scrollGrid
     * @class WantFixedPageSizeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WantFixedPageSizeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.WantFixedPageSizeVMBehavior.prototype */ {
        __name: "WantFixedPageSizeVMBehavior",

        watchedAttributes: {
          anchor: ['wantFixedPageSize']
        },

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFixedPageSize) {
            var anchorNode = controller.getAnchorNode();
            var wantFixedPageSize = anchorNode.attribute('wantFixedPageSize');
            widget.setFixedPageSize(wantFixedPageSize === 1);
          }
        }
      };
    });
  });
