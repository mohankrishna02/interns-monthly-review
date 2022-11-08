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

modulum('SpinEditWidgetBase', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * SpinEdit widget Base class.
     * @class SpinEditWidgetBase
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.SpinEditWidgetBase = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.SpinEditWidgetBase.prototype */ {
        __name: 'SpinEditWidgetBase',

        /**
         * Redefine where the data is located
         * @type {string}
         */
        __dataContentPlaceholderSelector: '.gbc_dataContentPlaceholder',

        /**
         * Up arrow element
         * @type {Element}
         */
        _upArrow: null,

        /**
         * Down arrow element
         * @type {Element}
         */
        _downArrow: null,

        /**
         * Maximum number of characters allowed. By default -1 indicates no limit.
         * @type {number}
         */
        _maxLength: -1,

        /**
         * Step of value increment/decrement.
         * @type {number}
         */
        _step: 1,

        /**
         * Minimum value of the spinedit
         * @type {?number}
         */
        _min: null,

        /**
         * Maximum value of the spinedit
         * @type {?number}
         */
        _max: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.setSingleLineContentOnly(true);
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName('input')[0];
          this._upArrow = this._element.getElementsByClassName('up')[0];
          this._downArrow = this._element.getElementsByClassName('down')[0];

          this._inputElement.on('input.SpinEditWidget', this._onInput.bind(this));
          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.SpinEditWidget', cls.WidgetBase._onSelect.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._inputElement.off('input.SpinEditWidget');
          this._inputElement.off('mousedown.SpinEditWidget');
          $super.destroy.call(this);
        },

        /**
         * Process one key event
         * @param {Object} event
         * @param {string} keyString
         * @returns {boolean} true if key has been processed, false otherwise
         */
        _processKey: function(event, keyString) {
          var isModifier = cls.KeyboardHelper.isSpecialCommand(keyString);
          var isValid = !isModifier && cls.KeyboardHelper.isDecimal(event.gbcKey) && !this._isMaxLength();

          if (isValid) {
            var value = this._inputElement.value;
            var start = this._inputElement.selectionStart;
            var end = this._inputElement.selectionEnd;
            if (end !== start) {
              value = '';
            }
            isValid = cls.KeyboardHelper.validateNumber(value, start, event.gbcKey, this._min, this._max);
          }
          if (!isValid && !isModifier) {
            event.preventCancelableDefault();
            return true;
          }
          return false;
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          this._onRequestFocus(domEvent); // request focus

          var target = domEvent.target;
          if (target.isElementOrChildOf(this._upArrow)) {
            this._onUpIcon(domEvent);
          } else if (target.isElementOrChildOf(this._downArrow)) {
            this._onDownIcon(domEvent);
          }

          return true;
        },

        /**
         * @inheritDoc
         */
        manageKeyUp: function(keyString, domKeyEvent) {
          $super.manageKeyUp.call(this, keyString, domKeyEvent);
          this.emit(context.constants.widgetEvents.change, true);
          this.emit(context.constants.widgetEvents.keyUp, domKeyEvent, true);
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          $super.setValue.call(this, value, fromVM);
          this._inputElement.value = value;
          this.setAriaAttribute("valuenow", value);
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          var value = parseInt(this._inputElement.value, 10);
          var isDefined = Object.isNumber(value) && !Object.isNaN(value);
          return isDefined ? value : '';
        },

        /**
         * Handler called when arrow up icon has been touched/click
         * @param {UIEvent} evt - DOM event
         */
        _onUpIcon: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            this._increase();
            this.emit(context.constants.widgetEvents.change, false);
          }
        },

        /**
         * Handler called when arrow down icon has been touched/click
         * @param {UIEvent} evt - DOM event
         */
        _onDownIcon: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            this._decrease();
            this.emit(context.constants.widgetEvents.change, false);
          }
        },

        /**
         * Update value
         * @param {number} factor - value to add
         */
        _updateValue: function(factor) {
          if (factor > 0) {
            this._increase(factor);
          } else if (factor < 0) {
            this._decrease(Math.abs(factor));
          }
        },

        /**
         * @inheritDoc
         */
        validateValue: function() {
          var valid = true;
          if (this._min && this.getValue() < this._min) {
            valid = false;
          }
          if (this._max && this.getValue() > this._max) {
            valid = false;
          }
          return valid;
        },

        /**
         * Increase value
         * @param {number} [factor=1] - value to add (default is 1)
         */
        _increase: function(factor) {
          var curVal = parseInt(this.getValue() ? this.getValue() : this._oldValue, 10);
          if (this._max && curVal > this._max) {
            this.setValue(this._max);
          }
          if (this._min && curVal < this._min) {
            this.setValue(this._min);
          } else {
            var newVal = (this._step * (factor && Object.isNumber(factor) ? factor : 1));
            newVal = curVal ? newVal + curVal : newVal;
            if (Object.isNumber(this._max) && newVal > this._max) {
              newVal = this._max;
            }
            this.setEditing(this._oldValue !== newVal);
            this.setValue(newVal);
          }
        },

        /**
         * Decrease value
         * @param {number} [factor=1] - value to remove (default is 1)
         */
        _decrease: function(factor) {
          var curVal = parseInt(this.getValue() ? this.getValue() : this._oldValue, 10);
          if (this._min && curVal < this._min) {
            this.setValue(this._min);
          } else if (this._max && curVal > this._max) {
            this.setValue(this._max);
          } else {
            var newVal = (this._step * (factor && Object.isNumber(factor) ? factor : 1));
            newVal = curVal ? curVal - newVal : -newVal;
            if (Object.isNumber(this._min) && newVal < this._min) {
              newVal = this._min;
            }
            this.setEditing(this._oldValue !== newVal);
            this.setValue(newVal);
          }
        },

        /**
         * Define the minimum possible value
         * @param {number} min - the minimum value
         * @publicdoc
         */
        setMin: function(min) {
          if (Object.isNumber(min)) {
            this._min = min;
          }
          this.setAriaAttribute("valuemin", min);
        },

        /**
         * Get minimum possible value
         * @returns {number} the minimum value
         * @publicdoc
         */
        getMin: function() {
          return this._min;
        },

        /**
         * Define the maximum possible value
         * @param {number} max - the maximum value
         * @publicdoc
         */
        setMax: function(max) {
          if (Object.isNumber(max)) {
            this._max = max;
          }
          this.setAriaAttribute("valuemax", max);
        },

        /**
         * Get maximum possible value
         * @returns {number} the maximum value
         * @publicdoc
         */
        getMax: function() {
          return this._max;
        },

        /**
         * Define the spinedit step when increasing or decreasing value
         * @param {number} step - the step value
         * @publicdoc
         */
        setStep: function(step) {
          var s = step && parseInt(step, 10);
          if (!s || Number.isNaN(s)) {
            s = 1;
          }
          this._step = s;
        },

        /**
         * Get spinedit step when increasing or decreasing value
         * @returns {number} the step value
         * @publicdoc
         */
        getStep: function() {
          return this._step;
        },

        /**
         * Returns if max length of the widget has been reached
         * @returns {boolean} return true if max length is reached in input element
         */
        _isMaxLength: function() {
          return this._maxLength !== -1 && this._inputElement.value.length >= this._maxLength &&
            this._inputElement.selectionStart === this._inputElement.selectionEnd;
        },

        /**
         * Define the maximum number of characters allowed
         * @param {number} maxlength - maximum number of characters allowed in the field
         * @publicdoc
         */
        setMaxLength: function(maxlength) {
          if (maxlength) {
            this._maxLength = maxlength;
          }
        },

        /**
         * Get the maximum number of characters allowed
         * @returns {number} the maximum number of characters allowed in the field
         * @publicdoc
         */
        getMaxLength: function() {
          return this._maxLength;
        },

        /**
         * @inheritDoc
         */
        setReadOnly: function(readonly) {
          $super.setReadOnly.call(this, readonly);
          this._setInputReadOnly(readonly);
        },

        /**
         * Set input readonly attribute if it doesn't have focus or is noentry.
         * @param {boolean} readonly - true to set the edit part as read-only, false otherwise
         */
        _setInputReadOnly: function(readonly) {
          if (readonly) {
            this._inputElement.setAttribute('readonly', 'readonly');
          } else {
            this._inputElement.removeAttribute('readonly');
          }
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
        setTitle: function(title) {
          $super.setTitle.call(this, title);
          this._inputElement.setAttribute('title', title);
        },

        /**
         * @inheritDoc
         */
        getTitle: function() {
          return this._inputElement.getAttribute('title');
        },

        /** Place the cursor at the given position,
         * @param {number} cursor - first cursor position
         * @param {number=} cursor2 - second cursor position
         * @publicdoc
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          }
          if (cursor2 && cursor2 < 0) {
            cursor2 = ('' + this.getValue()).length;
          }
          this._inputElement.setCursorPosition(cursor, cursor2);
        },

        /**
         * Get cursors
         * @return {{start: number, end: number}} object with cursors
         * @publicdoc
         */
        getCursors: function() {
          var cursors = {
            start: 0,
            end: 0
          };
          if (this._inputElement && this._inputElement.value) {
            try {
              cursors.start = this._inputElement.selectionStart;
              cursors.end = this._inputElement.selectionEnd;
            } catch (ignore) {
              // Some input types don't allow cursor manipulation
            }
          }
          return cursors;
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
        },

        /**
         * @inheritDoc
         */
        setFontWeight: function(weight) {
          this.setStyle('input', {
            'font-weight': weight
          });
        },

        /**
         * @inheritDoc
         */
        getFontWeight: function() {
          return this.getStyle('input', 'font-weight');
        },

        /**
         * @inheritDoc
         */
        setFontStyle: function(style) {
          this.setStyle('input', {
            'font-style': style
          });
        },

        /**
         * @inheritDoc
         */
        getFontStyle: function() {
          return this.getStyle('input', 'font-style');
        },

        /**
         * @inheritDoc
         */
        setTextAlign: function(align) {
          this.setStyle('input', {
            'text-align': align
          });
        },

        /**
         * @inheritDoc
         */
        getTextAlign: function() {
          return this.getStyle('input', 'text-align');
        },

        /**
         * @inheritDoc
         */
        getTextDecoration: function() {
          return this.getStyle('input', 'text-decoration');
        },

        /**
         * @inheritDoc
         */
        setTextDecoration: function(decoration) {
          this.setStyle('input', {
            'text-decoration': decoration
          });
        },

        /**
         * overrided since aria-required is not valid on spinbutton role
         * @inheritDoc
         */
        setRequired: function(required) {
          $super.setRequired.call(this, required);
          this.setAriaAttribute("required", null);
        },
      };
    });
  });
