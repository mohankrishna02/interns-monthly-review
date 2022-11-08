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

modulum('AccordionFolderWidget', ['FolderWidgetBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Accordion Folder widget.
     * @class AccordionFolderWidget
     * @memberOf classes
     * @extends classes.FolderWidgetBase
     * @publicdoc Widgets
     */
    cls.AccordionFolderWidget = context.oo.Class(cls.FolderWidgetBase, function($super) {
      return /** @lends classes.AccordionFolderWidget.prototype */ {
        __name: "AccordionFolderWidget",

        /** @function */
        _pageVisibilityHandler: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this._pageVisibilityHandler = this.when(gbc.constants.widgetEvents.pageVisibility, this.forceRelayout.bind(this));
          // Set the default value of the collapsers to the theme definition
          this.setCollapserPosition(gbc.ThemeService.getValue("gbc-AccordionFolderWidget-collapser-position"));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._pageVisibilityHandler) {
            this._pageVisibilityHandler();
            this._pageVisibilityHandler = null;
          }

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.AccordionFolderLayoutEngine(this);

          $super._initLayout.call(this);

        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {

          options = options || {};
          options.noDOMInsert = true;

          /** @type classes.PageWidget */
          var pageWidget = widget;

          var titleWidget = pageWidget.getTitleWidget();

          var accordionElement = document.createElement("div");
          accordionElement.addClass("gbc_AccordionElement");
          accordionElement.addClass("g_measurable");

          var accordionPage = document.createElement("div");
          accordionPage.addClass("gbc_AccordionPage");
          accordionPage.addClass("g_measurable");

          accordionElement.appendChild(titleWidget.getElement());
          accordionPage.appendChild(pageWidget.getElement());
          accordionElement.appendChild(accordionPage);

          this.getContainerElement().appendChild(accordionElement);

          this.forceRelayout();

          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          var accordionPage = widget.getElement().parentNode;
          // only current page is in DOM
          if (accordionPage) {
            var accordionElement = accordionPage.parentNode;
            accordionPage.remove();
            if (accordionElement) {
              accordionElement.remove();
            }
          }

          $super.removeChildWidget.call(this, widget);
        },

        /**
         * Force relayout of widget
         */
        forceRelayout: function() {
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        },

        /**
         * @inheritDoc
         */
        setCurrentPage: function(page, executeAction) {
          var accordionElement = null;
          var accordionPage = null;
          if (this._currentPage && this._currentPage !== page) {
            // remove currentPage class from previous current accordion page
            accordionPage = this._currentPage.getElement().parentNode;
            accordionElement = accordionPage.parentNode;
            accordionPage.removeClass("currentPage");
            accordionElement.removeClass("currentPage");
          }
          var modified = $super.setCurrentPage.call(this, page, executeAction);
          if (modified) {
            // add currentPage class to new current accordion page
            accordionPage = this._currentPage.getElement().parentNode;
            accordionElement = accordionPage.parentNode;
            accordionPage.addClass("currentPage");
            accordionElement.addClass("currentPage");
          }
          return modified;
        },

        /**
         * Define the position of the collapser
         * @param {string} pos - could be 'left' or 'right' (default)
         */
        setCollapserPosition: function(pos) {
          this.removeClass("collapser-position-left");
          this.removeClass("collapser-position-right");
          this.addClass("collapser-position-" + pos);
        }

      };
    });
    cls.WidgetFactory.registerBuilder("Folder[position=accordion]", cls.AccordionFolderWidget);
  });
