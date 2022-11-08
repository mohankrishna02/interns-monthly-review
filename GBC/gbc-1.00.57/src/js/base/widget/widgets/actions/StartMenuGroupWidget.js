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

modulum('StartMenuGroupWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * StartMenuGroup widget.
     * @class StartMenuGroupWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.StartMenuGroupWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.StartMenuGroupWidget.prototype */ {
        __name: 'StartMenuGroupWidget',

        /**
         * Image of the startMenu command
         * @protected
         * @type {classes.ImageWidget}
         */
        _image: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
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
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (domEvent.target.elementOrParent("gbc_startMenuGroupTitle")) { // only click on group title are managed
            this._element.classList.toggle('gbc_open');
            if (this.getElement().parent("gbc_startMenuContainer")) {
              context.SessionService.getCurrent().getCurrentApplication().layout.refreshLayout({
                resize: true
              });
            }
          }
          return false;
        },

        /**
         * Set the text of the group
         * @param {string} text
         */
        setText: function(text) {
          this._setTextContent(text, function() {
            return this._element.getElementsByClassName('gbc_startMenuGroupTitleText')[0];
          }.bind(this));
        },

        /**
         * Get the text of the group
         * @return {string}
         */
        getText: function() {
          return this._element.getElementsByClassName('gbc_startMenuGroupTitleText')[0].textContent;
        },

        /**
         * Define the command image
         * @param {string} image
         */
        setImage: function(image) {
          if (image.length !== 0) {
            if (!this._image) {
              this._image = cls.WidgetFactory.createWidget('ImageWidget', this.getBuildParameters());
              this._element.child('gbc_startMenuGroupTitle').prependChild(this._image.getElement());
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
    cls.WidgetFactory.registerBuilder('StartMenuGroup', cls.StartMenuGroupWidget);
  });
