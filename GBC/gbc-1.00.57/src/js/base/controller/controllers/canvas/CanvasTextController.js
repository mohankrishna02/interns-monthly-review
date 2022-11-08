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

modulum('CanvasTextController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class CanvasTextController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.CanvasTextController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.CanvasTextController.prototype */ {
        __name: "CanvasTextController",

        _initBehaviors: function() {
          this._addBehavior(cls.CanvasTextParametersVMBehavior);
          this._addBehavior(cls.CanvasFillColorVMBehavior);
          this._addBehavior(cls.CanvasItemOnClickUIBehavior);
        },

        onAfterLayout: function() {
          this.applyBehaviors(null, true);
        }
      };
    });
    cls.ControllerFactory.register("CanvasText", cls.CanvasTextController);

  });
