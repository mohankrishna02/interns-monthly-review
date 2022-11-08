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

modulum('RipGraphicTypeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class RipGraphicTypeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.RipGraphicTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.RipGraphicTypeVMBehavior.prototype */ {
        __name: "RipGraphicTypeVMBehavior",

        watchedAttributes: {
          anchor: ['type']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          controller.getWidget().setType(controller.getAnchorNode().attribute('type'));
        }
      };
    });
  });
