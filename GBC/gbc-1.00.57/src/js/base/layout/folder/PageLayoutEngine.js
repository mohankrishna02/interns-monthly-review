/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('PageLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class PageLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.PageLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.PageLayoutEngine.prototype */ {
        __name: "PageLayoutEngine",

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
        DOMMeasure: function() {
          $super.DOMMeasure.call(this);
          if (this._widget._title) {
            var info = this._getLayoutInfo(),
              title = this._widget._title.getElement().getBoundingClientRect();
            info.setTitleMeasureWidth(title.width);
            info.setTitleMeasureHeight(title.height);
          }
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          var layoutInfo = this._getLayoutInfo(),
            child = this._widget.getChildren()[0];
          if (child) {
            var widgetInfo = this._getLayoutInfo(child);
            layoutInfo.setMeasured(widgetInfo.getMeasured().getWidth(), widgetInfo.getMeasured().getHeight());
            layoutInfo.setMinimal(widgetInfo.getMinimal().getWidth(), widgetInfo.getMinimal().getHeight());
            layoutInfo.setMaximal(widgetInfo.getMaximal().getWidth(), widgetInfo.getMaximal().getHeight());
            layoutInfo.setPreferred(widgetInfo.getPreferred().getWidth(), widgetInfo.getPreferred().getHeight());
          }
        },

        /**
         * @inheritDoc
         */
        adjustStretchability: function() {
          var layoutInfo = this._getLayoutInfo(),
            child = this._widget.getChildren()[0];
          if (child) {
            var widgetInfo = this._getLayoutInfo(child);
            if (widgetInfo.isXStretched() || widgetInfo.isChildrenXStretched()) {
              layoutInfo.addChildrenStretchX(this._widget.getLayoutInformation());
            }
            if (widgetInfo.isYStretched() || widgetInfo.isChildrenYStretched()) {
              layoutInfo.addChildrenStretchY(this._widget.getLayoutInformation());
            }
          }
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var layoutInfo = this._getLayoutInfo(),
            child = this._widget.getChildren()[0];
          if (child) {
            var widgetInfo = this._getLayoutInfo(child);
            widgetInfo.setAvailable(
              layoutInfo.getAvailable().getWidth(),
              layoutInfo.getAvailable().getHeight()
            );
            widgetInfo.setAllocated(
              layoutInfo.getAvailable().getWidth(),
              layoutInfo.getAvailable().getHeight()
            );
          }
        }
      };
    });
  });
