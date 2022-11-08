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

modulum('ComboBoxWidget', ['ComboBoxWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Combobox widget.
     * @class ComboBoxWidget
     * @memberOf classes
     * @extends classes.ComboBoxWidgetBase
     * @publicdoc Widgets
     */

    cls.ComboBoxWidget = context.oo.Class(cls.ComboBoxWidgetBase, function($super) {
      return /** @lends classes.ComboBoxWidget.prototype */ {
        __name: 'ComboBoxWidget',

        /** @type {string} */
        __dataContentPlaceholderSelector: '.gbc_dataContentPlaceholder',
        /** @type {classes.EditWidget}*/
        _editWidget: null,
        /** @type {classes.ListDropDownWidget} */
        _dropDown: null,
        /** @type {string} */
        _typedLetters: "",
        /** @function */
        _typedLettersCacheHandler: null,
        /** @function */
        _focusHandler: null,
        /** @function */
        _editFocusHandler: null,
        /** @function */
        _dropDownSelectHandler: null,
        /** @function */
        _visibilityChangeHandler: null,

        /** @type {HTMLElement} */
        _toggleIcon: null,

        /** @type {string} */
        _placeholderText: '',

        /** @type {string} */
        _currentValue: "",
        /** @type {string} */
        _lastVMValue: "",
        /** @type {boolean} */
        _allowMultipleValues: false,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.ComboBoxLayoutEngine(this);
            this._layoutInformation.setReservedDecorationSpace(2);
            this._layoutInformation.setSingleLineContentOnly(true);
          }
        },

        /**
         * Bind all events listeners on combobox and create the combobox dropdown
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this._toggleIcon = this.getElement().querySelector("i.toggle");

          this.setStyle('i.toggle', {
            'min-width': window.scrollBarSize + 'px',
          });

          this._editWidget = cls.WidgetFactory.createWidget('EditWidget', this.getBuildParameters());
          this._editWidget.setFocusable(false);
          this._editWidget.setParentWidget(this);
          this._element.prependChild(this._editWidget.getElement());

          this._dropDown = cls.WidgetFactory.createWidget('ListDropDown', this.getBuildParameters());
          this._dropDown.setParentWidget(this);
          this._dropDown.fallbackMaxHeight = 300;
          this._dropDown.hide();
          this._dropDownSelectHandler = this._dropDown.when(context.constants.widgetEvents.select, this._onSelectValue.bind(this));
          this._focusHandler = this.when(context.constants.widgetEvents.focus, this._onFocus.bind(this));
          this._dropDown.onClose(this._onFocus.bind(this));
          this._dropDown.onClose(this._onClose.bind(this));

          this._editWidget._inputElement.on('blur.ComboBoxWidget', this._onBlur.bind(this));
          this._editFocusHandler = this._editWidget.when(context.constants.widgetEvents.requestFocus,
            this._onEditRequestFocus.bind(this));

          this._visibilityChangeHandler = this._dropDown
            .when(context.constants.widgetEvents.visibilityChange, this._updateEditState.bind(this));

          this.setAriaAttribute("owns", this._dropDown.getRootClassName());
          this.setAriaAttribute("labelledby", this._editWidget.getRootClassName());
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._focusHandler) {
            this._focusHandler();
            this._focusHandler = null;
          }
          if (this._editFocusHandler) {
            this._editFocusHandler();
            this._editFocusHandler = null;
          }
          if (this._dropDownSelectHandler) {
            this._dropDownSelectHandler();
            this._dropDownSelectHandler = null;
          }
          if (this._visibilityChangeHandler) {
            this._visibilityChangeHandler();
            this._visibilityChangeHandler = null;
          }

          this._editWidget._inputElement.off('blur.ComboBoxWidget');

          if (this._dropDown) {
            this._dropDown.destroy();
            this._dropDown = null;
          }

          this._typedLettersCacheHandler = null;

          this._editWidget.destroy();
          this._editWidget = null;
          $super.destroy.call(this);
        },

        /**
         * Set widget mode. Useful when widget have peculiar behavior in certain mode
         * @param {string} mode the widget mode
         * @param {boolean} active the active state
         */
        setWidgetMode: function(mode, active) {
          this._allowMultipleValues = mode === "Construct";
          this._dropDown.allowMultipleChoices(this._allowMultipleValues);
          this._updateEditState();
          this._updateTextTransform();
        },

        /**
         * Returns whether or not the user should be able to input data freely
         * @return {boolean} true if user can input data
         */
        canInputText: function() {
          return $super.canInputText.call(this) && this._allowMultipleValues;
        },

        /**
         * format the value
         * @param {string} value value
         * @return {string} the formatted value
         * @private
         */
        _getFormattedValue: function(value) {
          var allResolved = true,
            values = (value || "").split("|").map(function(itemValue) {
              var found = this._dropDown.findByValue(itemValue);
              allResolved = allResolved && (Boolean(found) || itemValue === "");
              return found && found.text || itemValue;
            }.bind(this));
          if (values[0] === "") {
            values.splice(0, 1);
          }
          return allResolved ? values.join("|") : value;
        },

        /**
         * Handler when focus is requested
         * @param event
         * @param sender
         * @param domEvent
         */
        _onEditRequestFocus: function(event, sender, domEvent) {
          this.emit(context.constants.widgetEvents.requestFocus, domEvent);
        },

        /**
         * update the edit value from the widget value
         * @private
         */
        _updateEditValue: function() {
          this._editWidget.setValue(this._getFormattedValue(this._currentValue));
        },
        /**
         * update edit availability
         * @private
         */
        _updateEditState: function() {
          var readOnly = this._dropDown.isVisible() || !this.canInputText();
          this._editWidget.setReadOnly(readOnly);
          this.domAttributesMutator(function(readonly) {
            this._editWidget._inputElement.setAttribute('contentEditable', readonly ? 'false' : 'true');
          }.bind(this, readOnly));
        },

        /**
         * Handler once dropdown is closed
         * @private
         */
        _onClose: function() {
          this._toggleIcon.toggleClass("dd-open", this._dropDown.isVisible());
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this._onRequestFocus(domEvent); // request focus
          if (this.isEnabled()) {
            this._dropDown.show();
            this._toggleIcon.toggleClass("dd-open", this._dropDown.isVisible());
          }
          return true;
        },

        /**
         * Focus handler
         * @private
         */
        _onFocus: function() {
          if (this._editWidget && this.isEnabled()) {
            this._editWidget.getInputElement().domFocus();
          }
        },

        /**
         * Blur handler
         * @private
         */
        _onBlur: function() {
          if (!this._dropDown.isVisible()) {
            this.emit(context.constants.widgetEvents.blur);
          } else if (!this.hasFocus()) {
            this._dropDown.hide();
          }
        },
        /**
         * when value is selected in the dropdown
         * @param event
         * @param src
         * @param value
         * @private
         */
        _onSelectValue: function(event, src, value) {
          this.setEditing(true);
          this.setValue(value);
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;
          if (this._dropDown.isVisible()) {
            keyProcessed = this._dropDown.managePriorityKeyDown(keyString, domKeyEvent, repeat);
          }

          if (keyProcessed) {
            return true;
          }
          return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
        },

        /**
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled()) {
            // we call managePriorityKeyDown method on the closed combobox to select item using same navigation logic
            keyProcessed = this._dropDown.managePriorityKeyDown(keyString, domKeyEvent, repeat);

            if (!keyProcessed) {
              // auto item preselection by name
              keyProcessed = this._processKey(domKeyEvent, keyString);
            }
          }

          if (keyProcessed) {
            return true;
          }
          return $super.manageKeyDown.call(this, keyString, domKeyEvent, repeat);
        },

        /**
         * Process one key event
         * @param {Object} event
         * @param {string} keyString
         * @returns {boolean} true if key has been processed, false otherwise
         * @private
         */
        _processKey: function(event, keyString) {
          if (event.which <= 0) { // arrows key (for firefox)
            return false;
          }
          var key = event.gbcKey;

          if (key.length > 1) { // we only want single char
            return false;
          }
          if (this._typedLettersCacheHandler) {
            this._clearTimeout(this._typedLettersCacheHandler);
            this._typedLettersCacheHandler = 0;
          }
          if (!this._dropDown.isVisible()) {
            if (this.canInputText()) {
              return false;
            }
          }
          var found, lastChar = key.toLocaleLowerCase(),
            repeating = this._typedLetters[this._typedLetters.length - 1] === lastChar;
          this._typedLettersCacheHandler = this._registerTimeout(this._clearTypedLettersCache.bind(this), 1000);
          if (repeating) {
            found = this._dropDown.findStartingByText(this._typedLetters, true);
            if (found && found.value === this._currentValue) {
              found = null;
            }
          }
          if (!found || !repeating) {
            this._typedLetters += lastChar;
            found = this._dropDown.findStartingByText(this._typedLetters);
          }
          if (!found) {
            this._typedLetters = lastChar;
            found = this._dropDown.findStartingByText(this._typedLetters);
          }
          if (found) {
            this._dropDown.navigateToItem(found);
            if (!this._dropDown.isVisible()) {
              this.setEditing(this._oldValue !== found.value);
              this.setValue(found.value);
            }
            return true;
          }
          return false;
        },

        /**
         * Clear the cache of typed letters
         * @private
         */
        _clearTypedLettersCache: function() {
          this._typedLettersCacheHandler = 0;
          this._typedLetters = "";
        },

        /**
         * Get the value of the dropdown list at given position
         * @param {number} pos - position in the dropdown
         * @return {*} value at given position
         * @publicdoc
         */
        getValueAtPosition: function(pos) {
          return this._dropDown.getValueAtPosition(pos);
        },

        /**
         * get the available items
         * @return {Object[]}
         */
        getItems: function() {
          return this._dropDown.getItems();
        },

        /**
         * set combobox choice(s)
         * @param {ListDropDownWidgetItem|ListDropDownWidgetItem[]} choices - a single or a list of choices
         * @publicdoc
         */
        setChoices: function(choices) {
          var list = choices;
          if (!Array.isArray(choices)) {
            list = choices ? [choices] : [];
          }
          this._dropDown.setItems(list);
          if (this._dropDown.isVisible()) {
            this._dropDown.setSelectedValues(this.getValue());
            this._dropDown.setCurrentValue(this.getValue());
          }
          this._updateSelectedValue();
          if (this._layoutEngine) {
            this._layoutEngine.invalidateMeasure();
          }
        },
        /**
         * update edit value
         * @private
         */
        _updateSelectedValue: function() {
          var selectedValue = this.isEditing() ? this._editWidget.getValue() : this._lastVMValue,
            foundInList = this._dropDown.findByValue(selectedValue);
          this._currentValue = foundInList && foundInList.value || "";
          if (!foundInList) {
            this._editWidget.setValue('');
          } else {
            this._editWidget.setValue(foundInList.text);
          }
        },

        /**
         * Display the dropdown
         * @publicdoc
         */
        showDropDown: function() {
          this.emit(context.constants.widgetEvents.requestFocus, null);
          this._dropDown.show();
        },

        toggleDropDown: function() {
          this._dropDown.toggle();
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          var editValue = this.getEditValue(),
            formattedValue = this._getFormattedValue(this._currentValue);
          return this.canInputText() && !this._dropDown.isVisible() &&
            editValue !== formattedValue ? editValue : this._currentValue || "";
        },

        /**
         * @inheritDoc
         */
        getClipboardValue: function() {
          var value = this._dropDown.getCurrentValue();
          var item = this._dropDown.findByValue(value);
          return item ? item.text : value;
        },

        /**
         * get the edit value
         * @return {string}
         */
        getEditValue: function() {
          return this._editWidget && this._editWidget.getValue() || "";
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          $super.setValue.call(this, value, fromVM);
          if (fromVM) {
            if (this._editWidget) {
              this._editWidget.setEditing(false);
            }
            this._lastVMValue = value;
          }
          this._setValue(value, fromVM);
        },

        /**
         * Internal setValue used to be inherited correctly by OtherWidget
         * @param {string} value - the value
         * @param {boolean} [fromVM] - is value come from VM ?
         * @private
         */
        _setValue: function(value, fromVM) {
          var currentValue, valueChanged = false;
          if (this._allowMultipleValues) {
            if (this._dropDown.isVisible()) {
              if (fromVM) {
                this._currentValue = value;
                this._updateEditValue();
              } else {
                var values = this._currentValue === "" ? [] : this._currentValue.split("|");
                var existingIndex = values.indexOf(value);
                if (existingIndex >= 0) {
                  values.splice(existingIndex, 1);
                } else {
                  values.push(value);
                }
                values = this._dropDown.sortValues(values);
                this._currentValue = values.join("|");
                valueChanged = true;
                this._updateEditValue();
              }
              this._dropDown.setSelectedValues(this._currentValue);
            } else {
              currentValue = this._currentValue || "";
              if (currentValue !== value) {
                this._currentValue = value;
                this._dropDown.setCurrentValue(value);
                this._updateEditValue();
                valueChanged = true;
              }
              if (!fromVM && valueChanged) {
                this.emit(context.constants.widgetEvents.change, false);
              }
            }
          } else {
            currentValue = this._currentValue || "";
            if (currentValue !== value) {
              var found = this._dropDown.findByValue(value);
              this._currentValue = found && found.value || "";
              this._dropDown.setCurrentValue(this._currentValue);
              this._editWidget.setValue(found ? found.text : "");
              valueChanged = true;
            }
          }
          if (!fromVM && valueChanged) {
            this.emit(context.constants.widgetEvents.change, false);
          }
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          $super.setFocus.call(this, fromMouse);
          if (this._editWidget) {
            this._editWidget.getInputElement().domFocus();
          } else {
            this._element.domFocus();
          }
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._editWidget.setEnabled(enabled);
          this._updateEditState();
          this._updateEditValue();
          this._dropDown.setEnabled(enabled);
        },

        /**
         * sets the combobox as query editable
         * @param {boolean} isQueryEditable
         */
        setQueryEditable: function(isQueryEditable) {
          this._isQueryEditable = isQueryEditable;
          this._updateEditState();
          this._updateTextTransform();
        },

        /**
         * @inheritDoc
         */
        setColor: function(color) {
          $super.setColor.call(this, color);
          this._editWidget.setColor(color);
          if (this._dropDown) {
            this._dropDown.setColor(color);
          }
        },

        /**
         * @inheritDoc
         */
        getColorFromStyle: function() {
          return this._editWidget.getColorFromStyle();
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          $super.setBackgroundColor.call(this, color);
          this._editWidget.setBackgroundColor(color);
          if (this._dropDown) {
            this._dropDown.setBackgroundColor(color);
          }
        },

        /**
         * @inheritDoc
         */
        setFontWeight: function(weight) {
          $super.setFontWeight.call(this, weight);
          this._editWidget.setFontWeight(weight);
          if (this._dropDown) {
            this._dropDown.setFontWeight(weight);
          }
        },

        /**
         * @inheritDoc
         */
        setFontFamily: function(fontFamily) {
          $super.setFontFamily.call(this, fontFamily);
          if (this._dropDown) {
            this._dropDown.setFontFamily(fontFamily);
          }
        },

        /**
         * @inheritDoc
         */
        setFontStyle: function(style) {
          $super.setFontStyle.call(this, style);
          this._editWidget.setFontStyle(style);
          if (this._dropDown) {
            this._dropDown.setFontStyle(style);
          }
        },

        /**
         * @inheritDoc
         */
        setTextAlign: function(align) {
          $super.setFontAlign.call(this, align);
          this._editWidget.setTextAlign(align);
          if (this._dropDown) {
            this._dropDown.setTextAlign(align);
          }
        },

        /**
         * @inheritDoc
         */
        removeTextTransform: function() {
          $super.removeTextTransform.call(this);
          this._editWidget.removeTextTransform();
        },
        /**
         * @inheritDoc
         */
        _updateTextTransform: function() {
          var wantedTextTransform = this.canInputText() ? this._textTransform : "none";
          if (wantedTextTransform !== this._editWidget.getTextTransform()) {
            this._editWidget.removeTextTransform();
            this._editWidget.setTextTransform(wantedTextTransform);
          }
        },

        /**
         * @inheritDoc
         */
        setTextDecoration: function(decoration) {
          $super.setTextDecoration.call(this, decoration);
          this._editWidget.setTextDecoration(decoration);
        },

        /**
         * Handle a null item if notNull is not specified
         * @param {boolean} notNull - combobox accept notNull value?
         * @publicdoc
         */
        setNotNull: function(notNull) {
          $super.setNotNull.call(this, notNull);
          this._dropDown.setNotNull(notNull);
        },

        /**
         * @inheritDoc
         */
        setPlaceHolder: function(placeholder) {
          $super.setPlaceHolder.call(this, placeholder);
          this._editWidget.setPlaceHolder(placeholder);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ComboBox', cls.ComboBoxWidget);
    cls.WidgetFactory.registerBuilder('ComboBoxWidget', cls.ComboBoxWidget);
  });
