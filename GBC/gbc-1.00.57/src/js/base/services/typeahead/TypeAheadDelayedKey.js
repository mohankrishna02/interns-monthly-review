/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TypeAheadDelayedKey', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead delayed key.
     * @class TypeAheadDelayedKey
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadDelayedKey = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadDelayedKey.prototype */ {
        __name: "TypeAheadDelayedKey",

        /** @type String */
        _keyString: null,

        /** @type Object */
        _keyEvent: null,

        /**
         * @param {classes.VMApplication} app owner
         * @param {String} keyString string corresponding to the key
         * @param {Object} keyEvent keyDown js event
         */
        constructor: function(app, keyString, keyEvent) {
          $super.constructor.call(this, app, null);
          this._keyString = keyString;
          this._keyEvent = keyEvent;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var processed = false;
          var focusedVMNode = this._app.getFocusedVMNodeAndValue();
          if (focusedVMNode) {
            var controller = focusedVMNode.getController();
            if (controller) {
              this._app.focus.restoreVMFocus(); // to be sure cursors are correctly set before value & cursors manipulation
              processed = this._app.keyboard.processKey(this._keyString, this._keyEvent, false);
              if (!processed) {
                context.LogService.typeahead.log("DelayedKey execute typeahead function on", controller);
                processed = this._simulateBrowserBehavior(controller);
              }

              this._app.keyboard.executeKeyUp(this._keyString, this._keyEvent);
            }
          }
          return {
            processed: processed,
            vmEvents: []
          };
        },

        /**
         * Try mimic browser behavior on a controller widget
         * @param {classes.ControllerBase} controller - controller on which we try to execute the key
         * @returns {boolean} true if key has been processed
         */
        _simulateBrowserBehavior: function(controller) {

          if (!controller || !controller.getWidget()) {
            return false;
          }

          var widget = controller.getWidget();

          if (!(widget instanceof cls.FieldWidgetBase)) {
            return false;
          }

          if (!widget.hasInputElement() || !widget.hasCursors() || widget.isReadOnly() || widget.isNotEditable()) {
            return false;
          }

          var consumed = false;
          var value = widget.getValue().toString();
          var keyString = this._keyString;
          var cursors = widget.getCursors();

          var ctrlA = window.browserInfo.isSafari ? 'meta+a' : 'ctrl+a';
          if (keyString === 'space') { // needed for IE
            keyString = ' ';
          }
          if (keyString.length === 1) { // value key
            var firstPart = value.substr(0, cursors.start);
            var secondPart = value.substr(cursors.end);
            value = firstPart + keyString;
            var newCursorPos = value.length;
            value += secondPart;
            cursors.start = cursors.end = newCursorPos;
            consumed = true;
          } else switch (keyString) { // modifier key
            case widget.getStart():
              cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
              cursors.end = cursors.start;
              consumed = true;
              break;
            case widget.getEnd():
              cursors.start = cursors.end < value.length ? cursors.end + 1 : value.length;
              cursors.end = cursors.start;
              consumed = true;
              break;
            case 'home':
              cursors.start = cursors.end = 0;
              consumed = true;
              break;
            case 'end':
              cursors.start = cursors.end = value.length;
              consumed = true;
              break;
            case 'shift+' + widget.getStart():
              cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
              consumed = true;
              break;
            case 'shift+' + widget.getEnd():
              cursors.end = cursors.end < value.length ? cursors.end + 1 : value.length;
              consumed = true;
              break;
            case ctrlA:
              cursors.start = 0;
              cursors.end = value.length;
              consumed = true;
              break;
            case 'backspace':
              if (cursors.end > 0 && value) {
                if (cursors.start === cursors.end) {
                  value = value.slice(0, cursors.start - 1) + value.slice(cursors.start);
                  cursors.start = cursors.end = cursors.end - 1;
                } else {
                  value = value.slice(0, cursors.start) + value.slice(cursors.end);
                }
              }
              consumed = true;
              break;
            case 'del':
              if (cursors.end > -1 && value) {
                if (cursors.start === cursors.end) {
                  value = value.slice(0, cursors.start) + value.slice(cursors.start + 1);
                } else {
                  value = value.slice(0, cursors.start) + value.slice(cursors.end);
                }
              }
              consumed = true;
              break;
          }

          if (consumed) {
            widget.setEditing(true); // simulated delay key should imply some editing logic
            widget.setValue(value, false);
            widget.setCursors(cursors.start, cursors.end);
            widget.emit(context.constants.widgetEvents.change, false, true);
          }

          return consumed;
        },

        /**
         * @inheritDoc
         */
        isPredictable: function() {
          return false;
        },

        /**
         * @inheritDoc
         */
        checkIntegrity: function() {
          return true;
        }
      };
    });
  }
);
