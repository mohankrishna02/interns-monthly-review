/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('SplitViewLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class SplitViewLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.SplitViewLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.SplitViewLayoutEngine.prototype */ {
        __name: "SplitViewLayoutEngine",
        /**
         * registered children widgets
         * @type {classes.WidgetBase[]}
         * @protected
         */
        _registeredWidgets: null,
        /**
         * stylesheet id
         * @protected
         */
        _styleSheetId: null,
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._styleSheetId = "boxLayout_" + widget.getUniqueIdentifier();
          this._registeredWidgets = [];
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          for (var i = this._registeredWidgets.length - 1; i > -1; i--) {
            var wi = this._registeredWidgets[i];
            wi.destroy();
            this.unregisterChild(wi);
          }
          this._registeredWidgets.length = 0;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          context.styler.removeStyleSheet(this.getLayoutSheetId());
        },

        /**
         * @inheritDoc
         */
        resetSizes: function() {
          $super.resetSizes.call(this);
          this._getLayoutInfo().setPreferred(0, 0);
        },

        /**
         * @inheritDoc
         */
        registerChild: function(widget) {
          if (!(widget instanceof cls.SplitterWidget)) {
            if (this._registeredWidgets.indexOf(widget) === -1) {
              this._registeredWidgets.push(widget);
            }
          }
        },

        /**
         * @inheritDoc
         */
        unregisterChild: function(widget) {
          this._registeredWidgets.remove(widget);
        },

        /**
         * Get list of all registered widget being a SplitView item
         * @returns {classes.WidgetBase[]}
         */
        getRegisteredWidgets: function() {
          return this._registeredWidgets;
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          var layoutInfo = this._getLayoutInfo();
          var availWidth = layoutInfo.getAvailable().getWidth();
          var availHeight = layoutInfo.getAvailable().getHeight();
          var decoratingWidth = layoutInfo.getDecorating().getWidth();
          var decoratingHeight = layoutInfo.getDecorating().getHeight();
          var width = availWidth - decoratingWidth;
          var height = availHeight - decoratingHeight;

          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var widgetInfo = this._getLayoutInfo(this._registeredWidgets[i]);
            widgetInfo.setAvailable(width, height);
            widgetInfo.setAllocated(width, height);
          }
          layoutInfo.setAllocated(width, height);
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var layoutInfo = this._getLayoutInfo();

          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable>.splitViewContent"] = {
            height: layoutInfo.getAllocated().getHeight() + "px",
            width: layoutInfo.getAllocated().getWidth() + "px",
            top: layoutInfo.getDecoratingOffset().getHeight() + "px",
            left: layoutInfo.getDecoratingOffset().getWidth() + "px"
          };
          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() +
            ".g_measureable>.splitViewContent>.containerElement"] = {
            height: layoutInfo.getAllocated().getHeight() + "px",
            width: layoutInfo.getAllocated().getWidth() + "px"
          };
        },

        /**
         * @inheritDoc
         */
        applyLayout: function() {
          context.styler.appendStyleSheet(this._styleRules, this._styleSheetId, true, this.getLayoutSheetId());
        },
      };
    });
  });
