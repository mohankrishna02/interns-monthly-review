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

modulum('RadioGroupWidget', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * RadioGroup widget.
     * @class RadioGroupWidget
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.RadioGroupWidget = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.RadioGroupWidget.prototype */ {
        __name: 'RadioGroupWidget',
        /**
         * currently aimed item
         * @type {number}
         */
        _currentAimIndex: 0,

        /**
         * Widget value
         * @type {string|?}
         */
        _value: null,
        /**
         * @type {boolean}
         */
        _notNull: false,
        /**
         * @type {boolean}
         */
        _allowNullValue: false,

        /**
         * @inheritDoc
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
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().initial = cls.SizePolicy.Dynamic();
            this._layoutInformation.getSizePolicyConfig().fixed = cls.SizePolicy.Dynamic();
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
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
              case this.getEnd():
                this._onNext();
                break;
              case "up":
              case this.getStart():
                this._onPrevious();
                break;
              case "space":
                this._onSpace();
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
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          this._onRequestFocus(domEvent);
          if (domEvent.target.elementOrParent("gbc_RadioGroupItem")) {
            this._onItemClick(domEvent);
          }
          this.emit(context.constants.widgetEvents.click, domEvent);

          return false;
        },

        /**
         * On click handler
         * @param {Object} evt - DOM event
         * @private
         */
        _onItemClick: function(evt) {
          if (this.isEnabled()) {
            var item = evt.target.closest('gbc_RadioGroupItem');
            this._currentAimIndex = 0;
            for (; item.previousElementSibling; item = item.previousElementSibling) {
              if (item.previousElementSibling !== this.__charMeasurer) {
                ++this._currentAimIndex;
              }
            }
            this._prepareValue(this._currentAimIndex, true);
            this.emit(context.constants.widgetEvents.change, false);
          }
        },

        /**
         * On previous handler : action to do when we want to go to previous value
         * @private
         */
        _onPrevious: function() {
          this._currentAimIndex = (this._currentAimIndex <= 0) ?
            this._element.children.length - 2 : //(remove charMeasurer child
            (this._currentAimIndex - 1);
          this._prepareValue(this._currentAimIndex, false);
          this.emit(context.constants.widgetEvents.change, false);
        },

        /**
         * On next handler : action to do when we want to go to next value
         * @private
         */
        _onNext: function() {
          this._currentAimIndex = (this._currentAimIndex >= (this._element.children.length - 2)) ? //(remove charMeasurer child
            0 :
            (this._currentAimIndex + 1);
          this._prepareValue(this._currentAimIndex, false);
          this.emit(context.constants.widgetEvents.change, false);
        },

        /**
         * On space Key handler
         * @private
         */
        _onSpace: function() {
          this._prepareValue(this._currentAimIndex, true);
          this.emit(context.constants.widgetEvents.change, false);
        },

        /**
         * Return index of value in _values array
         * @param {string} value - value to look for
         * @return {number} position of the value
         * @private
         */
        _indexOf: function(value) {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            if (children[i].getAttribute('data-value') === value.toString()) {
              return i;
            }
          }
          return -1;
        },

        /**
         * Add a choice to the list
         * @param {object} choice - choice to add
         * @private
         */
        _addChoice: function(choice) {
          var button = context.TemplateService.renderDOM('RadioGroupItem');
          button.setAttribute('data-value', choice.value);
          button.getElementsByTagName('span')[0].textContent = choice.text;
          this._element.appendChild(button);
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * Removes a choice at the given index
         * @param {number} index
         * @private
         */
        _removeChoiceAt: function(index) {
          this._element.allchild('gbc_RadioGroupItem')[index].remove();
        },

        /**
         * Removes the given choice
         * @param {object} choice
         * @private
         */
        _removeChoice: function(choice) {
          var index = this._indexOf(choice.value);
          if (index >= 0) {
            this._removeChoiceAt(index);
          }
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * Adds a single or a list of choices
         * @param {string|string[]} choices - choices to add to the radio ensemble
         * @publicdoc
         */
        setChoices: function(choices) {
          this.clearChoices();
          if (choices) {
            if (Array.isArray(choices)) {
              for (var i = 0; i < choices.length; i++) {
                this._addChoice(choices[i]);
              }
              this.updateValue();
            } else {
              this._addChoice(choices);
            }
            this._addAriaNavigation();
          }
        },

        /**
         * Removes a single or a list of choices
         * @param {(string|string[])} choices - choices to remove
         * @publicdoc
         */
        removeChoices: function(choices) {
          if (choices) {
            if (Array.isArray(choices)) {
              for (var i = 0; i < choices.length; i++) {
                this._removeChoice(choices[i]);
              }
            } else {
              this._removeChoice(choices);
            }
          }
        },

        /**
         * Clears all choices
         * @publicdoc
         */
        clearChoices: function() {
          while (this._element.childrenExcept(this.__charMeasurer).length !== 0) {
            this._element.childrenExcept(this.__charMeasurer)[0].remove();
          }
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * Set the layout orientation.
         * @param {string} orientation - 'vertical' or 'horizontal'.
         * @publicdoc
         */
        setOrientation: function(orientation) {
          this._element.toggleClass('gbc_RadioGroupWidget_horizontal', orientation === 'horizontal');
          this._element.toggleClass('gbc_RadioGroupWidget_vertical', orientation === 'vertical');
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * Get the layout orientation.
         * @returns {string} the layout orientation. 'vertical' or 'horizontal'.
         * @publicdoc
         */
        getOrientation: function() {
          if (this._element.hasClass('gbc_RadioGroupWidget_horizontal')) {
            return 'horizontal';
          } else {
            return 'vertical';
          }
        },

        /**
         * Get the value of the radiogroup
         * @returns {string} value - the current value
         * @publicdoc
         */
        getValue: function() {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            if (item.getElementsByClassName('zmdi')[0].hasClass('checked')) {
              return item.getAttribute('data-value');
            }
          }
          return '';
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
         * @param {string} value - the value to set
         * @private
         */
        _setValue: function(value) {
          this._value = value;
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            var isChecked = value !== null ? item.getAttribute('data-value') === value.toString() : false;
            item.setAttribute("aria-checked", isChecked.toString());
            item.getElementsByClassName('zmdi')[0].toggleClass('checked', isChecked);
            item.getElementsByClassName('zmdi')[0].toggleClass('unchecked', !isChecked || !value);
            if (isChecked) {
              this._currentAimIndex = i;
            }
          }
        },

        /**
         * Set again the value, can be useful if items have changed
         * @publicdoc
         */
        updateValue: function() {
          if (this._value) {
            this.setValue(this._value);
          }
        },

        /**
         * Prepare the value
         * @param {number} index - index of the value
         * @param {boolean} doSetValue -
         * @private
         */
        _prepareValue: function(index, doSetValue) {
          if (this.isEnabled()) {
            this._updateVisualAim();
            if (doSetValue || this._element.querySelectorAll('.checked').length !== 0) {
              var children = this._element.childrenExcept(this.__charMeasurer);
              for (var i = 0; i < children.length; ++i) {
                var element = children[i],
                  item = element.getElementsByClassName('zmdi')[0],
                  isCurrent = i === index;
                if (!isCurrent) {
                  item.removeClass('checked');
                  item.addClass('unchecked');
                } else {
                  if (!item.hasClass('checked')) {
                    item.removeClass('unchecked');
                    item.addClass('checked');
                  } else {
                    if (!this._notNull || this._allowNullValue) {
                      item.removeClass('checked');
                      item.addClass('unchecked');
                    }
                  }
                }
              }
              this.setEditing(this.getValue() !== this._oldValue);
            }
          }
        },

        /**
         * Add a visual outline to see the position
         * @protected
         */
        _updateVisualAim: function() {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            item.toggleClass('aimed', i === this._currentAimIndex);
            if (i === this._currentAimIndex) {
              item.setAttribute("aria-selected", "true");
            }
          }
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._element.toggleClass('disabled', !enabled);
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i].getElementsByClassName('zmdi')[0];
            item.toggleClass('disabled', !enabled);
          }
        },

        /**
         * Sets the focus to the widget
         * @publicdoc
         */
        setFocus: function(fromMouse) {
          this._element.domFocus();
          this._updateVisualAim();
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * Set widget mode. Useful when widget have peculiar behavior in certain mode
         * @param {string} mode the widget mode
         * @param {boolean} active the active state
         */
        setWidgetMode: function(mode, active) {
          this._allowNullValue = mode === "Construct";
        },

        /**
         * Add accessible navigation for radiogroup
         * @private
         */
        _addAriaNavigation: function() {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            children[i].setAttribute('aria-posinset', (i + 1).toString());
            children[i].setAttribute('aria-setsize', children.length.toString());
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('RadioGroup', cls.RadioGroupWidget);
  });
