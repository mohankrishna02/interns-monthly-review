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

modulum('FolderWidget', ['FolderWidgetBase'],
  function(context, cls) {

    /**
     * Folder widget.
     * @class FolderWidget
     * @memberOf classes
     * @extends classes.FolderWidgetBase
     * @publicdoc Widgets
     */
    cls.FolderWidget = context.oo.Class(cls.FolderWidgetBase, function($super) {
      return /** @lends classes.FolderWidget.prototype */ {
        __name: "FolderWidget",

        /** @type {Element} */
        _tabsTitlesHostElement: null,
        /** @type {Element} */
        _tabsTitlesElement: null,
        /** @type {String} */
        _tabsPosition: "top",
        /** @type {classes.ScrollTabDecorator} */
        _scroller: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.FolderLayoutInformation(this);
          this._layoutEngine = new cls.FolderLayoutEngine(this);

          $super._initLayout.call(this);
        },

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._tabsTitlesHostElement = this._element.getElementsByClassName("mt-tab-titles")[0];
          this._tabsTitlesElement = this._element.getElementsByClassName("mt-tab-titles-container")[0];

          this._scroller = new cls.ScrollTabDecorator(this);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._scroller) {
            this._scroller.destroy();
            this._scroller = null;
          }
          if (this._tabsTitlesHostElement) {
            this._tabsTitlesHostElement = null;
          }
          if (this._tabsTitlesElement) {
            this._tabsTitlesElement = null;
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          /** @type classes.PageWidget */
          var pageWidget = widget;

          var titleWidget = pageWidget.getTitleWidget();
          this._tabsTitlesElement.appendChild(titleWidget.getElement());

          $super.addChildWidget.call(this, pageWidget, options);
        },

        /**
         * @inheritDoc
         */
        setCurrentPage: function(page, executeAction) {
          var modified = $super.setCurrentPage.call(this, page, executeAction);
          if (modified) {
            this.scrollTo(this._currentPage);
          }
          return modified;
        },

        /**
         * Gets the tabs titles host element
         * @returns {Element} the element
         */
        getTabsTitlesHostElement: function() {
          return this._tabsTitlesHostElement;
        },

        /**
         * Get tabs position
         * @return {string} tabs pos: top, right, bottom, left
         * @publicdoc
         */
        getTabsPosition: function() {
          return this._tabsPosition;
        },

        /**
         * Set the tabs position
         * @param {string} position - could be top, right, bottom or left
         * @publicdoc
         */
        setTabPosition: function(position) {
          if (["top", "bottom", "left", "right"].indexOf(position) < 0) {
            position = "top";
          }
          this._element.setAttribute("__FolderWidget", position);
          this._scroller.updatePosition("__FolderWidget", position);

          this._tabsPosition = position;
        },

        /**
         * Go to the given page
         * @param {classes.PageWidget} page - page to navigate to
         * @publicdoc
         */
        scrollTo: function(page) {
          var title = page && page.getTitleWidget();
          if (title) {
            this._scroller.scrollTo(title.getElement());
          }
          this._scroller.refreshScrollers();
        },

        /**
         * Update visibility of scrollers
         */
        updateScrollersVisibility: function() {
          var isVertical = ["left", "right"].indexOf(this._tabsPosition) >= 0;
          var isHorizontal = ["top", "bottom"].indexOf(this._tabsPosition) >= 0;
          var sizeAttr = isVertical ? "height" : isHorizontal ? "width" : false;
          var info = this.getLayoutInformation();

          if (sizeAttr && this._scroller) {
            // Check if there is space enough to display the full bar or need scrolling
            var tabsTitlesSize = this.getChildren().map(function(item) {
              return item.isHidden() ? 0 :
                item.getLayoutInformation()[isHorizontal ? "getTitleMeasureWidth" : "getTitleMeasureHeight"]();
            }).reduce(function(next, prev) {
              return next + prev;
            }, 0);
            var tabsTitlesHostSize = this._getAllocatedSize(isHorizontal) -
              info[isHorizontal ? "getTitlesContainerDeltaWidth" : "getTitlesContainerDeltaHeight"]();

            if (tabsTitlesHostSize <= tabsTitlesSize) {
              this._scroller.showScroller(true);
            } else {
              this._scroller.showScroller(false);
            }
          }
        },

        /**
         * get the corrent allocatid size
         * @param isHorizontal is horizontal
         * @returns {number}
         * @protected
         */
        _getAllocatedSize: function(isHorizontal) {
          var info = this.getLayoutInformation();
          return info.getAllocated()[isHorizontal ? "getWidth" : "getHeight"]();
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Folder', cls.FolderWidget);
  });
