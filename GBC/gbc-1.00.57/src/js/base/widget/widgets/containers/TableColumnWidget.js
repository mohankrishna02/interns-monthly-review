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

modulum('TableColumnWidget', ['WidgetGroupBase'],
  function(context, cls) {

    /**
     * Table column widget.
     * @class TableColumnWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc
     */
    cls.TableColumnWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TableColumnWidget.prototype */ {
        __name: "TableColumnWidget",
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",

        /**
         * the title widget
         * @type {classes.TableColumnTitleWidget}
         */
        _title: null,
        /**
         * the aggregate widget
         * @type {classes.TableColumnAggregateWidget}
         */
        _aggregate: null,
        /**
         * is parent widget a tree view
         * @type {boolean}
         */
        _isTreeView: false,
        /**
         * is column always visible
         * @type {boolean}
         */
        _isUnhidable: false,
        /**
         * is column draggable/movable
         * @type {boolean}
         */
        _isMovable: true,
        /**
         * is column resizable
         * @type {boolean}
         */
        _isSizable: true,
        /**
         * is column always hidden
         * @type {boolean}
         */
        _alwaysHidden: false,
        /**
         * column order
         * @type {number}
         */
        _order: -1,
        /**
         * is current focused column
         * @type {boolean}
         */
        _current: false,
        /**
         * is drag & drop enabled
         * @type {boolean}
         */
        _dndItemEnabled: false,
        /**
         * is column detached from dom
         * @type {boolean}
         */
        _itemsDetachedFromDom: false,
        /**
         * column width (store settings or measured)
         * @type {number}
         */
        _width: null,
        /**
         * column width from store settings
         * @type {number}
         */
        _defaultWidth: null,
        /**
         * column measured width
         * @type {number}
         */
        _initialWidth: null,
        /**
         * is column left frozen
         * @type {boolean}
         */
        _isLeftFrozen: false,
        /**
         * is column right frozen
         * @type {boolean}
         */
        _isRightFrozen: false,
        /**
         * is column first child item measured (flag used for layout engine)
         * @type {boolean}
         */
        _firstWidgetMeasured: false,

        /**
         * @constructs
         * @param {*} opts - Options passed to the constructor
         */
        constructor: function(opts) {
          opts = opts || {};
          opts.inTable = true;
          this._isTreeView = opts.isTreeView;
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.TableColumnLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._title = cls.WidgetFactory.createWidget("TableColumnTitle", this.getBuildParameters());
          this._title.setParentWidget(this);
        },

        /**
         * @inheritDoc
         */
        resetLayout: function() {
          this._firstWidgetMeasured = false;
          this._width = null;
          this.attachItemsToDom();
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._title.destroy();
          this._title = null;
          if (this._aggregate) {
            this._aggregate.destroy();
            this._aggregate = null;
          }
          this.destroyChildren();
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          if (domEvent.target.hasClass("gbc_TableAfterLastItemZone")) { // click on afterLastItemZone
            this.emit(context.constants.widgetEvents.tableColumnAfterLastItemClick);
            return false;
          }
          if (!this.getParentWidget().isRowActionTriggerByDoubleClick()) {
            this.emit(context.constants.widgetEvents.rowAction);
            return false;
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          options = options || {};

          var opts = this.getBuildParameters();
          opts.isTreeItem = this._isTreeView;

          var tableColumnItem = null;
          if (widget.getParentWidget() !== null) {
            // if widget has already a parent it means that it as already been attached
            tableColumnItem = widget.getParentWidget();
          } else {
            tableColumnItem = cls.WidgetFactory.createWidget("TableColumnItem", opts);
            tableColumnItem.setDndEnabled(this._dndItemEnabled);
            tableColumnItem.addChildWidget(widget);
            $super.addChildWidget.call(this, tableColumnItem, options);
          }

          if (this.getParentWidget()) {
            // if first widget has not been measured need to relayout to measure it
            if (!this._firstWidgetMeasured) {
              this.resetMeasure();
              if (this.getParentWidget().resetMeasure) {
                this.getParentWidget().resetMeasure();
              }

            }
            // Set the current row
            tableColumnItem.setCurrent(tableColumnItem.getItemIndex() === this.getParentWidget().getCurrentRow());
          }
        },

        /**
         * Invalidate measure to force width & row height measure in next layout cycle
         */
        resetMeasure: function() {
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          var item = widget.getParentWidget() !== this ? widget.getParentWidget() : widget;
          $super.removeChildWidget.call(this, item);
        },

        /**
         *  Remove all items (container element) from DOM
         */
        detachItemsFromDom: function() {
          if (this._itemsDetachedFromDom === false) {
            this._itemsDetachedFromDom = true;
            this.getContainerElement().remove();
          }
        },

        /**
         * Attach all items (container element) to DOM
         */
        attachItemsToDom: function() {
          if (this._itemsDetachedFromDom === true) {
            this._itemsDetachedFromDom = false;
            this.getContainerElement().insertAt(0, this.getElement());
          }
        },

        /**
         * Returns true if column is a tree
         * @returns {boolean} true if is a tree
         * @publicdoc
         */
        isTreeView: function() {
          return this._isTreeView;
        },

        /**
         * Indicates if table has frozen columns
         * @returns {boolean} returns true if table has frozen columns
         * @publicdoc
         */
        isFrozen: function() {
          return this._isLeftFrozen === true || this._isRightFrozen === true;
        },

        /**
         * Indicates if table column is left frozen
         * @returns {boolean} returns true if column is left frozen
         * @publicdoc
         */
        isLeftFrozen: function() {
          return this._isLeftFrozen === true;
        },

        /**
         * Indicates if table column is right frozen
         * @returns {boolean} returns true if column is right frozen
         * @publicdoc
         */
        isRightFrozen: function() {
          return this._isRightFrozen === true;
        },

        /**
         * @returns {number} returns 0 if unfrozen, 1 if left frozen and 2 if right frozen
         */
        getFrozenIndex: function() {
          return this.isFrozen() ? (this.isLeftFrozen() ? 1 : 2) : 0;
        },

        /**
         * Sets if the column must be always hidden
         * @param {boolean} b - is always hidden ?
         * @publicdoc
         */
        setAlwaysHidden: function(b) {
          this._alwaysHidden = b;
        },

        /**
         * Returns true if column must be always hidden
         * @returns {boolean} true if column is always hidden
         * @publicdoc
         */
        isAlwaysHidden: function() {
          return this._alwaysHidden;
        },

        /**
         * Returns true if column must be always visible
         * @returns {boolean} true if column is always visible
         * @publicdoc
         */
        isAlwaysVisible: function() {
          return false;
        },

        /**
         * Sets if the column can be moved by the user
         * @param {boolean} b - is movable ?
         * @publicdoc
         */
        setMovable: function(b) {
          this._isMovable = b;
        },

        /**
         * Returns true if column is movable
         * @returns {boolean} true if column is movable
         * @publicdoc
         */
        isMovable: function() {
          return this._isMovable;
        },

        /**
         * Sets if the column can be sized by the user
         * @param {boolean} b - is sizable ?
         * @publicdoc
         */
        setSizable: function(b) {
          if (this._isSizable !== b) {
            this._isSizable = b;
            if (b) {
              this.getTitleWidget().getResizer().removeClass("unresizable");
            } else {
              this.getTitleWidget().getResizer().addClass("unresizable");
            }
          }
        },

        /**
         * Returns true if column is sizable
         * @returns {boolean} true il column is sizable
         * @publicdoc
         */
        isSizable: function() {
          return this._isSizable;
        },

        /**
         * Sets if the column can be hidden by the user
         * @param {boolean} b - is not hiddable ?
         */
        setUnhidable: function(b) {
          this._isUnhidable = b;
        },

        /**
         * Returns true if column is unhidable
         * @returns {boolean} true if column is unhidable
         */
        isUnhidable: function() {
          return this._isUnhidable;
        },

        /**
         * Update aggregate width
         */
        updateAggregateWidth: function() {
          // search column which contain an aggregate
          var tableWidget = this.getParentWidget();
          if (tableWidget && tableWidget.hasFooter()) {
            var columns = tableWidget.getOrderedColumns();
            for (var i = this.getOrderedColumnIndex(); i < columns.length; i++) {
              var col = columns[i];
              if (col.getAggregateWidget() && !col.isHidden()) {
                this.afterDomMutator(function(col) {
                  col.setAggregate(col.getAggregateWidget().getText());
                }.bind(this, col));
                break;
              }
            }
          } else if (this.getAggregateWidget()) {
            this.afterDomMutator(function() {
              this.setAggregate(this.getAggregateWidget().getText());
            }.bind(this));
          }
        },

        /**
         * Set/add an aggregate cell
         * @param text - aggregate text & value
         * @param width -
         */
        setAggregate: function(text, width) {
          var tableWidget = this.getParentWidget();

          if (text !== "") {
            if (!this._aggregate) {
              this._aggregate = cls.WidgetFactory.createWidget("TableColumnAggregate", this.getBuildParameters());
              this._aggregate.setParentWidget(this);
              var footer = null;
              if (this._isLeftFrozen) {
                footer = tableWidget.getLeftColumnsFooter();
              } else if (this._isRightFrozen) {
                footer = tableWidget.getRightColumnsFooter();
              } else {
                footer = tableWidget.getColumnsFooter();
              }
              if (footer) {
                footer.appendChild(this._aggregate.getElement());
                tableWidget.setHasFooter(true);
              }
            }

            if (this._textAlign) {
              this._aggregate.setTextAlign(this._textAlign);
            }

            this._aggregate.setText(text);
            this._aggregate.setHidden(this.isHidden());

            var aggregateWidth = this.getWidth();

            if (!width) {
              var columns = tableWidget.getOrderedColumns();
              for (var i = this.getOrderedColumnIndex() - 1; i >= 0; i--) {
                var col = columns[i];
                if (col._aggregate === null && col.getFrozenIndex() === this.getFrozenIndex()) {
                  if (!col.isHidden()) {
                    aggregateWidth += col.getWidth();
                  }
                } else {
                  if (!col.isHidden()) {
                    break;
                  }
                }
              }
            } else {
              aggregateWidth = width;
            }
            this._aggregate.computeWidth(aggregateWidth);

          } else {
            if (this._aggregate) {
              this._aggregate.setText(text);
            }
          }
        },

        /**
         * Returns index of the column in the parent table (vm aui index)
         * @returns {number} index of the column in the table
         * @publicdoc
         */
        getColumnIndex: function() {
          var parent = this.getParentWidget();
          if (parent) {
            return parent.getColumns().indexOf(this);
          }
          return -1;
        },

        /**
         * Returns index of the column in the parent table (visual index)
         * @returns {number} index of the column in the table
         * @publicdoc
         */
        getOrderedColumnIndex: function() {
          var parent = this.getParentWidget();
          if (parent) {
            return parent.getOrderedColumns().indexOf(this);
          }
          return -1;
        },

        /**
         * Returns column item at the specied index (row)
         * @param {number} index - index of the item (row)
         * @returns {classes.TableColumnItemWidget} item widget
         * @publicdoc
         */
        getColumnItem: function(index) {
          return this._children[index];
        },

        /**
         * Returns title widget of the column
         * @returns {classes.TableColumnTitleWidget} the title widget
         * @publicdoc
         */
        getTitleWidget: function() {
          return this._title;
        },

        /**
         * Returns aggregate widget of the column
         * @returns {classes.TableColumnAggregateWidget} the aggregate widget
         */
        getAggregateWidget: function() {
          return this._aggregate;
        },

        /**
         * Sets column text (title)
         * @param {string} text - the text to display
         * @publicdoc
         */
        setText: function(text) {
          this.getTitleWidget().setText(text);
        },

        /**
         * Returns column text (title)
         * @returns {string} the column text
         * @publicdoc
         */
        getText: function() {
          return this.getTitleWidget().getText();
        },

        /**
         * Set text alignment
         * @param {string} align - (left, center, right)
         */
        setTextAlign: function(align) {

          if (this._textAlign !== align) {
            this._textAlign = align;

            var titleWidget = this.getTitleWidget();

            if (titleWidget.isAutoTextAlignement()) {
              titleWidget.setTextAlign(align);
            }

            if (this._aggregate) {
              this._aggregate.setTextAlign(align);
            }
          }
        },

        /**
         * Sets the width of column
         * @param {number} width - column width (pixels)
         * @publicdoc
         */
        setWidth: function(width) {
          width = Math.round(width);
          if (this._width !== width) {
            this._width = width;
            this.setStyle({
              "width": width + "px !important"
            });
            this.getTitleWidget().setWidth(width);
            this.updateAggregateWidth();
          }
        },

        /**
         * Set width ( from a user interaction)
         * @param {number} width - column width (pixels)
         */
        setWidthFromUserInteraction: function(width) {
          this.setWidth(width);
          this.emit(gbc.constants.widgetEvents.tableResizeCol, width);
          this.getParentWidget().autoSetLastColumnWidthToFillEmptySpace();
          this.getParentWidget()._updateVisibleColumnsInDom();
        },

        /**
         * Returns column width (pixels)
         * @returns {?number} column width
         * @publicdoc
         */
        getWidth: function() {
          return this._width;
        },

        /**
         * Set measured column width as initial
         * @param {?number} width - column width (pixels)
         * @publicdoc
         */
        setInitialWidth: function(width) {
          this._initialWidth = width;
        },

        /**
         * Returns measured column width
         * @returns {?number} initial column width
         * @publicdoc
         */
        getInitialWidth: function() {
          return this._initialWidth;
        },

        /**
         * Set the default column width from store settings
         * @param {?number} width - column width (pixels)
         * @publicdoc
         */
        setDefaultWidth: function(width) {
          this._defaultWidth = width;
        },

        /**
         * Return the column default width defined in store settings
         * @returns {?number} default column width
         * @publicdoc
         */
        getDefaultWidth: function() {
          return this._defaultWidth;
        },

        /**
         * Reset width column (set with to initial width)
         * @publicdoc
         */
        resetWidth: function() {
          this.setWidth(this._initialWidth);
        },

        /**
         * Returns column width style
         * @returns {string} column width (ex:"42px")
         */
        getWidthStyle: function() {
          return this.getStyle("width");
        },

        /**
         * Sets index order of column
         * @param {number} index - order index
         */
        setOrder: function(index) {
          this.setStyle({
            "order": index
          });
          this._order = index;

          this.getTitleWidget().setOrder(index);
          if (this._aggregate) {
            this._aggregate.setOrder(index);
          }

          var tableWidget = this.getParentWidget();
          if (tableWidget) {
            tableWidget.resetOrderedColumns();
            tableWidget.updateAllAggregate();
          }
        },

        /**
         * Returns index order of column
         * @returns {number} order index
         * @publicdoc
         */
        getOrder: function() {
          return this._order;
        },

        /**
         * Changes current row
         * @param {number} row - current row
         */
        setCurrentRow: function(row) {
          var children = this.getChildren();
          var length = children.length;
          for (var i = 0; i < length; ++i) {
            var tableColumnItem = children[i];
            tableColumnItem.setCurrent(i === row);

            var tableWidget = this.getParentWidget();
            if (tableWidget) {
              this.getElement().toggleClass("highlight", tableWidget.isHighlightCurrentRow());
              this.getElement().toggleClass("nohighlight", !tableWidget.isHighlightCurrentRow());
            }
          }
        },

        /**
         * Defines if column is the current or not
         * @param {boolean} current - true if the column is the current one, false otherwise
         */
        setCurrent: function(current) {
          if (this._current !== current) {
            this._current = Boolean(current);
            this.getElement().toggleClass("currentColumn", Boolean(current));
          }

          if (this._current) {
            var tableWidget = this.getParentWidget();
            if (tableWidget) {
              this.getElement().toggleClass("highlight", tableWidget.isHighlightCurrentCell());
              this.getElement().toggleClass("nohighlight", !tableWidget.isHighlightCurrentCell());
            }
            this.attachItemsToDom(); // current should be always attached to DOM
          }

        },

        /**
         * Check if column is current one
         * @returns {boolean}  true if the column is the current one, false otherwise
         * @publicdoc
         */
        isCurrent: function() {
          return this._current;
        },

        /**
         * Updates rows visibility depending on the number of visible rows defined in the parent TableWidget
         */
        updateRowsVisibility: function() {
          var visibleRows = this.getParentWidget().getVisibleRows();
          var children = this.getChildren();
          for (var i = 0; i < children.length; ++i) {
            var tableColumnItemWidget = children[i];
            tableColumnItemWidget.setHidden(i >= visibleRows);
          }
        },

        /**
         * Sets if the a row is selected (mrs)
         * @param {number} row - index of the row
         * @param {boolean} selected - true if the row should be selected, false otherwise
         */
        setRowSelected: function(row, selected) {
          var children = this.getChildren();
          if (row < children.length) {
            children[row].setSelected(selected);
          }
        },

        /**
         * Check if a row is selected
         * @param {number} row - index of the row
         * @returns {boolean} true if the row is selected, false otherwise
         */
        isRowSelected: function(row) {
          var children = this.getChildren();
          if (row < children.length) {
            return children[row].isSelected();
          }
          return false;
        },

        /**
         * @inheritDoc
         */
        setHidden: function(state) {
          if (this.isHidden() !== state) { // optimization : do not recalculate when no state change
            $super.setHidden.call(this, state);
            //hide title as well
            this.getTitleWidget().setHidden(state);
            //hide aggregate as well too
            if (this._aggregate) {
              this._aggregate.setHidden(state);
            }
            var tableWidget = this.getParentWidget();
            if (tableWidget) {
              tableWidget.updateAllAggregate();
              tableWidget.synchronizeHeadersHeight();
            }
          }
        },

        /**
         * Returns afterLastItemZone element
         * @returns {HTMLElement} afterLastItemZone element
         */
        getAfterLastItemZone: function() {
          return this._element.getElementsByClassName("gbc_TableAfterLastItemZone")[0];
        },

        /**
         * Returns widget at the specified row
         * @param {number} row - row of item
         * @returns {classes.WidgetBase} widget
         * @publicdoc
         */
        getWidgetAt: function(row) {
          return this.getChildren()[row] &&
            this.getChildren()[row].getChildren() &&
            this.getChildren()[row].getChildren()[0];
        },

        /**
         * Auto set width according to max length of column values
         */
        autoSetWidth: function() {
          if (this.isSizable() && !this.isHidden()) {
            var children = this.getChildren();
            var width = null;
            var widget = null;
            var tableColumnItemWidget = null;
            var i = 0;

            // measure title width
            var titleWidget = this.getTitleWidget();
            titleWidget.getElement().addClass("g_TableMeasuring");
            var maxWidth = titleWidget.getElement().getBoundingClientRect().width;
            titleWidget.getElement().removeClass("g_TableMeasuring");

            // measure widgets width
            if (children.length > 0) {
              var firstWidget = children[0].getChildren()[0];
              var measureDataElement = firstWidget.getLayoutEngine().getDataContentMeasureElement();
              var hasInputElement = firstWidget.getElement().getElementsByTagName("input").length > 0;
              // if widgets are inputs, use the first charMeasurer to measure to search the larger
              if (hasInputElement && measureDataElement) {
                this.getElement().addClass("g_measuring");
                firstWidget.getElement().addClass("g_TableMeasuring");
                var initialContent = measureDataElement.textContent;

                for (i = 0; i < children.length; ++i) {
                  tableColumnItemWidget = children[i];
                  widget = tableColumnItemWidget.getChildren()[0];
                  measureDataElement.textContent = widget.getValue();
                  width = firstWidget.getElement().getBoundingClientRect().width;
                  if (width > maxWidth) {
                    maxWidth = width;
                  }
                }
                measureDataElement.textContent = initialContent;
                firstWidget.getElement().removeClass("g_TableMeasuring");
                this.getElement().removeClass("g_measuring");
              }
              // if widgets are not inputs, measure each widget and keep the larger size
              else {
                for (i = 0; i < children.length; ++i) {
                  tableColumnItemWidget = children[i];
                  widget = tableColumnItemWidget.getChildren()[0];

                  widget.getElement().addClass("g_TableMeasuring");
                  width = widget.getElement().getBoundingClientRect().width;
                  widget.getElement().removeClass("g_TableMeasuring");

                  if (width > maxWidth) {
                    maxWidth = width;
                  }
                }
              }
            }
            this.setWidthFromUserInteraction(maxWidth);
          }
        },

        /**
         * Enable Dnd of items
         * @param {boolean} b
         */
        setDndItemEnabled: function(b) {
          if (this._dndItemEnabled !== b) {

            this._dndItemEnabled = b;
            var items = this.getChildren();
            for (var j = 0; j < items.length; j++) {
              var item = items[j];
              item.setDndEnabled(b);
            }
          }
        },

        /**
         * Handle drop event
         */
        onDropAfterLastItem: function() {
          this.emit(gbc.constants.widgetEvents.tableDrop, this.getParentWidget().getVisibleRows());
        },

        /**
         * Handle dragOver event
         * @param {Object} evt - dragover event
         */
        onDragOverAfterLastItem: function(evt) {
          this.emit(gbc.constants.widgetEvents.tableDragOver, this.getParentWidget().getVisibleRows(), evt);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TableColumn', cls.TableColumnWidget);
  });
