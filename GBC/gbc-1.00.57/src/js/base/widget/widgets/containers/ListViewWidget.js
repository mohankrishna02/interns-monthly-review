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

modulum('ListViewWidget', ['TableWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Listview widget.
     * @class ListViewWidget
     * @memberOf classes
     * @extends classes.TableWidgetBase
     * @publicdoc
     */
    cls.ListViewWidget = context.oo.Class(cls.TableWidgetBase, function($super) {
      return /** @lends classes.ListViewWidget.prototype */ {
        __name: "ListViewWidget",

        /** @type boolean */
        _needToUpdateVerticalScroll: false,

        $static: {
          defaultRowHeight: 24,
          defaultOneLineHeightRatio: 1.7,
          defaultTwoLinesHeightRatio: 2.6
        },

        /** styles */
        _highlightCurrentRowCssSelector: ":not(.disabled).highlight .gbc_ListViewRowWidget.currentRow",

        /** @type boolean */
        _userScrollAction: true,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this.setRowHeight(cls.ListViewWidget.defaultRowHeight);
          this.getScrollableArea().on('scroll.ListViewWidget', this._onScroll.bind(this));
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ListViewLayoutEngine(this);

          this._layoutEngine.onLayoutApplied(this._layoutApplied.bind(this));
          this._layoutInformation.getStretched().setDefaultX(true);
          this._layoutInformation.getStretched().setDefaultY(true);

          var minPageSize = parseInt(context.ThemeService.getValue("gbc-ListViewWidget-min-page-size"), 10);
          this._layoutEngine.setMinPageSize(isNaN(minPageSize) ? 1 : minPageSize);
          var minWidth = parseInt(context.ThemeService.getValue("gbc-ListViewWidget-min-width"), 10);
          this._layoutEngine.setMinWidth(isNaN(minWidth) ? 60 : minWidth);
        },

        /**
         * Call when layout is finished
         */
        _layoutApplied: function() {
          if (this.isElementInDOM()) {
            // if table is visible and was already active
            this.updateVerticalScroll(this._needToUpdateVerticalScroll);
            this._needToUpdateVerticalScroll = false;
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this.destroyChildren();
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          this.domFocus(fromMouse);
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * Called when a scroll is done
         * @param {Object} event - scroll event
         */
        _onScroll: function(event) {
          if (this._userScrollAction) {
            this.afterDomMutator(function() {
              if (event.target) {
                // Emit scroll event for vertical scrolling
                this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());
              }
            }.bind(this));
          } else {
            this._userScrollAction = true;
          }
        },

        /**
         * Returns row widgets
         * @returns {classes.ListViewRowWidget[]} array of row widgets
         * @publicdoc
         */
        getRows: function() {
          return this.getChildren();
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {

          $super.addChildWidget.call(this, widget, options);

          if (widget.isInstanceOf(cls.ListViewRowWidget)) {
            widget.setHidden(this._children.length >= this._visibleRows);
            if (this.hasRowBound()) {
              widget.addRowBoundDecorator();
            }
          }
        },

        /**
         * @inheritDoc
         */
        setVisibleRows: function(visibleRows) {
          if (this._visibleRows !== visibleRows) {
            this._needToUpdateVerticalScroll = true;
            this._visibleRows = visibleRows;
            var rows = this.getChildren();
            for (var i = 0; i < rows.length; ++i) {
              var row = rows[i];
              row.setHidden(i >= visibleRows);
            }
          }
        },

        /**
         * @inheritDoc
         */
        setRowHeight: function(height) {
          if (this._rowHeight !== height) {
            this._rowHeight = height;
            this.setStyle(" .gbc_ListViewRowWidget", {
              "height": height + "px"
            });

            this.setStyle(" .gbc_ImageWidget", {
              "height": height + "px"
            });

            this.updateVerticalScroll(true); // refresh vertical scroll if row height has changed
          }
        },

        /**
         * @inheritDoc
         */
        updateContentPosition: function(size, pageSize, offset, forceScroll) {

          if (size !== null) {
            this.setSize(size);
            this._pageSize = pageSize;

            var top = 0;
            var height = 0;

            if (this.isEnabled()) {
              top = offset * this.getRowHeight();
              height = (size - offset) * this.getRowHeight();
            } else {
              height = this._visibleRows * this.getRowHeight();
            }

            this.setStyle({
              preSelector: ".g_measured ",
              selector: ".gbc_ListViewRowsContainer"
            }, {
              "margin-top": top + "px",
              "height": height + "px"
            });

            // if offset is different or if scrolltop value of current scrollarea is different too different from calculated value
            // need to rest scrolltop of scrollablearea
            if (forceScroll || (this.lastSentOffset === null || this.lastSentOffset === offset) && offset !== this._offset) {
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
         */
        doScroll: function(value, delta) {
          var isTableVisible = this.isVisibleRecursively();

          if (isTableVisible) {
            var top = value;

            if (delta) {
              top = (this.getScrollableArea().scrollTop + value);
            }

            if (this.getScrollableArea().scrollTop !== top) {
              this._userScrollAction = false;
              this.getScrollableArea().scrollTop = top;
            }
          } else {
            this._needToUpdateVerticalScroll = true;
          }
        },

        /**
         * @inheritDoc
         */
        setCurrentRow: function(row, ensureRowVisible) {
          this._currentRow = row;
          var children = this.getChildren();
          var length = children.length;
          for (var i = 0; i < length; ++i) {
            var rowWidget = children[i];
            rowWidget.setCurrent(i === row);
          }
          this._needToUpdateVerticalScroll = true;
        },

        // ============== START - STYLE FUNCTIONS ===================
        /**
         * @inheritDoc
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
              selector: this._highlightCurrentRowCssSelector + " *",
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

            color = (color === null ? null : color + " !important");
            this.setStyle({
              selector: this._highlightCurrentRowCssSelector + " *",
              appliesOnRoot: true
            }, {
              "color": color,
              "fill": color
            });
          }
        },

        /**
         * @inheritDoc
         */
        setHighlightCurrentRow: function(b) {
          this._highlightCurrentRow = b;
          this.getElement().toggleClass("highlight", b);
          this.getElement().toggleClass("nohighlight", !b);
        },

        /**
         * Update highlight row
         */
        updateHighlight: function() {
          this.setCurrentRow(this._currentRow);
        },

        // ============== END - STYLE FUNCTIONS ===================

        // ============== START - DOM ELEMENT GETTERS ===================
        /**
         * @inheritDoc
         */
        getScrollableArea: function() {
          if (!this._scrollAreaElement) {
            this._scrollAreaElement = this._element.getElementsByClassName("gbc_ListViewScrollArea")[0];
          }
          return this._scrollAreaElement;
        }
        // ============== END - DOM ELEMENT GETTERS =====================
      };
    });
    cls.WidgetFactory.registerBuilder("Table[tableType=listView]", cls.ListViewWidget);
  });
