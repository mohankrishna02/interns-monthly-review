/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FieldWidgetBase', ['TextWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Base class for genero formfield widgets
     * @class FieldWidgetBase
     * @memberOf classes
     * @publicdoc Widgets
     * @extends classes.TextWidgetBase
     */
    cls.FieldWidgetBase = context.oo.Class(cls.TextWidgetBase, function($super) {
      return /** @lends classes.FieldWidgetBase.prototype */ {
        __name: "FieldWidgetBase",
        /**
         * Flag for augmentedFace
         * @type {boolean}
         */
        __virtual: true,

        /**
         * List of values through time
         * @type {Array}
         */
        _valueStack: null,

        /**
         * Flag to know if the placeholder contain the real one (it could be the comment)
         * @type {boolean}
         */
        _isFakePlaceholder: true,

        /**
         * true if widget has pending changes
         * @type {boolean}
         */
        _editing: false,

        /**
         * true if widget is readOnly and can't be edited nor focused
         * @type {boolean}
         * */
        _isReadOnly: false,

        /**
         * the input element
         * @protected
         * @type {HTMLElement}
         */
        _inputElement: null,

        /**
         * Indicates if key event handlers are bound
         */
        _keyEventsBound: false,

        /***
         * Time of the last widget modification
         * @type {number}
         */
        _editingTime: 0,

        /**
         * Position of the current value in the stack
         * @type {Number}
         */
        _valueStackCursor: -1,

        /**
         * Old value, used by typeahead
         * @type {?string}
         */
        _oldValue: null,

        /**
         * true if widget should not be editable but navigation is possible
         * @type {boolean}
         */
        _notEditable: false,

        /**
         * true if widget requires a value
         * @type {boolean}
         */
        _required: false,

        /**
         * true if widget is set as not Null
         * @type {boolean}
         */
        _notNull: false,

        /**
         * List of possible values for the widget
         * @type {?Array}
         */
        _include: null,

        /**
         * Flag to check if the mouse button is currently pressed
         * @type {boolean}
         */
        _isMousePressed: false,

        /**
         * @constructs
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setEnabled(false, true);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._valueStack = [];
          if (window.isMobile()) {
            var inputElement = this._element.getElementsByTagName('input')[0];
            if (inputElement) {
              // Track the focus and mouse down/up events on mobile devices to handle the virtual keybord's TAB key
              inputElement.on('focus.FieldWidgetBase', this._onMobileFocus.bind(this));
              inputElement.on('mousedown.FieldWidgetBase', this._onMobileMouseDown.bind(this));
              inputElement.on('mouseup.FieldWidgetBase', this._onMobileMouseUp.bind(this));
            }
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);

          this._valueStack = null;
          this._oldValue = null;

          this.unbindKeyEvents();
          this._keyEventsBound = false;

          if (this._inputElement && this.isNotEditable()) {
            this._inputElement.off('drop.FieldWidgetBase_notEditable');
          }
          if (this._inputElement && window.isMobile()) {
            this._inputElement.off('focus.FieldWidgetBase');
            this._inputElement.off('mousedown.FieldWidgetBase');
            this._inputElement.off('mouseup.FieldWidgetBase');
          }
          this._inputElement = null;
        },

        /**
         * @inheritDoc
         */
        _afterInitElement: function() {
          $super._afterInitElement.call(this);

          this.bindKeyEvents();
          this._keyEventsBound = true;
        },

        /**
         * Get the input part of the widget
         * @return {HTMLElement} the input part of the widget
         * @publicdoc
         */
        getInputElement: function() {
          return this._inputElement;
        },

        /**
         * Check if the widget has an input element
         * @return {boolean} true if widget has an input element
         * @publicdoc
         */
        hasInputElement: function() {
          return Boolean(this.getInputElement());
        },

        /**
         * Bind all keys events of the widget (done when the widget becomes active)
         * @protected
         */
        bindKeyEvents: function() {},
        /**
         * Unbind all keys events of the widget (done when the widget becomes inactive or in typeahead)
         * @protected
         */
        unbindKeyEvents: function() {},

        /**
         * Set the value of widget
         * @param {string|number} value - sets the value to display
         * @param {boolean} [fromVM] - true if value comes from the VM
         * @publicdoc
         */
        setValue: function(value, fromVM) {
          if (this.hasCursors() && !fromVM) { // only widgets with cursors manage undo/redo
            this._valueStack.push(value);
            this._valueStackCursor++;
          }

          if (fromVM) {
            if (this.getValue() !== value) {
              this._valueStack = [value];
              this._valueStackCursor = 0;
            } else {
              this._valueStack.push(value);
              this._valueStackCursor++;
            }
            this._oldValue = value;
          }
          if (this._valueStack.length > 30) {
            this._valueStack.shift();
            this._valueStackCursor--;
          }
        },

        /**
         * Internal setValue to change value without any event emited
         * @param {string} value - the value
         * @private
         */
        _setValue: function(value) {
          if (this._inputElement) {
            this._inputElement.value = value;
          }
        },

        /**
         * Handle input event to manage
         *  - set editing
         *  - shift attribute (textTransform !== none)
         * @private
         */
        _onInput: function() {
          if (this.isNotEditable()) {
            // If not editable, rollback to old value (the initial one)
            this._inputElement.value = this._oldValue;
          } else {
            this._editingTime = Date.now();
            this.setEditing(this.isEditing() || this.getValue() !== this._oldValue);
            if (this.isEditing() && this._textTransform !== 'none' && this.hasInputElement()) {
              var start = this._inputElement.selectionStart;
              var end = this._inputElement.selectionEnd;
              this._inputElement.value = this.getValue();
              this._inputElement.setCursorPosition(start, end);
            }

          }
        },

        /**
         * Handle drop event
         * @param evt
         * @private
         */
        _onDrop: function(evt) {
          if (this.isNotEditable()) {
            evt.preventCancelableDefault();
          }
        },

        /**
         * NotEditable allows cursor moving, but not a value change
         * @param {boolean} notEditable - true to set the edit part as read-only
         */
        setNotEditable: function(notEditable) {
          this._notEditable = notEditable;
          if (this._inputElement) {
            if (notEditable) {
              this._inputElement.on('drop.FieldWidgetBase_notEditable', this._onDrop.bind(this));
            } else {
              this._inputElement.off('drop.FieldWidgetBase_notEditable');
            }
          }
        },

        /**
         * NotEditable allows cursor moving, but not a value change
         * @return {boolean} true if the edit part is not editable
         */
        isNotEditable: function() {
          return this._notEditable;
        },

        /**
         * Set the widget validation to 'required'
         * @param {boolean} required - true if a value is required
         */
        setRequired: function(required) {
          this._required = required;
          this.toggleClass("gbc_Required", required);
          this.setAriaAttribute("required", required.toString());
        },

        /**
         * Verify if the widget value is required
         * @return {boolean} true if a value is required
         */
        isRequired: function() {
          return this._required;
        },

        /**
         * Verify if the placeholder is the real one
         * @return {boolean} true if it is a fake placeholder
         */
        isFakePlaceholder: function() {
          return this._isFakePlaceholder;
        },

        /**
         * Set the widget validation to noNull
         * @param {boolean} notNull - false if the widget value can be null, true otherwise
         */
        setNotNull: function(notNull) {
          this._notNull = notNull;
          this.toggleClass("gbc_NotNull", notNull);
        },

        /**
         * Verify if the widget can be null
         * @return {boolean} false if the widget value can be null, true otherwise
         */
        isNotNull: function() {
          return this._notNull;
        },

        /**
         * Get the list of allowed values defined by INCLUDE list
         * @param {Array|null} include - list of allowed values or null if not defined
         */
        setAllowedValues: function(include) {
          this._include = include;
        },

        /**
         * Get the list of allowed values defined by INCLUDE list
         * @return {Array|null} list of allowed values or null if not defined
         */
        getAllowedValues: function() {
          return this._include;
        },

        /**
         * Prevent value change but allow navigation
         * @param {Event} evt the browser event
         * @param {string} keyString the string representation of the key sequence
         * @private
         */
        _preventEditAllowNavigation: function(evt, keyString) {
          var prevent = ["ctrl+x", "ctrl+v", "meta+x", "meta+v"].contains(keyString); // CTRL+X & CTRL+V forbidden
          prevent = prevent || (["tab", "home", "end", "left", "right", "up", "down", "shift+left", "shift+right", "ctrl+c",
            "ctrl+a",
            "meta+c", "meta+a"
          ].contains(
            keyString) === false);

          if (prevent) {
            evt.preventCancelableDefault();
            this.flash();
          }
        },

        /**
         * Get the value of the widget
         * @returns {?string|number} the value
         * @publicdoc
         */
        getValue: function() {
          return null;
        },

        /**
         * @inheritDoc
         */
        getClipboardValue: function() {
          return this.getValue();
        },

        /**
         * Define the widget as readonly or not
         * @param {boolean} readonly - true to set the widget as readonly without possibility of edition, false otherwise
         * @publicdoc
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
        },

        /**
         * Check if the widget is readonly or not
         * @returns {boolean} true if the widget is readonly, false otherwise
         * @publicdoc
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },

        /**
         * @returns {number} time of the last widget modification
         */
        getEditingTime: function() {
          return this._editingTime;
        },

        /**
         * Check if widget is currently editing
         * @return {boolean}
         */
        isEditing: function() {
          return this._editing;
        },

        /**
         * Flag or unflag widget as having value pending changes
         * @param editing {boolean} the new editing state
         * @publicdoc
         */
        setEditing: function(editing) {
          this._editing = editing;
          if (this.getElement()) {
            this.getElement().toggleClass("editing", Boolean(editing));
          }
        },

        /**
         * Returns if the widget is focusable
         * @return {boolean} State of focusable
         * @publicdoc
         */
        isFocusable: function() {
          return this.hasInputElement() || $super.isFocusable.call(this);
        },

        /**
         * Tests if the widget has really the DOM focus (check document.activeElement)
         * @returns {boolean} true if the widget has the DOM focus
         * @publicdoc
         */
        hasDOMFocus: function() {
          return (this.hasInputElement() && this.getInputElement() === document.activeElement) ||
            $super.hasDOMFocus.call(this);
        },

        /**
         * Defines the enabled status of the widget
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         * @publicdoc
         */
        setEnabled: function(enabled, noSelectionUpdate) {
          if (this._enabled !== enabled) {
            this._enabled = Boolean(enabled);
            this.domAttributesMutator(function(noSelectionUpdate) {
              if (this._enabled) {
                this.removeClass("disabled");
                if (this.hasInputElement() && !this.isReadOnly()) {
                  this.getInputElement().removeAttribute("readonly");
                }
              } else {
                this.addClass("disabled");
                if (!noSelectionUpdate) {
                  if (this.hasCursors()) {
                    this.setCursors(0);
                    this.afterDomMutator(function() {
                      var selection = window.getSelection();
                      if (selection) {
                        var hasTextSelection = selection.focusNode === this._element;
                        if (hasTextSelection) {
                          selection.removeAllRanges();
                        }
                      }
                    }.bind(this));
                  }
                }
                if (this.hasInputElement()) {
                  this.getInputElement().setAttribute("readonly", "readonly");
                }
              }
            }.bind(this, noSelectionUpdate));
          }
          // bind/unbind keys events
          if (enabled && (this.isNotEditable && !this.isNotEditable() || this.isReadOnly && !this.isReadOnly())) {
            if (!this._keyEventsBound) {
              this._keyEventsBound = true;
              this.bindKeyEvents();
            }
          } else {
            if (this._keyEventsBound) {
              this._keyEventsBound = false;
              this.unbindKeyEvents();
            }
          }
        },

        /**
         * @inheritDoc
         */
        loseVMFocus: function() {
          $super.loseVMFocus.call(this);
          this.setEditing(false);
        },

        /**
         * @inheritDoc
         */
        loseFocus: function() {
          $super.loseFocus.call(this);
          this.setEditing(false);
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled() && this.hasCursors()) {
            if (keyString === "home") {
              this.setCursors(0);
              keyProcessed = true;
            } else if (keyString === "end") {
              this.setCursors(this.getValue() && this.getValue().toString().length || 0);
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
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled() && !this.isReadOnly()) {

            if (keyString === "ctrl+z" || keyString === 'meta+z') {
              this.undo();
              keyProcessed = true;
            } else if (keyString === "ctrl+shift+z" || keyString === 'meta+shift+z') {
              this.redo();
              keyProcessed = true;
            }

            if (this.isNotEditable()) {
              this._preventEditAllowNavigation(domKeyEvent, keyString);
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.manageKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * Cancel the last value
         */
        undo: function() {
          if (this.hasCursors()) { // only widgets with cursors manage undo/redo
            var cursors = this.getCursors();
            var prevValue = this.getValue();
            //go back but store the current as last known value
            if (this._valueStackCursor === this._valueStack.length - 1 && this._valueStack[this._valueStack.length - 1] !==
              this.getValue()) {
              this.setValue(this.getValue());
            }
            this._valueStackCursor--;
            this._valueStackCursor = this._valueStackCursor < 0 ? 0 : this._valueStackCursor;

            this.afterDomMutator(function() {
              var val = this._valueStack[this._valueStackCursor];
              if (typeof val === "string" && this.hasInputElement()) {
                this._setValue(val);
                var diff = prevValue.length - val.length;
                this.setCursors(cursors.start - diff);
              }
            }.bind(this));
          }
        },

        /**
         * Restore the last value
         */
        redo: function() {
          if (this.hasCursors()) { // only widgets with cursors manage undo/redo
            var cursors = this.getCursors();
            var prevValue = this.getValue();
            if (this._valueStackCursor < this._valueStack.length - 1) {
              this._valueStackCursor++;
            }
            this.afterDomMutator(function() {
              var val = this._valueStack[this._valueStackCursor];
              if (typeof val === "string" && this.hasInputElement()) {
                this._setValue(val);
                var diff = prevValue.length - val.length;
                this.setCursors(cursors.start - diff);
              }
            }.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        buildExtraContextMenuActions: function(contextMenu) {
          $super.buildExtraContextMenuActions.call(this, contextMenu);

          if (!this.isReadOnly() && !this.isInTable() && this.hasInputElement()) {

            var selectAllAllowed = this.getValue().length > 0;
            contextMenu.addAction("selectAll", i18next.t("gwc.contextMenu.selectAll"), "font:FontAwesome.ttf:f0ea", "Ctrl+A", {
              clickCallback: function() {
                contextMenu.hide();
                this.setFocus();
                this.selectAllInputText();
              }.bind(this),
              disabled: !selectAllAllowed
            }, true);
          }
        },

        /**
         * Select all the text in the input element
         * @publicdoc
         */
        selectAllInputText: function() {
          if (this.hasInputElement()) {
            var cursor2 = this.getValue() && this.getValue().length || 0;
            this._inputElement.setCursorPosition(0, cursor2);
          }
        },

        /**
         * Defines a placeholder text
         * @param {string} placeholder - placeholder text
         * @param {boolean} fake - true if placeholder come from another attribute
         * @publicdoc
         */
        setPlaceHolder: function(placeholder, fake) {
          if (this.hasInputElement()) {
            this._isFakePlaceholder = fake ? true : false;
            if (placeholder) {
              this._inputElement.setAttribute('placeholder', placeholder);
            } else {
              this._inputElement.removeAttribute('placeholder');
            }
          }
        },

        /**
         * Method used to validate or not the value, this trigger a rollback if not valid when sending
         * the value to the VM
         * @return {boolean} - true if valid, false otherwise
         */
        validateValue: function() {
          // Implement your own method on widgets
          return true;
        },

        /**
         * This function requests the VM focus if this focus event hasn't been triggered
         * by a mouse or touch event.
         * This happens when the user presses the TAB key of a mobile's virtual keyboard.
         * - TAB generates only a focus event
         * - A tap or click generates a mousedown, focus and mouseup events
         * @param {FocusEvent} event HTML focus event
         * @private
         */
        _onMobileFocus: function(event) {
          if (!this._isMousePressed) {
            this._onRequestFocus(event);
          }
        },

        /**
         * @param {MouseEvent} event HTML mouse event
         * @private
         */
        _onMobileMouseDown: function(event) {
          this._isMousePressed = true;
        },

        /**
         * @param {MouseEvent} event HTML mouse event
         * @private
         */
        _onMobileMouseUp: function(event) {
          this._isMousePressed = false;
        }
      };
    });
  });
