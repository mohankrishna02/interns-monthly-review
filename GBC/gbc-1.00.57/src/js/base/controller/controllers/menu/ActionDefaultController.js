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

modulum('ActionDefaultController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class ActionDefaultController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.ActionDefaultController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.ActionDefaultController.prototype */ {
        __name: "ActionDefaultController",

        constructor: function(bindings) {
          $super.constructor.call(this, bindings);
        },

        /**
         * @inheritDoc
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // vm behaviors
          this._addBehavior(cls.ActionDefaultAcceleratorVMBehavior);
        },

        /**
         * @inheritDoc
         */
        createWidget: function() {
          return null;
        },
      };
    });
    cls.ControllerFactory.register("ActionDefault", cls.ActionDefaultController);

  });
