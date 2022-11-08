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

modulum('TableLayoutEngineBase', ['LeafLayoutEngine'],
  function(context, cls) {
    /**
     * @class TableLayoutEngineBase
     * @memberOf classes
     * @extends classes.LeafLayoutEngine
     */
    cls.TableLayoutEngineBase = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      return /** @lends classes.TableLayoutEngineBase.prototype */ {
        __name: "TableLayoutEngineBase",

        /** @type number */
        _minPageSize: 1,
        /** @type number */
        _minWidth: 60,
        /** @type boolean */
        _initialPreferredSize: false,

        /**
         * @inheritDoc
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          this._initialPreferredSize = false;
        },

        /**
         * @inheritDoc
         */
        invalidateAllocatedSpace: function(invalidation) {
          this._invalidatedAllocatedSpace = invalidation || context.LayoutInvalidationService.nextInvalidation();
        },

        // TODO check if this override is necessary
        /**
         * @inheritDoc
         */
        setHint: function(widthHint, heightHint) {
          this._widget.getLayoutInformation().setSizeHint(
            ((typeof(widthHint) === "undefined") || widthHint === null || widthHint === "") ? 0 : widthHint,
            ((typeof(heightHint) === "undefined") || heightHint === null || heightHint === "") ? 0 : heightHint
          );
        },
        needMeasureSwitching: function() {
          return this._widget.isVisibleRecursively();
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {},

        /**
         * Translate table height into number of rows
         * @param {number} height - table height (ex: 10, 10 row, 10 em, ...)
         * @param {number} charHeight - height of a char (pixels)
         * @param {number} rowHeight - height of table rows (pixels)
         * @return {number} number of rows
         */
        _translateHeight: function(height, charHeight, rowHeight) {
          var rowResult = 0;
          if (height) {
            if (Object.isNumber(height)) {
              rowResult = height;
            } else {
              var result = cls.Size.valueRE.exec(height);
              if (result) {
                var numeric = +result[1],
                  unit = result[2];
                switch (unit) {
                  case "ln":
                  case "row":
                    rowResult = numeric;
                    break;
                  case "ch":
                  case "em":
                    var fontSizeRatio = parseFloat(context.ThemeService.getValue("theme-font-size-ratio"));
                    charHeight = +charHeight || (16 * fontSizeRatio);
                    rowResult = Object.isNumber(rowHeight) && rowHeight ? Math.ceil((numeric * charHeight) / rowHeight) : 0;
                    break;
                  case "px":
                    rowResult = Object.isNumber(rowHeight) && rowHeight ? Math.ceil(numeric / rowHeight) : 0;
                    break;
                  default:
                    rowResult = numeric;
                    break;
                }
              }
            }
          }
          return rowResult;
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          $super.adjustMeasure.call(this);
          var layoutInfo = this._widget.getLayoutInformation();
          var rowHeight = this._widget.getRowHeight();
          var formWidget = this._widget.getFormWidget();

          // default minimum height
          var minHeight = this.getMinPageSize() * rowHeight + layoutInfo.getDecorating().getHeight();

          // we don't want to override the min height if we are in auto overflow mode
          // because ths min height has been computed in the first adjustMeasure pass.
          if (!(formWidget && formWidget.getLayoutEngine().isAutoOverflowActivated())) {
            layoutInfo.getMinimal().setHeight(minHeight);
          }
          // default minimum width
          var minWidth = this.getMinWidth() + layoutInfo.getDecorating().getWidth();
          layoutInfo.getMinimal().setWidth(minWidth);

          var parentModalElement = this._widget.getElement().parent("gbc_ModalWidget");
          var isInModal = Boolean(parentModalElement);

          // Set measured table height as preferred in modals to keep the good initial height
          if (isInModal) {
            layoutInfo.getMeasured().setHeight(layoutInfo.getPreferred().getHeight());
          }

          var windowWidget = this._widget.getWindowWidget(),
            isNoSizableWindow = windowWidget && windowWidget.getLayoutInformation().isSizable() === false;

          // if fixedPageSize or window sizable=false --> height of table must be fixed
          if (this._widget.isFixedPageSize() || isNoSizableWindow) {
            var preferredPageSize = this._widget._firstPageSize ? Math.max(this._widget._firstPageSize, 1) : 1;
            minHeight = preferredPageSize * rowHeight + layoutInfo.getDecorating().getHeight();
            layoutInfo.getMinimal().setHeight(minHeight);
            layoutInfo.getMeasured().setHeight(minHeight);
            layoutInfo.getMaximal().setHeight(minHeight);
          }

          // Set measured width
          layoutInfo.getMeasured().setWidth(Math.max(layoutInfo.getMinimal().getWidth(true), layoutInfo.getPreferred().getWidth(
            true)) + layoutInfo.getDecorating().getWidth());
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          $super.prepareApplyLayout.call(this);
          if (this._widget.isFixedPageSize()) {
            // Fix height when page size is fixed
            var layoutInfo = this._widget.getLayoutInformation();
            layoutInfo.getAllocated().setHeight(layoutInfo.getMinimal().getHeight());

            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              height: this._getLayoutInfo().getAllocated().getHeight() + "px"
            });
          }
        },

        /**
         * Returns minimum page size
         * @return {number} min page size
         */
        getMinPageSize: function() {
          return this._minPageSize;
        },

        /**
         * Sets minimum page size
         * @param {number} minPageSize - min page size
         */
        setMinPageSize: function(minPageSize) {
          this._minPageSize = minPageSize;
        },

        /**
         * Returns minimum width (pixels)
         * @return {number} min width
         */
        getMinWidth: function() {
          return this._minWidth;
        },

        /**
         * Sets minimum width (pixels)
         * @param {number} minWidth - min width
         */
        setMinWidth: function(minWidth) {
          this._minWidth = minWidth;
        }

      };
    });
  });
