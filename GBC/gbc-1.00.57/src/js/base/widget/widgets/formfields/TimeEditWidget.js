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

modulum('TimeEditWidget', ['TimeEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TimeEdit widget.
     * @class TimeEditWidget
     * @memberOf classes
     * @extends classes.TimeEditWidgetBase
     * @publicdoc Widgets
     */
    cls.TimeEditWidget = context.oo.Class(cls.TimeEditWidgetBase, function($super) {
      return /** @lends classes.TimeEditWidget.prototype */ {
        __name: 'TimeEditWidget',

        /**
         * Array of time fragment HH, MM and SS
         * @type {DateTimeHelper.timeFragment[]}
         */
        _groups: null,

        /**
         * Current cursor position
         * @type {Object}
         */
        _currentCursors: null,

        /**
         * Flag to indicate if valid number has been entered
         * @type {boolean}
         */
        _numericPressed: false,

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
         * Current group of time being updated
         * @type {number}
         */
        _currentGroup: 0,

        /**
         * Last valid time being set
         * @type {?string}
         */
        _lastValid: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._groups = [
            cls.DateTimeHelper.timeFragment(24),
            cls.DateTimeHelper.timeFragment(60),
            cls.DateTimeHelper.timeFragment(60)
          ];
          this._lastValid = '00:00:00';
          this._inputElement = this._element.getElementsByTagName('input')[0];
          this._upArrow = this._element.getElementsByClassName('up')[0];
          this._downArrow = this._element.getElementsByClassName('down')[0];

          this._inputElement.on('input.TimeEditWidget', this._onInput.bind(this));
          this._inputElement.on('mousedown.TimeEditWidget', cls.WidgetBase._onSelect.bind(this));

          this.setValue(this._lastValid);

          this._currentCursors = {
            start: 0,
            end: 0
          };

          this._inputElement.on("change.TimeEditWidget", function(event) {
            this._inputElement.setAttribute("data-time", this._inputElement.value);
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._currentCursors = null;
          this._upArrow = null;
          this._downArrow = null;
          this._inputElement.off('change.TimeEditWidget');
          this._inputElement.off('input.TimeEditWidget');
          this._inputElement.off('mousedown.TimeEditWidget');
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          var target = domEvent.target;
          if (target.isElementOrChildOf(this._upArrow)) {
            this._onUpIcon(domEvent);
          } else if (target.isElementOrChildOf(this._downArrow)) {
            this._onDownIcon(domEvent);
          } else if (target.isElementOrChildOf(this._inputElement)) {
            this._onInputClick(domEvent);
          }

          return true;
        },

        /**
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled() && !this.isReadOnly()) {

            var start = this._inputElement.selectionStart;
            var end = this._inputElement.selectionEnd;

            keyProcessed = true;
            switch (keyString) {
              case "down":
                this._decrease();
                this.emit(context.constants.widgetEvents.change, false, true);
                break;
              case "up":
                this._increase();
                this.emit(context.constants.widgetEvents.change, false, true);
                break;
              case this.getStart():
              case this.getEnd():
                this._updateCurrentGroup();
                keyProcessed = false; // let the default behavior, just update current group
                break;
              case ":":
              case "shift+:":
              case "ctrl+" + this.getEnd():
                //Update current group of time being selected
                this._moveGroup(1);
                this._updateSelection();
                break;
              case "ctrl+" + this.getStart():
                this._moveGroup(-1);
                this._updateSelection();
                break;
              case "backspace":
                // only whole text or single group selection deletion are permitted
                if (!this.isEditing() && !this.hasFocus()) { // first keydown in typeahead mode (cursors not ready yet)
                  return true;
                }

                if ((start === 0 && this.getValue().length === end) || this.getValue().charAt(end - 1) !== ':') {
                  keyProcessed = false; // let the default behavior
                }
                break;
              case "del":
                // only whole text or single group selection deletion are permitted
                if (!this.isEditing() && !this.hasFocus()) { // first keydown in typeahead mode (cursors not ready yet)
                  return true;
                }
                // if 2 digits group selected
                if ((start === 0 && this.getValue().length === end) || this.getValue().charAt(end) !== ':' || start === end - 2) {
                  keyProcessed = false; // let the default behavior
                }
                break;
              default:
                keyProcessed = this._processKey(domKeyEvent, keyString);
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.manageKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * Validate current group of time and eventually update set next group as current
         * @inheritDoc
         */
        manageKeyUp: function(keyString, domKeyEvent) {
          $super.manageKeyUp.call(this, keyString, domKeyEvent);

          // if key pressed was delete or backspace, we do not update current group
          var key = cls.KeyboardApplicationService.keymap[domKeyEvent.which];
          var groupChanged = (key === "del" || key === "backspace") ? false : this._updateCurrentGroup();
          var groupComplete = true;
          if (this._numericPressed) {
            this._numericPressed = false; // important to set it back to false since keypress event isn't raised for special command
            groupComplete = this._updateGroups(this.getValue());
            if (groupComplete) {
              this._moveGroup(1);
              this._updateSelection();
            }
          }
          if (groupChanged || groupComplete) {
            this.emit(context.constants.widgetEvents.change, true);
          }
        },

        /**
         * Process one key event
         * @param {Object} event
         * @param {string} keyString
         * @returns {boolean} true if key has been processed, false otherwise
         */
        _processKey: function(event, keyString) {
          var isModifier = cls.KeyboardHelper.isSpecialCommand(keyString);
          var isValid = !isModifier && cls.KeyboardHelper.isNumeric(event.gbcKey) && !this._isMaxLength();

          this._numericPressed = isValid;

          // timeedit is empty : we need to initialise its format on first numeric pressed
          if (isValid && this.getValue().length === 0) {
            this._updateFromGroups();
            this._updateSelection();
          }

          if (!isValid && !isModifier) {
            event.preventCancelableDefault();
            return true;
          }

          return false;
        },

        /**
         * Increase the current group value and update current group selection if needed
         */
        _increase: function() {
          this.setEditing(true);
          if (this._groups[this._currentGroup].increaseValue()) {
            if (this._currentGroup > 0 && this._groups[this._currentGroup - 1].increaseValue()) {
              if (this._currentGroup > 1) {
                this._groups[0].increaseValue();
              }
            }
          }
          this._updateFromGroups();
          this._updateSelection();
        },

        /**
         * Decrease the current group value
         */
        _decrease: function() {
          this.setEditing(true);
          if (this._groups[this._currentGroup].decreaseValue()) {
            if (this._currentGroup > 0 && this._groups[this._currentGroup - 1].decreaseValue()) {
              if (this._currentGroup > 1) {
                this._groups[0].decreaseValue();
              }
            }
          }
          this._updateFromGroups();
          this._updateSelection();
        },

        /**
         * Changes the current group
         * @param {number} where - group index
         */
        _moveGroup: function(where) {
          if (where < 0) {
            if (this._currentGroup !== 0) {
              this._currentGroup = this._currentGroup + where;
            }
          } else {
            if (this._currentGroup < this._groups.length - 1) {
              this._currentGroup = this._currentGroup + where;
            }
          }
        },

        /**
         * Updates the current group depending on the cursor position
         * @returns {boolean} true if the current group has changed, false otherwise
         */
        _updateCurrentGroup: function() {
          var value = this.getValue(),
            firstColon = value.indexOf(':'),
            secondColon = value.lastIndexOf(':');
          var position = this._inputElement.selectionEnd;
          var newPosition = 0;
          var oldPosition = this._currentGroup;
          if (secondColon !== -1) {
            newPosition = position <= firstColon ? 0 : (firstColon === secondColon || position <= secondColon ? 1 : 2);
          } else {
            oldPosition = 0;
          }
          oldPosition = Math.min(this._currentGroup, oldPosition);

          this._currentGroup = newPosition;
          var hasChanged = newPosition !== oldPosition;
          if (hasChanged && !this._isGroupComplete(oldPosition)) {
            this._updateFromGroups();
          }
          return hasChanged;
        },

        /**
         * Indicates if group is complete
         * @param {number} groupIndex - cursor position of group to test
         * @returns {boolean} true if group is complete
         */
        _isGroupComplete: function(groupIndex) {
          var value = this.getValue().split(':');
          return this._groups[groupIndex].fromText(value[groupIndex]);
        },

        /**
         * Update current group time value
         * @param {string} value - time value
         * @param {boolean} [force] - if true we consider this value is valid
         * @returns {boolean} true if group is complete
         */
        _updateGroups: function(value, force) {
          var complete = true;
          if (!this._useSeconds && this._groups.length === 3) {
            this._groups.pop();
          }
          for (var i = 0; i < this._groups.length; i++) {
            complete = complete && this._isGroupComplete(i);
          }
          if (complete || force) {
            this._updateFromGroups();
            this._lastValid = this.getValue();
          }
          return complete;
        },

        /**
         * Rebuilds the value from groups
         */
        _updateFromGroups: function() {
          var value = '';
          for (var i = 0; i < this._groups.length; i++) {
            value += (i > 0 ? ':' : '') + this._groups[i].getText();
          }
          this.setValue(value);
        },

        /**
         * Updates the selection range based on current group
         */
        _updateSelection: function() {
          var start = this._currentGroup * 3;
          if (start < 0) {
            start = 0;
          }
          if (start + 2 <= this.getValue().length) {
            this.setCursors(start, start + 2, true);
          }
        },

        /**
         * Handler which updates current group of time being updated
         * @param {UIEvent} event - DOM event
         */
        _onInputClick: function(event) {
          if (this.isEnabled() && !this.isReadOnly() && this.getValue() !== '') {
            // on click we update current time group and update selection/cursors in consequence
            this._updateCurrentGroup();
            this._updateSelection();
          }
          this._onRequestFocus(event); // request focus
        },

        /**
         * @inheritDoc
         */
        _onUpIcon: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            this._onRequestFocus(evt); // request focus
            if (this.hasVMFocus()) { // focus input element before updating its cursors
              this._inputElement.domFocus();
            }
            this._increase();
            this.emit(context.constants.widgetEvents.change, false, true); // ask for cursors sending
          }
        },

        /**
         * @inheritDoc
         */
        _onDownIcon: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            this._onRequestFocus(evt); // request focus
            if (this.hasVMFocus()) { // focus input element before updating its cursors
              this._inputElement.domFocus();
            }
            this._decrease();
            this.emit(context.constants.widgetEvents.change, false, true); // ask for cursors sending
          }
        },

        /**
         * Get cursors
         * @return {{start: number, end: number}} object with cursors
         * @publicdoc
         */
        getCursors: function() {
          return this._currentCursors;
        },

        /**
         * Place the cursor at the given position,
         * @param {number} cursor - first cursor position
         * @param {number} cursor2 - second cursor position
         * @param {Boolean} doNotUpdateGroup
         */
        setCursors: function(cursor, cursor2, doNotUpdateGroup) {
          var start = cursor;
          var end = cursor2;
          if (cursor2 === -1) {
            start = 0;
            end = 2;
          } else if (!cursor2) { // if cursor2 isn't defined, start cursor is used as end as well
            end = start;
          }
          this._currentCursors.start = start;
          this._currentCursors.end = end;
          this._inputElement.setCursorPosition(start, end);
          if (!doNotUpdateGroup) {
            this._updateCurrentGroup();
          }
          if (!cursor2) { // if cursor2 isn't defined or set to 0, we need to fallback selection to current group
            this._updateSelection();
          }
        },

        /**
         * @inheritDoc
         */
        setDisplayFormat: function(format) {
          $super.setDisplayFormat.call(this, format);
          this._updateGroups(this.getValue());
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          if (this.getValue() !== value) {
            $super.setValue.call(this, value, fromVM);
            this._updateGroups(value);
          }
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          $super.setFocus.call(this, fromMouse);
          var currentCursors = this.getCursors();
          this.setCursors(currentCursors.start, currentCursors.end);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TimeEdit', cls.TimeEditWidget);
  });
