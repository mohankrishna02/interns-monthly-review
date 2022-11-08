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

modulum('RipGraphicController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class RipGraphicController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.RipGraphicController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.RipGraphicController.prototype */ {
        __name: "RipGraphicController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.RipGraphicTypeVMBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

        },
      };
    });
    cls.ControllerFactory.register("RipGraphic", cls.RipGraphicController);

  });
