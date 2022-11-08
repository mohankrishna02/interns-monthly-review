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

modulum('TableWidget', ['TableWidgetBase'],
  function(context, cls) {

    /**
     * Table widget.
     *
     * @class TableWidget
     * @memberOf classes
     * @extends classes.TableWidgetBase
     * @publicdoc Widgets
     */
    cls.TableWidget = context.oo.Class(cls.TableWidgetBase, function($super) {
      return /** @lends classes.TableWidget.prototype */ {
        __name: "TableWidget",

        _stylingContext: "widget",

        $static: /** @lends classes.TableWidget */ {
          defaultRowHeight: 14
        },

        _lastClickDate: null, // date of the last click event
        _lastClickTarget: null, // target of the click event
        _currentColumn: 0,
        _orderedColumns: null,
        _addOnlyVisibleColumnsToDom: true, // to enable/disable this optimization
        _layoutDone: false,
        _hasFooter: false,
        _firstDisplay: true,
        _needToUpdateVerticalScroll: false,
        _focusOnField: false,
        _requestSynchronizeHeadersHeight: false,

        /** @type classes.TableColumnRowBoundWidget */
        _rowBoundColumnWidget: null,

        /** Item client selection */
        _defaultItemSelection: false,
        _firstItemSelected: null,
        _itemSelectionInProgress: false,
        _itemSelectionHasChanged: false,
        _itemSelectionElement: null,

        /** DOM Elements */
        _leftContainerElement: null,
        _rightContainerElement: null,
        _columnsContainerElement: null,
        _leftColumnsContainer: null,
        _rightColumnsContainer: null,
        _columnsHeaders: null,
        _leftColumnsHeaders: null,
        _rightColumnsHeaders: null,
        _columnsFooter: null,
        _rightScrollAreaElement: null,
        _leftScrollAreaElement: null,
        _replacerElement: null,
        _aggregateGlobalTextElement: null,

        /** @type boolean */
        _scrollAreaNoUserScroll: false,
        /** @type boolean */
        _rightScrollAreaNoUserScroll: false,
        /** @type boolean */
        _scrollAreaResetScrollTopFromPrevious: false,
        /**
         * unique unbind id part generator
         * @type {number}
         */
        _uniqueScrollUnbindId: 0,
        /**
         * Map with all active scrolls
         * @type {Map<string, Element>}
         */
        _activeUniqueIdScrolls: null,

        /** frozen table attributes */
        _frozenTable: false,
        _leftFrozenColumns: 0,
        _rightFrozenColumns: 0,

        /** scroll attributes */
        /** @type number */
        _previousScrollLeftValue: 0,
        /** @type number */
        _previousScrollTopValue: 0,
        lastSentOffset: null,

        /** Dnd attributes */
        _dndItemEnabled: false,
        _dndMode: null,
        _dndMouseDragX: null, // mouse X position when dragging (ugly hack for FF because drag event does not contain mouse coordinates)
        _dndReorderingDragOverWidget: null,
        _dndDraggedColumnWidget: null,
        _noDrop: null,

        /** styles */
        _highlightCurrentCell: null,
        _showGrid: null,
        _headerAlignment: null,
        _headerHidden: null,
        _resizeFillsEmptySpace: false,
        _columnResizeFillsEmptySpace: null,

        /**
         * @constructs
         * @param {*} opts - Options passed to the constructor
         */
        constructor: function(opts) {
          this._noDrop = {
            "left": false,
            "right": false,
            "center": false
          };

          $super.constructor.call(this, opts);
        },

        /**
         * Prevent default on dragover, to remove forbidden icon on drag
         * @param {Object} event - DOM event
         * @private
         */
        _preventDefault: function(event) {
          this._dndMouseDragX = event.clientX || event.screenX; // Fix for FF
          if (this._dndMode) {
            event.preventCancelableDefault();
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this.setRowHeight(cls.TableWidget.defaultRowHeight);
          this._activeUniqueIdScrolls = new Map();

          //drag events
          this.getColumnsHeaders().on("dragover.TableWidget", this._preventDefault.bind(this));
          this.getLeftColumnsHeaders().on("dragover.TableWidget", this._preventDefault.bind(this));
          this.getRightColumnsHeaders().on("dragover.TableWidget", this._preventDefault.bind(this));

          //left container events
          this.getLeftColumnsHeaders()
            .on("drop.TableWidget", this._onHeaderDrop.bind(this))
            .on("dragstart.TableWidget", this._onHeaderDragStart.bind(this))
            .on("dragend.TableWidget", this._onHeaderDragEnd.bind(this))
            .on("drag.TableWidget", this._onHeaderDrag.throttle(5).bind(this))
            .on("dragover.TableWidget", this._onHeaderDragOver.bind(this))
            .on("dragleave.TableWidget", this._onHeaderDragLeave.bind(this))
            .onLongTouch('longTouch.TableWidget', this._onLongTouch.bind(this))
            .onDoubleTap("TableWidget", this._onHeaderDoubleClick.bind(this));

          this.getLeftColumnsContainer()
            .onDoubleTap("TableWidget", this._onDoubleClick.bind(this));

          //right container events
          this.getRightColumnsHeaders()
            .on("drop.TableWidget", this._onHeaderDrop.bind(this))
            .on("dragstart.TableWidget", this._onHeaderDragStart.bind(this))
            .on("dragend.TableWidget", this._onHeaderDragEnd.bind(this))
            .on("drag.TableWidget", this._onHeaderDrag.throttle(5).bind(this))
            .on("dragover.TableWidget", this._onHeaderDragOver.bind(this))
            .on("dragleave.TableWidget", this._onHeaderDragLeave.bind(this))
            .onLongTouch('longTouch.TableWidget', this._onLongTouch.bind(this))
            .onDoubleTap("TableWidget", this._onHeaderDoubleClick.bind(this));

          this.getRightColumnsContainer()
            .onDoubleTap("TableWidget", this._onDoubleClick.bind(this));

          //main container events
          this.getColumnsHeaders()
            .on("drop.TableWidget", this._onHeaderDrop.bind(this))
            .on("dragstart.TableWidget", this._onHeaderDragStart.bind(this))
            .on("dragend.TableWidget", this._onHeaderDragEnd.bind(this))
            .on("drag.TableWidget", this._onHeaderDrag.throttle(5).bind(this))
            .on("dragover.TableWidget", this._onHeaderDragOver.bind(this))
            .on("dragleave.TableWidget", this._onHeaderDragLeave.bind(this))
            .onLongTouch('longTouch.TableWidget', this._onLongTouch.bind(this))
            .onDoubleTap("TableWidget", this._onHeaderDoubleClick.bind(this));

          this.getColumnsContainer()
            .onDoubleTap("TableWidget", this._onDoubleClick.bind(this));

          // Scroll events
          this.getScrollableArea().on('scroll.TableWidget', this._onScroll.bind(this));
          this.getLeftScrollableArea().on('scroll.TableWidget', this._onScrollOnLeftColumns.bind(this));
          this.getRightScrollableArea().on('scroll.TableWidget', this._onScrollOnRightColumns.bind(this));

          // client select items events
          this.getElement()
            .on("mousedown.TableWidget", this._onItemMouseDown.bind(this))
            .on("mouseup.TableWidget", this._onItemMouseUp.bind(this))
            .on("mouseleave.TableWidget", this._onItemMouseLeave.bind(this));

          this.setStyle(".gbc_TableColumnsHeaders", {
            "margin-right": window.scrollBarSize + "px"
          });
          this.setStyle(".gbc_TableColumnsFooter, .gbc_TableLeftColumnsFooter, .gbc_TableRightColumnsFooter", {
            "margin-bottom": window.scrollBarSize + "px"
          });
          this._updateFooterWidth();

        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutInformation.shouldFillStack = true;
          this._layoutEngine = new cls.TableLayoutEngine(this);

          this._layoutEngine.onLayoutApplied(this._layoutApplied.bind(this));
          this._layoutInformation.getStretched().setDefaultX(true);
          this._layoutInformation.getStretched().setDefaultY(true);

          var minPageSize = parseInt(context.ThemeService.getValue("gbc-TableWidget-min-page-size"), 10);
          this._layoutEngine.setMinPageSize(isNaN(minPageSize) ? 1 : minPageSize);
          var minWidth = parseInt(context.ThemeService.getValue("gbc-TableWidget-min-width"), 10);
          this._layoutEngine.setMinWidth(isNaN(minWidth) ? 60 : minWidth);
        },

        /**
         * Invalidate measure to force width & row height measure in next layout cycle
         */
        resetMeasure: function() {
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
          if (this.getLayoutEngine().invalidatePreferredSize) {
            this.getLayoutEngine().invalidatePreferredSize();
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {

          //drag events
          this.getColumnsHeaders().off("dragover.TableWidget");
          this.getLeftColumnsHeaders().off("dragover.TableWidget");
          this.getRightColumnsHeaders().off("dragover.TableWidget");

          //left container events
          this.getLeftColumnsHeaders().off("drop.TableWidget");
          this.getLeftColumnsHeaders().off("dragstart.TableWidget");
          this.getLeftColumnsHeaders().off("dragend.TableWidget");
          this.getLeftColumnsHeaders().off("drag.TableWidget");
          this.getLeftColumnsHeaders().off("dragover.TableWidget");
          this.getLeftColumnsHeaders().off("dragleave.TableWidget");
          this.getLeftColumnsHeaders().offLongTouch('longTouch.TableWidget');
          this.getLeftColumnsHeaders().offDoubleTap("TableWidget");

          this.getLeftColumnsContainer().offDoubleTap("TableWidget");

          //right container events
          this.getRightColumnsHeaders().off("drop.TableWidget");
          this.getRightColumnsHeaders().off("dragstart.TableWidget");
          this.getRightColumnsHeaders().off("dragend.TableWidget");
          this.getRightColumnsHeaders().off("drag.TableWidget");
          this.getRightColumnsHeaders().off("dragover.TableWidget");
          this.getRightColumnsHeaders().off("dragleave.TableWidget");
          this.getRightColumnsHeaders().offLongTouch('longTouch.TableWidget');
          this.getRightColumnsHeaders().offDoubleTap("TableWidget");

          this.getRightColumnsContainer().offDoubleTap("TableWidget");

          //main container events
          this.getColumnsHeaders().off("drop.TableWidget");
          this.getColumnsHeaders().off("dragstart.TableWidget");
          this.getColumnsHeaders().off("dragend.TableWidget");
          this.getColumnsHeaders().off("drag.TableWidget");
          this.getColumnsHeaders().off("dragover.TableWidget");
          this.getColumnsHeaders().off("dragleave.TableWidget");
          this.getColumnsHeaders().offLongTouch('longTouch.TableWidget');
          this.getColumnsHeaders().offDoubleTap("TableWidget");

          this.getColumnsContainer().offDoubleTap("TableWidget");

          // Scroll events
          this.getScrollableArea().off('scroll.TableWidget');
          this.getLeftScrollableArea().off('scroll.TableWidget');
          this.getRightScrollableArea().off('scroll.TableWidget');

          if (this._activeUniqueIdScrolls) {
            this._activeUniqueIdScrolls.forEach(function(domElement, id) {
              domElement.off(id);
            }, this);
            this._activeUniqueIdScrolls.clear();
            this._activeUniqueIdScrolls = null;
          }

          if (this._rowBoundColumnWidget) {
            this._rowBoundColumnWidget.destroy();
            this._rowBoundColumnWidget = null;
          }

          // client select items events
          this.getElement().off("mousedown.TableWidget");
          this.getElement().off("mouseup.TableWidget");
          this.getElement().off("mousemove.TableWidget");
          this.getElement().off("mouseleave.TableWidget");

          if (this._dndItemEnabled) {
            var columnsContainer = this.getColumnsContainer();
            columnsContainer.off("dragstart.TableWidget");
            columnsContainer.off("dragend.TableWidget");
            columnsContainer.off("dragover.TableWidget");
            columnsContainer.off("drop.TableWidget");
            columnsContainer.off("dragleave.TableWidget");
            columnsContainer.off("dragenter.TableWidget");
          }

          this._columnsHeaders = null;
          this._leftContainerElement = null;
          this._rightContainerElement = null;
          this._columnsContainerElement = null;
          this._leftColumnsContainer = null;
          this._rightColumnsContainer = null;
          this._leftColumnsHeaders = null;
          this._rightColumnsHeaders = null;
          this._columnsFooter = null;
          this._leftColumnsFooter = null;
          this._rightColumnsFooter = null;
          this._rightScrollAreaElement = null;
          this._leftScrollAreaElement = null;
          this._aggregateGlobalTextElement = null;
          this._orderedColumns = null;
          this._lastClickDate = null;
          this._lastClickTarget = null;

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isDisplayMode()) {
            if (domKeyEvent) {
              var key = cls.KeyboardApplicationService.keymap[domKeyEvent.which];
              keyProcessed = true;
              switch (key) {
                case "down":
                  this.emit(context.constants.widgetEvents.keyArrowDown, domKeyEvent);
                  break;
                case "up":
                  this.emit(context.constants.widgetEvents.keyArrowUp, domKeyEvent);
                  break;
                case "left":
                  this.emit(context.constants.widgetEvents.keyArrowLeft, domKeyEvent);
                  break;
                case "right":
                  this.emit(context.constants.widgetEvents.keyArrowRight, domKeyEvent);
                  break;
                case "pageup":
                  this.emit(context.constants.widgetEvents.keyPageUp, domKeyEvent);
                  break;
                case "pagedown":
                  this.emit(context.constants.widgetEvents.keyPageDown, domKeyEvent);
                  break;
                case "home":
                  this.emit(context.constants.widgetEvents.keyHome, domKeyEvent);
                  break;
                case "end":
                  this.emit(context.constants.widgetEvents.keyEnd, domKeyEvent);
                  break;
                case "space":
                  this.emit(context.constants.widgetEvents.keySpace, domKeyEvent);
                  break;
                default:
                  keyProcessed = false;
              }
            }

            if (keyString === "ctrl+a" || keyString === "meta+a") {
              this.emit(context.constants.widgetEvents.selectAll);
              keyProcessed = true;
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.manageKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          // manage CTRL+C case
          if (keyString === "ctrl+c" || keyString === "meta+c") {
            if (this.hasItemsSelected()) { // copy selection
              this._copySelectionInClipboard();
              keyProcessed = true;
            } else if (this.isDisplayMode()) { // copy current row
              this.emit(context.constants.widgetEvents.copy);
              keyProcessed = true;
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (!domEvent.target.parent("gbc_TableColumnWidget")) { // request focus only if click is outside a column
            this.emit(context.constants.widgetEvents.requestFocus);
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        manageMouseDblClick: function(domEvent) {
          var target = domEvent.target;

          // click on headers
          var isHeaderDblClick = target.isElementOrChildOf(this.getColumnsHeaders()) ||
            target.isElementOrChildOf(this.getLeftColumnsHeaders()) || target.isElementOrChildOf(this.getRightColumnsHeaders());

          if (isHeaderDblClick) {
            this._onHeaderDoubleClick(domEvent);
            return false;
          }

          // click on columns
          var isColumnsContainerClick = target.isElementOrChildOf(this.getColumnsContainer()) ||
            target.isElementOrChildOf(this.getLeftColumnsContainer()) || target.isElementOrChildOf(this.getRightColumnsContainer());

          if (isColumnsContainerClick) {
            this._onDoubleClick(domEvent);
            return false;
          }

          return true;
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          if (this._enabled !== enabled) {
            $super.setEnabled.call(this, enabled);

            this._resetItemsSelection();
            this.updateVerticalScroll(enabled);
          }
        },

        /**
         * @inheritDoc
         */
        setAriaSelection: function() {
          // Do nothing to override this: table role cannot have aria-selected
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          $super.setBackgroundColor.call(this, color);
          this.setStyle('.gbc_TableColumnsHeaders, .gbc_TableLeftColumnsHeaders, .gbc_TableRightColumnsHeaders', {
            "background-color": color && !this._ignoreBackgroundColor ? color : null
          });
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          if (this.isElementInDOM()) {
            this.domFocus(fromMouse);
          } else {
            var uiWidget = this.getUserInterfaceWidget();
            if (uiWidget) {
              uiWidget.getElement().domFocus();
            }
          }
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * @inheritDoc
         */
        resetLayout: function() {
          $super.resetLayout.call(this);
          this._layoutDone = false;
        },

        /**
         * Call when layout is finished
         */
        _layoutApplied: function() {
          if (this.isElementInDOM()) {
            if (!this._layoutDone) {
              // first time layout is applied
              this._layoutDone = true;
              this.updateFrozenColumns();
              this.updateAllAggregate();
            }

            // if table is visible and was already active
            this._updateVisibleColumnsInDom(); // remove not visible column content
            this.updateVerticalScroll(this._needToUpdateVerticalScroll);
            this._needToUpdateVerticalScroll = false;

            if (this._requestSynchronizeHeadersHeight) {
              this._requestSynchronizeHeadersHeight = false;
              this.synchronizeHeadersHeight();
            }

            this.autoSetLastColumnWidthToFillEmptySpace();
          }
        },

        /**
         * @inheritDoc
         */
        requestFocusFromWidget: function(widget, event) {

          // check if click is second click of a double click
          var isDoubleClick = (new Date() - this._lastClickDate) < 350 && (this._lastClickTarget === event.target);
          this._lastClickDate = new Date();
          this._lastClickTarget = event.target;

          // if event !== click request focus
          // if table has not the focus, widget request focus
          var mustSendFocusRequest = !this.hasVMFocus() || (event.type !== "click");
          // if event is a click and there is no change in the item selection, widget request focus
          mustSendFocusRequest = mustSendFocusRequest || (this._itemSelectionHasChanged === false);
          // else no request focus

          // if click is the second click of a double click not request focus
          if (isDoubleClick) {
            this._lastClickDate = null;
            this._lastClickTarget = null;
            mustSendFocusRequest = false;
          }

          if (mustSendFocusRequest) {
            $super.requestFocusFromWidget.call(this, widget, event);
          }
        },

        /**
         * Auto set last column width
         */
        autoSetLastColumnWidthToFillEmptySpace: function() {
          if (this._resizeFillsEmptySpace) {

            var lastVisibleColumn = this.getLastOrderedColumn(true);

            if (this._columnResizeFillsEmptySpace && this._columnResizeFillsEmptySpace !== lastVisibleColumn) {
              this._columnResizeFillsEmptySpace.resetWidth();
              this._columnResizeFillsEmptySpace.setSizable(true);
            }
            this._columnResizeFillsEmptySpace = lastVisibleColumn;

            this._columnResizeFillsEmptySpace.resetWidth();
            this._columnResizeFillsEmptySpace.setSizable(false);

            var visibleColumnsWidth = this.getVisibleColumnsWidth();
            var tableWidth = this.getDataAreaWidth();

            var emptySpaceWidth = tableWidth - visibleColumnsWidth;
            if (emptySpaceWidth >= 0) {
              this._columnResizeFillsEmptySpace.setWidth(this._columnResizeFillsEmptySpace.getWidth() + emptySpaceWidth, true);
            }
          }
        },

        /**
         * Update the list of columns which are in the DOM according to visibility
         */
        _updateVisibleColumnsInDom: function() {

          if (!this._addOnlyVisibleColumnsToDom) {
            return;
          }
          var isLayouted = this._layoutInformation && this._layoutDone;
          if (!isLayouted) {
            return;
          }
          var isVisible = this.isElementInDOM() && this.isVisibleRecursively();
          if (!isVisible) {
            return;
          }
          var offset = this.getScrollableArea().scrollLeft;
          var columns = this.getOrderedColumns();
          var tableWidth = this._layoutInformation.getAllocated().getWidth();
          var currentWidth = 0;
          var extraVisibleColumnAttached = false;
          for (var i = 0; i < columns.length; i++) {

            var col = columns[i];
            if (col.isFrozen() === false && col.isHidden() === false) {
              var colWidth = col.getWidth();

              if (col.isCurrent()) {
                col.attachItemsToDom(); // current column should be always in the dom
              }
              // Detach columns which are not visible at left
              else if (offset > (currentWidth + colWidth)) {
                col.detachItemsFromDom();
              }
              // Detach columns which are not visible at right
              else if ((currentWidth - offset) > tableWidth) {
                if (extraVisibleColumnAttached) {
                  col.detachItemsFromDom();
                } else {
                  extraVisibleColumnAttached = true;
                  col.attachItemsToDom();
                }
              } else {
                col.attachItemsToDom();
              }
              currentWidth += colWidth;
            } else {
              if (col.isHidden()) {
                col.detachItemsFromDom();
              } else {
                col.attachItemsToDom();
              }
            }
          }
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {

          if (widget.isInstanceOf(cls.TableColumnWidget)) {
            this._addChildTableColumn(widget, options);
          } else if (widget.isInstanceOf(cls.ContextMenuWidget)) {
            // Add rowbound menu
            $super.addChildWidget.call(this, widget, options);

            // create rowbound column and add it
            if (this._rowBoundColumnWidget === null) {
              this._rowBoundColumnWidget = cls.WidgetFactory.createWidget("TableColumnRowBound", this.getBuildParameters());
              this._addChildTableColumn(this._rowBoundColumnWidget, options);
            }
            // rowbound column which is the last, should always fills empty space
            this.setResizeFillsEmptySpace(true);
            this._rowBoundColumnWidget.setHidden(false);
          }

          this.resetOrderedColumns();
          this.updateFrozenColumns();
          this._requestSynchronizeHeadersHeight = true;
        },

        /**
         * Add and init table column as table child
         * @param {classes.TableColumnWidget} columnWidget - columns to be added
         * @param options - options addChildWidget
         */
        _addChildTableColumn: function(columnWidget, options) {
          // Set Table as parent
          columnWidget.setParentWidget(this, {
            noLayoutInvalidation: true
          });
          this.getColumnsHeaders().appendChild(columnWidget.getTitleWidget().getElement());
          columnWidget.setCurrentRow(this._currentRow);
          columnWidget.setOrder(this.getColumns().length);
          $super.addChildWidget.call(this, columnWidget, options);
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          $super.removeChildWidget.call(this, widget);
          if (widget.isInstanceOf(cls.ContextMenuWidget)) {
            this.setResizeFillsEmptySpace(false);
            // hide rowbound column when it is not used
            if (this._rowBoundColumnWidget) {
              this._rowBoundColumnWidget.setHidden(true);
            }
          }
          this.resetOrderedColumns();
        },

        /**
         * Set sorted column an type
         * @param sortType - sort type "asc" or "desc" (empty string for no sort)
         * @param sortColumn - column sorted (-1 for no sort)
         */
        setSort: function(sortType, sortColumn) {
          var columns = this.getColumns();

          for (var i = 0; i < columns.length; i++) {
            if (i === sortColumn) {
              columns[i].getTitleWidget().setSortDecorator(sortType);
            } else {
              if (columns[i].getTitleWidget) {
                columns[i].getTitleWidget().setSortDecorator("");
              }
            }
          }
        },

        /**
         * @inheritDoc
         */
        isTreeView: function() {
          var firstColumn = this.getColumns()[0];
          return firstColumn && firstColumn._isTreeView;
        },

        /**
         * Returns if current row is visible
         * @returns {boolean} true if current row is visible
         * @publicdoc
         */
        isCurrentRowVisible: function() {
          return this._currentRow >= 0 && this._currentRow <= this._pageSize;
        },

        /**
         * Returns column widgets (vm aui tree order)
         * @returns {classes.TableColumnWidget[]} array of column widgets
         * @publicdoc
         */
        getColumns: function() {
          return this.getChildren();
        },

        /**
         * Reset cache of ordered columns.
         */
        resetOrderedColumns: function() {
          this._orderedColumns = null;
        },

        /**
         * Returns column widgets (visual order)
         * @returns {classes.TableColumnWidget[]} array of column widgets
         * @publicdoc
         */
        getOrderedColumns: function() {
          var columns = this.getColumns();
          if (this._orderedColumns === null || columns.length !== this._orderedColumns.length) {
            var children = columns.slice();
            children.sort(function(a, b) {
              return a.getOrder() - b.getOrder();
            });
            this._orderedColumns = children;
          }
          return this._orderedColumns;
        },

        /**
         * Returns last ordered column
         * @param {boolean} visible - if true return the last visible ordered columns
         * @returns {classes.TableColumnWidget} last column widget
         * @publicdoc
         */
        getLastOrderedColumn: function(visible) {
          var columns = this.getOrderedColumns();
          for (var i = columns.length - 1; i >= 0; i--) {
            var currentColumn = columns[i];
            if (!visible || !currentColumn.isHidden()) {
              return currentColumn;
            }
          }
          return null;
        },

        /**
         * Returns the width of all visible columns
         * @returns {number} columns width
         */
        getVisibleColumnsWidth: function() {
          var visibleColumnsWidth = 0;
          var columns = this.getOrderedColumns();
          for (var i = 0; i < columns.length; i++) {
            var currentColumn = columns[i];
            if (!currentColumn.isHidden()) {
              visibleColumnsWidth += currentColumn.getWidth();
            }
          }
          return visibleColumnsWidth;
        },

        /**
         * @inheritDoc
         */
        setRowHeight: function(height) {
          this._rowHeight = Math.round(height);
          this.setStyle(" .gbc_TableColumnItemWidget", {
            "height": this._rowHeight + "px"
          });
          this.setStyle(" .gbc_TableColumnItemWidget .gbc_TableItemImage", {
            "width": this._rowHeight + "px",
            "height": this._rowHeight + "px"
          });
          this.updateVerticalScroll(true); // refresh vertical scroll if row height has changed
        },

        /**
         * @inheritDoc
         */
        setCurrentRow: function(row, ensureRowVisible) {
          this._currentRow = row;
          var columns = this.getColumns();

          // if item is partially visible need to scroll, it must be entirely visible
          var scrollIntoView = (Boolean(ensureRowVisible) && this._layoutDone);

          for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            col.setCurrentRow(row);
          }

          if (scrollIntoView) {
            this._scrollAreaNoUserScroll = true;
            this._rightScrollAreaNoUserScroll = true;
            var id = "scroll.unbindScroll" + (++this._uniqueScrollUnbindId);
            this._activeUniqueIdScrolls.set(id, this.getScrollableArea());
            this.getScrollableArea().on(id, function(id) {
              this._previousScrollTopValue = this.getScrollableArea().scrollTop;
              this._previousScrollLeftValue = this.getScrollableArea().scrollLeft;

              this.getScrollableArea().off(id);
              this._activeUniqueIdScrolls.delete(id);

              this._scrollAreaNoUserScroll = false;
              this._rightScrollAreaNoUserScroll = false;
            }.bind(this, id));
            this.getScrollableArea().scrollTop = (this._offset * this.getRowHeight());
          }
        },

        /**
         * @inheritDoc
         */
        setCurrentColumn: function(col) {
          this._currentColumn = col;
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            if (columns[i].setCurrent) {
              columns[i].setCurrent(i === col);
            }
          }
        },

        /** Returns current column
         * @returns {number} current column
         */
        getCurrentColumn: function() {
          return this._currentColumn;
        },

        /**
         * Returns the current widget
         * @returns {classes.WidgetBase} current widget
         * @publicdoc
         */
        getCurrentWidget: function() {
          if (this.isCurrentRowVisible()) {
            return this.getWidgetAt(this._currentColumn, this._currentRow);
          }
          return null;
        },

        /**
         * Returns the widget at the specified column/row
         * @param {number} column - column index
         * @param {number} row - row index
         * @returns {classes.WidgetBase} item widget
         * @publicdoc
         */
        getWidgetAt: function(column, row) {
          return this.getColumns()[column].getWidgetAt(row);
        },

        /**
         * @inheritDoc
         */
        setVisibleRows: function(visibleRows) {
          if (this._visibleRows !== visibleRows) {
            this._visibleRows = visibleRows;
            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              var tableColumn = columns[i];
              if (tableColumn.updateRowsVisibility) {
                tableColumn.updateRowsVisibility();
              }
            }
          }
        },

        /**
         * @param {boolean} enable - true if the table should allow multi-row selection, false otherwise
         */
        setMultiRowSelectionEnabled: function(enable) {
          this._element.toggleClass("multiRowSelection", Boolean(enable));
        },

        /**
         * Returns if multi-row selection is enabled
         * @returns {boolean} true if the table allow multi-row selection, false otherwise
         * @publicdoc
         */
        isMultiRowSelectionEnabled: function() {
          return this._element.hasClass("multiRowSelection");
        },

        /**
         * Sets the specified row is selected
         * @param {number} row - index of the row
         * @param {boolean} selected - true if the row should be selected, false otherwise
         */
        setRowSelected: function(row, selected) {
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            var tableColumn = columns[i];
            tableColumn.setRowSelected(row, selected);
          }
        },

        /**
         * Returns if the specified row is selected
         * @param {number} row - index of the row
         * @returns {boolean} true if the row is selected, false otherwise
         */
        isRowSelected: function(row) {
          var columns = this.getColumns();
          if (columns.length) {
            return columns[row].isRowSelected(row);
          }
          return false;
        },

        /**
         * Defines if focus in on a field (table item) or (default) on a row
         * @param {boolean} focusOnField - true if focus on field activated
         */
        setFocusOnField: function(focusOnField) {
          this._focusOnField = focusOnField;
        },

        /**
         * Returns if focus is on a field (table item) (by default focus is on a row)
         * @returns {boolean} true if focus on field activated
         */
        hasFocusOnField: function() {
          return this._focusOnField;
        },

        /**
         * Set the same heights for all headers (left, middle, right)
         */
        synchronizeHeadersHeight: function() {
          if (this._frozenTable && this._layoutDone) {

            var height = -1;
            var leftHeight = -1;
            var rightHeight = -1;

            if (this.hasLeftFrozenColumns() || this.hasRightFrozenColumns()) {
              this.getColumnsHeaders().addClass("g_TableMeasuring");
              height = this.getColumnsHeaders().clientHeight;
              this.getColumnsHeaders().removeClass("g_TableMeasuring");
            }
            if (this.hasLeftFrozenColumns()) {
              this.getLeftColumnsHeaders().addClass("g_TableMeasuring");
              leftHeight = this.getLeftColumnsHeaders().clientHeight;
              this.getLeftColumnsHeaders().removeClass("g_TableMeasuring");
            }
            if (this.hasRightFrozenColumns()) {
              this.getRightColumnsHeaders().addClass("g_TableMeasuring");
              rightHeight = this.getRightColumnsHeaders().clientHeight;
              this.getRightColumnsHeaders().removeClass("g_TableMeasuring");
            }

            var headerHeight = Math.max(height, leftHeight, rightHeight);
            if (headerHeight > 0) {

              this.setStyle(".gbc_TableColumnsHeaders", {
                "height": headerHeight + "px"
              });
              if (this.hasLeftFrozenColumns()) {
                this.setStyle(".gbc_TableLeftColumnsHeaders", {
                  "height": headerHeight + "px"
                });
              }
              if (this.hasRightFrozenColumns()) {
                this.setStyle(".gbc_TableRightColumnsHeaders", {
                  "height": headerHeight + "px"
                });
              }
            }
            // need to measure table
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * @inheritDoc
         */
        buildExtraContextMenuActions: function(contextMenu) {

          contextMenu.addAction("copyRow", i18next.t("gwc.contextMenu.copyRow"), null, "Ctrl+C", {
            clickCallback: function() {
              contextMenu.hide();
              this._copyCurrentRowInClipboard();
            }.bind(this)
          }, true);

          if (this.isMultiRowSelectionEnabled()) {
            contextMenu.addAction("selectAll", i18next.t("gwc.contextMenu.selectAll"), "font:FontAwesome.ttf:f0ea", "Ctrl+A", {
              clickCallback: function() {
                contextMenu.hide();
                this.emit(context.constants.widgetEvents.selectAll);
              }.bind(this)
            }, true);
          }

        },

        /**
         * @inheritDoc
         */
        flash: function() {
          this.addClass("flash");
          this._registerTimeout(function() {
            this.removeClass("flash");
          }.bind(this), 50);
        },

        /**
         * Auto fit all column widths
         */
        autoFitAllColumns: function() {
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            var tc = columns[i];
            tc.autoSetWidth();
          }
        },

        /**
         * Auto fit column widths so all columns visible.
         */
        fitToViewAllColumns: function() {
          // phase 1 work out total
          var columns = this.getColumns();
          var totalAvail = this.getDataAreaWidth();
          var totalCurrent = 0;
          var tc = null,
            i = 0;
          for (i = 0; i < columns.length; i++) {
            tc = columns[i];
            if (!tc.isHidden()) {
              if (tc.isSizable()) {
                totalCurrent = totalCurrent + tc.getWidth();
              } else {
                totalAvail = totalAvail - tc.getWidth();
              }
            }
          }
          // phase 2 set column width in proportion to space available
          var newTotal = 0;
          if (totalCurrent > 0) {
            for (i = 0; i < columns.length; i++) {
              tc = columns[i];
              if (!tc.isHidden() && tc.isSizable()) {
                var w = Math.round(tc.getWidth() * (totalAvail / totalCurrent));
                newTotal = newTotal + w;
                if (newTotal > totalAvail) {
                  w = w - (newTotal - totalAvail); // to be sure that the total of width is not > totalAvail
                }
                tc.setWidthFromUserInteraction(w);
              }
            }
          }
        },

        // ============== START - FOOTER/AGGREGATE FUNCTIONS ===================

        /**
         * Defines if the footer element is needed (used to display aggregate)
         * @param {boolean} b - true to display footer, false to hide it
         */
        setHasFooter: function(b) {
          if (this._hasFooter !== b) {
            this._hasFooter = b;
            this.getColumnsFooter().toggleClass("hidden", !b);
            if (b) {
              this.updateAllAggregate(); // need to update all aggregate
            }
            // need to measure table
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * Returns if table has a footer (used for aggregate)
         * @returns {boolean} true if footer is visible
         */
        hasFooter: function() {
          return this._hasFooter;
        },

        /**
         * Update all aggregates
         */
        updateAllAggregate: function() {
          if (this.hasFooter() && this._layoutDone) {
            // search column which contain an aggregate
            this.resetOrderedColumns();
            var columns = this.getOrderedColumns();
            var firstAggregate = null;
            var aggregateWidth = 0;
            var frozenIndex = null;
            for (var i = 0; i < columns.length; i++) {
              var col = columns[i];
              if (frozenIndex === null) {
                frozenIndex = col.getFrozenIndex();
              }
              var agg = col.getAggregateWidget();

              // for each frozen group (left, right or none), we calculate width of aggregate
              if (col.getFrozenIndex() !== frozenIndex) {
                frozenIndex = col.getFrozenIndex();
                aggregateWidth = 0;
              }
              if (!col.isHidden()) {
                aggregateWidth += col.getWidth();

                if (agg) {
                  if (aggregateWidth) {
                    this.afterDomMutator(function(col, aggregateWidth) {
                      col.setAggregate(col.getAggregateWidget().getText(), aggregateWidth);
                    }.bind(this, col,
                      aggregateWidth)); // pass values as parameters since we are in a loop (otherwise we get only last column values)
                  }
                  aggregateWidth = 0;

                  // first global text has always to be set in the left part of the table
                  if (!firstAggregate) {
                    firstAggregate = agg;
                  }
                }
              }

            }

            // Add globalText element to first aggregate widget
            if (firstAggregate) {
              this.getAggregateGlobalTextElement().remove();
              firstAggregate.getElement().prependChild(this.getAggregateGlobalTextElement());
            }
          }
        },

        /**
         * Global text for aggregates
         * @param {string} text - global aggregate text
         */
        setAggregateGlobalText: function(text) {
          if (!this._aggregateGlobalTextElement) {
            this._aggregateGlobalTextElement = document.createElement("div");
            this._aggregateGlobalTextElement.addClass("gbc_TableAggregateGlobalText");
          }
          this._aggregateGlobalTextElement.textContent = text;
        },
        // ============== END - FOOTER/AGGREGATE FUNCTIONS ===================

        // ============== START - SCROLL FUNCTIONS ===================

        /**
         * Returns if vertical scroll bar is at end
         * @returns {boolean} true if vertical Scroll bar is at end
         */
        isVerticalScrollAtEnd: function() {
          var scrollArea = this.getScrollableArea();
          return (scrollArea.scrollTop + scrollArea.clientHeight) === scrollArea.scrollHeight;
        },

        /**
         * Do native vertical scroll
         * @param {number} value - new scroll value
         * @param {boolean} delta - if true, value is added to old scroll value
         * @param {boolean} [force] - if true, consider the scroll as a user input scroll (especially wheel on left frozen columns)
         */
        doScroll: function(value, delta, force) {
          var isTableVisible = this.isVisibleRecursively();
          if (isTableVisible) {
            var top = value;
            if (delta) {
              top = (this.getScrollableArea().scrollTop + value);
            }
            if (this.hasRightFrozenColumns()) {
              this.setRightScrollableAreaScrollTop(top, force);
            } else {
              this.setScrollableAreaScrollTop(top, force);
            }
          } else {
            this._needToUpdateVerticalScroll = true;
          }
        },

        /**
         * Do a horizontal scrolling (column by column)
         * @param {string} direction - "left" or "right"
         */
        doHorizontalScroll: function(direction) {
          var scrollArea = this.getScrollableArea();
          var scrollPos = scrollArea.scrollLeft;
          var columns = this.getOrderedColumns();
          var width = 0;
          for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            if (col.isFrozen() === false && col.isHidden() === false) {
              var colWidth = col.getWidth();

              var isScrollAtStartColumn = (Math.abs(scrollPos - width) <= 2);
              var isScrollAtEndColumn = (Math.abs(scrollPos - (width + colWidth)) <= 2);
              if ((isScrollAtStartColumn || scrollPos > width) && (isScrollAtEndColumn || scrollPos < width + colWidth)) {
                if (isScrollAtStartColumn && direction === "right") {
                  scrollPos = width + colWidth;
                  direction = "left";
                } else if (isScrollAtEndColumn && direction === "right") {
                  scrollPos = width + colWidth;
                } else {
                  scrollArea.scrollLeft = direction === "right" ? width + colWidth : width;
                  break;
                }
              }
              width += colWidth;
            }
          }
        },

        /**
         * Called when a mousewheel is done
         * @param {Object} event - mousewheel event
         */
        _onMouseWheel: function(event) {
          if (this.isEnabled()) {
            this.doScroll(event.deltaY, true, true);
          }
        },

        /**
         * Called when a scroll is done
         * @param {Object} event - scroll event
         */
        _onScroll: function(event) {

          var targetScrollTop = event.target.scrollTop;
          var targetScrollLeft = event.target.scrollLeft;

          // manage horizontal scroll
          if (this._previousScrollLeftValue !== targetScrollLeft) {
            this._previousScrollLeftValue = targetScrollLeft;
            this.afterDomMutator(function() {
              // Update visible columns
              if (this._throttleUpdateVisibleColumnsInDom) {
                this._clearTimeout(this._throttleUpdateVisibleColumnsInDom);
              }
              this._throttleUpdateVisibleColumnsInDom = this._registerTimeout(function() {
                this._throttleUpdateVisibleColumnsInDom = null;

                // after add/remove a column in DOM, we must block vertical scroll
                this._scrollAreaNoUserScroll = true;
                this._scrollAreaResetScrollTopFromPrevious = true;

                this._updateVisibleColumnsInDom();

                // unblock vertical scroll after two requestAnimationFrame
                // to be sure scroll is done after add/remove column in DOM
                this.afterDomMutator(function() {
                  this.afterDomMutator(function() {
                    this._scrollAreaNoUserScroll = false;
                    this._scrollAreaResetScrollTopFromPrevious = false;
                  }.bind(this));
                }.bind(this));

              }.bind(this), 10);

              // Synchronize Columns headers horizontal scroll
              var scrollLeft = this.getScrollableArea().scrollLeft;
              this.getColumnsHeaders().scrollLeft = scrollLeft;

              // Synchronize columns footer horizontal scroll
              if (this.hasFooter()) {
                this.getColumnsFooter().scrollLeft = scrollLeft;
              }
            }.bind(this));
          }

          // reset items selection after each scroll change
          this._resetItemsSelection();

          if (this._scrollAreaNoUserScroll) {
            // if scroll is not done by user ignore it
            this._scrollAreaNoUserScroll = false;
            if (this._scrollAreaResetScrollTopFromPrevious) {
              // reset to previous value of scroll to block no user scroll
              this._scrollAreaResetScrollTopFromPrevious = false;
              this.getScrollableArea().scrollTop = this._previousScrollTopValue;
            }
            return true;
          }

          // manage vertical scroll
          if (this._previousScrollTopValue !== targetScrollTop) {
            this._previousScrollTopValue = targetScrollTop;
            this.afterDomMutator(function() {
              if (!this.hasRightFrozenColumns()) {
                // Emit scroll event for vertical scrolling
                this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());

                var scrollTop = this.getScrollableArea().scrollTop;
                this.setLeftScrollableAreaScrollTop(scrollTop);
                this.setRightScrollableAreaScrollTop(scrollTop);
              }
            }.bind(this));
          }
        },

        /**
         * Called when a scroll is done on left frozen columns
         * @param {Object} event - scroll event
         */
        _onScrollOnLeftColumns: function(event) {
          // Synchronize Columns headers and footers horizontal scroll
          this.afterDomMutator(function() {
            if (event.target) {
              this.getLeftColumnsHeaders().scrollLeft = event.target.scrollLeft;
              if (this.hasFooter()) {
                this.getLeftColumnsFooter().scrollLeft = event.target.scrollLeft;
              }
            }
          }.bind(this));
        },

        /**
         * Called when a scroll is done on right frozen columns
         * @param {Object} event - scroll event
         */
        _onScrollOnRightColumns: function(event) {
          // Synchronize Columns headers and footers horizontal scroll
          this.afterDomMutator(function() {
            if (event.target) {
              this.getRightColumnsHeaders().scrollLeft = event.target.scrollLeft;
              if (this.hasFooter()) {
                this.getRightColumnsFooter().scrollLeft = event.target.scrollLeft;
              }

              if (this.hasRightFrozenColumns()) {
                // Emit scroll event for vertical scrolling
                this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());

                var scrollTop = event.target.scrollTop;
                this.setLeftScrollableAreaScrollTop(scrollTop);
                this.setScrollableAreaScrollTop(scrollTop);
              }
            }
          }.bind(this));

          if (this._rightScrollAreaNoUserScroll) {
            this._rightScrollAreaNoUserScroll = false;
            return true;
          }

          // Manage vertical scroll only if there is right frozen columns
          if (this.hasRightFrozenColumns()) {
            this.afterDomMutator(function() {
              if (event.target) {

                // Emit scroll event for vertical scrolling
                this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());

                var scrollTop = event.target.scrollTop;
                this.setLeftScrollableAreaScrollTop(scrollTop);
                this.setScrollableAreaScrollTop(scrollTop);
              }
            }.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        updateContentPosition: function(size, pageSize, offset, forceScroll) {

          if (size !== null) {
            this.setSize(size);
            if (this._pageSize !== pageSize) {
              this._pageSize = pageSize;
              this._resetItemsSelection(); // reset items selection after pageSize change
            }

            var top = offset * this.getRowHeight();
            var rowCount = (size - offset + (this.isInputMode() ? 1 :
              0)); // in input one extra line for user to click after last line
            var height = rowCount * this.getRowHeight() + (this.hasFooter() ? this.getColumnsFooter().clientHeight : 0);
            if (size <
              pageSize) { // Height should be always greater than getDataAreaHeight to display correctly gbc_TableAfterLastItemZone
              height = Math.max(Math.floor(this.getDataAreaHeight() - 2),
                height); // -2 to be sure that container is smaller than scrollarea
            }

            this.setStyle({
              selector: ".gbc_TableColumnsContainer"
            }, {
              "margin-top": top + "px",
              "height": height + "px"
            });

            if (this.hasLeftFrozenColumns()) {
              this.setStyle({
                preSelector: ".g_measured ",
                selector: ".gbc_TableLeftColumnsContainer"
              }, {
                "margin-top": top + "px",
                "height": height + "px"
              });
            }

            if (this.hasRightFrozenColumns()) {
              this.setStyle({
                preSelector: ".g_measured ",
                selector: ".gbc_TableRightColumnsContainer"
              }, {
                "margin-top": top + "px",
                "height": height + "px"
              });
            }

            // if offset is different or if scrolltop value of current scrollarea is different too different from calculated value
            // need to rest scrolltop of scrollablearea
            if (forceScroll || (this.lastSentOffset === null || this.lastSentOffset === offset) && offset !== this
              ._offset) {
              this._offset = offset;
              // need to do this because to scroll we need to wait the style "height" set just before is really applied in the dom
              this.afterDomMutator(function() {
                this.doScroll(top, false);
              }.bind(this));
            }
            this.lastSentOffset = null;
          }
        },

        /**
         * set scroll top to the main area
         * @param {number} top - the scrollTop to apply
         * @param {boolean} [force] - if true, consider the scroll as a user input scroll (especially wheel on left frozen columns)
         * @param {boolean} [synchronizing] -
         */
        setScrollableAreaScrollTop: function(top, force, synchronizing) {
          if (this.getScrollableArea().scrollTop !== top) {
            var id = "scroll.unbindScroll" + (++this._uniqueScrollUnbindId);
            this._activeUniqueIdScrolls.set(id, this.getScrollableArea());

            this._scrollAreaNoUserScroll = !force;
            this.getScrollableArea().on(id, function(id) {
              this._previousScrollTopValue = this.getScrollableArea().scrollTop;
              this._previousScrollLeftValue = this.getScrollableArea().scrollLeft;

              this.getScrollableArea().off(id);
              this._activeUniqueIdScrolls.delete(id);

              this._scrollAreaNoUserScroll = false;
            }.bind(this, id));
            this.getScrollableArea().scrollTop = top;
            if (!synchronizing) {
              this.setLeftScrollableAreaScrollTop(top, true);
              this.setRightScrollableAreaScrollTop(top, false, true);
            }
          }
        },

        /**
         * set scroll top to the right area
         * @param {number} top - the scrollTop to apply
         * @param {boolean} [synchronizing] -
         */
        setLeftScrollableAreaScrollTop: function(top, synchronizing) {
          if (this.getLeftScrollableArea().scrollTop !== top) {
            this.getLeftScrollableArea().scrollTop = top;
            if (!synchronizing) {
              this.setScrollableAreaScrollTop(top, false, true);
              this.setRightScrollableAreaScrollTop(top, false, true);
            }
          }
        },

        /**
         * Set scroll top to the right area
         * @param {number} top the scrollTop to apply
         * @param {boolean} [force] - if true, consider the scroll as a user input scroll (especially wheel on left frozen columns)
         * @param {boolean} [synchronizing] -
         */
        setRightScrollableAreaScrollTop: function(top, force, synchronizing) {
          if (this.getRightScrollableArea().scrollTop !== top) {
            var id = "scroll.unbindScroll" + (++this._uniqueScrollUnbindId);
            this._activeUniqueIdScrolls.set(id, this.getRightScrollableArea());

            this._rightScrollAreaNoUserScroll = !force;
            this.getRightScrollableArea().on(id, function(id) {
              this.getRightScrollableArea().off(id);
              this._activeUniqueIdScrolls.delete(id);

              this._rightScrollAreaNoUserScroll = false;
            }.bind(this, id));
            this.getRightScrollableArea().scrollTop = top;
            if (!synchronizing) {
              this.setLeftScrollableAreaScrollTop(top, true);
              this.setScrollableAreaScrollTop(top, false, true);
            }
          }
        },
        // ============== END - SCROLL FUNCTIONS =====================

        // ============== START - FROZEN COLUMNS FUNCTIONS ===================
        /**
         * Update frozen columns.
         */
        updateFrozenColumns: function() {

          if (this._frozenTable) {
            this._renderFrozenColumns();

            this.getScrollableArea().off('wheel.TableWidget');
            this.getLeftScrollableArea().off('wheel.TableWidget');
            this.getRightScrollableArea().off('wheel.TableWidget');

            if (this.hasLeftFrozenColumns()) {
              this.getLeftScrollableArea().on('wheel.TableWidget', this._onMouseWheel.bind(this));
            }

            if (this.hasRightFrozenColumns()) {
              this.getScrollableArea().on('wheel.TableWidget', this._onMouseWheel.bind(this));

              this.setStyle(".gbc_TableColumnsHeaders", {
                "margin-right": 0
              });
              this.setStyle(".gbc_TableRightColumnsHeaders", {
                "margin-right": window.scrollBarSize + "px"
              });

              this.setStyle(".gbc_TableScrollArea", {
                "overflow-y": "hidden"
              });
            } else {
              this.setStyle(".gbc_TableRightColumnsHeaders", {
                "margin-right": 0
              });
              this.setStyle(".gbc_TableColumnsHeaders", {
                "margin-right": window.scrollBarSize + "px"
              });
              this.setStyle(".gbc_TableScrollArea", {
                "overflow-y": "scroll"
              });
            }

            this.getLeftContainer().toggleClass("hidden", !this.hasLeftFrozenColumns());
            this.getRightContainer().toggleClass("hidden", !this.hasRightFrozenColumns());

            this._updateFooterWidth();
            this.updateVerticalScroll();
            this.domAttributesMutator(function() {
              this.afterDomMutator(function() {
                var scrollTop = this.getScrollableArea().scrollTop;
                this.setLeftScrollableAreaScrollTop(scrollTop);
                this.setRightScrollableAreaScrollTop(scrollTop);
              }.bind(this));
            }.bind(this));

            this.synchronizeHeadersHeight();
            this.updateAllAggregate();
          }
        },

        _updateFooterWidth: function() {
          if (this.hasRightFrozenColumns()) {
            this.setStyle(".gbc_TableRightColumnsFooter", {
              "width": "calc(100% - " + window.scrollBarSize + "px)"
            });
            this.setStyle(".gbc_TableColumnsFooter", {
              "width": "100%"
            });
          } else {
            this.setStyle(".gbc_TableColumnsFooter", {
              "width": "calc(100% - " + window.scrollBarSize + "px)"
            });
            this.setStyle(".gbc_TableRightColumnsFooter", {
              "width": "100%"
            });
          }
        },

        /**
         * Returns true if table has left frozen columns
         * @returns {boolean} true if there are left frozen columns
         * @publicdoc
         */
        hasLeftFrozenColumns: function() {
          return (this._leftFrozenColumns > 0);
        },

        /**
         * Returns true if table has right frozen columns
         * @returns {boolean} true if there are right frozen columns
         * @publicdoc
         */
        hasRightFrozenColumns: function() {
          return (this._rightFrozenColumns > 0);
        },

        /**
         * Render frozen columns.
         */
        _renderFrozenColumns: function() {

          if (this._frozenTable) {
            var columns = this.getOrderedColumns();

            for (var i = 0; i < columns.length; i++) {
              var currentColumn = columns[i];
              if (i < this._leftFrozenColumns) {
                currentColumn._isLeftFrozen = true;
                currentColumn._isRightFrozen = false;
                this.getLeftColumnsContainer().appendChild(currentColumn.getElement());
                this.getLeftColumnsHeaders().appendChild(currentColumn.getTitleWidget().getElement());
                if (currentColumn._aggregate) {
                  this.getLeftColumnsFooter().appendChild(currentColumn._aggregate.getElement());
                }
              } else if (columns.length - i <= this._rightFrozenColumns) {
                currentColumn._isRightFrozen = true;
                currentColumn._isLeftFrozen = false;
                this.getRightColumnsContainer().appendChild(currentColumn.getElement());
                this.getRightColumnsHeaders().appendChild(currentColumn.getTitleWidget().getElement());
                if (currentColumn._aggregate) {
                  this.getRightColumnsFooter().appendChild(currentColumn._aggregate.getElement());
                }
              } else {
                currentColumn._isLeftFrozen = false;
                currentColumn._isRightFrozen = false;
                this.getColumnsContainer().appendChild(currentColumn.getElement());
                this.getColumnsHeaders().appendChild(currentColumn.getTitleWidget().getElement());
                if (currentColumn._aggregate) {
                  this.getColumnsFooter().appendChild(currentColumn._aggregate.getElement());
                }
              }
            }
            this._updateVisibleColumnsInDom();
          }
        },

        /**
         * Returns true if table can have frozen columns
         * @returns {boolean} true if table can have frozen columns
         * @publicdoc
         */
        isFrozenTable: function() {
          return this._frozenTable;
        },

        /**
         * Sets if table can contains frozen table.
         * @param {boolean} frozen - true if table can have frozen columns
         */
        setFrozenTable: function(frozen) {
          if (this._frozenTable !== frozen) {
            this._frozenTable = frozen;
            this.updateFrozenColumns();
          }
        },

        /**
         * Sets the number of left frozen columns.
         * @param {number} n - number of left frozen columns
         * @publicdoc
         */
        setLeftFrozenColumns: function(n) {
          if (this._leftFrozenColumns !== n) {
            this._leftFrozenColumns = n;
            this.updateFrozenColumns();
          }
        },

        /**
         * Sets the number of right frozen columns.
         * @param {number} n - number of right frozen columns
         * @publicdoc
         */
        setRightFrozenColumns: function(n) {
          if (this._rightFrozenColumns !== n) {
            this._rightFrozenColumns = n;
            this.updateFrozenColumns();
          }
        },

        /**
         * Returns number of left frozen columns
         * @returns {number} number of left frozen columns
         * @publicdoc
         */
        getLeftFrozenColumns: function() {
          return this._leftFrozenColumns;
        },

        /**
         * Returns number of right frozen columns
         * @returns {number} number of right frozen columns
         * @publicdoc
         */
        getRightFrozenColumns: function() {
          return this._rightFrozenColumns;
        },
        // ============== END - FROZEN COLUMNS FUNCTIONS =====================

        // ============== START - STYLE FUNCTIONS ===================
        /**
         * Hide/Show column headers
         * @param {boolean} hidden - true if header must be hidden
         */
        setHeaderHidden: function(hidden) {
          if (this._headerHidden !== hidden) {
            this._headerHidden = hidden;
            this.getColumnsHeaders().toggleClass("hidden", Boolean(hidden));
            this.getLeftColumnsHeaders().toggleClass("hidden", Boolean(hidden));
            this.getRightColumnsHeaders().toggleClass("hidden", Boolean(hidden));
          }
        },

        /**
         * Show/hide table grid
         * @param {boolean} showGrid - if true always show grid
         */
        setShowGrid: function(showGrid) {
          if (this._showGrid !== showGrid) {
            this._showGrid = showGrid;
            this._element.toggleClass("showGrid", Boolean(showGrid));
          }
        },

        /**
         * Set header columns alignment
         * @param {string} alignment - (default, left, center, right, auto)
         */
        setHeaderAlignment: function(alignment) {
          if (this._headerAlignment !== alignment) {
            this._headerAlignment = alignment;
            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              var col = columns[i];
              col.getTitleWidget().setTextAlign(alignment);
            }
          }
        },

        /**
         * @inheritDoc
         */
        setHighlightColor: function(color) {
          if (this._highlightColor !== color) {
            this._highlightColor = color;

            color = (color === null ? null : color + " !important");

            this.setStyle({
              selector: ":not(.disabled) .highlight .gbc_TableColumnItemWidget.currentRow",
              appliesOnRoot: true
            }, {
              "background-color": color
            });
          }
        },

        /**
         * @inheritDoc
         */
        setHighlightTextColor: function(color) {
          if (this._highlightTextColor !== color) {
            this._highlightTextColor = color;

            this.setStyle({
              selector: ":not(.disabled) .highlight .gbc_TableColumnItemWidget.currentRow",
              appliesOnRoot: true
            }, {
              "color": color === null ? null : color + " !important",
              "fill": color === null ? null : color + " !important"
            });
          }
        },

        /**
         * Indicates if the current cell must be highlighted in a table
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
          this.setCurrentColumn(this._currentColumn);
        },

        /**
         * Indicates if the last visible column should fill the empty space.
         * @param {boolean} b - true if last column fills empty space
         */
        setResizeFillsEmptySpace: function(b) {
          this._resizeFillsEmptySpace = b || this
            .hasRowBound(); // when rowbound last column which is rowbound always takes all the empty space
          if (!this._resizeFillsEmptySpace) {
            this._columnResizeFillsEmptySpace = null;
          }
        },

        /**
         * Indicates if the last visible column should fill the empty space.
         * @return {boolean} true if last column fills empty space
         * @publicdoc
         */
        isResizeFillsEmptySpace: function() {
          return this._resizeFillsEmptySpace;
        },
        // ============== END - STYLE FUNCTIONS =====================

        // ============== START - HEADER Event/DnD FUNCTIONS ===================

        /**
         * Handle double click on header
         * @param {Object} evt - dblclick event
         */
        _onHeaderDoubleClick: function(evt) {
          if (evt.target.hasClass("resizer")) { // double click on resizer
            var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
            if (columnTitleWidget) {
              columnTitleWidget.onResizerDoubleClick(evt);
            }
          }
        },

        /**
         * Handle reordering drop event
         * @param {Object} evt - rop event
         */
        _onHeaderDrop: function(evt) {
          var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
          if (columnTitleWidget) {
            columnTitleWidget.onReorderingDrop(evt);
          } else if (this._dndMode === "columnReordering") {
            if (this._dndReorderingDragOverWidget === null) { // it means user drop column on the header but after the last column
              var orderedColumns = this.getOrderedColumns();
              this._dndDraggedColumnWidget.getTitleWidget().reorderColumns(this._dndDraggedColumnWidget, orderedColumns[
                orderedColumns.length - 1]);
            }
          }
        },

        /**
         * Handle drag start on header
         * @param {Object} evt - dragstart event
         */
        _onHeaderDragStart: function(evt) {
          var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
          if (!columnTitleWidget) {
            return;
          }

          if (evt.target.hasClass("resizer")) { // drag start on resizer
            columnTitleWidget.onResizerDragStart(evt);
          } else if (evt.target.hasClass("headerText")) { // drag start on headerText
            columnTitleWidget.onReorderingDragStart(evt);
          }
        },

        /**
         * Handle drag start on header
         * @param {Object} evt - dragend event
         */
        _onHeaderDragEnd: function(evt) {
          var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
          if (!columnTitleWidget || !evt.target.hasClass) {
            return;
          }

          if (evt.target.hasClass("resizer")) { // drag end on resizer
            columnTitleWidget.onResizerDragEnd(evt);
          } else if (evt.target.hasClass("headerText")) { // drag end on headerText
            columnTitleWidget.onReorderingDragEnd(evt);
          }
        },

        /**
         * Handle drag over on header
         * @param {Object} evt - dragover event
         */
        _onHeaderDragOver: function(evt) {
          var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
          if (!columnTitleWidget) {
            return;
          }
          columnTitleWidget.onReorderingDragOver(evt);
        },

        /**
         * Handle drag leave on header
         * @param {Object} evt - drag leave event
         */
        _onHeaderDragLeave: function(evt) {
          var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
          if (!columnTitleWidget) {
            return;
          }
          columnTitleWidget.onReorderingDragLeave(evt);
        },

        /**
         * Handle drag start on header
         * @param {Object} evt - drag start event
         */
        _onHeaderDrag: function(evt) {
          if (evt.target.hasClass && evt.target.hasClass("resizer")) { // drag start on resizer
            var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
            if (columnTitleWidget) {
              columnTitleWidget.onResizerDrag(evt);
            }
          }
        },

        // ============== END - HEADER Event/DnD FUNCTIONS ===================

        // ============== START - ITEMS CLIENT SELECTION FUNCTIONS ===================

        /**
         * Set if item selection is the default behavior (disable dnd in this case)
         * @param {boolean} b
         */
        setDefaultItemSelection: function(b) {
          this._defaultItemSelection = b;
          if (b === true) {
            this.setDndItemEnabled(false);
          }
        },

        /**
         * Check if this mouse event can allow item selection
         * @param {Object} evt - mouse event
         * @returns {boolean}
         */
        _isEventAllowItemSelection: function(evt) {
          return (this.isDisplayMode() && (evt.ctrlKey || evt.metaKey || this._defaultItemSelection)) || (this.isInputMode() && (
            evt.ctrlKey ||
            evt.metaKey || (this._defaultItemSelection &&
              !this._enabled)));
        },

        /**
         * Returns true if there are some items selected
         * @returns {boolean} true if there are some items selected
         */
        hasItemsSelected: function() {
          if (this._itemSelectionElement === null) {
            return false;
          }
          return !(this._itemSelectionElement.hasClass("hidden"));
        },

        /**
         * Reset items selection
         */
        _resetItemsSelection: function() {
          if (this._firstItemSelected !== null) {
            this._itemSelectionInProgress = false;
            this._firstItemSelected = null;
            if (this._itemSelectionElement) {
              this._itemSelectionElement.addClass("hidden");
            }
            this._setItemSelection(false);
          }
        },

        // Store mouse move prev positions
        _itemSelectionMouseMovePrevX: 0,
        _itemSelectionMouseMovePrevY: 0,

        /**
         * Handle mouseDown event for table items
         * @param {Object} evt - mousedown event
         */
        _onItemMouseDown: function(evt) {

          this._itemSelectionMouseMovePrevX = evt.screenX;
          this._itemSelectionMouseMovePrevY = evt.screenY;

          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");

          this._resetItemsSelection();

          // Start item selection
          if (itemWidget && this._isEventAllowItemSelection(evt)) {

            // To avoid text selection in input array
            evt.stopPropagation();
            evt.preventCancelableDefault();

            // Create selection rect element
            if (this._itemSelectionElement === null) {
              this._itemSelectionElement = document.createElement("span");
              this._itemSelectionElement.addClass("gbc_TableItemSelectionArea");
              this._itemSelectionElement.addClass("hidden");
              this._element.appendChild(this._itemSelectionElement);
            }
            this._itemSelectionInProgress = true;
            this._firstItemSelected = itemWidget;

            // bind mousemove event
            this.getElement().on("mousemove.TableWidget", this._onItemMouseMove.bind(this));

            // disable dnd
            this._temporaryEnabledDndOnItem(false, this._firstItemSelected);
          }
        },

        /**
         * Stop item selection in progress
         * @param {Object} evt - mouse event
         */
        _stopInProgressItemSelection: function(evt) {
          this._itemSelectionInProgress = false;
          if (this._isEventAllowItemSelection(evt)) {
            // re-enable dnd
            this._temporaryEnabledDndOnItem(this._dndItemEnabled, this._firstItemSelected);
          }
        },

        /**
         * Handle mouseUp event for table items
         * @param {Object} evt - mouseup event
         */
        _onItemMouseUp: function(evt) {

          // unbind mousemove event
          this.getElement().off("mousemove.TableWidget");

          this._itemSelectionMouseMovePrevX = 0;
          this._itemSelectionMouseMovePrevY = 0;

          this._stopInProgressItemSelection(evt);
        },

        /**
         * Handle mouseLeave event for table items
         * @param {Object} evt - mouseleave event
         */
        _onItemMouseLeave: function(evt) {
          this._stopInProgressItemSelection(evt);
        },

        /**
         * Handle mouseMove event for table items
         * @param {Object} evt - mousemove event
         */
        _onItemMouseMove: function(evt) {
          var movementX = (this._itemSelectionMouseMovePrevX ? evt.screenX - this._itemSelectionMouseMovePrevX : 0);
          var movementY = (this._itemSelectionMouseMovePrevY ? evt.screenY - this._itemSelectionMouseMovePrevY : 0);

          if (Math.abs(movementX) > 1 || Math.abs(movementY) > 1) { // execute code only if movement > 1px
            if (this._itemSelectionInProgress && this._isEventAllowItemSelection(evt)) {
              var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
              if (itemWidget) {
                if (this._firstItemSelected !== null) {
                  this._setItemSelection(true, this._firstItemSelected, itemWidget);
                }
              }
            }
          }

          this._itemSelectionMouseMovePrevX = evt.screenX;
          this._itemSelectionMouseMovePrevY = evt.screenY;
        },

        /**
         * Copy current items selection in the clipboard
         */
        _copySelectionInClipboard: function() {
          var rows = [];
          var rowIndex;

          var orderedColumns = this.getOrderedColumns();
          for (var i = 0; i < orderedColumns.length; i++) {
            var col = orderedColumns[i];

            rowIndex = 0;
            for (var j = 0; j < col.getChildren().length; j++) {
              var item = col.getChildren()[j];

              if (item.isClientSelected()) {

                var text = item.getChildren()[0].getClipboardValue() + "\t";
                if (rows.length <= rowIndex) {
                  rows.push(text);
                } else {
                  rows[rowIndex] += text;
                }
                rowIndex++;
              }
            }
          }
          for (i = 0; i < rows.length; ++i) {
            rows[i] = rows[i].substring(0, rows[i].length - 1);
          }
          cls.ClipboardHelper.copyTo(rows.join("\r\n"), this._element);
        },

        /**
         * Copy current row items in the clipboard
         */
        _copyCurrentRowInClipboard: function() {
          var row = "";

          var orderedColumns = this.getOrderedColumns();
          for (var i = 0; i < orderedColumns.length; i++) {
            var col = orderedColumns[i];
            if (!col.isHidden()) {
              if (this._currentRow >= 0 && this._currentRow < col.getChildren().length) {
                var item = col.getChildren()[this._currentRow];
                row += item.getChildren()[0].getClipboardValue();
                if (i < orderedColumns.length - 1) {
                  row += '\t';
                }
              }
            }
          }

          cls.ClipboardHelper.copyTo(row, this._element);
        },

        /**
         * Copy current cell item in the clipboard
         */
        _copyCurrentCellInClipboard: function() {
          var cell = "";
          var col = this.getColumns()[this._currentColumn];

          if (this._currentRow >= 0 && this._currentRow < col.getChildren().length) {
            var item = col.getChildren()[this._currentRow];
            cell = item.getChildren()[0].getClipboardValue();
          }

          cls.ClipboardHelper.copyTo(cell, this._element);
        },

        /**
         * Select items
         * @param {boolean} b - true/false select or unselect items
         * @param {classes.TableColumnItemWidget} [startSelectedItem]
         * @param {classes.TableColumnItemWidget} [endSelectedItem]
         */
        _setItemSelection: function(b, startSelectedItem, endSelectedItem) {

          var realStartRow = -1;
          var realEndRow = -1;
          var realStartCol = -1;
          var realEndCol = -1;

          this._itemSelectionHasChanged = false;

          if (b && startSelectedItem && endSelectedItem) {

            var startCol = startSelectedItem.getParentWidget().getOrderedColumnIndex();
            var startRow = startSelectedItem.getItemIndex();
            var endCol = !endSelectedItem ? startCol : endSelectedItem.getParentWidget().getOrderedColumnIndex();
            var endRow = !endSelectedItem ? startRow : endSelectedItem.getItemIndex();

            realStartRow = (startRow < endRow) ? startRow : endRow;
            realEndRow = (startRow < endRow) ? endRow : startRow;
            realStartCol = (startCol < endCol) ? startCol : endCol;
            realEndCol = (startCol < endCol) ? endCol : startCol;

            var mostLeftItem = (realStartCol === startCol) ? startSelectedItem : endSelectedItem;
            var mostRightItem = (realStartCol === startCol) ? endSelectedItem : startSelectedItem;
            var left = mostLeftItem.getElement().getBoundingClientRect().left;
            var right = mostRightItem.getElement().getBoundingClientRect().right;

            var mostTopItem = (realStartRow === startRow) ? startSelectedItem : endSelectedItem;
            var mostBottomItem = (realStartRow === startRow) ? endSelectedItem : startSelectedItem;
            var top = mostTopItem.getElement().getBoundingClientRect().top;
            var bottom = mostBottomItem.getElement().getBoundingClientRect().bottom;
            var tableTop = this.getElement().getBoundingClientRect().top;
            var tableLeft = this.getElement().getBoundingClientRect().left;

            this.setStyle(".gbc_TableItemSelectionArea", {
              "left": (left - tableLeft) + "px",
              "top": (top - tableTop) + "px",
              "width": (right - left) + "px",
              "height": (bottom - top) + "px"
            });

            this._itemSelectionElement.removeClass("hidden");
            this._itemSelectionHasChanged = true;
          }

          for (var i = 0; i < this.getOrderedColumns().length; i++) {
            var col = this.getOrderedColumns()[i];
            for (var j = 0; j < col.getChildren().length; j++) {
              var item = col.getChildren()[j];

              var select = (b && i >= realStartCol && i <= realEndCol && j >= realStartRow && j <= realEndRow);
              item.setClientSelected(select);
            }
          }
        },

        /**
         * Enable or disable Dnd on a item
         * @param {boolean} b - true/false enable/disable Dnd on item
         * @param {classes.TableColumnItemWidget} item
         */
        _temporaryEnabledDndOnItem: function(b, item) {
          if (item) {
            item.setDndEnabled(b);

            if (b) {
              this.getColumnsContainer().setAttribute("draggable", "true");
            } else {
              this.getColumnsContainer().removeAttribute("draggable");
            }
          }
        },
        // ============== END - ITEMS CLIENT SELECTION FUNCTIONS ===================

        // ============== START - ITEMS DnD FUNCTIONS ===================
        /**
         * Enable Dnd of items
         * @param {boolean} b
         */
        setDndItemEnabled: function(b) {
          if (b && this._defaultItemSelection) {
            return; // no dnd if default is item selection
          }

          if (this._dndItemEnabled !== b) {
            this._dndItemEnabled = b;

            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              columns[i].setDndItemEnabled(b);
            }

            var columnsContainer = this.getColumnsContainer();
            if (b) {
              columnsContainer.setAttribute("draggable", "true");
              columnsContainer.on("dragstart.TableWidget", this._onItemDragStart.bind(this));
              columnsContainer.on("dragend.TableWidget", this._onItemDragEnd.bind(this));
              columnsContainer.on("dragover.TableWidget", this._onItemDragOver.bind(this));
              columnsContainer.on("drop.TableWidget", this._onItemDrop.bind(this));
              columnsContainer.on("dragleave.TableWidget", this._onItemDragLeave.bind(this));
              columnsContainer.on("dragenter.TableWidget", this._onItemDragEnter.bind(this));
            } else {
              columnsContainer.removeAttribute("draggable");
              columnsContainer.off("dragstart.TableWidget");
              columnsContainer.off("dragend.TableWidget");
              columnsContainer.off("dragover.TableWidget");
              columnsContainer.off("drop.TableWidget");
              columnsContainer.off("dragleave.TableWidget");
              columnsContainer.off("dragenter.TableWidget");
            }
          }
        },

        /**
         * Handle dragStart event for table items
         * @param {Object} evt - dragstart event
         */
        _onItemDragStart: function(evt) {
          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
          if (itemWidget) {
            itemWidget.onDragStart(evt);
          }
        },
        /**
         * Handle dragEnd event for table items
         * @param {Object} evt - dragend event
         */
        _onItemDragEnd: function(evt) {
          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
          if (itemWidget) {
            itemWidget.onDragEnd(evt);
          }
        },
        /**
         * Handle dragOver event for table items
         * @param {Object} evt - dragover event
         */
        _onItemDragOver: function(evt) {
          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
          if (itemWidget) {
            itemWidget.onDragOver(evt);
          } else {
            if (evt.target.hasClass("gbc_TableAfterLastItemZone")) {
              var columnWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnWidget");
              columnWidget.onDragOverAfterLastItem(evt);
            }
          }
        },
        /**
         * Handle drop event for table items
         * @param {Object} evt - drop event
         */
        _onItemDrop: function(evt) {
          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
          if (itemWidget) {
            itemWidget.onDrop(evt);
          } else {
            if (evt.target.hasClass("gbc_TableAfterLastItemZone")) {
              var columnWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnWidget");
              columnWidget.onDropAfterLastItem(evt);
            }
          }
        },
        /**
         * Handle dragLeave event for table items
         * @param {Object} evt - dragleave event
         */
        _onItemDragLeave: function(evt) {
          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
          if (itemWidget) {
            itemWidget.onDragLeave(evt);
          }
        },
        /**
         * Handle dragEnter event for table items
         * @param {Object} evt - dragenter event
         */
        _onItemDragEnter: function(evt) {
          var itemWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnItemWidget");
          if (itemWidget) {
            itemWidget.onDragEnter(evt);
          }
        },
        // ============== END - ITEMS DnD FUNCTIONS =====================

        // ============== START - Other Event handler FUNCTIONS ===================

        /**
         * Handle double click event
         * @param {Object} evt - dblclick event
         */
        _onDoubleClick: function(evt) {
          var columnWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnWidget");
          if (!columnWidget) {
            return;
          }
          if (this.isRowActionTriggerByDoubleClick()) {
            columnWidget.emit(context.constants.widgetEvents.rowAction);
          }
        },

        /**
         * Handle long touch event
         * @param {*} evt
         */
        _onLongTouch: function(evt) {
          var columnTitleWidget = gbc.WidgetService.getWidgetFromElement(evt.target, "gbc_TableColumnTitleWidget");
          if (columnTitleWidget) {
            columnTitleWidget.manageMouseRightClick(evt);
          } else {
            $super.manageMouseRightClick.call(this, evt);
          }
        },
        // ============== END - Other Event handler FUNCTIONS ===================

        // ============== START - DOM ELEMENT GETTERS ===================
        /**
         * Returns left container DOM Element (contains left frozen columns/headers/footers elements)
         * @returns {HTMLElement} left container DOM Element
         * @publicdoc
         */
        getLeftContainer: function() {
          if (!this._leftContainerElement) {
            this._leftContainerElement = this._element.getElementsByClassName("gbc_TableLeftContainer")[0];
          }
          return this._leftContainerElement;
        },

        /**
         * Returns right container DOM Element (contains right frozen columns/headers/footers elements)
         * @returns {HTMLElement} right container DOM Element
         * @publicdoc
         */
        getRightContainer: function() {
          if (!this._rightContainerElement) {
            this._rightContainerElement = this._element.getElementsByClassName("gbc_TableRightContainer")[0];
          }
          return this._rightContainerElement;
        },

        /**
         * Returns columns container DOM Element
         * @returns {HTMLElement} columns container DOM Element
         * @publicdoc
         */
        getColumnsContainer: function() {
          if (!this._columnsContainerElement) {
            this._columnsContainerElement = this._element.getElementsByClassName("gbc_TableColumnsContainer")[0];
          }
          return this._columnsContainerElement;
        },

        /**
         * Returns left frozen columns container DOM Element
         * @returns {HTMLElement} left frozen columns container DOM Element
         * @publicdoc
         */
        getLeftColumnsContainer: function() {
          if (!this._leftColumnsContainer) {
            this._leftColumnsContainer = this._element.getElementsByClassName("gbc_TableLeftColumnsContainer")[0];
          }
          return this._leftColumnsContainer;
        },

        /**
         * Returns right frozen columns container DOM Element
         * @returns {HTMLElement} right frozen columns container DOM Element
         * @publicdoc
         */
        getRightColumnsContainer: function() {
          if (!this._rightColumnsContainer) {
            this._rightColumnsContainer = this._element.getElementsByClassName("gbc_TableRightColumnsContainer")[0];
          }
          return this._rightColumnsContainer;
        },

        /**
         * Returns columns headers DOM Element
         * @returns {HTMLElement} columns headers DOM Element
         * @publicdoc
         */
        getColumnsHeaders: function() {
          if (!this._columnsHeaders) {
            this._columnsHeaders = this._element.getElementsByClassName("gbc_TableColumnsHeaders")[0];
          }
          return this._columnsHeaders;
        },

        /**
         * Returns left frozen columns headers DOM Element
         * @returns {HTMLElement} left frozen columns headers DOM Element
         * @publicdoc
         */
        getLeftColumnsHeaders: function() {
          if (!this._leftColumnsHeaders) {
            this._leftColumnsHeaders = this._element.getElementsByClassName("gbc_TableLeftColumnsHeaders")[0];
          }
          return this._leftColumnsHeaders;
        },

        /**
         * Returns right frozen columns headers DOM Element
         * @returns {HTMLElement} right frozen columns headers DOM Element
         * @publicdoc
         */
        getRightColumnsHeaders: function() {
          if (!this._rightColumnsHeaders) {
            this._rightColumnsHeaders = this._element.getElementsByClassName("gbc_TableRightColumnsHeaders")[0];
          }
          return this._rightColumnsHeaders;
        },

        /**
         * Returns columns footer DOM Element
         * @returns {HTMLElement} columns footer DOM Element
         * @publicdoc
         */
        getColumnsFooter: function() {
          if (!this._columnsFooter) {
            this._columnsFooter = this.getElement().getElementsByClassName("gbc_TableColumnsFooter")[0];
          }
          return this._columnsFooter;
        },

        /**
         * Returns left columns footer DOM Element
         * @returns {HTMLElement} left columns footer DOM Element
         * @publicdoc
         */
        getLeftColumnsFooter: function() {
          if (!this._leftColumnsFooter) {
            this._leftColumnsFooter = this.getElement().getElementsByClassName("gbc_TableLeftColumnsFooter")[0];
          }
          return this._leftColumnsFooter;
        },

        /**
         * Returns right columns footer DOM Element
         * @returns {HTMLElement} right columns footer DOM Element
         * @publicdoc
         */
        getRightColumnsFooter: function() {
          if (!this._rightColumnsFooter) {
            this._rightColumnsFooter = this.getElement().getElementsByClassName("gbc_TableRightColumnsFooter")[0];
          }
          return this._rightColumnsFooter;
        },

        /**
         * @inheritDoc
         */
        getScrollableArea: function() {
          if (!this._scrollAreaElement) {
            this._scrollAreaElement = this._element.getElementsByClassName("gbc_TableScrollArea")[0];
          }
          return this._scrollAreaElement;
        },

        /**
         * Returns right frozen columns scrollable area DOM Element
         * @returns {HTMLElement} right frozen columns scrollable area DOM Element
         */
        getRightScrollableArea: function() {
          if (!this._rightScrollAreaElement) {
            this._rightScrollAreaElement = this._element.getElementsByClassName("gbc_TableRightScrollArea")[0];
          }
          return this._rightScrollAreaElement;
        },

        /**
         * Returns left frozen columns scrollable area DOM Element
         * @returns {HTMLElement} left frozen columns scrollable area DOM Element
         */
        getLeftScrollableArea: function() {
          if (!this._leftScrollAreaElement) {
            this._leftScrollAreaElement = this._element.getElementsByClassName("gbc_TableLeftScrollArea")[0];
          }
          return this._leftScrollAreaElement;
        },

        /**
         * Returns aggregate global text DOM Element
         * @returns {HTMLElement} aggregate global text DOM Element
         */
        getAggregateGlobalTextElement: function() {
          return this._aggregateGlobalTextElement;
        }

        // ============== END - DOM ELEMENT GETTERS =====================
      };
    });
    cls.WidgetFactory.registerBuilder('Table', cls.TableWidget);
  });
