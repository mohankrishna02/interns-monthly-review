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

modulum('TextEditWidget', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TextEdit widget.
     * @class TextEditWidget
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.TextEditWidget = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.TextEditWidget.prototype */ {
        __name: 'TextEditWidget',
        /**
         * true if textedit can contains HTML content
         * @type {boolean}
         */
        _hasHTMLContent: false,
        /** @type classes.HtmlFilterWidget **/
        _htmlFilter: null,
        /** @type {boolean} */
        _wantReturns: true,
        /** @type {boolean} */
        _wantTabs: false,
        /**
         * Redefine where the data is located
         * @type {string|Object}
         */
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutInformation.shouldFillStack = true;
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutEngine._shouldFillHeight = true;
            this._layoutInformation.getSizePolicyConfig().dynamic = cls.SizePolicy.Initial();
            this._layoutInformation.forcedMinimalWidth = 20;
            this._layoutInformation.forcedMinimalHeight = 20;
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName('textarea')[0];
          this._initListeners();
        },

        /**
         * Initialize all widget events listener
         */
        _initListeners: function() {
          this._inputElement.on('input.TextEditWidget', this._onInput.bind(this));
          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.TextEditWidget', cls.WidgetBase._onSelect.bind(this));
        },

        /**
         * Clear event listeners of the widget
         */
        _unloadListeners: function() {
          this._inputElement.off('mousedown.TextEditWidget');
          this._inputElement.off('input.TextEditWidget');
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._unloadListeners();

          if (this._htmlFilter) {
            this._htmlFilter.destroy();
            this._htmlFilter = null;
          }

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this._onRequestFocus(domEvent); // request focus
          this.emit(context.constants.widgetEvents.click, domEvent);
          return true;
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled()) {
            switch (keyString) {
              // Standard navigation : let default
              case "up":
              case "down":
              case "end":
              case "home":
                domKeyEvent.gbcDontPreventDefault = true;
                keyProcessed = true;
                break;

              case "enter":
              case "return":
                if (!this.isNotEditable() && this._wantReturns) {
                  domKeyEvent.gbcDontPreventDefault = true;
                  keyProcessed = true;
                }
                break;

              case "tab":
                if (!this.isNotEditable() && this._wantTabs) {
                  keyProcessed = true;
                  this._insertTab();
                }
                break;
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
        manageKeyUp: function(keyString, domKeyEvent) {
          $super.manageKeyUp.call(this, keyString, domKeyEvent);

          this.emit(context.constants.widgetEvents.keyUp, domKeyEvent, true);
        },

        /**
         * @inheritDoc
         */
        _onInput: function() {
          $super._onInput.call(this);

          // TODO this code should probably be moved in FieldWidgetBase when fix GBC-2088
          // IE11 bug : input event being raised on edit click. Try to catch this specific case by testing if value changed and field doesn't have VM focus yet.
          if (!window.browserInfo.isIE || this.getValue() !== this._oldValue || this.hasVMFocus()) {
            this.emit(context.constants.widgetEvents.change, true);
          }
        },

        /**
         * Insert a TAB char
         * @private
         */
        _insertTab: function() {
          var s = this._inputElement.selectionStart;
          var value = this._inputElement.value.substring(0, this._inputElement.selectionStart) + "\t" + this._inputElement.value
            .substring(this._inputElement.selectionEnd);

          // If Maxlength is not defined, insert tab character anyway
          if (!this.getMaxLength() || value.length <= this.getMaxLength()) {
            this.setValue(value);
            this._inputElement.selectionEnd = s + 1;
          }
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          $super.setValue.call(this, value, fromVM);
          this._setValue(value);
        },

        /**
         * Internal setValue used to be inherited correctly by DummyWidget
         * @param {string} value - the value
         * @private
         */
        _setValue: function(value) {
          if (this._hasHTMLContent) {
            this._inputElement.innerHTML = this._htmlFilter.filterHtml(value);
          } else {
            this._inputElement.value = value;
          }
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          if (this._hasHTMLContent === true) {
            return this._inputElement.innerHTML;
          } else {
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
          if (readonly || this._isReadOnly) {
            if (this._hasHTMLContent) {
              this._inputElement.setAttribute('contenteditable', false);
            } else {
              this._inputElement.setAttribute('readonly', 'readonly');
            }
          } else {
            if (this._hasHTMLContent) {
              this._inputElement.setAttribute('contenteditable', true);
            } else {
              this._inputElement.removeAttribute('readonly');
            }
          }
        },

        /**
         * Define the maximum number of characters allowed
         * @param {number} maxlength - maximum number of characters allowed in the field
         * @publicdoc
         */
        setMaxLength: function(maxlength) {
          this._setElementAttribute('maxlength', maxlength, "_inputElement");
        },

        /**
         * Get the maximum number of characters allowed
         * @returns {number} the maximum number of characters allowed in the field
         * @publicdoc
         */
        getMaxLength: function() {
          return this._inputElement.getIntAttribute('maxlength');
        },

        /** Place the cursor at the given position,
         * @param {number} cursor - first cursor position
         * @param {number} [cursor2] - second cursor position
         * @publicdoc
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          } else if (cursor2 === -1) { // for textEditWidget if cursor2 === -1 we don't select all the text, !== editWidget
            cursor2 = cursor;
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
        setTextAlign: function(align) {
          $super.setTextAlign.call(this, align);
          this.setStyle(">textarea", {
            "text-align": align
          });
        },

        /**
         * Replace default textarea element used to display text with an html element which can displays HTML
         * @param {HTMLElement} jcontrol - div element
         * @publicdoc
         */
        setHtmlControl: function(jcontrol) {
          if (this._htmlFilter === null) {
            this._htmlFilter = cls.WidgetFactory.createWidget('HtmlFilterWidget', this.getBuildParameters());
          }
          if (this.isEnabled()) {
            jcontrol.setAttribute('contenteditable', true);
          }
          jcontrol.innerHTML = this.getValue();
          // Remove events before replacing the widget
          this._unloadListeners();
          this._inputElement.replaceWith(jcontrol);
          this._hasHTMLContent = true;
          this._inputElement = jcontrol;
          // Initialize events for the new widget
          this._initListeners();
          if (this.hasFocus()) {
            // Force focus again if it has focus
            this.setFocus();
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
         * Set number of editable rows inside the textedit widget
         * @param {number} rows - number of rows
         * @publicdoc
         */
        setRows: function(rows) {
          this._inputElement.setAttribute('rows', rows || 1);
        },

        /**
         * Make the textedit content return the new line breaking the word or not
         * @param {string} format - css value
         * @publicdoc
         */
        setWrapPolicy: function(format) {
          this._inputElement.toggleClass('breakword', format === 'anywhere');
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
        },

        /**
         * Set if textedit accepts TAB key
         * @param {boolean} wantTabs - true if TAB key should be accepted in the textedit
         * @publicdoc
         */
        setWantTabs: function(wantTabs) {
          this._wantTabs = wantTabs;
        },

        /**
         * Set if textedit accepts RETURN/ENTER key
         * @param {boolean} wantReturns - true if returns/enters should be accepted in the textedit
         * @publicdoc
         */
        setWantReturns: function(wantReturns) {
          this._wantReturns = wantReturns;
        },

        /**
         * Defines the scrollBars to display
         * @param {string} scrollBars - value can be 'auto', 'both', 'none', 'horizontal', 'vertical'
         */
        setScrollBars: function(scrollBars) {
          this.addClass("scrollbars-" + scrollBars);
        },
      };
    });
    cls.WidgetFactory.registerBuilder('TextEdit', cls.TextEditWidget);
  });
