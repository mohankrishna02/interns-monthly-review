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

modulum('PageTitleWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Page title in folder widget.
     * @class PageTitleWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.PageTitleWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.PageTitleWidget.prototype */ {
        __name: "PageTitleWidget",

        /** @type {classes.ImageWidget} */
        _image: null,
        /** @type {HTMLElement} */
        _titleElement: null,
        /** @type {HTMLElement} */
        _actionsContainerElement: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._titleElement = this._element.getElementsByClassName("mt-tab-title-text")[0];
          this._actionsContainerElement = this._element.getElementsByClassName("mt-tab-title-actions")[0];
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
          this._actionsContainerElement = null;
          this._titleElement = null;
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this.emit(context.constants.widgetEvents.click, domEvent);
          return true;
        },

        /**
         * Set the page title text
         * @param {string} text the text to display
         * @publicdoc
         */
        setText: function(text) {
          var title = text.replace(/&(.)/g, "$1");
          this._setTextContent(title, "_titleElement");
          if (!this.getTitle()) { // fallback if no title defined
            this.setTitle(title);
          }
        },

        /**
         * Set the dom title of the pageTitle widget
         * @param {string} title - text to display as title
         */
        setTitle: function(title) {
          this.domAttributesMutator(function() {
            this._titleElement.title = title;
          }.bind(this));
        },

        /**
         * Get the dom title of the pageTitle widget
         * @return {string} text displayed as title
         */
        getTitle: function() {
          return this._titleElement.title;
        },

        /**
         * Get the page title text
         * @returns {string} the text displayed
         * @publicdoc
         */
        getText: function() {
          return this._titleElement.textContent;
        },

        /**
         * Get the action container element
         * @return {HTMLElement} the action container
         */
        getActionsContainerElement: function() {
          return this._actionsContainerElement;
        },

        /**
         * Define an image to display next to the title
         * @param {string} image the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         * @publicdoc
         */
        setImage: function(image) {
          if (!this._image) {
            var opts = this.getBuildParameters();
            opts.ignoreLayout = true;
            this._image = cls.WidgetFactory.createWidget("ImageWidget", opts);
            this._element.prependChild(this._image.getElement());
          }
          this._image.setHidden(true);
          if (image && image !== "") {
            this._image.setSrc(image);
            this._image.setHidden(false);
            if (!this._image.getTitle()) {
              this.domAttributesMutator(function() {
                this._image.setTitle(this._titleElement.title);
              }.bind(this));
            }
          }
        },

        /**
         * Get the image displayed next to the title
         * @returns {?string} the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         * @publicdoc
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        },

        /**
         * Set the tab to be the current one
         * @param {boolean} current displays the current tab indicator
         * @publicdoc
         */
        setCurrent: function(current) {
          this._element.toggleClass("mt-tab-current", current);
          this.setAriaAttribute("selected", current.toString());
        },

        /**
         * Check if the tab is the current one
         * @returns {boolean} true if the current tab indicator is displayed
         * @publicdoc
         */
        isCurrent: function() {
          return this._element.hasClass("mt-tab-current");
        },

        /**
         * Define the position of the collapser icon
         * @param {string} pos - could be 'left' or 'right' (default)
         */
        setCollapserPosition: function(pos) {
          this.addClass("collapser-position-" + pos);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('PageTitle', cls.PageTitleWidget);
  });
