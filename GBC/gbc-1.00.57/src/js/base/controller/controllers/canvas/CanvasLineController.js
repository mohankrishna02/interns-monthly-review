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

modulum('CanvasLineController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class CanvasLineController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.CanvasLineController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.CanvasLineController.prototype */ {
        __name: "CanvasLineController",

        _initBehaviors: function() {
          this._addBehavior(cls.CanvasLineParametersVMBehavior);
          this._addBehavior(cls.CanvasFillColorVMBehavior);
          this._addBehavior(cls.CanvasItemOnClickUIBehavior);
        }
      };
    });
    cls.ControllerFactory.register("CanvasLine", cls.CanvasLineController);

  });
