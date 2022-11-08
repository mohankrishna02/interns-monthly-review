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

modulum('PaginationWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Pagination buttons for a specified range
     * @class PaginationWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc
     */
    cls.PaginationWidget = context.oo.Class(cls.WidgetBase, function($super) {

      return /** @lends classes.PaginationWidget.prototype */ {
        __name: "PaginationWidget",

        /** @type {number} */
        _pageSize: 0,
        /** @type {number} */
        _size: 0,
        /** @type {number} */
        _offset: 0,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._navigationPrevPage = this._element.children[0];
          this._navigationPrevPage.on('click.NavigationPrevPage', this._navigatePrevPage.bind(this));
          this._navigationNextPage = this._element.children[1];
          this._navigationNextPage.on('click.NavigationNextPage', this._navigateNextPage.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._clearNavigationButtons();
          this._navigationPrevPage.off('click.NavigationPrevPage');
          this._navigationNextPage.off('click.NavigationNextPage');
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // No layout used
        },

        /**
         * Updates the pagination content
         */
        _update: function() {
          var i = 0;
          if (this._pageSize === 0) {
            // not initialized yet
            this._navigationPrevPage.toggleClass('disabled', false);
            this._navigationNextPage.toggleClass('disabled', false);
            return;
          }
          this._clearNavigationButtons();
          var pageCount = Math.ceil(this._size / this._pageSize);
          var current = Math.floor(this._offset / this._pageSize);
          if (pageCount <= 10) {
            for (i = 0; i < pageCount; ++i) {
              this._createNavigationButton(i, current);
            }
          } else {
            var maxButtons = 3;
            this._createNavigationButton(0, current);
            if (current < maxButtons - 1) {
              for (i = 1; i < maxButtons; ++i) {
                this._createNavigationButton(i, current);
              }
              this._createNavigationEllipsis();
            } else if (current > pageCount - maxButtons) {
              this._createNavigationEllipsis();
              for (i = pageCount - maxButtons - 1; i < pageCount - 1; ++i) {
                this._createNavigationButton(i, current);
              }
            } else {
              this._createNavigationEllipsis();
              var n = Math.floor(maxButtons / 2);
              for (i = current - n; i <= current + n; ++i) {
                this._createNavigationButton(i, current);
              }
              this._createNavigationEllipsis();
            }
            this._createNavigationButton(pageCount - 1, current);
          }
          this._navigationPrevPage.toggleClass('disabled', current === 0);
          this._navigationNextPage.toggleClass('disabled', current === pageCount - 1);
        },

        /**
         * Add a navigation button with index inside
         * @param {number} index - page linked to this button
         * @param {number} current - current page
         * @private
         */
        _createNavigationButton: function(index, current) {
          var span = document.createElement('span');
          span.addClass("navbutton");
          span.textContent = "" + (index + 1);
          if (index === current) {
            span.addClass('current');
          }
          span.on('click.NavigatePage', this._navigatePage.bind(this, index));
          this._element.insertBefore(span, this._navigationNextPage);
        },

        /**
         * Add ellipsis (...) to the navigation bar
         * @private
         */
        _createNavigationEllipsis: function() {
          var span = document.createElement('span');
          span.textContent = '\u2026';
          this._element.insertBefore(span, this._navigationNextPage);
        },

        /**
         * Handler to switch to previous page
         * @param {Object} event - DOM event
         */
        _navigatePrevPage: function(event) {
          if (!this._navigationPrevPage.hasClass('disabled')) {
            var offset = Math.max(0, this._offset - this._pageSize);
            this.emit(context.constants.widgetEvents.offset, offset);
          }
        },

        /**
         * Handler to switch to next page
         * @param {Object} event - DOM event
         */
        _navigateNextPage: function(event) {
          if (!this._navigationNextPage.hasClass('disabled')) {
            var maxOffset = Math.floor(this._size / this._pageSize) * this._pageSize;
            var offset = Math.min(maxOffset, this._offset + this._pageSize);
            this.emit(context.constants.widgetEvents.offset, offset);
          }
        },

        /**
         * Handler to switch to a given page
         * @param {number} index - page number to switch to
         * @param {Object} event - DOM event
         */
        _navigatePage: function(index, event) {
          var offset = index * this._pageSize;
          this.emit(context.constants.widgetEvents.offset, offset);
        },

        /**
         * Unregister all navigation callbacks
         * @private
         */
        _clearNavigationButtons: function() {
          var children = this._element.children;
          while (children.length > 2) {
            // Remove ellipsis
            var elt = children[1];
            elt.off('click.NavigatePage');
            this._element.removeChild(elt);
          }
        },

        /**
         * @param {number} size - size of the dataset
         * @param {number} pageSize - viewport size
         * @param {number} offset - viewport offset
         */
        updateContentPosition: function(size, pageSize, offset) {
          this._size = size;
          this._pageSize = pageSize;
          this._offset = offset;
          this._update();
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Pagination', cls.PaginationWidget);
  });
