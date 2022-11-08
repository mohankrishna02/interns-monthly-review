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

modulum('EditWidget', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Edit widget.
     * @class EditWidget
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.EditWidget = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.EditWidget.prototype */ {

        __name: 'EditWidget',

        _completerCurrentChildrenChangeHandler: null,

        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        _completerWidget: null,
        _inputType: 'text',
        _maxLength: -1,
        _displayFormat: null,

        _title: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation._fixedSizePolicyForceMeasure = true;
            this._layoutInformation.setSingleLineContentOnly(true);
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName('input')[0];

          // needed for completer
          this._inputElement.on('blur.EditWidget', this._onBlur.bind(this));
          this._inputElement.on('input.EditWidget', this._onInput.bind(this));

          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.EditWidget', cls.WidgetBase._onSelect.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._inputElement) {
            this._inputElement.off('input.EditWidget');
            this._inputElement.off('mousedown.EditWidget');
            this._inputElement.off('blur.EditWidget');
            this._inputElement.remove();
            this._inputElement = null;
          }
          if (this._completerWidget) {
            this._completerWidget.destroy();
            this._completerWidget = null;
            if (this._completerCurrentChildrenChangeHandler) {
              this._completerCurrentChildrenChangeHandler();
              this._completerCurrentChildrenChangeHandler = null;
            }
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this._onRequestFocus(domEvent);
          return true;
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.hasCompleter()) {
            keyProcessed = this.getCompleterWidget().managePriorityKeyDown(keyString, domKeyEvent, repeat);
          }

          this._updateCapsLockWarning();

          if (keyProcessed) {
            return true;
          } else {
            return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * @inheritDoc
         */
        manageKeyUp: function(keyString, domKeyEvent) {
          $super.manageKeyUp.call(this, keyString, domKeyEvent);

          this.emit(context.constants.widgetEvents.keyUp, domKeyEvent, true);
        },

        /**
         * @inheritDoc
         */
        _onInput: function() {
          $super._onInput.call(this);

          // sometimes we have to display dropdown again without VM interaction
          // case occurs when we select an item, close dropdown and rollback selected item. In this case
          if (this._completerWidget &&
            this.getValue() &&
            this.getValue() === this._oldValue &&
            !this._completerWidget.isVisible()) {
            this._completerWidget.show();
          }

          // TODO this code should probably be moved in FieldWidgetBase when fix GBC-2088
          // IE11 bug : input event being raised on edit click. Try to catch this specific case by testing if value changed and field doesn't have VM focus yet.
          if (!window.browserInfo.isIE || this.getValue() !== this._oldValue || this.hasVMFocus()) {
            this.emit(context.constants.widgetEvents.change, true);
          }
        },

        /**
         * Blur handler
         * @param {Object} event
         * @private
         */
        _onBlur: function(event) {
          this.emit(context.constants.widgetEvents.blur, event);
        },

        /**
         * @inheritDoc
         */
        setReadOnly: function(readonly) {
          if (this._isReadOnly !== readonly) {
            $super.setReadOnly.call(this, readonly);
            this._setInputReadOnly(readonly);
          }
        },

        /**
         * Set input readonly attribute if it doesn't have focus or is noentry.
         * @param {boolean} readonly - true to set the edit part as read-only, false otherwise
         */
        _setInputReadOnly: function(readonly) {
          this._setElementAttribute('readonly', readonly ? 'readonly' : null, "_inputElement");
        },

        /**
         * Defines the Edit's maximum number of characters allowed
         * @param {number} maxlength maximum number of characters allowed in the field
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
         * Defines the alignment of the text in the input
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @param {string} align - a CSS text alignment. null restores the default value.
         * @publicdoc
         */
        setTextAlign: function(align) {
          this._textAlign = align;
          this.setStyle('>input', {
            'text-align': align
          });

          //only when focus
          align = this.isEnabled() ? this.getStart() : align;
          //not when number type
          align = this.isNumber() ? this.getEnd() : align;

          this.setStyle('>input:focus', {
            'text-align': align
          });
        },

        /**
         * Define the 'size' attribute of the input
         * @param {number} cols - size attribute
         * @publicdoc
         */
        setCols: function(cols) {
          this._inputElement.setAttribute('size', cols);
        },

        /**
         * Get the alignment of the text
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @returns {string} a CSS text alignment
         * @publicdoc
         */
        getTextAlign: function() {
          return this.getStyle('>input', 'text-align');
        },

        /**
         * Check if the widget format is number
         * @return {boolean} true if the widget format is number, false otherwise
         */
        isNumber: function() {
          var regex = /SMALLINT|INTEGER|BIGINT|INT|DECIMAL|MONEY|SMALLFLOAT|FLOAT/g;
          var match = regex.exec(this.getDisplayFormat());
          return Boolean(match);
        },

        /**
         * Get the display format if any
         * @return {?string} the display format
         * @publicdoc
         */
        getDisplayFormat: function() {
          return this._displayFormat;
        },

        /**
         * Set current display format to use on each set value
         * @param {string} format - display format
         * @publicdoc
         */
        setDisplayFormat: function(format) {
          this._displayFormat = format;
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          $super.setValue.call(this, value, fromVM);
          if (window.browserInfo.isSafari) {
            // This hack is required to fix GBC-1362. Safari doesn't display uppercased text if the value of the field hasn't changed
            // We force a temporary different value. This can be removed once this bug is fixed : https://bugs.webkit.org/show_bug.cgi?id=171050
            this._inputElement.value = value + ' ';
          }
          this._inputElement.value = value;
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          if (this._inputElement) {
            var result = this._inputElement.value;
            if (this.isEditing()) {
              if (this.getTextTransform() === 'up') {
                result = result.toLocaleUpperCase();
              }
              if (this.getTextTransform() === 'down') {
                result = result.toLocaleLowerCase();
              }
            }
            return result;
          }
          return null;
        },

        /**
         * Set the cursors
         * When cursor2 === cursor, it is a simple cursor set
         * @param {number} cursor - the selection range beginning (-1 for end)
         * @param {number=} [cursor2] - the selection range end, if any
         * @publicdoc
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          }
          if (cursor2 && cursor2 < 0) {
            cursor2 = this.getValue() && this.getValue().length || 0;
          }

          if (this.isInTable() && !this.isEnabled()) { // fix for GBC-1170
            cursor = cursor2 = 0;
          }
          this._element.toggleClass('noTextSelection', this.isInTable() && !this.isEnabled());

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
         * Set field as a password (displays bullets instead of value)
         * @param {boolean} isPassword - true if the widget should be in 'password' mode, false otherwise
         * @publicdoc
         */
        setIsPassword: function(isPassword) {
          if (isPassword) {
            this._inputElement.setAttribute('type', 'password');
          } else {
            this._inputElement.setAttribute('type', 'text');
            this.setType(this._inputType);
          }
          this.toggleClass("gbc_isPassword", Boolean(isPassword));
        },

        /**
         * Check if field is set as password
         * @returns {boolean} true if the widget is in 'password' mode, false otherwise
         * @publicdoc
         */
        isPassword: function() {
          return this._inputElement.getAttribute('type') === 'password';
        },

        /**
         * Display or not the caps lock warning
         * @private
         */
        _updateCapsLockWarning: function() {
          if (this.isPassword()) {
            // Check if caps lock is on, and display accordingly
            if (!window.browserInfo.isSafari) { // Safari add this by itself
              this.removeClass("capsOn");
              if (window._capsLock) {
                this.addClass("capsOn");
              }
            }
          }
        },

        /**
         * Check if max length of the widget has been reached
         * @returns {boolean} return true if max length is reached in input element
         */
        _isMaxLength: function() {
          return this._maxLength !== -1 && this._inputElement.value.length >= this._maxLength &&
            this._inputElement.selectionStart === this._inputElement.selectionEnd;
        },

        /**
         * Used to manage the keyboardHint.
         * @param {string} valType the type attribute value to set
         * @publicdoc
         */
        setType: function(valType) {
          this._inputType = valType;
          if (!this.isPassword()) {
            this._inputElement.setAttribute('type', valType);
            if (window.browserInfo.isFirefox) {
              // sad old browser patch
              this._inputElement.setAttribute('step', valType === 'number' ? 'any' : null);
            }
          }
        },

        /**
         * Get the type of the field
         * @returns {string} this Edit current type
         * @publicdoc
         */
        getType: function() {
          return this._inputType;
        },

        /**
         * Sets the focus to the widget
         * @publicdoc
         */
        setFocus: function(fromMouse) {
          $super.setFocus.call(this, fromMouse);
          this._inputElement.domFocus();
          this._updateCapsLockWarning();

          if (this.isFakePlaceholder() && this._title &&
            ((window.isMobile() && context.ThemeService.getValue("gbc-Edit-mobile-comment-to-placeholder") === '1') ||
              (!window.isMobile() && context.ThemeService.getValue("gbc-Edit-desktop-comment-to-placeholder") === '1'))) {
            this.setPlaceHolder(this._title, true);
          }
        },

        /**
         * @inheritDoc
         */
        loseVMFocus: function() {
          $super.loseVMFocus.call(this);
          if (this.isFakePlaceholder()) {
            this.setPlaceHolder("", true);
          }
        },

        /**
         * @inheritDoc
         */
        loseFocus: function() {
          $super.loseFocus.call(this);
          if (this.isFakePlaceholder()) {
            this.setPlaceHolder("", true);
          }
        },

        /**
         * Check if the Edit Widget has a completer
         * @return {boolean} true if has a completer, false otherwise
         */
        hasCompleter: function() {
          return this.getCompleterWidget() !== null;
        },

        /**
         * Get the completer widget if any
         * @return {?classes.CompleterWidget} the completer widget, null if none
         * @publicdoc
         */
        getCompleterWidget: function() {
          return this._completerWidget;
        },

        /**
         * Will add a completer to the edit
         * @publicdoc
         */
        addCompleterWidget: function() {
          if (!this._completerWidget) {
            this._completerWidget = cls.WidgetFactory.createWidget('Completer', this.getBuildParameters());
            this._completerWidget.addCompleterWidget(this);
            this._completerCurrentChildrenChangeHandler = this._completerWidget.onCurrentChildrenChange(function(value) {
              this.setEditing(this._oldValue !== value);
              this.setValue(value);
            }.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          if (this._textAlign) {
            this.setTextAlign(this._textAlign);
          }
        },

        /**
         * @inheritDoc
         */
        setTitle: function(title) {
          $super.setTitle.call(this, title);

          if (title === "") {
            this._inputElement.removeAttribute("aria-label");
            this._title = null;
          } else {
            this._inputElement.setAttribute("aria-label", title);
            this._title = title;
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Edit', cls.EditWidget);
    cls.WidgetFactory.registerBuilder('EditWidget', cls.EditWidget);
  });
