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

modulum('StretchableScrollGridWidgetBase', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Strechable Scroll Grid base widget
     * @class StretchableScrollGridWidgetBase
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc
     */
    cls.StretchableScrollGridWidgetBase = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.StretchableScrollGridWidgetBase.prototype */ {
        __name: "StretchableScrollGridWidgetBase",

        /** @type {boolean} */
        _rowActionTriggerByDoubleClick: true,
        /** @type {boolean} */
        _focusOnField: false,

        /** styles */
        _highlightColor: null,
        _highlightTextColor: null,
        _highlightCurrentRow: null,
        _highlightCurrentRowCssSelector: ":not(.disabled) .gbc_StretchableScrollGridLineWidget.highlight.currentRow",
        _highlightCurrentCellCssSelector: ":not(.disabled) .gbc_StretchableScrollGridLineWidget .g_GridElement >.currentRow",
        _highlightCurrentCell: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          $super._initLayout.call(this);

          this._layoutEngine = new cls.StretchableScrollLayoutEngine(this);
          this._layoutInformation.getStretched().setDefaultX(true);
          this._layoutInformation.getStretched().setDefaultY(true);
        },

        /**
         * Indicates how the row action must be triggered.
         * @param {boolean} b - true if action is triggered by double click (else it is single click)
         */
        setRowActionTriggerByDoubleClick: function(b) {
          this._rowActionTriggerByDoubleClick = b;
        },

        /**
         * Defines if focus in on a field or (default) on a row
         * @param {boolean} focusOnField - true if focus on field activated
         */
        setFocusOnField: function(focusOnField) {
          if (this._focusOnField !== focusOnField) {
            this._focusOnField = focusOnField;
            this.updateHighlight();
          }
        },

        /**
         * Returns if focus is on a field (by default focus is on a row)
         * @returns {boolean} true if focus on field activated
         */
        hasFocusOnField: function() {
          return this._focusOnField;
        },

        /**
         * Change current row
         * @param {number} row - new current row
         */
        setCurrentRow: function(row) {
          this._currentRow = row;
          var children = this.getChildren();
          var length = children.length;
          for (var i = 0; i < length; ++i) {
            var rowWidget = children[i];
            rowWidget.setCurrent(i === row);
          }
        },

        /**
         * @returns {number} the current row
         */
        getCurrentRow: function() {
          return this._currentRow;
        },

        /**
         * Defines the highlight color of rows, used for selected rows
         * @param {string} color - CSS color
         */
        setHighlightColor: function(color) {

          if (this._highlightColor !== color) {
            this._highlightColor = color;

            color = (color === null ? null : color + " !important");
            this.setStyle({
              selector: this._highlightCurrentRowCssSelector,
              appliesOnRoot: true
            }, {
              "background-color": color
            });

            this.setStyle({
              selector: this._highlightCurrentCellCssSelector,
              appliesOnRoot: true
            }, {
              "background-color": color
            });
          }
        },

        /**
         * Defines the highlighted text color of rows, used for selected rows
         * @param {string} color - CSS color
         */
        setHighlightTextColor: function(color) {

          if (this._highlightTextColor !== color) {
            this._highlightTextColor = color;

            color = (color === null ? null : color + " !important");
            this.setStyle({
              selector: this._highlightCurrentCellCssSelector,
              appliesOnRoot: true
            }, {
              "color": color,
              "fill": color
            });
          }
        },

        /**
         * Indicates if the current row must be highlighted
         * @param {boolean} b - true if current row must be highlighted
         */
        setHighlightCurrentRow: function(b) {
          this._highlightCurrentRow = b;
        },

        /**
         * Return if the current row must be highlighted
         * @returns {?boolean} true if current row must be highlighted
         * @publicdoc
         */
        isHighlightCurrentRow: function() {
          return this._highlightCurrentRow;
        },

        /**
         * Indicates if the current cell must be highlighted
         * @param {boolean} b - true if current cell must be highlighted
         */
        setHighlightCurrentCell: function(b) {
          this._highlightCurrentCell = b;
        },

        /**
         * Return if the current cell must be highlighted
         * @returns {?boolean} true if current cell must be highlighted
         * @publicdoc
         */
        isHighlightCurrentCell: function() {
          return this._highlightCurrentCell;
        },

        /**
         * Update highlight row and cell
         */
        updateHighlight: function() {
          this.setCurrentRow(this._currentRow);
        },
      };
    });
  });
