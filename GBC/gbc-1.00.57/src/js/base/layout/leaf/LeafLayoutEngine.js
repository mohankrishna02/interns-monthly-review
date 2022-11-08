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

modulum('LeafLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {

    /**
     * @class LeafLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.LeafLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.LeafLayoutEngine.prototype */ {
        __name: "LeafLayoutEngine",
        /**
         * data content placeholder is the DOM element that contains what is defined as widget's value
         * @type HTMLElement
         */
        _dataContentPlaceholder: null,
        /**
         * data content measure element is the DOM element that contains widget's value as text for measuring puurpose
         * @type HTMLElement
         */
        _dataContentMeasure: null,
        /**
         * text sample, used in measure
         * @type {?string}
         */
        _textSample: null,
        /**
         * text sample width (in characters)
         * @type {number}
         */
        _sampleWidth: 0,
        /**
         * text sample height (in characters)
         * @type {number}
         */
        _sampleHeight: 0,
        /**
         * value content natural width (to deal with images for example)
         * @type {number}
         */
        _naturalWidth: 0,
        /**
         * value content natural height (to deal with images for example)
         * @type {number}
         */
        _naturalHeight: 0,

        /**
         * set natural size
         * @param {number} width the width
         * @param {number} height the height
         */
        setNaturalSize: function(width, height) {
          this._naturalWidth = width;
          this._naturalHeight = height;
        },

        /**
         * test if this layout has a natural size
         * @return {boolean} true if this layout has a natural size
         */
        hasNaturalSize: function() {
          return Boolean(this._naturalWidth) && Boolean(this._naturalHeight);
        },
        /**
         * set hint size
         * @param {number} widthHint the width
         * @param {number} heightHint the height
         */
        setHint: function(widthHint, heightHint) {
          this._widget.getLayoutInformation().setSizeHint(
            ((typeof(widthHint) === "undefined") || widthHint === null || widthHint === "") ? 1 : widthHint, ((typeof(
                heightHint) ===
              "undefined") || heightHint === null || heightHint === "") ? 1 : heightHint
          );
        },
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this.invalidateDataContentSelector(widget);
        },

        /**
         * @inheritDoc
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          this._widget.resetLayout();
        },

        /**
         * @inheritDoc
         */
        resetSizes: function() {
          $super.resetSizes.call(this);

          var layoutInfo = this._widget.getLayoutInformation();
          layoutInfo.hasBeenFixed = false;
        },

        /**
         * invalidate data content selector, creates it if needed
         * @param {classes.WidgetBase} widget this widget
         */
        invalidateDataContentSelector: function(widget) {
          if (widget.__dataContentPlaceholderSelector) {
            var element = this._widget.getElement();
            this._dataContentPlaceholder = widget.__dataContentPlaceholderSelector === cls.WidgetBase.selfDataContent ? element :
              element.getElementsByClassName(widget.__dataContentPlaceholderSelector.replace(".", ""))[0];
            if (this._dataContentPlaceholder) {
              this._dataContentPlaceholder.addClass("gbc_staticMeasure");
              this._dataContentPlaceholder.removeClass("gbc_dynamicMeasure");

              this._dataContentMeasure = this._dataContentPlaceholder.getElementsByClassName("gbc_dataContentMeasure")[0];
              if (!this._dataContentMeasure && !widget.ignoreLayout()) {
                this._dataContentMeasure = context.TemplateService.renderDOM("LeafLayoutMeasureElement");
                this._dataContentPlaceholder.appendChild(this._dataContentMeasure);
              }
            }
          }
        },

        /**
         * Returns Element containing the data to be measured
         * @returns {HTMLElement} element containing the data to be measured
         */
        getDataContentMeasureElement: function() {
          return this._dataContentMeasure;
        },

        /**
         * @inheritDoc
         */
        invalidateMeasure: function(invalidation) {
          var layoutInfo = this._getLayoutInfo(),
            currentSizePolicy = layoutInfo.getCurrentSizePolicy();
          if (!this._statuses.layouted || (!this.considerWidgetAsFixed() && !(currentSizePolicy.isFixed() && !layoutInfo
              ._fixedSizePolicyForceMeasure))) {
            $super.invalidateMeasure.call(this, invalidation);
            this._getLayoutInfo().invalidateMeasure();
          }
          layoutInfo.hasBeenFixed = false;
        },

        /**
         * sets measure as fixed measure
         * @private
         */
        _setFixedMeasure: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          layoutInfo.setMeasured(
            layoutInfo.getPreferred().getWidth() + layoutInfo.getDecorating().getWidth(true),
            layoutInfo.getPreferred().getHeight() + layoutInfo.getDecorating().getHeight(true));
        },

        /**
         * @inheritDoc
         */
        beforeLayout: function() {
          $super.beforeLayout.call(this);
          // widgets contained in tables should not have a max height defined
          if (this._widget.isInTable()) {
            this._shouldFillHeight = true;
          }
        },

        /**
         * @inheritDoc
         */
        prepareMeasure: function() {
          if (this._dataContentMeasure) {
            var layoutInfo = this._widget.getLayoutInformation();
            var sizeHintWidth = layoutInfo.getSizeHint().getWidth();
            var width = (!layoutInfo.hasRawGridWidth() && cls.Size.isCols(sizeHintWidth)) ? parseInt(sizeHintWidth, 10) :
              layoutInfo.getGridWidth();

            // if a grid is present gridWidth send by VM add the reservedDecorationSpace automatically
            // so we need to remove it to correctly measure the widget
            if (layoutInfo.hasRawGridWidth() && width > layoutInfo.getReservedDecorationSpace()) {
              width -= layoutInfo.getReservedDecorationSpace();
            }
            if (width !== this._sampleWidth || layoutInfo.getGridHeight() !== this._sampleHeight) {
              var sample = cls.Measurement.getTextSample(width, layoutInfo.hasSingleLineContentOnly() ? 1 : layoutInfo
                .getGridHeight());
              this._sampleWidth = width;
              this._sampleHeight = layoutInfo.getGridHeight();
              this._textSample = sample;
              this._dataContentMeasure.textContent = sample;
            }
          }
          this.prepareDynamicMeasure();
        },

        /**
         * prepare widget for dynamic measure
         */
        prepareDynamicMeasure: function() {
          if (this._dataContentPlaceholder) {
            var layoutInfo = this._widget.getLayoutInformation(),
              isDynamic = layoutInfo._needValuedMeasure || layoutInfo.getCurrentSizePolicy().isDynamic();

            this._dataContentPlaceholder.toggleClass("gbc_staticMeasure", !isDynamic);
            this._dataContentPlaceholder.toggleClass("gbc_dynamicMeasure", isDynamic);
          }
        },

        /**
         * test if this widget is considered as fixed
         * @return {boolean} true if this widget is considered as fixed
         */
        considerWidgetAsFixed: function() {
          return false;
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          var layoutInfo = this._widget.getLayoutInformation(),
            currentSizePolicy = layoutInfo.getCurrentSizePolicy();

          var element = this._widget.getElement();

          if (this._widget.isLayoutMeasureable(true) && this.considerWidgetAsFixed() || (currentSizePolicy.isFixed() && !layoutInfo
              ._fixedSizePolicyForceMeasure)) {
            if (this._widget.getElement().querySelector(".gbc-label-text-container") && this._dataContentPlaceholder) {
              var container = this._dataContentPlaceholder.hasClass("gbc_dynamicMeasure") ?
                this._widget.getElement().querySelector(".gbc-label-text-container") :
                this._dataContentMeasure;
              var containerRects = container.getBoundingClientRect();
              this._getLayoutInfo().setDecorating(
                layoutInfo.getRawMeasure().getWidth(true) - containerRects.width,
                layoutInfo.getRawMeasure().getHeight(true) - containerRects.height
              );
              this._getLayoutInfo().setDecoratingOffset(
                container.offsetLeft - element.offsetLeft,
                container.offsetTop - element.offsetTop
              );
            }
          }
        },

        /**
         * @inheritDoc
         */
        measure: function() {
          var layoutInfo = this._widget.getLayoutInformation(),
            currentSizePolicy = layoutInfo.getCurrentSizePolicy(),
            minSize = layoutInfo.getMinimal(),
            maxSize = layoutInfo.getMaximal(),
            measured = layoutInfo.getMeasured(),
            rawMeasure = layoutInfo.getRawMeasure();
          if (this._widget.isLayoutMeasureable(true)) {
            if (this.considerWidgetAsFixed() || (currentSizePolicy.isFixed() && !layoutInfo._fixedSizePolicyForceMeasure)) {
              if (!layoutInfo.hasBeenFixed) {
                this._setFixedMeasure();
                layoutInfo.hasBeenFixed = true;
              }
            } else {
              if (layoutInfo.getCurrentSizePolicy().isDynamic() || (layoutInfo._widget.isVisible() && layoutInfo.needMeasure())) {
                if (currentSizePolicy.isFixed() && layoutInfo._fixedSizePolicyForceMeasure) {
                  if (!layoutInfo.hasBeenFixed) {
                    layoutInfo.setMeasured(
                      this._naturalWidth || rawMeasure.getWidth(true),
                      this._naturalHeight || rawMeasure.getHeight(true)
                    );
                    layoutInfo.hasBeenFixed = true;
                  }
                } else {
                  var width = layoutInfo._forceFixedWidthMeasure ?
                    layoutInfo.getPreferred().getWidth(true) :
                    (this._naturalWidth || rawMeasure.getWidth(true));
                  layoutInfo.setMeasured(width, this._naturalHeight || rawMeasure.getHeight(true));
                }
              }
            }
            if (layoutInfo.getCurrentSizePolicy().isDynamic()) {
              layoutInfo.setMinimal(measured.getWidth(), measured.getHeight());
            } else {
              if (layoutInfo.isXStretched() || currentSizePolicy.canShrink()) {
                minSize.setWidth(layoutInfo.forcedMinimalWidth);
              } else {
                minSize.setWidth(measured.getWidth());
              }
              if (layoutInfo.isYStretched() || currentSizePolicy.canShrink()) {
                minSize.setHeight(layoutInfo.forcedMinimalHeight);
              } else {
                minSize.setHeight(measured.getHeight());
              }
            }
            if (layoutInfo.isXStretched()) {
              maxSize.setWidth(cls.Size.maximal);
            } else {
              maxSize.setWidth(measured.getWidth());
            }
            if (layoutInfo.isYStretched()) {
              maxSize.setHeight(cls.Size.maximal);
            } else {
              maxSize.setHeight(measured.getHeight());
            }

            if (this._getLayoutInfo().forceMinimalMeasuredHeight) {
              minSize.setHeight(Math.max(layoutInfo.getRawMeasure().getHeight(true), minSize.getHeight(true)));
            }
            currentSizePolicy.setInitialized();
          } else {
            layoutInfo.setMeasured(0, 0);
            layoutInfo.setMinimal(0, 0);
            layoutInfo.setMaximal(0, 0);
          }
        },

        /**
         * @inheritDoc
         */
        adjustStretchability: function() {
          var formWidget = this._widget.getFormWidget();
          if (formWidget && formWidget.getLayoutEngine().isAutoOverflowActivated()) {
            var layoutInfo = this._widget.getLayoutInformation();
            if (layoutInfo.isYStretched()) {
              layoutInfo.getMinimal().setHeight(Math.max(layoutInfo.getPreferred().getHeight(true), layoutInfo.getMeasured()
                .getHeight(
                  true)));
            }
            if (this._getLayoutInfo().forceMinimalFixedHeight) {
              layoutInfo.getMinimal().setHeight(Math.max(this._getLayoutInfo().forcedMinimalHeight, layoutInfo.getMinimal()
                .getHeight(
                  true)));
            }

          }
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          if (this._getLayoutInfo().isXStretched()) {
            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              width: this._getLayoutInfo().getAvailable().getWidth() + "px"
            });
          }
          if (this._getLayoutInfo().isYStretched()) {
            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              height: this._getLayoutInfo().getAvailable().getHeight() + "px"
            });
          } else if (this._getLayoutInfo().getMaximal().getHeight(true) && !this._shouldFillHeight) {
            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              "max-height": this._getLayoutInfo().getMaximal().getHeight(true) + "px"
            });
          }
        },

        /**
         * @inheritDoc
         */
        getRenderableChildren: function() {
          return [];
        }
      };
    });
  });
