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

modulum('VBoxController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class VBoxController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.VBoxController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.VBoxController.prototype */ {
        __name: "VBoxController",
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
          this._addBehavior(cls.SplitterVMBehavior);

          // ui behaviors
          this._addBehavior(cls.OnSplitterUIBehavior);
        },
        /**
         * @inheritDoc
         */
        ensureVisible: function(executeAction) {
          var widget = this.getAnchorNode().getWidget();
          widget.emit(context.constants.widgetEvents.splitViewChange, widget);
          return $super.ensureVisible.call(this, executeAction);
        }
      };
    });
    cls.ControllerFactory.register("VBox", cls.VBoxController);

  });
