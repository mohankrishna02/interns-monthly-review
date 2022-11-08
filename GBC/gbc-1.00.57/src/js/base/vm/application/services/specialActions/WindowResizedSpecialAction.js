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

modulum('WindowResizedSpecialAction', ['ActionApplicationService'],
  function(context, cls) {
    /**
     * @class WindowResizedSpecialAction
     * @memberOf classes
     */
    cls.WindowResizedSpecialAction = context.oo.Class(function() {
      return /** @lends classes.WindowResizedSpecialAction.prototype */ {
        __name: "WindowResizedSpecialAction",
        /** @type {classes.ActionApplicationService} */
        _actionService: null,
        _listener: null,
        constructor: function(actionService) {
          this._actionService = actionService;
          this._listener = context.HostService.onScreenResize(this._onResized.debounce().bind(this));
        },

        destroy: function() {
          if (this._listener) {
            this._listener();
            this._listener = null;
          }
          this._actionService = null;
        },
        _onResized: function() {
          if (this._actionService && this._actionService.hasAction("windowresized")) {
            this._actionService.executeByName("windowresized");
          }
        }
      };
    });
    cls.ActionApplicationService.registerSpecialAction("windowresized", cls.WindowResizedSpecialAction);
  });
