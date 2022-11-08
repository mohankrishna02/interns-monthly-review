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

modulum('ProgressBarWidget', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Progressbar widget.
     * @class ProgressBarWidget
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.ProgressBarWidget = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.ProgressBarWidget.prototype */ {
        __name: 'ProgressBarWidget',
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        /** @type {string} */
        _progressSelector: '>div>.mt-progress-level',

        /** @type {HTMLElement} */
        _progressElement: null,
        /** @type {HTMLElement} */
        _percentageElement: null,

        /** @type {number} */
        _value: 0,
        /** @type {number} */
        _valueMin: 0,
        /** @type {number} */
        _valueMax: 100,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._progressElement = this._element.querySelector('div>div');
          this._percentageElement = this._element.querySelector('.mt-progress-bar-percentage');
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().initial = cls.SizePolicy.Fixed();
            this._layoutInformation.getSizePolicyConfig().dynamic = cls.SizePolicy.Fixed();
            // this._layoutInformation.forcedMinimalWidth = 80;
            this._layoutInformation.forcedMinimalHeight = 20;
            this._layoutEngine._shouldFillHeight = true;
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._progressElement = null;
          this._percentageElement = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          // in table we have to request focus on row when clicking on a table column progress bar
          if (this.isInTable()) {
            this._onRequestFocus(domEvent); // request focus
          }
          return true;
        },

        /**
         * Overrided to use mt-progress-color instead of secondary color
         * @inheritDoc
         */
        setColor: function(color) {
          if (color === gbc.ThemeService.getValue("theme-secondary-color")) {
            color = gbc.ThemeService.getValue("mt-progress-color");
          }
          this.setStyle(this._progressSelector, {
            'background-color': color ? color + ' !important' : null
          });
        },

        /**
         * Get the color of the progressBar
         * @return {string} the CSS value for the backgrund-color attribute
         * @publicdoc
         */
        getColor: function() {
          return this.getStyle(this._progressSelector, 'background-color');
        },

        /**
         * Set the color of the progressBar
         * @param {string} color - any CSS compliant color
         * @publicdoc
         */
        setBackgroundColor: function(color) {
          this.setStyle({
            'background-color': color ? color + ' !important' : null
          });
        },

        /**
         * Get the color of the progressBar
         * @return {string} the CSS value for the backgrund-color attribute
         * @publicdoc
         */
        getBackgroundColor: function() {
          return this.getStyle('background-color');
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          return this._value;
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          value = +value;
          // Check if number
          value = Number.isNaN(value) ? this._valueMin : value;
          // Check if value is higher than Max
          value = value > this._valueMax ? this._valueMax : value;
          // Check if value is lower than min
          value = value < this._valueMin ? this._valueMin : value;
          this._value = value;

          var percentValue = Math.round((this._value - this._valueMin) / (this._valueMax - this._valueMin) * 100);
          this.afterDomMutator(function() {
            this.setStyle(this._progressSelector, {
              'width': '' + percentValue + '% !important'
            });
          }.bind(this));
          if (this._percentageElement) {
            this._percentageElement.querySelector("span").innerText = percentValue;
            this.setAriaAttribute("valuetext", percentValue + " %");
          }
          this.setAriaAttribute("valuenow", value);
        },

        /**
         * Set the progressbar as running (with animation)
         * @param {boolean} running - true starts the animation for an unknown progress progressbar, false stops it.
         * @publicdoc
         */
        setRunning: function(running) {
          this._progressElement.toggleClass('running', running);
          this._element.toggleClass('running', running);
        },

        /**
         * Check if the progressBar is running
         * @returns {boolean} true if the animation is running for an unknown progress progressbar, false otherwise.
         * @publicdoc
         */
        isRunning: function() {
          return this._element.hasClass('running');
        },

        /**
         * Set the state of the progressBar as unknown
         * @param {boolean} unknown true to switch to the unknown progress mode, false otherwise
         * @publicdoc
         */
        setProgressUnknown: function(unknown) {
          this._progressElement.toggleClass('mt-progress-level-unknown', unknown);
          if (unknown) {
            this.setStyle(this._progressSelector, {
              'width': '0% !important'
            });
          }
        },

        /**
         * Check if progress status is unknown
         * @returns {boolean} true if the progressbar is in unknown progress mode, false otherwise
         * @publicdoc
         */
        isProgressUnknown: function() {
          return this._progressElement.hasClass('mt-progress-level-unknown');
        },

        /**
         * Set the minimum value of the progressBar
         * @param {number} valueMin - minimum value the progressBar can handle
         * @publicdoc
         */
        setMin: function(valueMin) {
          this._valueMin = parseInt(valueMin, 10);
          this.setAriaAttribute("valuemin", valueMin);
          this.setValue(this._value, false);
        },

        /**
         * Get the minimum value of the progressBar
         * @return {number} minimum value the progressBar can handle
         * @publicdoc
         */
        getMin: function() {
          return this._valueMin;
        },

        /**
         * Set the maximum value of the progressBar
         * @param {number} valueMax - maximum value the progressBar can handle
         * @publicdoc
         */
        setMax: function(valueMax) {
          this._valueMax = parseInt(valueMax, 10);
          this.setAriaAttribute("valuemax", valueMax);
          this.setValue(this._value, false);
        },

        /**
         * Get the maximum value of the progressBar
         * @return {number} maximum value the progressBar can handle
         * @publicdoc
         */
        getMax: function() {
          return this._valueMax;
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          this._element.domFocus();
        },

        /**
         * Show the percentage in the progressbar
         * @param {string} pos - position of the percentage info: 'left', 'right' or center
         */
        showPercentage: function(pos) {
          if (pos && this._percentageElement) {
            this._percentageElement.removeClass('.percentage-left');
            this._percentageElement.removeClass('.percentage-center');
            this._percentageElement.removeClass('.percentage-right');
            this._percentageElement.addClass('percentage-' + pos);
          }
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ProgressBar', cls.ProgressBarWidget);
  });
