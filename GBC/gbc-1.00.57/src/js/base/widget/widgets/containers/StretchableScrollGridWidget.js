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

modulum('StretchableScrollGridWidget', ['StretchableScrollGridWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Stretchable scroll grid widget.
     * @class StretchableScrollGridWidget
     * @memberOf classes
     * @extends classes.StretchableScrollGridWidgetBase
     * @publicdoc
     */
    cls.StretchableScrollGridWidget = context.oo.Class(cls.StretchableScrollGridWidgetBase, function($super) {

      return /** @lends classes.StretchableScrollGridWidget.prototype */ {
        __name: "StretchableScrollGridWidget",
        /** @type {?number} */
        _pageSize: null,
        /** @type {?number} */
        _size: null,
        /** @type {?number} */
        _offset: null,
        /** @type {?number} */
        lastSentOffset: null,
        /** @type {number} */
        _rowHeight: 0,
        /** @type {number} */
        _currentRow: 0,

        /** Handlers */
        /** @type {classes.UserInterfaceWidget} */
        _uiWidget: null,
        /** @type {classes.FolderWidgetBase} */
        _folderPageWidget: null,
        /** @function */
        _uiActivateHandler: null,
        /** @function */
        _pageActivateHandler: null,

        /** @type {classes.ContextMenuWidget} */
        _rowBoundWidget: null,

        /** @type {boolean} */
        _hasReduceFilter: false,

        /** @type {Number} **/
        _firstPageSize: null,

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

          this._element.on('scroll.StretchableScrollGridWidget', function(event) {
            this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());
          }.bind(this));
          this._uiActivateHandler = this._uiWidget.onActivate(this.updateVerticalScroll.bind(this, true));
          if (this._folderPageWidget) {
            this._pageActivateHandler = this._folderPageWidget.onActivate(this.updateVerticalScroll.bind(this, true));
          }
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
          this._element.off('scroll.StretchableScrollGridWidget');

          this._rowBoundWidget = null;
          this._uiWidget = null;
          this._folderPageWidget = null;
          this.destroyChildren();
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
        addChildWidget: function(widget, options) {
          if (widget.isInstanceOf(cls.StretchableScrollGridLineWidget)) {
            $super.addChildWidget.call(this, widget, options);
            if (this.hasRowBound()) {
              widget.addRowBoundDecorator();
            }
          } else if (widget.isInstanceOf(cls.ContextMenuWidget)) {
            // Rowbound menu
            this._rowBoundWidget = widget;
            this._rowBoundWidget.setParentWidget(this);
          }
        },

        /**
         * @returns {number} scroll grid data area height
         */
        getDataAreaHeight: function() {
          return this.getLayoutInformation().getAvailable().getHeight();
        },

        /**
         * Returns scrollable area DOM Element
         * @returns {HTMLElement} scrollable area DOM Element
         */
        getScrollableArea: function() {
          return this.getElement();
        },

        /**
         * Returns the row height in pixels
         * @returns {number} row height
         * @publicdoc
         */
        getRowHeight: function() {
          if (this._rowHeight === 0 && this.getChildren().length !== 0) {
            this._rowHeight = this.getChildren()[0]._element.getBoundingClientRect().height;
          }
          return this._rowHeight;
        },

        /**
         * Defines the scroll grid pageSize
         * @param {number} pageSize - page size
         */
        setPageSize: function(pageSize) {
          this._pageSize = pageSize;
        },

        /**
         * Defines the scroll grid size (total number of row)
         * @param {number} size - size value
         */
        setSize: function(size) {
          this._size = size;
        },

        /**
         * Defines the scroll grid offset
         * @param {number} offset - offset value
         */
        setOffset: function(offset) {
          this._offset = offset;
        },

        /**
         * Update vertical scroll
         * @param {boolean} forceScroll - true to force scrolling
         */
        updateVerticalScroll: function(forceScroll) {
          this.updateContentPosition(this._size, this._pageSize, this._offset, forceScroll);
        },

        /**
         * Sets vertical scroll parameters
         * BEWARE this code should be the same as TableWidget::updateContentPosition
         * @param {?number} size
         * @param {?number} pageSize
         * @param {?number} offset
         * @param {boolean} forceScroll
         */
        updateContentPosition: function(size, pageSize, offset, forceScroll) {
          this.setSize(size);
          this._pageSize = pageSize;

          var top = offset * this.getRowHeight();
          var height = (size - offset) * this.getRowHeight();

          this.setStyle("> .containerElement", {
            "margin-top": top + "px",
            "height": height + "px"
          });

          if (forceScroll || (this.lastSentOffset === null ||
              this.lastSentOffset === offset) && offset !== this._offset) {
            this._offset = offset;
            // need to do this because to scroll we need to wait the style "height" set just before is really applied in the dom
            this.afterDomMutator(function() {
              this.getScrollableArea().scrollTop = top;
            }.bind(this));
          }

          this.lastSentOffset = null;
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
         * Indicates if the scrollgrid can have a reduce filter
         * @param {boolean} b - true if table can have a reduce filter
         */
        setReduceFilter: function(b) {
          this._hasReduceFilter = b;
        },

        /**
         * Return if the scrollgrid can have a reduce filter
         * @returns {boolean} true if table can have a reduce filter
         */
        hasReduceFilter: function() {
          return this._hasReduceFilter;
        },

        /**
         * Set how children will align
         * @param {string} alignment
         */
        setItemsAlignment: function(alignment) {
          if (this._containerElement) {
            this._containerElement.style.alignItems = {
              start: "flex-start",
              left: "flex-start",
              center: "center",
              stretch: "stretch",
              right: "flex-end",
              end: "flex-end"
            } [alignment] || "stretch";
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('StretchableScrollGrid', cls.StretchableScrollGridWidget);
  });
