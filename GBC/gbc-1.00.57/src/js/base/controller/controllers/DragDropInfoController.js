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

modulum('DragDropInfoController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class DragDropInfoController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.DragDropInfoController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.DragDropInfoController.prototype */ {
        __name: "DragDropInfoController",

        /**
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          $super.constructor.call(this, bindings);

          var anchor = this.getNodeBindings().anchor;
          // vm behaviors
          this._addBehavior(cls.DndAcceptedVMBehavior);

          context.DndService.dragDropInfoNode = anchor;
          context.DndService.dndAccepted = false;
        },

        /**
         *
         */
        destroy: function() {
          $super.destroy.call(this);

          context.DndService.dragDropInfoNode = null;
          context.DndService.dndAccepted = false;
        },

        createWidget: function() {
          // DragDropInfo don't create own widgets
          return null;
        }
      };
    });
    cls.ControllerFactory.register("DragDropInfo", cls.DragDropInfoController);
  });
