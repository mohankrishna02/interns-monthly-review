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

modulum('ListViewLayoutEngine', ['TableLayoutEngineBase'],
  function(context, cls) {
    /**
     * @class ListViewLayoutEngine
     * @memberOf classes
     * @extends classes.TableLayoutEngineBase
     */
    cls.ListViewLayoutEngine = context.oo.Class(cls.TableLayoutEngineBase, function($super) {
      return /** @lends classes.ListViewLayoutEngine.prototype */ {
        __name: "ListViewLayoutEngine",

        /** @type boolean */
        _firstWidgetMeasured: false,

        /**
         * @inheritDoc
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          this._firstWidgetMeasured = false;
        },

        /**
         * @inheritDoc
         */
        measure: function() {
          $super.measure.call(this);
          var layoutInfo = this._widget.getLayoutInformation();

          var computePreferredWidth = 0;
          if (!this._firstWidgetMeasured && layoutInfo._charSize.hasSize()) {
            // measure first widget of first row to initialize row height of listview
            var rowWidget = this._widget.getChildren()[0];
            if (rowWidget) {
              var widget = rowWidget.getChildren()[0];
              if (widget) {
                widget._layoutInformation._charSize = layoutInfo._charSize;
                widget._layoutInformation.getSizePolicyConfig().mode = "fixed";
                widget._layoutInformation.updatePreferred();
                widget._layoutEngine.DOMMeasure();
                widget._layoutEngine.measureDecoration();
                widget._layoutEngine.measure();
                widget._layoutEngine.afterMeasure();

                var height = widget._layoutInformation.getMeasured().getHeight();
                if (rowWidget.getLineCount() === 1) {
                  height = height * cls.ListViewWidget.defaultOneLineHeightRatio;
                } else if (rowWidget.getLineCount() === 2) {
                  height = height * cls.ListViewWidget.defaultTwoLinesHeightRatio;
                }
                computePreferredWidth = widget._layoutInformation.getMeasured().getWidth();

                this._widget.setRowHeight(Math.round(height));

                this._firstWidgetMeasured = true;
              }
            }
          }

          // Compute preferred size
          if (!this._initialPreferredSize) {
            this._initialPreferredSize = true;
            var rowHeight = this._widget.getRowHeight();
            var sizeHint = layoutInfo.getSizeHint();
            layoutInfo.getPreferred().setWidth(Math.round(computePreferredWidth));
            if (sizeHint.getHeight()) {
              // translate height into number of rows
              var preferredPageSize = Math.max(this._translateHeight(sizeHint.getHeight(), layoutInfo.getCharSize().getHeight(),
                rowHeight), 1);
              this._widget._firstPageSize = preferredPageSize;
            }
            var h = this._widget._firstPageSize ? this._widget._firstPageSize * rowHeight : 1;
            layoutInfo.getPreferred().setHeight(Math.round(h + layoutInfo.getDecorating().getHeight()));
          }
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          var scrollAreaElementHeight = this._widget.getScrollableArea().offsetHeight;
          var decorateHeight = this._widget.getElement().offsetHeight - scrollAreaElementHeight;
          var scrollAreaElementWidth = this._widget.getScrollableArea().offsetWidth;
          var decorateWidth = this._widget.getElement().offsetWidth - scrollAreaElementWidth;

          this._getLayoutInfo().setDecorating(decorateWidth + window.scrollBarSize, decorateHeight);
        }

      };
    });
  });
