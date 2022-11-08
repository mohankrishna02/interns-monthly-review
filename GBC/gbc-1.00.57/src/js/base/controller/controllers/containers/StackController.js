/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('StackController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class StackController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.StackController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.StackController.prototype */ {
        __name: "StackController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          // ui behaviors
        }
      };
    });
    cls.ControllerFactory.register("Stack", cls.StackController);

  });
