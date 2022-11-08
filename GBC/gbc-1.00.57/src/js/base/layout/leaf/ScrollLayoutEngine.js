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

modulum('ScrollLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class ScrollLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    // TODO why it is a layoutEngienBase or why it is in leaf directory ?
    cls.ScrollLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function() {
      return /** @lends classes.ScrollLayoutEngine.prototype */ {
        __name: "ScrollLayoutEngine",

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var parentWidget = this._widget.getParentWidget();
          var parentLayoutInfo = this._getLayoutInfo(parentWidget);
          // widget => scroll Widget

          // Calculate needed values
          var widgetHeight = parentLayoutInfo.getAllocated()._height;
          var lineHeight = parentWidget.getRowHeight ? parentWidget.getRowHeight() : (parseFloat(widgetHeight) / this._widget._pageSize) ||
            0;

          if (lineHeight === 0 && parentWidget._isGridChildrenInParent && this._widget._pageSize > 0) {
            lineHeight = parentLayoutInfo.getAllocated().getHeight() / this._widget._pageSize;
            var allocatedSize = parentLayoutInfo.getAllocated();
            parentLayoutInfo.setMeasured(allocatedSize.getWidth(), allocatedSize.getHeight());
          }

          this._widget.setLineHeight(lineHeight);
          this._widget.setTotalHeight(lineHeight * this._widget._size);

          this._widget.setVisibleHeight(widgetHeight);
          if (this._widget.refreshScroll) {
            this._widget.refreshScroll();
          }
        }
      };
    });
  });
