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

modulum('TableColumnTitleWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Table column title widget.
     * @class TableColumnTitleWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc
     */
    cls.TableColumnTitleWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.TableColumnTitleWidget.prototype */ {
        __name: "TableColumnTitleWidget",

        _resizerDragX: null,
        /**
         * the contextmenu widget
         * @type {classes.ContextMenuWidget}
         */
        _contextMenu: null,
        _autoAlignment: false,

        _sortIconElement: null,
        _sortGlyph: null,

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
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._contextMenu) {
            this._contextMenu.destroyChildren();
            this._contextMenu.destroy();
            this._contextMenu = null;
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseRightClick: function(domEvent) {
          if (domEvent.shiftKey) {
            return false;
          }
          domEvent.preventCancelableDefault();
          this._buildContextMenu(domEvent);

          return false;
        },

        /**
         * Shortcut to open the contextMenu at a given x position
         * @param {Number?} xPos - horizontal position
         */
        showContextMenu: function(xPos) {
          this._buildContextMenu(null, xPos);
        },

        /**
         * Build context menu and show it
         */
        _buildContextMenu: function(domEvent, xPos) {
          if (this._contextMenu) {
            this._contextMenu.destroyChildren();
            this._contextMenu.destroy();
            this._contextMenu = null;
          }
          var table = this.getTableWidget();
          if (table) {
            var opts = this.getBuildParameters();
            opts.inTable = false; // contextmenu is not really in the table, it is outside
            opts.ignoreLayout = true;

            this._contextMenu = cls.WidgetFactory.createWidget("ContextMenu", opts);
            this._contextMenu.allowMultipleChoices(true);
            this._contextMenu.setParentWidget(this);
            this._contextMenu.setColor(table.getColor());
            this._contextMenu.setBackgroundColor(table.getBackgroundColor());

            this._contextMenu.onClose(function() {
              this.afterDomMutator(function() {
                if (this._contextMenu) {
                  this._contextMenu.destroyChildren();
                  this._contextMenu.destroy();
                  this._contextMenu = null;
                }
              }.bind(this));
            }.bind(this), true);

            if (domEvent && domEvent.touches && domEvent.touches[0]) {
              this._contextMenu.x = domEvent.touches[0].clientX;
            } else if (window.event) {
              this._contextMenu.x = window.event.clientX;
            } else {
              this._contextMenu.x = xPos;
            }

            var columns = table.getColumns();
            var tableColumn = this.getParentWidget();

            // Hide/show columns
            var hideShowFunc = function(columnTitle) {
              if (!this.isUnhidable()) {
                this.emit(gbc.constants.widgetEvents.tableShowHideCol, "toggle");
              }

              // refocus UI widget to keep typeahead key processing & drodown manage keys active
              if (columnTitle && columnTitle._contextMenu && columnTitle._contextMenu.isVisible()) {
                var uiWidget = columnTitle.getUserInterfaceWidget();
                if (uiWidget) {
                  uiWidget.getElement().domFocus();
                }
              }
            };

            // Be sure that the last checkbox is always check (cannot hide all columns)
            var checkLast = function(checkWidget, columnTitle) {
              var children = columnTitle.getContextMenu().getChildren();
              var checkCount = children.filter(function(c) {
                if (c._tc) {
                  c.setEnabled(!c._tc.isUnhidable());
                  if (c.isInstanceOf(cls.CheckBoxWidget) && c.getValue()) {
                    return c;
                  }
                }
              });
              if (checkCount.length === 1) {
                checkCount[0].setEnabled(false);
              }
            };

            for (var i = 0; i < columns.length; i++) {
              var tc = columns[i];
              if (!tc.isAlwaysHidden() && !tc.isAlwaysVisible()) {
                var check = cls.WidgetFactory.createWidget("CheckBox", opts);
                check._tc = tc;
                check.setEnabled(!tc.isUnhidable());
                check.setText(tc.getTitleWidget().getText());
                check.setValue(!tc.isHidden());
                checkLast(check, this);
                check.when(context.constants.widgetEvents.click, checkLast.bind(tc, check, this));
                this._contextMenu.addChildWidget(check, {
                  clickCallback: hideShowFunc.bind(tc, this)
                });
              }
            }

            this._contextMenu.addSeparator();

            // Show all columns action
            var showAllColumnsLabel = cls.WidgetFactory.createWidget("Label", opts);
            showAllColumnsLabel.setValue(i18next.t("gwc.contextMenu.showAllColumns"));
            showAllColumnsLabel.addClass("gbc_showAllColumns_action");
            this._contextMenu.addChildWidget(showAllColumnsLabel, {
              clickCallback: function() {
                var columns = this.getTableWidget().getColumns();
                for (var i = 0; i < columns.length; i++) {
                  var tc = columns[i];
                  if (!tc.isAlwaysHidden() && !tc.isUnhidable()) {
                    tc.emit(gbc.constants.widgetEvents.tableShowHideCol, "show");
                  }
                }
              }.bind(this)
            });

            // hide other columns action
            var hideOtherColumnsLabel = cls.WidgetFactory.createWidget("Label", opts);
            hideOtherColumnsLabel.setValue(i18next.t("gwc.contextMenu.hideAllButSelected"));
            hideOtherColumnsLabel.addClass("gbc_hideAllButSelected_action");
            this._contextMenu.addChildWidget(hideOtherColumnsLabel, {
              clickCallback: function() {
                var columns = this.getTableWidget().getColumns();
                for (var i = 0; i < columns.length; i++) {
                  var tc = columns[i];
                  if (!tc.isAlwaysHidden() && !tc.isUnhidable() && tc !== this.getParentWidget()) {
                    tc.emit(gbc.constants.widgetEvents.tableShowHideCol, "hide");
                  }
                }
                // we hide other columns but we must show current column
                this.getParentWidget().emit(gbc.constants.widgetEvents.tableShowHideCol, "show");
              }.bind(this)
            });

            // AutoFit column width based on values
            var autoFitAllColumnsLabel = cls.WidgetFactory.createWidget("Label", opts);
            autoFitAllColumnsLabel.setValue(i18next.t("gwc.contextMenu.autoFitAllColumns"));
            autoFitAllColumnsLabel.addClass("gbc_autoFitAllColumns_action");
            this._contextMenu.addChildWidget(autoFitAllColumnsLabel, {
              clickCallback: function() {
                this.getTableWidget().autoFitAllColumns();
              }.bind(this)
            });

            // Fit column width so all columns visible
            // Example: if table width = 600px and there are two columns currently 100 and 200px
            // then this will set width of columns to 200 and 400 px respectively
            var fitToViewAllColumnsLabel = cls.WidgetFactory.createWidget("Label", opts);
            fitToViewAllColumnsLabel.setValue(i18next.t("gwc.contextMenu.fitToViewAllColumns"));
            fitToViewAllColumnsLabel.addClass("gbc_fitToViewAllColumns_action");
            this._contextMenu.addChildWidget(fitToViewAllColumnsLabel, {
              clickCallback: function() {
                this.getTableWidget().fitToViewAllColumns();
              }.bind(this)
            });

            this._contextMenu.addSeparator();

            // Reset to default action
            var resetDefaultLabel = cls.WidgetFactory.createWidget("Label", opts);
            resetDefaultLabel.setValue(i18next.t("gwc.contextMenu.restoreDefaultSettings"));
            resetDefaultLabel.addClass("gbc_restoreColumnSort_action");
            this._contextMenu.addChildWidget(resetDefaultLabel, {
              clickCallback: function() {
                table.emit(context.constants.widgetEvents.tableResetToDefault);
              }.bind(this)
            });

            // Reset sort order action
            var resetLabel = cls.WidgetFactory.createWidget("Label", opts);
            resetLabel.setValue(i18next.t("gwc.contextMenu.restoreColumnSort"));
            resetLabel.addClass("gbc_restoreColumnSort_action");
            this._contextMenu.addChildWidget(resetLabel, {
              clickCallback: function() {
                tableColumn.emit(context.constants.widgetEvents.tableHeaderClick, "reset");
              }.bind(this)
            });

            //Frozen columns
            if (table.isFrozenTable()) {
              this._contextMenu.addSeparator();

              var leftFrozenLabel = cls.WidgetFactory.createWidget("Label", opts);
              var rightFrozenLabel = cls.WidgetFactory.createWidget("Label", opts);
              var unfreezeLabel = cls.WidgetFactory.createWidget("Label", opts);
              var freezeIndex = 0;
              var columnCount = 0;

              leftFrozenLabel.setValue(i18next.t("gwc.contextMenu.freezeLeft"));
              rightFrozenLabel.setValue(i18next.t("gwc.contextMenu.freezeRight"));
              unfreezeLabel.setValue(i18next.t("gwc.contextMenu.unfreezeAll"));

              leftFrozenLabel.addClass("gbc_freezeLeft_action");
              rightFrozenLabel.addClass("gbc_freezeRight_action");
              unfreezeLabel.addClass("gbc_unfreezeAll_action");

              this._contextMenu.addChildWidget((this.isReversed() ? rightFrozenLabel : leftFrozenLabel), {
                clickCallback: function() {
                  freezeIndex = tableColumn.getOrderedColumnIndex() + 1;
                  table.setLeftFrozenColumns(freezeIndex);
                  table.emit(gbc.constants.widgetEvents.tableLeftFrozen, freezeIndex);
                }.bind(this)
              });
              this._contextMenu.addChildWidget((this.isReversed() ? leftFrozenLabel : rightFrozenLabel), {
                clickCallback: function() {
                  columnCount = columns.length;
                  freezeIndex = tableColumn.getOrderedColumnIndex();
                  table.setRightFrozenColumns(columnCount - freezeIndex);
                  table.emit(gbc.constants.widgetEvents.tableRightFrozen, columnCount - freezeIndex);
                }.bind(this)
              });
              this._contextMenu.addChildWidget(unfreezeLabel, {
                clickCallback: function() {
                  table.setLeftFrozenColumns(0);
                  table.setRightFrozenColumns(0);
                  table.emit(gbc.constants.widgetEvents.tableLeftFrozen, 0);
                  table.emit(gbc.constants.widgetEvents.tableRightFrozen, 0);
                }.bind(this)
              });
            }

            this._element.domFocus(null, table.getElement());
            // beware setFocus should not raise a scroll event (it will immediatly close contextmenu)
            this._contextMenu.show();
          }
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;
          if (this._contextMenu.isVisible()) {
            keyProcessed = this._contextMenu.managePriorityKeyDown(keyString, domKeyEvent, repeat);
          }
          return keyProcessed;
        },

        /**
         * Returns the element used to resize the column
         * @returns {HTMLElement} the resizer element
         * @publicdoc
         */
        getResizer: function() {
          return this._element.getElementsByClassName("resizer")[0];
        },

        /**
         * Returns the element containing the text
         * @returns {HTMLElement} the headerText element
         * @publicdoc
         */
        getHeaderText: function() {
          return this._element.getElementsByClassName("headerText")[0];
        },

        /**
         * Returns the contextmenu widget
         * @returns {classes.ContextMenuWidget} the context menu widget
         */
        getContextMenu: function() {
          return this._contextMenu;
        },

        /**
         * Returns element containing the sort icon
         * @returns {HTMLElement} the sortIcon element
         */
        getSortIconElement: function() {
          return this._sortIconElement;
        },

        /**
         * Returns the parent table widget
         * @returns {classes.TableWidget} the table widget
         */
        getTableWidget: function() {
          return this._parentWidget._parentWidget;
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (domEvent.target.hasClass("headerText")) { // click on header text
            this.getParentWidget().emit(context.constants.widgetEvents.tableHeaderClick);
          }

          return false;
        },

        /**
         * Handle resizer double click event
         */
        onResizerDoubleClick: function() {
          this.getParentWidget().autoSetWidth();
        },

        /**
         * Handle resizer dragStart event on resizer element
         * @param {Object} evt dragstart event
         */
        onResizerDragStart: function(evt) {
          if (window.browserInfo.isFirefox) { // Firefox 1.0+
            try {
              evt.dataTransfer.setData('text/plain', ''); // for Firefox compatibility
            } catch (ex) {
              console.error("evt.dataTransfer.setData('text/plain', ''); not supported");
            }
          }
          if (this.getParentWidget().isSizable()) {
            this.getTableWidget()._dndMode = "columnResizing";
            this.getParentWidget().getElement().addClass("resizing");
            this._resizerDragX = evt.clientX || evt.screenX;
          } else {
            evt.preventCancelableDefault();
          }
        },

        /**
         * Handle resizer drag event on resizer element
         */
        onResizerDrag: function() {
          if (this.getTableWidget()._dndMode === "columnResizing") {
            if (!this._resizerDragX || !this.getTableWidget()._dndMouseDragX) {
              return;
            }
            var size = this.getTableWidget()._dndMouseDragX - this._resizerDragX;
            var initialWidth = this.getParentWidget().getWidth();

            var newWidth = initialWidth + size;
            if (this.isReversed()) {
              newWidth = initialWidth - size;
            }
            if (newWidth > 30) {
              this._resizerDragX = this.getTableWidget()._dndMouseDragX;
              this.getParentWidget().setWidthFromUserInteraction(newWidth);
            }
          }
        },

        /**
         * Handle resizer dragEnd event on resizer element
         * @param {Object} evt dragend event
         */
        onResizerDragEnd: function(evt) {
          var tc = this.getParentWidget();
          tc._element.removeClass("resizing");

          this._resizerDragX = null;
          evt.preventCancelableDefault();

          this.getTableWidget()._dndMode = null;

          // Save stored settings
          var width = tc.getWidth();
          this.getParentWidget().setWidthFromUserInteraction(width);
        },

        /**
         * Handle reordering dragStart event
         * @param {Object} evt dragstart event
         */
        onReorderingDragStart: function(evt) {
          if (window.browserInfo.isFirefox) { // Firefox 1.0+
            try {
              evt.dataTransfer.setData('text/plain', ''); // for Firefox compatibility
            } catch (ex) {
              console.error("evt.dataTransfer.setData('text/plain', ''); not supported");
            }
          }

          if (this.getParentWidget().isMovable()) {
            this.getTableWidget()._dndMode = "columnReordering";
            this.getTableWidget()._dndDraggedColumnWidget = this.getParentWidget();
          } else {
            evt.preventCancelableDefault();
          }
        },

        /**
         * Handle reordering dragEnd event
         * @param {Object} evt dragend event
         */
        onReorderingDragEnd: function(evt) {
          if (this.getTableWidget()._dndReorderingDragOverWidget !== null) {
            this.getTableWidget()._dndReorderingDragOverWidget.getElement()
              .removeClass("reordering_left").removeClass("reordering_right");
            this.getTableWidget()._dndReorderingDragOverWidget = null;
          }
          // When releasing the drag, remove all noDrop classes
          var allNoDrop = this.getTableWidget().getElement().querySelectorAll(".noDrop");
          for (var i = 0; i < allNoDrop.length; i++) {
            allNoDrop[i].removeClass("noDrop");
          }
          this.getTableWidget()._noDrop = {
            "left": false,
            "right": false,
            "center": false
          };
          this.getTableWidget()._dndMode = null;
          this.getTableWidget()._dndDraggedColumnWidget = null;
        },

        /**
         * Handle reordering drop event
         */
        onReorderingDrop: function() {
          if (this.getTableWidget()._dndMode === "columnReordering") {
            if (this.getTableWidget()._dndReorderingDragOverWidget &&
              this.getTableWidget()._dndDraggedColumnWidget !== this.getTableWidget()._dndReorderingDragOverWidget) {

              if (this.getTableWidget()._dndDraggedColumnWidget.getFrozenIndex() === this.getTableWidget()._dndReorderingDragOverWidget
                .getFrozenIndex()) {
                this.reorderColumns(
                  this.getTableWidget()._dndDraggedColumnWidget, this.getTableWidget()._dndReorderingDragOverWidget);
              }
            }
          }
        },

        /**
         * Reorder columns
         * @param {classes.TableColumnWidget} draggedColumn - dragged column
         * @param {classes.TableColumnWidget} dropColumn - drop column
         */
        reorderColumns: function(draggedColumn, dropColumn) {
          var tableWidget = this.getTableWidget();
          tableWidget.resetOrderedColumns();
          var orderedColumns = tableWidget.getOrderedColumns();
          var newOrderedColumns = orderedColumns.slice();

          var dragColIndex = newOrderedColumns.indexOf(draggedColumn);
          var dropColIndex = newOrderedColumns.indexOf(dropColumn);

          newOrderedColumns.removeAt(dragColIndex);
          newOrderedColumns.insert(this.getTableWidget()._dndDraggedColumnWidget, dropColIndex);

          for (var i = 0; i < newOrderedColumns.length; i++) {
            var col = newOrderedColumns[i];
            col.emit(context.constants.widgetEvents.tableOrderColumn, i + 1);
            col.setOrder(i);
          }
        },

        /**
         * Handle reordering dragOver event
         * @param {Object} evt - dragover event
         */
        onReorderingDragOver: function(evt) {

          if (this.getTableWidget()._dndMode === "columnReordering") {

            var lastReorderingDragOverColumnWidget = this.getTableWidget()._dndReorderingDragOverWidget;
            if (lastReorderingDragOverColumnWidget !== this.getParentWidget()) {

              if (lastReorderingDragOverColumnWidget !== null) {
                lastReorderingDragOverColumnWidget.getElement()
                  .removeClass("reordering_left").removeClass("reordering_right");
              }
              this.getTableWidget()._dndReorderingDragOverWidget = this.getParentWidget();
            }

            var overIndex = this.getParentWidget().getOrderedColumnIndex();
            var startIndex = this.getTableWidget()._dndDraggedColumnWidget.getOrderedColumnIndex();

            // Make a visual difference to "show" that it's not permitted to drop frozen columns in other containers
            if (evt.currentTarget && evt.currentTarget.hasClass("gbc_TableLeftColumnsHeaders")) {
              //noDrop on gbc_TableColumnsHeaders or gbc_TableRightColumnsHeaders
              if (!this.getTableWidget()._noDrop.left) {
                this.getTableWidget().getRightColumnsContainer().addClass("noDrop");
                this.getTableWidget().getRightColumnsHeaders().addClass("noDrop");
                this.getTableWidget().getColumnsContainer().addClass("noDrop");
                this.getTableWidget().getColumnsHeaders().addClass("noDrop");
                this.getTableWidget()._noDrop = {
                  "left": false,
                  "right": true,
                  "center": true
                };
              }
            } else if (evt.currentTarget && evt.currentTarget.hasClass("gbc_TableRightColumnsHeaders")) {
              //noDrop on gbc_TableColumnsHeaders or gbc_TableLeftColumnsHeaders
              if (!this.getTableWidget()._noDrop.right) {
                this.getTableWidget().getLeftColumnsContainer().addClass("noDrop");
                this.getTableWidget().getLeftColumnsHeaders().addClass("noDrop");
                this.getTableWidget().getColumnsContainer().addClass("noDrop");
                this.getTableWidget().getColumnsHeaders().addClass("noDrop");
                this.getTableWidget()._noDrop = {
                  "left": true,
                  "right": false,
                  "center": true
                };
              }
            } else if (evt.currentTarget && evt.currentTarget.hasClass("gbc_TableColumnsHeaders")) {
              if (!this.getTableWidget()._noDrop.center) {
                this.getTableWidget().getLeftColumnsContainer().addClass("noDrop");
                this.getTableWidget().getLeftColumnsHeaders().addClass("noDrop");
                this.getTableWidget().getRightColumnsContainer().addClass("noDrop");
                this.getTableWidget().getRightColumnsHeaders().addClass("noDrop");
                this.getTableWidget()._noDrop = {
                  "left": true,
                  "right": true,
                  "center": false
                };
              }
            }
            this.getParentWidget().getElement().addClass(overIndex >= startIndex ? "reordering_right" : "reordering_left");
          }
        },

        /**
         * Handle reordering dragLeave event
         */
        onReorderingDragLeave: function() {
          if (this.getTableWidget()._dndMode === "columnReordering") {
            this.getParentWidget().getElement().removeClass("reordering_left").removeClass("reordering_right");
            this.getTableWidget()._dndReorderingDragOverWidget = null;
          }
        },

        /**
         * Sets column title text
         * @param {string} text - the title text
         * @publicdoc
         */
        setText: function(text) {
          this._setTextContent(text, function() {
            return this._element.getElementsByClassName("headerText")[0];
          }.bind(this));
          var tableWidget = this.getTableWidget();
          if (tableWidget) {
            tableWidget.synchronizeHeadersHeight();
          }
        },

        /**
         * Returns column title text
         * @returns {string} the title text
         * @publicdoc
         */
        getText: function() {
          return this._element.getElementsByClassName("headerText")[0].textContent;
        },

        /**
         * Sets title width
         * @param {number} width - title width (pixels)
         * @publicdoc
         */
        setWidth: function(width) {
          this.setStyle({
            "width": width + "px"
          });
        },

        /**
         * Returns title width style
         * @returns {string} title width (ex:"42px")
         */
        getWidthStyle: function() {
          return this.getStyle("width");
        },

        /**
         * Sets the sort decorator caret.
         * @param {string} sortType - "asc", "desc" or ""
         */
        setSortDecorator: function(sortType) {

          var glyphClass = "hidden";
          if (sortType === "asc") {
            glyphClass = "caret-up";
          }
          if (sortType === "desc") {
            glyphClass = "caret-down";
          }

          if (!this._sortIconElement && glyphClass !== "hidden") {
            this._sortIconElement = document.createElement("span");
            this._sortIconElement.addClass("sortIcon");
            this._element.prependChild(this._sortIconElement);
          }

          if (this._sortIconElement) {
            this._sortIconElement.removeClass(this._sortGlyph);
            this._sortIconElement.addClass(glyphClass);
          }

          this._sortGlyph = glyphClass;
        },

        /**
         * Sets index order of title
         * @param {number} index - order index
         */
        setOrder: function(index) {
          this.setStyle({
            "order": index
          });
        },

        /**
         * @inheritDoc
         */
        hasFocus: function() {
          // TODO explain why ?
          return true;
        },

        /**
         * Set text alignment
         * @param {string} alignment - (left, center, right, auto)
         */
        setTextAlign: function(alignment) {
          if (alignment === "auto") {
            this._autoAlignment = true;
          } else {
            this.setStyle(" .headerText", {
              "text-align": alignment
            });
          }
        },

        /**
         * @return {boolean} true if text should be auto aligned
         */
        isAutoTextAlignement: function() {
          return this._autoAlignment;
        },

        /**
         * @inheritDoc
         */
        isReversed: function() {
          return this._parentWidget._parentWidget.isReversed();
        },

        /**
         * @inheritDoc
         */
        shouldShowApplicationContextMenu: function() {
          return false;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TableColumnTitle', cls.TableColumnTitleWidget);
  });
