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

modulum('ScrollGridWidget', ['WidgetGridLayoutBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Scroll Grid widget.
     * @class ScrollGridWidget
     * @memberOf classes
     * @extends classes.WidgetGridLayoutBase
     * @publicdoc
     */
    cls.ScrollGridWidget = context.oo.Class(cls.GridWidget, function($super) {
      return /** @lends classes.ScrollGridWidget.prototype */ {
        $static: /** @lends classes.ScrollGridWidget */ {
          /** Generic click events handler */
          _onClick: function(event) {
            this.emit(context.constants.widgetEvents.click, event);
            if (!this._rowActionTriggerByDoubleClick && event.target !== this._containerElement) {
              this.emit(context.constants.widgetEvents.rowAction, event);
            }
          },
          _onDblClick: function(event) {
            if (this._rowActionTriggerByDoubleClick && event.target !== this._containerElement) {
              this.emit(context.constants.widgetEvents.rowAction, event);
            }
          },
        },
        __name: "ScrollGridWidget",

        /** @type {classes.ScrollWidget} */
        _scrollWidget: null,
        /** @type boolean */
        _rowActionTriggerByDoubleClick: true,
        /** @type {classes.UserInterfaceWidget} */
        _uiWidget: null,
        /** @type {classes.FolderWidgetBase} */
        _folderPageWidget: null,

        /** Handlers */
        /** @function */
        _uiActivateHandler: null,
        /** @function */
        _pageActivateHandler: null,

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
        _initElement: function() {
          $super._initElement.call(this);
          this._scrollWidget = cls.WidgetFactory.createWidget("Scroll", this.getBuildParameters());
          this.addChildWidget(this._scrollWidget, {
            noDOMInsert: true
          });
          this._element.appendChild(this._scrollWidget.getElement());

          this._uiActivateHandler = this._uiWidget.onActivate(this.refreshScroll.bind(this, true));
          if (this._folderPageWidget) {
            this._pageActivateHandler = this._folderPageWidget.onActivate(this.refreshScroll.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ScrollGridLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          // ScrollWidget is owned directly by this widget no matter if gridChildrenInParent is set
          this._rerouteChildren = false;
          this._element.removeChild(this._scrollWidget.getElement());
          this._scrollWidget.destroy();
          this._scrollWidget = null;
          this._uiWidget = null;
          this._folderPageWidget = null;
          if (this._uiActivateHandler) {
            this._uiActivateHandler();
            this._uiActivateHandler = null;
          }
          if (this._pageActivateHandler) {
            this._pageActivateHandler();
            this._pageActivateHandler = null;
          }

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          cls.ScrollGridWidget._onClick.call(this, domEvent);
          return true;
        },

        /**
         * @inheritDoc
         */
        manageMouseDblClick: function(domEvent) {
          cls.ScrollGridWidget._onDblClick.call(this, domEvent);
          return true;
        },

        /**
         * @inheritDoc
         */
        _listChildrenToMoveWhenGridChildrenInParent: function() {
          return this._children.filter(function(item) {
            return item !== this._scrollWidget;
          }.bind(this));
        },

        /**
         * Indicates how the row action must be triggered.
         * @param {boolean} b - true if action is triggered by double click (else it is single click)
         */
        setRowActionTriggerByDoubleClick: function(b) {
          this._rowActionTriggerByDoubleClick = b;
        },

        /** Returns the scroll widget
         * @returns {classes.ScrollWidget} Scroll widget
         */
        getScrollWidget: function() {
          return this._scrollWidget;
        },

        /**
         * Returns the row height in pixels
         * @returns {number} row height
         * @publicdoc
         */
        getRowHeight: function() {
          return this._layoutInformation.getMeasured().getHeight(true) / Math.max(1, this._scrollWidget.getPageSize());
        },

        /**
         * Returns scrollable area DOM Element
         * @returns {HTMLElement} scrollable area DOM Element
         */
        getScrollableArea: function() {
          return this._scrollWidget.getElement();
        },

        /**
         * Defines the scroll grid pageSize
         * @param {number} pageSize - page size
         */
        setPageSize: function(pageSize) {
          this._scrollWidget.setPageSize(pageSize);
        },

        /**
         * Defines the scroll grid size (total number of row)
         * @param {number} size - size value
         */
        setSize: function(size) {
          this._scrollWidget.setSize(size);
        },

        /**
         * Defines the scroll grid offset
         * @param {number} offset - offset value
         */
        setOffset: function(offset) {
          this._scrollWidget.setOffset(offset);
        },

        /**
         * Sets the total height of the widget (pixels)
         * @param {number} size - total height
         */
        setTotalHeight: function(size) {
          this._scrollWidget.setTotalHeight(size);
        },

        /**
         * Refresh scroll widget
         */
        refreshScroll: function(force) {
          this._scrollWidget.setLineHeight(this.getRowHeight());
          this._scrollWidget.refreshScroll(force);
        },

        /**
         * Defines the highlighted text color of rows, used for selected rows
         * @param {string} color - CSS color
         */
        setHighlightTextColor: function(color) {},

        /**
         * Defines the highlight color of rows, used for selected rows
         * @param {string} color - CSS color
         */
        setHighlightColor: function(color) {},

        /**
         * @param highlight false to disable current row highlighting
         */
        setHighlightCurrentRow: function(highlight) {
          this._element.toggleClass("nohighlight", !highlight);
          this._element.toggleClass("highlight", highlight);
        },

        /**
         * Update highlight row and cell
         */
        updateHighlight: function() {}
      };
    });
    cls.WidgetFactory.registerBuilder('ScrollGrid', cls.ScrollGridWidget);
  });
