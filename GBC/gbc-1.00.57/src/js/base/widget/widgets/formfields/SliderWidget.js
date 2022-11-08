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

modulum('SliderWidget', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Slider widget.
     * @class SliderWidget
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.SliderWidget = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.SliderWidget.prototype */ {
        __name: 'SliderWidget',
        /**
         * Redefine where the data is located
         * @type {string|Object}
         */
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        /**
         * Slider orientation. Default is horizontal
         * @type {?string}
         */
        _orientation: null,
        /**
         * Flag to indicate if we updated orientation before or after first widget layout
         */
        _afterLayoutFlag: null,

        /**
         * @constructs
         * @param {Object} opts - Options passed to the constructor
         * @publicdoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setFocusable(true);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.SliderLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().initial = cls.SizePolicy.Dynamic();
            this._layoutInformation.getSizePolicyConfig().fixed = cls.SizePolicy.Dynamic();
            this._layoutInformation._forceFixedWidthMeasure = true;
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName('input')[0];
          var onSlideEnd = this._onSlide.bind(this);

          this._inputElement.on('touchend.SliderWidget', onSlideEnd);
          this._inputElement.on('mouseup.SliderWidget', onSlideEnd);

          this._inputElement.on('touchstart.SliderWidget', function() {
            this._preventContainerScrolling(true);
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._inputElement.off('touchend.SliderWidget');
          this._inputElement.off('mouseup.SliderWidget');
          this._inputElement.off('touchstart.SliderWidget');
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this._onRequestFocus(domEvent); // request focus
          return true;
        },

        /**
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled() && !this.isReadOnly()) {

            keyProcessed = true;
            switch (keyString) {
              case "down":
              case "pagedown":
              case this.getStart():
                this.setEditing(true);
                this._decrease();
                this.emit(context.constants.widgetEvents.change, false);
                break;
              case "up":
              case "pageup":
              case this.getEnd():
                this.setEditing(true);
                this._increase();
                this.emit(context.constants.widgetEvents.change, false);
                break;
              default:
                keyProcessed = false;
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.manageKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * Handler executed on mouse click. We update the value depending of pointer location click on the slider
         * and send it to VM
         * @param {Object} evt - DOM event
         */
        _onSlide: function(evt) {
          if (!this.hasFocus()) {
            this._onRequestFocus(evt); // request focus
          }
          // need to emit change because on some browsers, change event is not raised when slider has not yet the focus
          if (this.isEnabled() && !this.isReadOnly()) {
            var total;
            // Vertical sliders are rotated with CSS. evt.offsetX takes this into account. getBoundingClientRect doesn't
            var clickPos = 0;
            var inputRect = this._inputElement.getBoundingClientRect();
            if (evt.offsetX) {
              clickPos = evt.offsetX;
              // on mobile offsetX doesn't exist. We need to calculate the relative click position using global pageX and input position
            } else if (window.isTouchDevice() && evt.changedTouches[0]) {
              if (this.getOrientation() === 'horizontal') {
                clickPos = evt.changedTouches[0].pageX - inputRect.left;
              } else {
                clickPos = inputRect.bottom - evt.changedTouches[0].pageY;
              }
            }
            if (this.getOrientation() === 'horizontal') {
              total = inputRect.width;
            } else {
              total = inputRect.height;
            }
            var expectedTotal = this.getMax() - this.getMin();
            var expectedVal = expectedTotal * (clickPos / total);
            var step = this.getStep();
            var value = this.getMin() + Math.floor(expectedVal / step) * step;
            if ((expectedVal % step) > (step / 2)) {
              value += step;
            }
            this.setEditing(true);
            this._inputElement.value = value;
          }
          this._preventContainerScrolling(false);
          this.emit(context.constants.widgetEvents.change, false);
        },

        /**
         * Increase the displayed value
         */
        _increase: function() {
          this.setValue((this.getValue() || 0) + this.getStep());
        },

        /**
         * Decrease the displayed value
         */
        _decrease: function() {
          this.setValue((this.getValue() || 0) - this.getStep());
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          return parseInt(this._inputElement.value, 10);
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          $super.setValue.call(this, value, fromVM);
          value = +value;
          this._inputElement.value = Object.isNumber(value) && !Number.isNaN(value) ? value : 0;
          this.setAriaAttribute("valuenow", value);
        },

        /**
         * Get minimum possible value of the slider
         * @returns {number} the minimum value
         * @publicdoc
         */
        getMin: function() {
          return this._inputElement.getIntAttribute('min');
        },

        /**
         * Define the minimum possible value of the slider
         * @param {number} value - the minimum value
         * @publicdoc
         */
        setMin: function(value) {
          if (Object.isNumber(value)) {
            this._inputElement.setAttribute('min', value);
          } else {
            this._inputElement.removeAttribute('min');
          }
          this.setAriaAttribute("valuemin", value);
        },

        /**
         * Get maximum possible value of the slider
         * @returns {number} the maximum value
         * @publicdoc
         */
        getMax: function() {
          return this._inputElement.getIntAttribute('max');
        },

        /**
         * Define the maximum possible value of the slider
         * @param {number} value - the maximum value
         * @publicdoc
         */
        setMax: function(value) {
          if (Object.isNumber(value)) {
            this._inputElement.setAttribute('max', value);
          } else {
            this._inputElement.removeAttribute('max');
          }
          this.setAriaAttribute("valuemax", value);
        },

        /**
         * Get slider step when increasing or decreasing value
         * @returns {number} the step value
         * @publicdoc
         */
        getStep: function() {
          return this._inputElement.getIntAttribute('step');
        },

        /**
         * Define the slider step when increasing or decreasing value
         * @param {number} step - the step value
         * @publicdoc
         */
        setStep: function(step) {
          this._inputElement.setAttribute('step', Object.isNumber(step) && step > 0 ? step : 1);
        },

        /**
         * @inheritDoc
         */
        setTitle: function(title) {
          this._inputElement.setAttribute('title', title);
        },

        /**
         * @inheritDoc
         */
        getTitle: function() {
          return this._inputElement.getAttribute('title');
        },

        /**
         * Set the orientation of the slider widget
         * @param {string} orientation can be 'horizontal' or 'vertical'
         * @param {boolean} afterLayout internal
         * @publicdoc
         */
        setOrientation: function(orientation, afterLayout) {
          if (this._orientation !== orientation || this._afterLayoutFlag !== afterLayout) {
            this._orientation = orientation;
            this._afterLayoutFlag = afterLayout;
            var newStyle = {};

            if (orientation === 'vertical' && afterLayout) {
              // Rotate only after layout
              this.setStyle({
                'transform': 'rotate(-90deg)'
              });
            } else {
              newStyle = {
                '-webkit-appearance': null,
                'writing-mode': null
              };
              if (this._inputElement) {
                this._inputElement.removeAttribute('orient');
              }
            }
            this.setStyle('>input[type=range]', newStyle);
            this.setAriaAttribute("orientation", orientation);
          }
        },

        /**
         * Get the current slider orientation. Default is horizontal.
         * @returns {string} current css orientation
         * @publicdoc
         */
        getOrientation: function() {
          return this._orientation ? this._orientation : 'horizontal';
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          this._inputElement.domFocus();
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * @inheritDoc
         */
        setReadOnly: function(readonly) {
          $super.setReadOnly.call(this, readonly);
          this._setInputReadOnly(readonly);
        },

        /**
         * Set if input element is readonly
         * @param {boolean} readonly
         * @private
         */
        _setInputReadOnly: function(readonly) {
          if (readonly) {
            this._inputElement.setAttribute('readonly', 'readonly');
          } else {
            this._inputElement.removeAttribute('readonly');
          }
        },

        /**
         * Prevent the container to scroll while doing touch to scroll the tab-titles
         * @param {Boolean} prevent - true to prevent it, false otherwise
         * @private
         */
        _preventContainerScrolling: function(prevent) {
          var form = this.getFormWidget();
          if (form) {
            form.getContainerElement().toggleClass("prevent-touch-scroll", prevent);
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Slider', cls.SliderWidget);
  });
