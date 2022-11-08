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

modulum('TopMenuCommandWidget', ['TextWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TopMenuCommand widget.
     * @class TopMenuCommandWidget
     * @memberOf classes
     * @extends classes.TextWidgetBase
     * @publicdoc Widgets
     */
    cls.TopMenuCommandWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      return /** @lends classes.TopMenuCommandWidget.prototype */ {
        __name: 'TopMenuCommandWidget',
        /** @type {classes.ImageWidget} */
        _image: null,
        /** @type {HTMLElement} */
        _anchorElement: null,
        /** @type {HTMLElement} */
        _commentContainer: null,

        /**
         * @inheritDoc
         */
        _initElement: function(initialInformation) {
          $super._initElement.call(this, initialInformation);

          this._image = cls.WidgetFactory.createWidget('ImageWidget', this.getBuildParameters());
          this._image.setAutoScale(true);
          this._element.prependChild(this._image.getElement());

          this._anchorElement = this._element.querySelector('span.anchor');
          this._commentContainer = this._element.querySelector('span.gbc-label-comment-container');

          this._element.on('mouseover.TopMenuCommandWidget', this._onMouseover.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._element) {
            this._element.off('mouseover.TopMenuCommandWidget');
          }
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
          if (this.isEnabled() || this.isInterruptable()) {
            this.emit(context.constants.widgetEvents.click, domEvent);
          }
          return true;
        },

        /**
         * Hide previous sub menu displayed from a same level topmenugroup
         * @param event
         * @private
         */
        _onMouseover: function(event) {
          if (cls.DropDownWidget.hasAnyVisible()) {
            var lastDropDown = cls.DropDownWidget.getActiveDropDown();

            if (!lastDropDown.getElement().contains(event.target)) {
              lastDropDown.remove();
            }
          }
        },

        /**
         * Set the text of the command item
         * @param {string} text - text to display
         * @publicdoc
         */
        setText: function(text) {
          this._setTextContent(text, "_anchorElement");
        },

        /**
         * Set a comment for the Command item
         * @param {string} comment - accelerator name
         * @publicdoc
         */
        setComment: function(comment) {
          var regex = /([^A-Za-z]*\+|\-)([A-Za-z])/g;
          if (window.browserInfo.isSafari) {
            comment = comment.replace(/control/ig, "⌘")
              .replace(regex, function(match) {
                return match.toUpperCase();
              })
              .replace("-", " ");
          } else {
            comment = comment.replace("-", "+")
              .replace(/control/ig, "Ctrl")
              .replace(regex, function(match) {
                return match.toUpperCase();
              });
          }
          this._commentContainer.textContent = comment;
        },

        /**
         * Get the text of the command item
         * @return {string} - text of the command item
         * @publicdoc
         */
        getText: function() {
          return this._anchorElement.textContent;
        },

        /**
         * Define the topmenu command image
         * @param {string} image - url source of the image
         * @publicdoc
         */
        setImage: function(image) {
          this._image.setSrc(image);
        },

        /**
         * Get image of the topmenu command
         * @return {?string} - source of the image, null if not set
         * @publicdoc
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TopMenuCommand', cls.TopMenuCommandWidget);
  });
