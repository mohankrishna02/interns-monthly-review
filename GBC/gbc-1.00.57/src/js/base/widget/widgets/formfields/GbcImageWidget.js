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

modulum('GbcImageWidget', ['ImageWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * GBC Image widget to create internal images (i.e: with zmdi)
     * @class GbcImageWidget
     * @memberOf classes
     * @extends classes.ImageWidget
     * @publicdoc Widgets
     */
    cls.GbcImageWidget = context.oo.Class(cls.ImageWidget, function($super) {
      return /** @lends classes.GbcImageWidget.prototype */ {
        __name: 'GbcImageWidget',
        __templateName: "ImageWidget",

        /**
         * Update image according to several pre-set parameters
         * @private
         */
        _updateImage: function() {
          if (!this._element) {
            return;
          }
          if (this._hasContent) {
            this._element.empty();
            this._hasContent = false;
          }
          if (this._img) {
            this._img.off('error.ImageWidget');
            this._img.off('load.ImageWidget');
            this._img = null;
          }
          var backgroundImage = null;
          var backgroundSize = null;
          var backgroundRepeat = null;
          var backgroundPosition = null;
          var width = null;

          if (this._src) {

            this._img = document.createElement('i');
            this._img.on('error.ImageWidget', this._onError.bind(this));
            this._img.setAttribute('class', "zmdi " + this._src);
            this._img.on('load.ImageWidget', this._onLoad.bind(this));
            this._element.appendChild(this._img);

            this._element.toggleClass('gbc_autoScale', this._autoScale);
          }
          if (this._standalone) {
            if (!this._border) {
              this._border = document.createElement('div');
              this._border.addClass('gbc_ImageWidget_border');
            }
            this._element.appendChild(this._border);
          }
          this.setStyle({
            'background-image': backgroundImage,
            'background-size': backgroundSize,
            'background-repeat': backgroundRepeat,
            'background-position': backgroundPosition,
            'width': width
          });
          if (this.__charMeasurer) {
            this._element.appendChild(this.__charMeasurer);
          }
        },
      };
    });
    cls.WidgetFactory.registerBuilder('GbcImage', cls.GbcImageWidget);
  });
