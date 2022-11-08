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

modulum('TableColumnItemWidget', ['WidgetGroupBase'],
  function(context, cls) {

    /**
     * Table column widget.
     * @class TableColumnItemWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc
     */
    cls.TableColumnItemWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TableColumnItemWidget.prototype */ {
        __name: "TableColumnItemWidget",

        _treeAnchor: null,
        /**
         * @type {classes.ImageWidget}
         */
        _imageWidget: null,
        /**
         * @type {Function}
         */
        _imageClickHandler: null,
        /**
         * @type {HTMLElement}
         */
        _imageSpanElement: null,
        _dndEnabled: false,
        _currentImagePath: null,

        _current: false,
        _clientSelected: false,

        /**
         * @constructs
         * @param {*} opts - Options passed to the constructor
         */
        constructor: function(opts) {
          opts = (opts || {});
          var isTreeItem = opts.isTreeItem;
          opts.inTable = true;
          $super.constructor.call(this, opts);

          if (isTreeItem) {
            this._treeAnchor = document.createElement("span");
            this._treeAnchor.addClass("gbc_TreeAnchor");
            this._element.prependChild(this._treeAnchor);
            this._element.onDoubleTap("TreeAnchor", this.manageMouseClick.bind(this)); // TODO this is for why ?
            this.setLeaf(true);
          }
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
          if (this._treeAnchor) {
            this._element.offDoubleTap("TreeAnchor");
          }
          if (this._imageClickHandler) {
            this._imageClickHandler();
            this._imageClickHandler = null;
          }
          if (this._imageWidget) {
            this._imageWidget.destroy();
            this._imageWidget = null;
          }
          $super.destroy.call(this);
        },

        /**
         * Request focus for this row (keep current column)
         * @param {*} domEvent - dom event object
         */
        requestFocus: function(domEvent) {
          var tableWidget = this.getTableWidgetBase();
          if (tableWidget) {
            var widget = tableWidget.getWidgetAt(tableWidget.getCurrentColumn(), this.getItemIndex());
            tableWidget.requestFocusFromWidget(widget, domEvent);
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (domEvent.target === this._treeAnchor) { // click on tree anchor
            var index = this.getItemIndex();
            this.getParentWidget().emit(context.constants.widgetEvents.toggleClick, index);
            return false;
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        manageMouseDblClick: function(domEvent) {
          if (domEvent.target === this._treeAnchor) { // double click on tree anchor
            return false;
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          if (this._children.length !== 0) {
            throw "A item only contain a single child";
          }
          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          if (this._backgroundColor !== color) {
            this._backgroundColor = color;
            this.setStyle({
              "background-color": color && !this._ignoreBackgroundColor ? color : null
            });
          }
        },

        /**
         * Enable drag and drop
         * @param {boolean} b - true to enable
         */
        setDndEnabled: function(b) {
          if (this._dndEnabled !== b) {
            this._dndEnabled = b;
            if (b) {
              this._element.setAttribute("draggable", "true");
            } else {
              this._element.removeAttribute("draggable");
            }
          }
        },

        /**
         * Check if item is tree item
         * @returns {boolean} true if the element is a tree item, false otherwise
         * @publicdoc
         */
        isTreeItem: function() {
          return Boolean(this._treeAnchor);
        },

        /**
         * Sets if item is a leaf of tree
         * @param {boolean} leaf - true if the item is a leaf item, false otherwise
         */
        setLeaf: function(leaf) {
          if (this.isTreeItem()) {
            this.setAriaExpanded(null);
            if (leaf) {
              this._treeAnchor.removeClass("treeExpanded");
              this._treeAnchor.removeClass("treeCollapsed");
            }
            this._treeAnchor.toggleClass("treeLeaf", leaf);

          }
        },

        /**
         * Checks if item is tree leaf item
         * @returns {boolean} leaf true if the item is a leaf item, false otherwise
         * @publicdoc
         */
        isLeaf: function() {
          return this.isTreeItem() && this._treeAnchor.hasClass("treeLeaf");
        },

        /**
         * Expands or collapse tree item
         * @param {boolean} expanded - true if the item should be expanded, false otherwise
         */
        setExpanded: function(expanded) {
          if (this.isTreeItem() && !this.isLeaf()) {
            this.setAriaExpanded(expanded);
            this._treeAnchor.toggleClass("treeExpanded", "treeCollapsed", expanded);

            var qaElement = this.getContainerElement().querySelector("[data-gqa-name]");
            if (qaElement) {
              qaElement.setAttribute('data-gqa-expanded', expanded.toString());
            }
          }
        },

        setAriaExpanded: function(expanded) {
          this.setAriaAttribute("expanded", expanded);
          if (this._children[0]) {
            this._children[0].setAriaAttribute("expanded", expanded);
          }
        },

        /**
         * Checks if tree item is expanded
         * @returns {boolean} true if the item is expanded, false otherwise
         * @publicdoc
         */
        isExpanded: function() {
          return this.isTreeItem();
        },

        /**
         * @inheritDoc
         */
        isReversed: function() {
          // executed on table column
          return this._parentWidget.isReversed();
        },

        /**
         * Updates visibility depending on the number of visible rows defined in the parent TableWidget
         */
        updateVisibility: function() {
          var visibleRows = this.getParentWidget().getParentWidget().getVisibleRows();
          this.setHidden(this.getItemIndex() >= visibleRows);
        },

        /**
         * Sets tree item depth
         * @param {number} depth - item depth
         */
        setDepth: function(depth) {
          var depthObj = {};
          depthObj["padding-" + this.getStart()] = depth + 'em';
          this.setStyle(depthObj);
        },

        /**
         * Get tree item depth
         * @returns {number} item depth
         */
        getDepth: function() {
          var depth = this.getStyle('padding-left');
          if (depth) {
            return parseInt(depth, 10);
          }
          return 0;
        },

        /**
         * Sets if it is part of current row
         * @param {boolean} current - true if the item is part of the current line, false otherwise
         */
        setCurrent: function(current) {
          if (this._current !== current) {
            this._current = current;
            if (current) {
              this._element.addClass("currentRow");
              this._children[0].addClass("currentRow");
            } else {
              this._element.removeClass("currentRow");
              this._children[0].removeClass("currentRow");
            }
            this.setAriaAttribute("labeledby", this._children[0].getRootClassName());
            this.setAriaSelection();

          }
        },

        /**
         * Sets image item
         * @param {string} path - image path
         * @publicdoc
         */
        setImage: function(path) {
          if (this._currentImagePath !== path) {
            if (path && path !== "") {

              if (!this._imageSpanElement) {
                this._imageSpanElement = document.createElement("span");
                this._imageSpanElement.addClass("gbc_TableItemImage");
                this._element.insertBefore(this._imageSpanElement, this.getContainerElement());
              }

              if (!this._imageWidget) {

                var opts = this.getBuildParameters();
                opts.inTable = true;
                this._imageWidget = cls.WidgetFactory.createWidget("ImageWidget", opts);
                this._imageWidget.setParentWidget(this);
                this._imageClickHandler = this._imageWidget.when(context.constants.widgetEvents.click, function(event) {
                  this.getTableWidgetBase().requestFocusFromWidget(this._children[0], event);
                }.bind(this));
                this._imageSpanElement.prependChild(this._imageWidget.getElement());
              }
              this._imageSpanElement.addClass("visibleImage");
              this._imageWidget.setSrc(path);
              this._imageWidget.setHidden(false);
            } else if (this._imageWidget) {
              this._imageSpanElement.removeClass("visibleImage");
              this._imageWidget.setHidden(true);
            }
            this._currentImagePath = path;
          }
        },

        /**
         * Checks if item is part of current row
         * @returns {boolean} true if the item is part of the current line, false otherwise
         * @publicdoc
         */
        isCurrent: function() {
          return this._element.hasClass("currentRow");
        },

        /**
         * Sets if item is selected
         * @param {boolean} selected - true if the item should be selected, false otherwise
         */
        setSelected: function(selected) {
          var children = this.getChildren();
          if (children.length !== 0) {
            children[0].setIgnoreBackgroundColor(Boolean(selected));
          }
          this._element.toggleClass("selectedRow", Boolean(selected));
        },

        /**
         * Checks if item is selected
         * @returns {boolean} true if the row item is selected, false otherwise
         */
        isSelected: function() {
          return this._element.hasClass("selectedRow");
        },

        /**
         * Checks if item is client selected
         * @returns {boolean} true if the row item is client selected, false otherwise
         */
        isClientSelected: function() {
          return this._clientSelected;
        },

        /**
         * Sets if item is client selected
         * @param {boolean} selected - true if the item is client selected, false otherwise
         */
        setClientSelected: function(selected) {
          this._clientSelected = selected;
        },

        /**
         * Returns index of the item in the parent column
         * @returns {number} index of the item in the column
         * @publicdoc
         */
        getItemIndex: function() {
          var parent = this.getParentWidget();
          if (parent) {
            return parent.getChildren().indexOf(this);
          }
          return -1;
        },

        /**
         * Handle dragStart event
         * @param {Object} evt - dragstart event
         */
        onDragStart: function(evt) {
          if (window.browserInfo.isFirefox) { // Firefox 1.0+
            try {
              evt.dataTransfer.setData('text/plain', ''); // for Firefox compatibility
            } catch (ex) {
              console.error("evt.dataTransfer.setData('text/plain', ''); not supported");
            }
          }
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragStart, this.getItemIndex(), evt);
        },

        /**
         * Handle dragEnd event
         */
        onDragEnd: function() {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragEnd);
        },

        /**
         * Handle dragOver event
         * @param {Object} evt - dragover event
         */
        onDragOver: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragOver, this.getItemIndex(), evt);
        },

        /**
         * Handle dragLeave event
         * @param {Object} evt - dragleave event
         */
        onDragLeave: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragLeave, this.getItemIndex(), evt);
        },

        /**
         * Handle dragEnter event
         * @param {Object} evt - dragenter event
         */
        onDragEnter: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragEnter, this.getItemIndex(), evt);
        },

        /**
         * Handle drop event
         */
        onDrop: function() {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDrop, this.getItemIndex());
        },

        /**
         * @inheritDoc
         */
        isLayoutMeasureable: function(deep) {
          return true;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TableColumnItem', cls.TableColumnItemWidget);
  });
