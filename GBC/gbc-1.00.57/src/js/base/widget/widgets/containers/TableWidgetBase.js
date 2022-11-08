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

modulum('TableWidgetBase', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TableWidgetBase widget (abstract class for TableWidget & ListViewWidget).
     * @class TableWidgetBase
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc
     */
    cls.TableWidgetBase = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TableWidgetBase.prototype */ {
        __name: "TableWidgetBase",

        /** @type {boolean} */
        __virtual: true,

        /** @type {number} */
        _currentRow: 0,
        /** @type {number} */
        _size: 0,
        /** @type {number} */
        _offset: 0,
        /** @type {number} */
        _pageSize: 0,
        /** @type {?number} */
        _firstPageSize: null,
        /** @type {boolean} */
        _fixedPageSize: false,
        /** @type {number} */
        _visibleRows: 0,

        /** @type {boolean} */
        _inputMode: false,
        /** @type {number} */
        _rowHeight: 0,

        /** @type {?boolean} */
        _rowActionTriggerByDoubleClick: true,
        /** @type {?string} */
        _highlightColor: null,
        /** @type {?string} */
        _highlightTextColor: null,
        /** @type {?boolean} */
        _highlightCurrentRow: null,
        /** @type {classes.UserInterfaceWidget} */
        _uiWidget: null,
        /** @type {classes.FolderWidgetBase} */
        _folderPageWidget: null,

        /** Handlers */
        /** @function */
        _uiActivateHandler: null,
        /** @function */
        _pageActivateHandler: null,

        /** @type {HTMLElement} */
        _scrollAreaElement: null,

        /** @type {classes.ContextMenuWidget} */
        _rowBoundWidget: null,

        /** @type {boolean} */
        _hasReduceFilter: false,

        /**
         * @constructs
         * @param {*} opts - Options passed to the constructor
         */
        constructor: function(opts) {
          opts = opts || {};
          this._uiWidget = opts.uiWidget;
          this._folderPageWidget = opts.folderPageWidget;

          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._uiActivateHandler) {
            this._uiActivateHandler();
            this._uiActivateHandler = null;
          }
          if (this._pageActivateHandler) {
            this._pageActivateHandler();
            this._pageActivateHandler = null;
          }
          this._uiWidget = null;
          this._folderPageWidget = null;
          this._scrollAreaElement = null;
          this._rowBoundWidget = null;

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this.setFocusable(true);

          this._uiActivateHandler = this._uiWidget.onActivate(this.updateVerticalScroll.bind(this, true));
          if (this._folderPageWidget) {
            this._pageActivateHandler = this._folderPageWidget.onActivate(this.updateVerticalScroll.bind(this, true));
          }
        },

        /**
         * @inheritDoc
         */
        resetLayout: function() {
          $super.resetLayout.call(this);
          this._rowHeight = 0;
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;
          if (this._rowBoundWidget && this._rowBoundWidget.isVisible()) {
            keyProcessed = this._rowBoundWidget.managePriorityKeyDown(keyString, domKeyEvent, repeat);
          }
          return keyProcessed;
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          if (widget.isInstanceOf(cls.ContextMenuWidget)) {
            // Rowbound menu
            this._rowBoundWidget = widget;
            this._rowBoundWidget.setParentWidget(this);
          } else {
            $super.addChildWidget.call(this, widget, options);
          }
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          $super.removeChildWidget.call(this, widget);

          if (widget.isInstanceOf(cls.ContextMenuWidget)) {
            this._rowBoundWidget = null;
          }
        },

        /**
         * Set the DOM focus to the widget
         * @param {boolean} [noScroll] - if true try to disable auto scroll
         * @publicdoc
         */
        domFocus: function(noScroll) {
          if (this._element) {
            if (!noScroll) {
              this._element.domFocus();
            } else {
              // try to not scroll when focus
              this._element.domFocus(null, this.getFormWidget().getContainerElement());
            }
          }
        },

        /**
         * Change current row
         * @param {number} row - new current row
         * @param {boolean} [ensureRowVisible] - if true scroll to be sure row is visible (useful when first row is partially visible)
         */
        setCurrentRow: function(row, ensureRowVisible) {
          // TO BE IMPLEMENTED
        },

        /**
         * Returns current row
         * @returns {number} current row
         * @publicdoc
         */
        getCurrentRow: function() {
          return this._currentRow;
        },

        /**
         * Change current column
         * @param {number} col - new current column
         */
        setCurrentColumn: function(col) {
          // TO BE IMPLEMENTED, IF NEEDED
        },

        /**
         * Defines the table pageSize
         * @param {number} pageSize - page size
         */
        setPageSize: function(pageSize) {
          this._setFirstPageSize(pageSize);
          this._pageSize = pageSize;
        },

        /**
         * Keep the first pageSize
         * @param {number} pageSize - page size
         */
        _setFirstPageSize: function(pageSize) {
          if (this._firstPageSize === null) {
            this._firstPageSize = pageSize;
          }
        },

        /**
         * Returns page size
         * @returns {?number} the page size
         * @publicdoc
         */
        getPageSize: function() {
          return this._pageSize;
        },

        /**
         * Defines if pageSize is fixed
         * @param {boolean} fixed - true if page size is fixed
         */
        setFixedPageSize: function(fixed) {
          if (this._fixedPageSize !== fixed) {
            this._fixedPageSize = fixed;
            this._layoutInformation.getStretched().setDefaultY(!fixed);
          }
        },

        /**
         * Returns if pageSize is fixed
         * @returns {boolean} true if pageSize is fixed
         * @publicdoc
         */
        isFixedPageSize: function() {
          return this._fixedPageSize;
        },

        /**
         * Returns table size
         * @returns {number} the table size
         * @publicdoc
         */
        getSize: function() {
          return this._size;
        },

        /**
         * Defines the table size (total number of row)
         * @param {number} size - size value
         */
        setSize: function(size) {
          this._size = size;
        },

        /**
         * Defines the table offset
         * @param {number} offset - offset value
         */
        setOffset: function(offset) {
          this._offset = offset;
        },

        /**
         * Returns table offset
         * @returns {number} the table offset
         * @publicdoc
         */
        getOffset: function() {
          return this._offset;
        },

        /**
         * Sets the number of visible rows
         * @param {number} visibleRows - number of visible rows
         */
        setVisibleRows: function(visibleRows) {
          this._visibleRows = visibleRows;
        },

        /**
         * Returns number of visible rows
         * @returns {number} the number of visible rows
         */
        getVisibleRows: function() {
          return this._visibleRows;
        },

        /**
         * Sets if table is in "input" mode.
         * @param {boolean} b - input mode
         * @publicdoc
         */
        setInputMode: function(b) {
          if (this._inputMode !== b) {
            this._inputMode = b;
            this._element.toggleClass("inputMode", Boolean(b));
          }
        },

        /**
         * Returns if table is in input mode.
         * @returns {boolean} true if input mode
         * @publicdoc
         */
        isInputMode: function() {
          return this._inputMode;
        },

        /**
         * Returns if table is in display mode.
         * @returns {boolean} true if display mode
         * @publicdoc
         */
        isDisplayMode: function() {
          return !this._inputMode;
        },

        /**
         * Sets the height of rows
         * @param {number} height - row height (pixels)
         * @publicdoc
         */
        setRowHeight: function(height) {
          this._rowHeight = height;
        },

        /**
         * Returns the row height in pixels
         * @returns {number} row height
         * @publicdoc
         */
        getRowHeight: function() {
          return this._rowHeight;
        },

        /**
         * Call when a widget in the table request the focus
         * @param {classes.WidgetBase} widget - widget that request focus
         * @param {Object} event - event that request focus
         */
        requestFocusFromWidget: function(widget, event) {
          widget.emit(context.constants.widgetEvents.requestFocus, event);
        },

        /**
         * @returns {number} table data area height
         */
        getDataAreaHeight: function() {
          return this.getLayoutInformation().getAllocated().getHeight() - this.getLayoutInformation().getDecorating().getHeight();
        },

        /**
         * @returns {number} table data area width
         */
        getDataAreaWidth: function() {
          return this.getLayoutInformation().getAllocated().getWidth() - this.getLayoutInformation().getDecorating().getWidth();
        },

        /**
         * Indicates how the row action must be triggered.
         * @param {boolean} b - true if action is triggered by double click (else it is single click)
         */
        setRowActionTriggerByDoubleClick: function(b) {
          this._rowActionTriggerByDoubleClick = b;
        },

        /**
         * Indicates how the row action must be triggered.
         * @returns {boolean} true if action is triggered by double click (else it is single click)
         */
        isRowActionTriggerByDoubleClick: function() {
          return this._rowActionTriggerByDoubleClick;
        },

        /**
         * Defines the highlight color of rows for the table
         * @param {string} color - CSS color
         */
        setHighlightColor: function(color) {
          // TO BE IMPLEMENTED
        },

        /**
         * Defines the highlighted text color of rows for the table
         * @param {string} color - CSS color
         */
        setHighlightTextColor: function(color) {
          // TO BE IMPLEMENTED
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
         * Update vertical scroll
         * @param {boolean} [forceScroll] - true to force scrolling
         */
        updateVerticalScroll: function(forceScroll) {
          this.updateContentPosition(this._size, this._pageSize, this._offset, forceScroll);
        },

        /**
         * Sets vertical scroll parameters
         * BEWARE this code should be the same as ScrollGridWidget::updateContentPosition
         * @param {?number} size
         * @param {?number} pageSize
         * @param {?number} offset
         * @param {boolean} forceScroll
         */
        updateContentPosition: function(size, pageSize, offset, forceScroll) {
          // TO BE IMPLEMENTED
        },

        /**
         * Returns scrollable area DOM Element
         * @returns {HTMLElement} scrollable area DOM Element
         */
        getScrollableArea: function() {
          // TO BE IMPLEMENTED
        },

        /**
         * Returns rowBound widget
         * @returns {classes.ContextMenuWidget} rowBound
         */
        getRowBoundWidget: function() {
          return this._rowBoundWidget;
        },

        /**
         * Returns if rowBound is activated
         * @returns {boolean} rowBound activated ?
         */
        hasRowBound: function() {
          return this._rowBoundWidget !== null;
        },

        /**
         * Indicates if the table can have a reduce filter
         * @param {boolean} b - true if table can have a reduce filter
         */
        setReduceFilter: function(b) {
          this._hasReduceFilter = b;
        },

        /**
         * Return if the table can have a reduce filter
         * @returns {boolean} true if table can have a reduce filter
         */
        hasReduceFilter: function() {
          return this._hasReduceFilter;
        },

        /**
         * Returns if table is a tree
         * @returns {boolean} true if table is a tree
         * @publicdoc
         */
        isTreeView: function() {
          return false;
        },
      };
    });
  });
