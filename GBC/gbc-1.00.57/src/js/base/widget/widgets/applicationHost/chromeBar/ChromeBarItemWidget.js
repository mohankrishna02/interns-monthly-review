/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ChromeBarItemWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Item to add to the topbar (Use as a base class as well for GBC items)
     * @class ChromeBarItemWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ChromeBarItemWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ChromeBarItemWidget.prototype */ {
        __name: "ChromeBarItemWidget",

        /** @type {classes.ImageWidget} */
        _image: null,
        /** @type {Element} */
        _textElement: null,
        /** @type {Element} */
        _imageContainer: null,
        /** @type {string} */
        _itemType: "",

        /** @function */
        _afterLayoutHandler: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ChromeBarItemLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function(initialInformation) {
          $super._initElement.call(this, initialInformation);
          this._textElement = this._element.getElementsByTagName('span')[0];
          this._imageContainer = this._element.getElementsByClassName('gbc_imageContainer')[0];
        },

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setItemType("item"); // item type by default (could be item or gbcItem)
        },

        /**
         * Client QA code for UR testing
         * @private
         */
        actionQAReady: function() {
          if (this.__qaReadyAction) {
            this.__qaReadyAction = false;
            this.emit(context.constants.widgetEvents.click);
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          // Click on any item should close the right bar
          if (this.getParentWidget().closeRightBar) {
            this.getParentWidget().closeRightBar();
          } else {
            this.getParentWidget().hide();
          }
          this.emit(context.constants.widgetEvents.click, domEvent);
          return true; // bubble
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;
          if (this.isEnabled()) {
            if (keyString === "space" || keyString === "enter" || keyString === "return") {
              this.emit(context.constants.widgetEvents.click, domKeyEvent);
              keyProcessed = true;
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * Set the text of the chromebar item
         * @param {string} text - the text
         * @publicdoc
         */
        setText: function(text) {
          this._setTextContent(text, "_textElement");
          this._layoutEngine.invalidateMeasure();
          this._layoutEngine.forceMeasurement();

          // client QA code
          if (gbc.qaMode && ['qa_dialog_ready', 'qa_menu_ready'].indexOf(text) >= 0) {
            this.__qaReadyAction = true;
            if (this._afterLayoutHandler) {
              this._afterLayoutHandler();
            }
            this._afterLayoutHandler =
              context.SessionService.getCurrent().getCurrentApplication().layout.afterLayoutComplete(
                function() {
                  // event executed once : we release reference because event listener will destroy it
                  this._afterLayoutHandler = null;
                  this.actionQAReady();
                }.bind(this), true
              );
          }
        },

        /**
         * Get the text of the chromebar item
         * @return {?string}
         */
        getText: function() {
          return this._textElement ? this._textElement.textContent : null;
        },

        /**
         * Define the chromebar item image
         * @param {string} image - image url to use
         * @publicdoc
         */
        setImage: function(image) {
          if (image.length !== 0) {
            this.addClass("hasImage");
            if (!this._image) {
              this._image = cls.WidgetFactory.createWidget(image.startsWith('zmdi-') ? 'GbcImage' : 'ImageWidget', this
                .getBuildParameters());
              this._imageContainer.appendChild(this._image.getElement());
            } else if (this._image.isInstanceOf(cls.GbcImageWidget) && !image.startsWith('zmdi-')) {
              // Case where image is overrided to be something else than zmdi
              this._image.destroy();
              this._image = null;
              this.setImage(image);
            }
            this._image.setSrc(image);
          } else if (this._image) {
            this._image.getElement().remove();
            this._image.destroy();
            this._image = null;
          }
          this._layoutEngine.invalidateMeasure();
        },

        /**
         * Get the chromebar item Image
         * @return {?string}
         */
        getImage: function() {
          return this._image ? this._image.getSrc() : null;
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
            this._afterLayoutHandler = null;
          }
          $super.destroy.call(this);
        },

        /**
         * Get the item type
         * @return {string} the item type could be item (default) or gbcItem (for gbc Actions)
         */
        getItemType: function() {
          return this._itemType;
        },

        /**
         * Set the item type
         * @param {string} type - the item type could be item (default) or gbcItem (for gbc Actions)
         */
        setItemType: function(type) {
          this._itemType = type;
          this.getElement().setAttribute("chromebar-itemtype", type);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItem', cls.ChromeBarItemWidget);
  });
