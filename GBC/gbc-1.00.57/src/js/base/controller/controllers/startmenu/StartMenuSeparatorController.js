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

modulum('StartMenuSeparatorController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class StartMenuSeparatorController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.StartMenuSeparatorController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.StartMenuSeparatorController.prototype */ {
        __name: "StartMenuSeparatorController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
        },
        _getWidgetType: function(kind) {
          var type;
          switch (kind) {
            case "poptree":
              // poptree isn't implemented, using tree instead
              /* falls through */
            case "tree":
              type = 'StartMenuSeparator';
              break;
            case "menu":
              type = 'TopMenuSeparator';
              break;
          }
          return type;
        }
      };
    });
    cls.ControllerFactory.register("StartMenuSeparator", cls.StartMenuSeparatorController);

  });
