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

modulum('DateEditWidgetBase', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DateEdit widget Base class.
     * @class DateEditWidgetBase
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.DateEditWidgetBase = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.DateEditWidgetBase.prototype */ {
        __name: 'DateEditWidgetBase',

        /**
         * @inheritDoc
         */
        __dataContentPlaceholderSelector: '.gbc_dataContentPlaceholder',

        /**
         * Format used to display dates of the calendar
         * @type {?string}
         */
        _displayFormat: null,

        /**
         * Get list of sorted days depending of first day of the week which is defined
         * @type {Array}
         */
        _sortedDays: null,

        /**
         * Callback function used to disable days of calendar (framework api)
         * @type {function}
         */
        _disableDayFn: null,

        /**
         * Chinese format for date
         * @type {boolean}
         */
        _useMingGuoYears: false,

        /**
         * Current date momentjs object of the widget
         * @type {Object}
         */
        _dateObj: null,

        /**
         * Last valid date
         * @type {?string}
         */
        _validValue: null,

        /**
         * Indicates if current date of the calendar has been validated by user
         * @type {boolean}
         */
        _mustValid: false,
        /**
         * Max length of the input field
         * @type {number}
         */
        _maxLength: -1,
        /**
         * To detect if we selected a date using keyboard or mouse
         * @type {boolean}
         */
        _keyPressed: false,
        /**
         * Save last clicked date value. Needed to detect double click
         * @type {?string}
         */
        _lastClickValue: null,
        /**
         * Widget icon used to display/hide calendar
         * @type {HTMLElement}
         */
        _pikerIcon: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.setSingleLineContentOnly(true);
            this._layoutInformation.setReservedDecorationSpace(2);
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          if (this._displayFormat === null) {
            this._displayFormat = 'MM/DD/YYYY'; //default format
          }

          this._inputElement = this._element.getElementsByTagName('input')[0];
          this._pikerIcon = this._element.getElementsByTagName('i')[0];

          this._inputElement.on('input.DateEditWidgetBase', this._onInput.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._pikerIcon = null;
          if (this._inputElement) {
            this._inputElement.off('input.DateEditWidgetBase');
            this._inputElement.remove();
            this._inputElement = null;
          }

          $super.destroy.call(this);
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
         * Reset input field with last valid date
         */
        setLastValidValue: function() {
          if (this._inputElement) {
            this._inputElement.value = this._validValue;
          }
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
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              this._inputElement.removeAttribute('contentEditable');
            }
          } else {
            this._inputElement.removeAttribute('readonly');
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              // need to add this to be sure that user can enter text in the field
              // even if setCursorPosition is called before
              this._inputElement.setAttribute('contentEditable', 'true');
            }
          }
        },

        /**
         * Get the current dateedit value
         * @returns {string} the displayed value
         */
        getValue: function() {
          return this._inputElement.value;
        },

        /**
         * @inheritDoc
         */
        setValue: function(dateString, fromVM) {
          $super.setValue.call(this, dateString, fromVM);
          this.setDate(dateString);
        },

        /**
         * Return the current Date object
         * @returns {Object} returns current momentjs date object
         * @publicdoc
         */
        getDate: function() {
          return this._dateObj ? this._dateObj.format(this._displayFormat) : null;
        },

        /**
         * Generate momentjs date object from a string and set it for both the calendar component and the input field
         * @param {string} date - date value in string format
         * @publicdoc
         */
        setDate: function(date) {
          // created date object based on received value using known format (for datepicker)
          if (this._useMingGuoYears) { // Convert Ming Guo year to 4 digit years for datepicker
            var str = cls.DateTimeHelper.mingGuoToGregorianYears(date);
            this._dateObj = context.moment(str, this._displayFormat);
          } else {
            this._dateObj = context.moment(date, this._displayFormat);
          }

          // set non formatted value to input (already formatted by VM depending)
          if (this.getValue() !== date) {
            this._inputElement.value = date;
          }
        },

        /**
         * Set a specified format of date. Default is MM/DD/YYYY
         * @param {string} format - date format used to display and send date to the VM.
         * @publicdoc
         */
        setFormat: function(format) {
          var years = format && format.match(/Y/g);
          if (years && years.length === 3) { // Ming Guo format
            this._useMingGuoYears = true;
            format = format.replace('YYY', 'YYYY');
          }
          if (this._displayFormat !== format) {
            this._displayFormat = format;
          }
        },

        /**
         * Return date format
         * @returns {string} the date format
         * @publicdoc
         */
        getFormat: function() {
          return this._displayFormat;
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
            cursor2 = this.getValue() && this.getValue().length || 0;
          }
          this._inputElement.setCursorPosition(cursor, cursor2);
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
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          $super.setFocus.call(this, fromMouse);
          this._inputElement.domFocus();
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
        },

        /**
         * Define the maximum number of characters allowed
         * @param {number} maxlength - maximum number of characters allowed in the field
         * @publicdoc
         */
        setMaxLength: function(maxlength) {
          if (maxlength) {
            this._maxLength = maxlength;
            this._setElementAttribute('maxlength', maxlength, "_inputElement");
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
         * Defines a different image for the icon of the DateEdit
         * @param {string} icon - src of the image
         */
        setButtonIcon: function(icon) {
          if (icon) {
            var img = cls.WidgetFactory.createWidget('ImageWidget', this.getBuildParameters());
            var imgElem = img.getElement();
            img.setSrc(context.__wrapper.wrapResourcePath(icon), true);
            img.setTitle("Open picker");
            this._pikerIcon.classList.remove('zmdi', 'zmdi-calendar-blank', 'zmdi-calendar-clock');
            this.domAttributesMutator(function() {
              this._pikerIcon.innerHTML = imgElem.innerHTML;
              img.destroy();
            }.bind(this));
          }
        }
      };
    });
  });
