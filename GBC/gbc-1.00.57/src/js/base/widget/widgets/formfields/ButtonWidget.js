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

modulum('ButtonWidget', ['TextWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class ButtonWidget
     * @memberOf classes
     * @extends classes.TextWidgetBase
     * @publicdoc Widgets
     */
    cls.ButtonWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      return /** @lends classes.ButtonWidget.prototype */ {
        __name: "ButtonWidget",

        /**
         * @type {classes.ImageWidget}
         */
        _image: null,

        /**
         * @type {HTMLElement}
         */
        _textElement: null,

        /**
         * @type {HTMLElement}
         */
        _mtButton: null,

        /**
         * Type of the button (normal, link or commandLink)
         * @type {null|string}
         */
        _buttonType: null,

        /** @type {boolean} */
        _autoScale: false,

        /** @type {Object} */
        _alignment: null,

        /** @type {string|null} */
        _defaultColor: null,

        /** @function */
        _imageReadyHandler: null,
        /** @function */
        _afterLayoutHandler: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutInformation.getSizePolicyConfig().initial._shrinkable = false;
          this._layoutInformation.getSizePolicyConfig().dynamic._shrinkable = false;
          this.getLayoutInformation()._fixedSizePolicyForceMeasure = true;
          this._layoutEngine = new cls.ButtonLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._mtButton = this._element.getElementsByClassName('mt-button')[0];
          this._textElement = this._mtButton.querySelector('.textimage span');
        },

        /**
         * Client QA code for performances testing
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
        destroy: function() {
          if (this._imageReadyHandler) {
            this._imageReadyHandler();
            this._imageReadyHandler = null;
          }
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
            this._afterLayoutHandler = null;
          }
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          this._textElement = null;
          this._mtButton = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          // Disable click when not clicking on text nor image
          if (this._buttonType === 'link' && (domEvent.target.tagName.toLowerCase() !== 'span' && domEvent.target.tagName
              .toLowerCase() !==
              'img')) {
            return true;
          }

          if (this.isEnabled() || this.isInterruptable()) {
            this.emit(context.constants.widgetEvents.click, domEvent);
          }
          return true;
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
         * Sets the text of the button
         * @param {string} text text to display in the button
         * @publicdoc
         */
        setText: function(text) {
          this.domAttributesMutator(function() {
            this.getElement().toggleClass('hasText', text.length !== 0);
            this._textElement.textContent = text;
          }.bind(this));

          if (this._layoutEngine) {
            if (this._layoutInformation && this._layoutInformation.getCurrentSizePolicy().isDynamic()) {
              this._layoutEngine.invalidateMeasure();
            }
          }
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
         * Gets the text of the button
         * @returns {string} the text displayed in the button
         * @publicdoc
         */
        getText: function() {
          return this._textElement.textContent;
        },

        /**
         * Sets the image of the button
         * @param {string} image the URL of the image to display
         * @publicdoc
         */
        setImage: function(image) {
          if (this._imageReadyHandler) {
            this._imageReadyHandler();
            this._imageReadyHandler = null;
          }
          if (image.length !== 0) {
            if (!this._image) {
              var opts = this.getBuildParameters();
              opts.inTable = false; // TODO image in button edit seem to not work correctly if inTable and buttonedit is intable
              this._image = cls.WidgetFactory.createWidget('ImageWidget', opts);
              var imageContainer = document.createElement('div');
              imageContainer.addClass('gbc_imageContainer');
              imageContainer.appendChild(this._image.getElement());
              this._mtButton.querySelector(".textimage").prependChild(imageContainer);
              this.setAutoScale(this._autoScale);
              if (this._defaultColor) {
                this._image.setDefaultColor(this._defaultColor);
              }
            }
            this._image.setSrc(image);
            this._imageReadyHandler = this._image.when(context.constants.widgetEvents.ready, this._imageLoaded.bind(this));
            this.getElement().addClass('hasImage');

            if (!this._alignment) {
              this.afterDomMutator((function() {
                // if no alignment set and no text
                if (this.getText().length <= 0) {
                  this.setStyle(".mt-button", {
                    "justify-content": "center"
                  });
                } else {
                  this.setStyle(".mt-button", {
                    "justify-content": "flex-start"
                  });
                }
              }).bind(this));

              this.setStyle(".mt-button .textimage", {
                "align-self": "center",
                "align-items": "center"
              });
            }
          } else if (this._image) {
            this._image.getElement().parentElement.remove();
            this._image.destroy();
            this._image = null;
          }
        },

        /**
         * Callback once image has finish loading
         * @private
         */
        _imageLoaded: function(event, src) {
          this._layoutEngine.invalidateMeasure();
          this.emit(context.constants.widgetEvents.ready);
        },

        /**
         * Gets the image of the button
         * @returns {?string} the URL of the displayed image
         * @publicdoc
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        },

        /**
         * Define the button as autoscaled or not
         * @param {boolean} enabled the button autoscale mode
         * @publicdoc
         */
        setAutoScale: function(enabled) {
          this._autoScale = enabled;
          if (this._image) {
            this._image.setAutoScale(this._autoScale);
            this._image.getElement().parentElement.toggleClass('gbc_autoScale', this._autoScale);
          }
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          if (this.getParentWidget() && (this.getParentWidget().isDropDown || this.getParentWidget().isHidden())) {
            var uiWidget = this.getUserInterfaceWidget();
            if (uiWidget) {
              uiWidget.getElement().domFocus();
            }
          } else {
            this._mtButton.domFocus();
          }
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this.domAttributesMutator(function() {
            this._mtButton.toggleClass('disabled', !enabled);
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        setColor: function(color) {
          this.setStyle('.mt-button', {
            'color': color ? color + ' !important' : null
          });
        },

        /**
         * @inheritDoc
         */
        getColor: function() {
          return this.getStyle('.mt-button', 'color');
        },

        /**
         * Set Default color (defined by DefaultTTF)
         * @param {string} color - rgb formatted or css name
         */
        setDefaultColor: function(color) {
          this._defaultColor = color;
          if (this._image) {
            this._image.setDefaultColor(color);
          }
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          this.setStyle('.mt-button', {
            'background-color': color ? color + ' !important' : null
          });
        },

        /**
         * @inheritDoc
         */
        getBackgroundColor: function() {
          return this.getStyle('.mt-button', 'background-color');
        },

        /**
         * Align the content of the button
         * @param {string} align the button content alignment
         * @publicdoc
         */
        setContentAlign: function(align) {
          this._element.toggleClass('content-left', align === 'left')
            .toggleClass('content-right', align === 'right');
        },

        /**
         * @inheritDoc
         */
        setTitle: function(title) {
          $super.setTitle.call(this, title);
          if (this._image) {
            this._image.setTitle(title);
          }
        },

        /**
         * Hide the button text
         * @param {boolean} textHidden the button text visibility
         * @publicdoc
         */
        setTextHidden: function(textHidden) {
          this._element.toggleClass('text-hidden', textHidden);
        },

        /**
         * Define the button type (normal, link or commandLink)
         * @param {string} buttonType the button type
         * @publicdoc
         */
        setButtonType: function(buttonType) {
          if (this._buttonType) {
            this._mtButton.removeClass('buttonType_' + this._buttonType);
            this.removeClass('buttonType_' + this._buttonType);
          }
          this._buttonType = buttonType;
          this._mtButton.addClass('buttonType_' + buttonType);
          this.addClass('buttonType_' + buttonType);
        },

        /**
         * Defines the alignment of the button text
         * @param {string} vertical - vertical position
         * @param {string} horizontal - horizontal position left, right or centered
         */
        setAlignment: function(vertical, horizontal) {
          this._alignment = {
            "vertical": vertical,
            "horizontal": horizontal
          };

          var _flex = {
            "top": "flex-start",
            "verticalCenter": "center",
            "bottom": "flex-end",
            "left": "flex-start",
            "horizontalCenter": "center",
            "right": "flex-end"
          };

          if (["left", "center", "right"].indexOf(horizontal) >= 0) {
            this.setStyle(".mt-button", {
              "justify-content": _flex[horizontal]
            });
          }

          if (["top", "verticalCenter", "bottom"].indexOf(vertical) >= 0) {
            this.setStyle(".mt-button .textimage", {
              "align-self": _flex[vertical]
            });
          }
        },
        /**
         * @inheritDoc
         */
        setInterruptable: function(interruptable) {
          $super.setInterruptable.call(this, interruptable);
          if (this._mtButton) {
            if (interruptable) {
              this._mtButton.setAttribute("interruptable", "interruptable");
            } else {
              this._mtButton.removeAttribute("interruptable");
            }
          }
        },
        /**
         * @inheritDoc
         */
        setInterruptableActive: function(isActive) {
          $super.setInterruptableActive.call(this, isActive);
          if (this._mtButton) {
            if (isActive) {
              this._mtButton.setAttribute("interruptable-active", "interruptable-active");
            } else {
              this._mtButton.removeAttribute("interruptable-active");
            }
          }
        },

        /**
         * Set the aria-current attribute instead of aria-selected to help screen-reader to know wich widget is the current one
         */
        setAriaSelection: function() {
          this.domAttributesMutator(function() {
            var currentSelected = document.querySelector('[aria-current="true"]');
            if (currentSelected) {
              currentSelected.removeAttribute('aria-current');
            }
          });
          this.setAriaAttribute('current', "true");
        },

      };
    });
    cls.WidgetFactory.registerBuilder('Button', cls.ButtonWidget);
    cls.WidgetFactory.registerBuilder('ButtonWidget', cls.ButtonWidget);
    cls.WidgetFactory.registerBuilder('Action', cls.ButtonWidget);
    cls.WidgetFactory.registerBuilder('MenuAction', cls.ButtonWidget);
  });
