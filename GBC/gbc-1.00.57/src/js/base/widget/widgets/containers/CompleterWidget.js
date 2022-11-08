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

modulum('CompleterWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Manages a dropdown attached to an edit to provide predefined choices
     * @class CompleterWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc Widgets
     */
    cls.CompleterWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.CompleterWidget.prototype */ {
        __name: "CompleterWidget",
        /**
         * Dropdown used to display completer items
         * @type {classes.ChoiceDropDownWidget}
         */
        _dropDown: null,
        /**
         * Flag to indicate of completer results are visible or not
         * @type {boolean}
         */
        _isVisible: null,
        /**
         * Completer size
         * @type {number}
         */
        _size: 0,
        /**
         * Completer delay in ms to display its results
         * @type {number}
         */
        _completerDelay: 50,
        /**
         * Completer input element
         * @type {HTMLElement}
         */
        _input: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._dropDown = cls.WidgetFactory.createWidget("ChoiceDropDown", this.getBuildParameters());
          this._dropDown.setParentWidget(this);
          this._dropDown.autoSize = true;
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._dropDown.destroy();
          this._dropDown = null;
          this._input = null;
          $super.destroy.call(this);
        },

        /**
         * Add a completer to the parent widget
         * @param {classes.WidgetBase} parentWidget to which is attached completer
         * @publicdoc
         */
        addCompleterWidget: function(parentWidget) {
          this.setParentWidget(parentWidget);

          var parentElement = parentWidget.getElement();
          parentElement.parentNode.insertBefore(this.getElement(), parentElement.nextSibling);

          this._input = parentWidget.getElement().getElementsByTagName("input")[0];

          // set edit input of parent widget as parent element
          if (this._dropDown) {
            this._dropDown.parentElement = this._input;
          }
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isVisible()) {
            switch (keyString) {
              case "esc":
              case "enter":
              case "return":
              case "up":
              case "down":
              case "pageup":
              case "pagedown":
                keyProcessed = this._dropDown.managePriorityKeyDown(keyString, domKeyEvent, repeat);
                break;
              case "tab":
              case "shift+tab":
                this.hide();
                break;

            }
          }
          return keyProcessed;
        },

        /**
         * Bind handler which is executed each time a completer item is selected
         * @param {Hook} hook - function to execute each time a completer item is selected (we pass item value in parameter of the hook)
         * @returns {HandleRegistration} bound handler
         * @publicdoc
         */
        onCurrentChildrenChange: function(hook) {
          return this._dropDown.onCurrentChildrenChange(function(evt, parent, children) {
            hook(children.getValue());
          });
        },

        /**
         * @inheritDoc
         */
        isReversed: function() {
          return this._parentWidget.isReversed();
        },

        /**
         * @inheritDoc
         */
        isVisible: function() {
          return this._dropDown.isVisible();
        },

        /**
         * Add item label in dropdown
         * @param {string} choice - item label to be displayed
         * @publicdoc
         */
        addChoice: function(choice) {
          var label = cls.WidgetFactory.createWidget("Label", this.getBuildParameters());
          label.setValue(choice);
          this._dropDown.addChildWidget(label, {
            clickCallback: function() {
              this.getParentWidget().setFocus();
            }.bind(this)
          });
        },

        /**
         * Remove all items from dropdown
         * @publicdoc
         */
        clearChoices: function() {
          this._dropDown.destroyChildren();
        },

        /**
         * Set completer items size
         * @param {number} size - size of the completer
         * @publicdoc
         */
        setSize: function(size) {
          this._size = size;
        },

        /**
         * Return completer items size
         * @returns {number} completer size
         * @publicdoc
         */
        getSize: function() {
          return this._size;
        },

        /**
         * Returns completer current input value
         * @returns {string} completer value
         * @publicdoc
         */
        getValue: function() {
          return this.getParentWidget().getValue();
        },

        /**
         * Set current completer input value
         * @param {string} value - value to set in completer
         * @param {boolean} fromVM - indicates if we set value from VM order or not
         * @publicdoc
         */
        setValue: function(value, fromVM) {
          this.getParentWidget().setValue(value, fromVM);
        },

        /**
         * @inheritDoc
         */
        setEditing: function(b) {
          this.getParentWidget().setEditing(b);
        },

        /**
         * @inheritDoc
         */
        hasVMFocus: function() {
          var parent = this.getParentWidget();
          return parent.hasVMFocus() || parent.getParentWidget().hasVMFocus();
        },

        /**
         * Show completer results
         * @publicdoc
         */
        show: function() {
          this._registerTimeout(this._show.bind(this, true), this._completerDelay);
        },

        /**
         * Hide completer results
         * @publicdoc
         */
        hide: function() {
          this._registerTimeout(this._show.bind(this, false), this._completerDelay);
        },

        /**
         * Internal method to show/hide completer results
         * @param visibility
         * @private
         */
        _show: function(visibility) {
          if (this._dropDown) {
            if (visibility === true) {
              if (!this.hasVMFocus()) {
                return;
              }
              var element = this.getParentWidget().getElement();
              if (element) {
                this._dropDown.x = element.getBoundingClientRect().left;
                this._dropDown.width = element.getBoundingClientRect().width;
              }
              this._dropDown.show();
            } else {
              this._dropDown.hide();
            }
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Completer', cls.CompleterWidget);
  });
