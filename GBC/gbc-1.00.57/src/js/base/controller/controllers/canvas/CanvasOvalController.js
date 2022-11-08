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

modulum('CanvasOvalController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class CanvasOvalController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.CanvasOvalController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.CanvasOvalController.prototype */ {
        __name: "CanvasOvalController",

        _initBehaviors: function() {
          this._addBehavior(cls.CanvasOvalParametersVMBehavior);
          this._addBehavior(cls.CanvasFillColorVMBehavior);
          this._addBehavior(cls.CanvasItemOnClickUIBehavior);
        }
      };
    });
    cls.ControllerFactory.register("CanvasOval", cls.CanvasOvalController);

  });
