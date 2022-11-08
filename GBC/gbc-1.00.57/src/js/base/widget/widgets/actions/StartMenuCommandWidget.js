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

modulum('StartMenuCommandWidget', ['TextWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * StartMenuCommand widget.
     * @class StartMenuCommandWidget
     * @memberOf classes
     * @extends classes.TextWidgetBase
     */
    cls.StartMenuCommandWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      return /** @lends classes.StartMenuCommandWidget.prototype */ {
        __name: 'StartMenuCommandWidget',

        /**
         * Image of the startMenu command
         * @protected
         * @type {classes.ImageWidget}
         */
        _image: null,

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this.emit(context.constants.widgetEvents.click);
          return false;
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._image) {
            this._image.destroy();
            this._image = null;

          }
          $super.destroy.call(this);
        },

        /**
         * Set the text of the command
         * @param {string} text
         */
        setText: function(text) {
          this._setTextContent(text, function() {
            return this._element.getElementsByClassName('gbc_startMenuCommandText')[0];
          }.bind(this));
        },

        /**
         * Get the text of the command
         * @return {string}
         */
        getText: function() {
          return this._element.getElementsByClassName('gbc_startMenuCommandText')[0].textContent;
        },

        /**
         * Set the title to appear as tooltip
         * @param {string} title
         */
        setTitle: function(title) {
          this._element.setAttribute('title', title);
        },

        /**
         * Get the title to appear as tooltip
         * @return {string}
         */
        getTitle: function() {
          return this._element.getAttribute('title');
        },

        /**
         * Define the command image
         * @param {string} image
         */
        setImage: function(image) {
          if (image.length !== 0) {
            if (!this._image) {
              this._image = cls.WidgetFactory.createWidget('ImageWidget', this.getBuildParameters());
              this._element.prependChild(this._image.getElement());
            }
            this._image.setSrc(image);
          }
        },

        /**
         * Get image of the command
         * @return {?string} - source of the image, null if not set
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('StartMenuCommand', cls.StartMenuCommandWidget);
  });
