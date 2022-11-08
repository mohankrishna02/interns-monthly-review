/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableColumnLayoutEngine', ['LeafLayoutEngine'],
  function(context, cls) {
    /**
     * @class TableColumnLayoutEngine
     * @memberOf classes
     * @extends classes.LeafLayoutEngine
     */
    cls.TableColumnLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      return /** @lends classes.TableColumnLayoutEngine.prototype */ {
        __name: "TableColumnLayoutEngine",

        /**
         * reset column first item width layout
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          var item = this._widget.getChildren()[0];
          if (item) {
            var widget = item.getChildren()[0];
            if (widget) {
              widget._layoutInformation.reset(true);
              widget._layoutEngine.reset(true);
            }
          }
        },

        /**
         * Set size policy mode as fixed on first column item widget
         */
        prepareMeasure: function() {
          $super.prepareMeasure.call(this);

          var item = this._widget.getChildren()[0];
          if (item) {
            var widget = item.getChildren()[0];
            if (widget) {
              widget.getLayoutInformation().setSizePolicyMode("fixed");

              var charSize = this._widget.getParentWidget().getLayoutInformation().getCharSize();
              widget.getLayoutInformation().setCharSize(charSize.getWidthM(), charSize.getWidth0(), charSize.getHeight());
            }
          }
        },

        /**
         * Get DOM measure of column first item widget and set it as row measure on column layout
         */
        DOMMeasure: function() {
          var item = this._widget.getChildren()[0];
          if (item) {
            var widget = item.getChildren()[0];
            if (widget) {
              var widgetRawMeasure = widget.getLayoutInformation().getRawMeasure();
              this._getLayoutInfo().setRawMeasure(widgetRawMeasure.getWidth(), widgetRawMeasure.getHeight());
            }
          }
        },

        /**
         * Measure column first item widget and copy its measure on column layout
         */
        measure: function() {
          $super.measure.call(this);

          if (!this._widget._firstWidgetMeasured) {
            var item = this._widget.getChildren()[0];
            if (item) {
              var widget = item.getChildren()[0];
              if (widget) {

                var measuredWidth = widget.getLayoutInformation().getMeasured().getWidth();
                var preferredWidth = widget.getLayoutInformation().getPreferred().getWidth();
                var measuredHeight = widget.getLayoutInformation().getMeasured().getHeight();
                var preferredHeight = widget.getLayoutInformation().getPreferred().getHeight();

                var width = Math.round(Math.max(measuredWidth, preferredWidth));
                this._widget.setInitialWidth(width);
                this._getLayoutInfo().setPreferred(width, preferredHeight);
                this._getLayoutInfo().setMeasured(width, measuredHeight);

                this._widget._firstWidgetMeasured = true;
              }
            }
          }

        },

        /**
         * Apply store settings or measured width if no store settings on column
         */
        applyLayout: function() {
          var defaultWidth = this._widget.getDefaultWidth();
          this._widget.setWidth(defaultWidth === null ? this._getLayoutInfo().getPreferred().getWidth() : defaultWidth);
        },

        /**
         * Returns column first item widget as renderable on first launch and then empty array to not measure anymore
         */
        getRenderableChildren: function() {
          var children = [];
          if (this._widget && !this._widget._firstWidgetMeasured && this._widget.getChildren) {
            var item = this._widget.getChildren()[0];
            if (item && item.getChildren) {
              children = item.getChildren();
            }
          }
          return children;
        }
      };
    });
  });
