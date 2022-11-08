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

modulum('GroupController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class GroupController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.GroupController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.GroupController.prototype */ {
        __name: "GroupController",

        /**
         * @inheritDoc
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);
          this._addBehavior(cls.Collapsible4STBehavior);
          this._addBehavior(cls.CollapserPosition4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          // ui behaviors
          this._addBehavior(cls.GridAutomaticStack4STBehavior);
        },

        /**
         * @inheritDoc
         */
        ensureVisible: function(executeAction) {
          var widget = this.getAnchorNode().getWidget(),
            result = widget.setCollapsed(false);
          widget.emit(context.constants.widgetEvents.splitViewChange, widget);
          return result || $super.ensureVisible.call(this, executeAction);
        }
      };
    });
    cls.ControllerFactory.register("Group", cls.GroupController);

  });
