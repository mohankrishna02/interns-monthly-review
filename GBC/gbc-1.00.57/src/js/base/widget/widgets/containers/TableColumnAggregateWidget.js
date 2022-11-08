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

modulum('TableColumnAggregateWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Table column aggregate.
     * @class TableColumnAggregateWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc
     */
    cls.TableColumnAggregateWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.TableColumnAggregateWidget.prototype */ {
        __name: "TableColumnAggregateWidget",

        _textElement: null,

        /**
         * Current text aligned used
         * @type {?string}
         */
        _textAlign: null,

        /**
         * @constructs
         * @param {*} opts - Options passed to the constructor
         */
        constructor: function(opts) {
          opts = (opts || {});
          opts.inTable = true;
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._textElement = this._element.getElementsByClassName("gbc_TableAggregateText")[0];
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._textElement = null;
          $super.destroy.call(this);
        },

        /**
         * Sets text displayed
         * @param {string} text - the text to display
         * @publicdoc
         */
        setText: function(text) {
          var tableColumn = this.getParentWidget();
          if (tableColumn.getChildren().length > 0) {
            var item = tableColumn.getColumnItem(0);
            var widget = item.getChildren().length > 0 ? item.getChildren()[0] : null;
            if (widget && widget.getFormat) { // use same date format as first widget of column
              text = cls.DateTimeHelper.toDbDateFormat(text, widget.getFormat());
            }
          }
          this._setTextContent(text, "_textElement");
        },

        /**
         * Returns text displayed
         * @returns {string} the text to display
         * @publicdoc
         */
        getText: function() {
          return this._textElement.textContent;
        },

        /**
         * Set text alignment
         * @param {string} align - (left, center, right)
         */
        setTextAlign: function(align) {
          this._textAlign = align;
          this.setStyle(".gbc_TableAggregateText", {
            "text-align": align
          });
        },

        /**
         * Computes aggregate width
         * @param {number} aggregateWidth - aggregate width (contains al previous column which have no aggregate) (pixels)
         */
        computeWidth: function(aggregateWidth) {

          var tableColumn = this.getParentWidget();
          if (tableColumn.getWidth() === null) {
            return; // no need to compute aggregate width if column width is not measured
          }

          this.setStyle({
            "width": aggregateWidth + "px"
          });

          // remove borders
          this.setStyle(".gbc_TableAggregateText", {
            "border-left": null,
            "border-right": null,
            "margin-left": null
          });

          var isRightTextAlign = (this._textAlign === "right");
          var isCenterTextAlign = (this._textAlign === "center");
          var isLeftTextAlign = (this._textAlign === "left" || this._textAlign === null);

          if (isLeftTextAlign || isCenterTextAlign) {
            this.setStyle(".gbc_TableAggregateText", {
              "margin-left": (aggregateWidth - tableColumn.getWidth()) + "px",
            });
          }

          var borderColor = context.ThemeService.getValue("gbc-TableWidget-inner-border-color");
          if (isRightTextAlign) {
            this.setStyle(".gbc_TableAggregateText", {
              "border-right": "solid 1px " + borderColor
            });
          } else if (isLeftTextAlign && tableColumn.getOrderedColumnIndex() > 0) { // don't put left border on first column
            this.setStyle(".gbc_TableAggregateText", {
              "border-left": "solid 1px " + borderColor
            });
          }
        },

        /**
         * Returns aggregate width style
         * @returns {string} aggregate width (ex:"42px")
         */
        getWidthStyle: function() {
          return this.getStyle("width");
        },

        /**
         * Sets index order of aggregate
         * @param {number} index - order index
         */
        setOrder: function(index) {
          this.setStyle({
            "order": index
          });
        }

      };
    });
    cls.WidgetFactory.registerBuilder('TableColumnAggregate', cls.TableColumnAggregateWidget);
  });
