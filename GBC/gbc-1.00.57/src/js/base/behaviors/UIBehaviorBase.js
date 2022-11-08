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

modulum('UIBehaviorBase', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class UIBehaviorBase
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.UIBehaviorBase = context.oo.Class(cls.BehaviorBase, function($super) {
      return /** @lends classes.UIBehaviorBase.prototype */ {
        __name: "UIBehaviorBase",
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {}
      };
    });
  });
