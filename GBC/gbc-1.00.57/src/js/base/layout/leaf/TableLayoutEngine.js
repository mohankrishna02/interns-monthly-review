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

modulum('TableLayoutEngine', ['TableLayoutEngineBase'],
  function(context, cls) {
    /**
     * @class TableLayoutEngine
     * @memberOf classes
     * @extends classes.TableLayoutEngineBase
     */
    cls.TableLayoutEngine = context.oo.Class(cls.TableLayoutEngineBase, function($super) {
      return /** @lends classes.TableLayoutEngine.prototype */ {
        __name: "TableLayoutEngine",

        /**
         * reset table measured flag
         */
        invalidatePreferredSize: function() {
          this._initialPreferredSize = false;
        },

        /**
         * @inheritDoc
         */
        measure: function() {
          $super.measure.call(this);

          if (!this._initialPreferredSize) {

            var layoutInfo = this._widget.getLayoutInformation();

            // get measured width and height of each columns
            var columns = this._widget.getColumns(),
              len = columns.length,
              i, perVisibleColumn = [];
            var computePreferredWidth = 0;
            var rowHeight = 0;
            for (i = 0; i < len; i++) {
              var columnWidget = columns[i];

              // max measured column item height is used as global row height
              if (!columnWidget.isHidden()) {
                var height = columnWidget.getLayoutInformation().getMeasured().getHeight();
                if (Math.round(height) > rowHeight) {
                  rowHeight = height;
                  this._widget.setRowHeight(height);
                }

                // get sum of all columns width
                var width = columnWidget.getLayoutInformation().getPreferred().getWidth();
                perVisibleColumn.push(width);
                computePreferredWidth += width;
              }
            }

            // Compute preferred size
            this._initialPreferredSize = true;
            var sizeHint = layoutInfo.getSizeHint();
            if (!sizeHint.getWidth()) {
              layoutInfo.getPreferred().setWidth(Math.round(computePreferredWidth));
            } else if (cls.Size.isCols(sizeHint.getWidth())) {
              var count = parseInt(sizeHint.getWidth(), 10),
                colsLen = perVisibleColumn.slice(0, count).reduce(function(pv, cv) {
                  return pv + cv;
                }, 0);
              layoutInfo.getPreferred().setWidth(Math.round(colsLen));
            }
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
          var footerElement = this._widget.hasFooter() ? this._widget.getColumnsFooter() : null;
          var scrollAreaElementWidth = this._widget.getScrollableArea().offsetWidth;
          if (this._widget.hasLeftFrozenColumns()) {
            scrollAreaElementWidth += this._widget.getLeftScrollableArea().offsetWidth;
          }
          if (this._widget.hasRightFrozenColumns()) {
            scrollAreaElementWidth += this._widget.getRightScrollableArea().offsetWidth;
          }

          // computation of decorationHeight and decorationWidth are not the same because of g_measuring css rules in TableWidget.scss
          var decorateHeight = this._widget.getElement().offsetHeight + (
            footerElement ? footerElement.offsetHeight : 0
          );
          var decorateWidth = this._widget.getElement().offsetWidth - scrollAreaElementWidth;

          this._getLayoutInfo().setDecorating(decorateWidth + window.scrollBarSize, decorateHeight + window.scrollBarSize);
        },

        /**
         * @inheritDoc
         */
        applyLayout: function() {
          // set correct width of the table when measuring to avoid reset of horizontal scrollbar
          $super.applyLayout.call(this);
          this._widget.setStyle({
            preSelector: ".g_measuring ",
            selector: ".g_measureable",
            appliesOnRoot: true
          }, {
            width: this._getLayoutInfo().getAllocated().getWidth() + "px !important",
          });
        },

        /**
         * Returns table columns as renderable children
         */
        getRenderableChildren: function() {
          var children = [];
          if (this._widget && this._widget.isElementInDOM() && this._widget.getChildren) {
            children = this._widget.getChildren();
          }
          return children;
        }
      };
    });
  });
