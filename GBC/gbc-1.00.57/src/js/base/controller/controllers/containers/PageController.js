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

modulum('PageController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class PageController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.PageController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.PageController.prototype */ {
        __name: "PageController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // ui behaviors
          this._addBehavior(cls.OnClickUIBehavior);
          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.FontColor4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
        },

        /**
         *
         * @param {string=} type
         * @returns {classes.WidgetBase}
         * @protected
         */
        _createWidget: function(type) {
          var pageWidget = $super._createWidget.call(this, type);
          var parentPageWidget = null;
          var parentPageNode = this.getAnchorNode().getAncestor("Page");
          if (parentPageNode) {
            parentPageWidget = parentPageNode.getController().getWidget();
          }
          pageWidget.emit(context.constants.widgetEvents.ready, parentPageWidget);
          return pageWidget;
        },

        /**
         * @inheritDoc
         */
        ensureVisible: function(executeAction) {
          var folderWidget = this.getAnchorNode().getParentNode().getController().getWidget();
          folderWidget.setCurrentPage(this.getWidget(), executeAction === true);
          folderWidget.emit(context.constants.widgetEvents.splitViewChange, this.getWidget());
          return $super.ensureVisible.call(this, executeAction);
        }
      };
    });
    cls.ControllerFactory.register("Page", cls.PageController);

  });
