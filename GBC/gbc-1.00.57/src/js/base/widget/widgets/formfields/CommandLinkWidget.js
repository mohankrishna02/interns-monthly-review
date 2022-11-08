/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('CommandLinkWidget', ['ButtonWidget', 'WidgetFactory'],
  function(context, cls) {
    /**
     * Button widget CommandLinkWidget.
     * @class CommandLinkWidget
     * @memberOf classes
     * @extends classes.ButtonWidget
     */
    cls.CommandLinkWidget = context.oo.Class(cls.ButtonWidget, function($super) {
      return /** @lends classes.CommandLinkWidget.prototype */ {
        __name: 'CommandLinkWidget',

        /**
         * @type {HTMLElement}
         */
        _titleElement: null,
        /**
         * @type {HTMLElement}
         */
        _commandContainer: null,
        /**
         * @type {HTMLElement}
         */
        _imageContainer: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._textElement = this._mtButton.querySelector('span.text');
          this._titleElement = this._mtButton.querySelector('span.title');
          this._commandContainer = this._mtButton.querySelector('div.command');
          this._imageContainer = this._mtButton.querySelector('.gbc_ImageContainer');
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._titleElement = null;
          this._commandContainer = null;
          this._imageContainer = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        setImage: function(image) {
          if (this._imageReadyHandler) {
            this._imageReadyHandler();
            this._imageReadyHandler = null;
          }
          if (image.length !== 0) {
            if (!this._image) {
              this._image = cls.WidgetFactory.createWidget('ImageWidget', this.getBuildParameters());
              this._imageContainer.appendChild(this._image.getElement());

              this.setAutoScale(this._autoScale);
              if (this._defaultColor) {
                this._image.setDefaultColor(this._defaultColor);
              }
            }
            this._image.setSrc(image);
            this._imageReadyHandler = this._image.when(context.constants.widgetEvents.ready, this._imageLoaded.bind(this));
            this.getElement().addClass('hasImage');
          } else if (this._image) {
            this._image.getElement().parentElement.remove();
            this._image.destroy();
            this._image = null;
          }
        },

        /**
         * @inheritDoc
         */
        setTitle: function(title) {
          $super.setTitle.call(this, title);
          if (this._buttonType === 'commandLink') {
            this._titleElement.textContent = title;
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Button[buttonType=commandLink]', cls.CommandLinkWidget);
    cls.WidgetFactory.registerBuilder('CommandLink', cls.CommandLinkWidget);
  });
