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

modulum('PagedScrollGridWidget', ['StretchableScrollGridWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Paged Scroll Grid widget to display Scroll grid with tiles
     * @class PagedScrollGridWidget
     * @memberOf classes
     * @extends classes.StretchableScrollGridWidgetBase
     * @publicdoc
     */
    cls.PagedScrollGridWidget = context.oo.Class(cls.StretchableScrollGridWidgetBase, function($super) {

      return /** @lends classes.PagedScrollGridWidget.prototype */ {
        __name: "PagedScrollGridWidget",
        _currentRow: 0,

        _paginationWidget: null,
        _onOffsetHandler: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._paginationWidget = cls.WidgetFactory.createWidget("Pagination", this.getBuildParameters());
          // Forward scroll events
          this._onOffsetHandler = this._paginationWidget.when(context.constants.widgetEvents.offset, function(event) {
            this.emit(context.constants.widgetEvents.offset, event.data[0]);
          }.bind(this));
          this._element.appendChild(this._paginationWidget.getElement());
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._onOffsetHandler) {
            this._onOffsetHandler();
            this._onOffsetHandler = null;
          }
          this._paginationWidget.destroy();
          this._paginationWidget = null;

          this.destroyChildren();
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (domEvent.target.isElementOrChildOf(this._containerElement)) {
            cls.ScrollGridWidget._onClick.call(this, domEvent);
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        manageMouseDblClick: function(domEvent) {
          if (domEvent.target.isElementOrChildOf(this._containerElement)) {
            cls.ScrollGridWidget._onDblClick.call(this, domEvent);
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          $super.addChildWidget.call(this, widget, options);
          widget.removeClass("gbc_WidgetBase_standalone");
          widget.addClass("gbc_WidgetBase_in_array");
        },

        /**
         * Get the Data area height
         * @returns {number} scroll data area width
         */
        getDataAreaWidth: function() {
          // TODO perf use layoutInformation
          return this.getContainerElement().getBoundingClientRect().width;
        },

        /**
         * Get the Data area height
         * @returns {number} scroll data area height
         */
        getDataAreaHeight: function() {
          // TODO perf use layoutInformation
          return this.getContainerElement().getBoundingClientRect().height;
        },

        /**
         * Get the width of a Row
         * @return {number} row width or 1;
         */
        getRowWidth: function() {
          var children = this.getChildren();
          if (children.length !== 0) {
            return children[0].getElement().getBoundingClientRect().width;
          }
          return 0;
        },

        /**
         * Get the height of a Row
         * @return {number} row height or 1;
         */
        getRowHeight: function() {
          var children = this.getChildren();
          if (children.length !== 0) {
            return children[0].getElement().getBoundingClientRect().height;
          }
          return 0;
        },

        /**
         * @param {number} size - size of the dataset
         * @param {number} pageSize - viewport size
         * @param {number} offset - viewport offset
         */
        updateContentPosition: function(size, pageSize, offset) {
          this._paginationWidget.updateContentPosition(size, pageSize, offset);
        },

        /**
         * @return {classes.PaginationWidget} the pagination widget
         */
        getPaginationWidget: function() {
          return this._paginationWidget;
        },

        /**
         * Set how children will align
         * @param {string} alignment
         */
        setItemsAlignment: function(alignment) {
          if (this._containerElement) {
            this._containerElement.style.justifyContent = {
              start: "flex-start",
              left: "flex-start",
              center: "center",
              right: "flex-end",
              end: "flex-end"
            } [alignment] || "flex-start";
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ScrollGrid[customWidget=pagedScrollGrid]', cls.PagedScrollGridWidget);
    cls.WidgetFactory.registerBuilder('StretchableScrollGrid[customWidget=pagedScrollGrid]', cls.PagedScrollGridWidget);
  });
