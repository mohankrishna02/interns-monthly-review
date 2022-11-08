/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('PictureVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class PictureVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.PictureVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.PictureVMBehavior.prototype */ {
        __name: "PictureVMBehavior",

        watchedAttributes: {
          decorator: ['picture'],
          container: ['dialogType']
        },

        /**
         * Apply PICTURE rules on the widget. Bind handlers on its input field
         * @param controller
         * @param data
         * @private
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.getInputElement) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var containerNode = controller.getNodeBindings().container;
            var input = widget.getInputElement();
            if (input) {
              if (decoratorNode && decoratorNode.isAttributeSetByVM('picture') && containerNode && containerNode.attribute(
                  'dialogType') !== "Construct" && decoratorNode.attribute("picture").length > 0) {
                // Analyse picture and create rule (group) for each character of the mask
                var mask = decoratorNode.attribute('picture');
                data.groups = [];

                for (var i = 0; i < mask.length; i++) {
                  data.groups.push(this._createGroup(mask[i]));
                }

                if (!window.isAndroid()) {
                  // Android keyboards don't provide pressed key info in keydown/keyup. Workarouds aren't satisfying either.
                  // Picture is thus disabled on this platform until proper support of keydown/keyup events

                  // Bind on paste event and prevent drag event
                  // Catch paste event to update value if it's respecting picture format
                  input.off('paste.PictureVMBehavior');
                  input.on('paste.PictureVMBehavior', this._onPicturePaste.bind(this, controller, data));

                  // Disable text selection dragging
                  input.off("dragstart.PictureVMBehavior");
                  input.on("dragstart.PictureVMBehavior", this._onDragStart.bind(this));

                  // Override widget manageKeyDown method
                  if (!data.manageKeyDown) {
                    data.manageKeyDown = widget.manageKeyDown;
                  }
                  widget.manageKeyDown = function(keyString, domKeyEvent, repeat) {
                    return this._manageKeyDown.call(this, controller, data, keyString, domKeyEvent, repeat);
                  }.bind(this);
                }
              } else {
                input.off('paste.PictureVMBehavior');
                input.off("dragstart.PictureVMBehavior");
              }
            }
          }
        },

        /**
         * Detach input handlers and restore initial widget manageKeyDown
         * @param controller
         * @param data
         * @private
         */
        _detach: function(controller, data) {
          var widget = controller && controller.getWidget();
          if (widget) {
            var input = widget.getInputElement && widget.getInputElement();
            if (input) {
              input.off('paste.PictureVMBehavior');
              input.off("dragstart.PictureVMBehavior");
            }
            if (data.manageKeyDown) {
              widget.manageKeyDown = data.manageKeyDown;
            }
          }
        },

        /**
         * Override widget manageKeyDown method.
         * @param {object} controller
         * @param {object} data
         * @param {string} keyString - key combinaison
         * @param {object} domKeyEvent
         * @param {boolean} repeat
         * @returns {boolean} true if key has been processed
         * @private
         */
        _manageKeyDown: function(controller, data, keyString, domKeyEvent, repeat) {
          var keyProcessed = false;
          var widget = controller.getWidget();

          if (widget.isEnabled() && !widget.isReadOnly()) {

            var input = widget.getInputElement();
            var start = input.selectionStart;
            var value = input.value;
            var cursor = this._getNextCursor(data, start, value.length);

            // First manage picture specific special keys (left, right, backspace, del), then execute widget manageKeyDown rules.
            // Finally, if no special key has to be be managed, we let picturevmbehavior manage the key depending of the picture mask
            switch (keyString) {
              case widget.getStart():
                cursor = this._getPreviousCursor(data, start);
                if (cursor) {
                  input.setCursorPosition(cursor.start, cursor.start + 1);
                  keyProcessed = true;
                }
                break;
              case widget.getEnd():
                cursor = this._getNextCursor(data, start, value.length);
                if (cursor) {
                  input.setCursorPosition(cursor.start, cursor.start + 1);
                  keyProcessed = true;
                }
                break;
              case "backspace":
                keyProcessed = this._onPictureBackspace(controller, data);
                break;
              case "del":
                keyProcessed = this._onPictureDelete(controller, data);
                break;
              default:
                keyProcessed = data.manageKeyDown.call(widget, keyString, domKeyEvent, repeat);
            }
          }

          if (keyProcessed) {
            return true;
          } else if (cls.KeyboardHelper.isSpecialCommand(keyString)) { // let browser manages native combinaison
            return false;
          } else {
            return this._onPictureKeydown(controller, data, domKeyEvent.gbcKey);
          }
        },

        /**
         * Insert typed key at correct position if allowed by PICTURE mask. Otherwise do nothing
         * @param controller
         * @param data
         * @param {string} keyString
         * @returns {boolean}
         * @private
         */
        _onPictureKeydown: function(controller, data, keyString) {
          var pictureWidget = controller.getWidget();
          var input = pictureWidget.getInputElement();
          var start = input.selectionStart;

          var value = input.value;
          var cursor = this._getNextCursor(data, start, value.length);

          // start at first editable position from cursor position (editable group)
          while (data.groups[start] && !data.groups[start].isEditable) {
            var separator = data.groups[start].separator;
            if (value[start] !== separator) {
              input.value = value = (value.substr(0, start) + separator + value.substr(start + 1));
              cursor = this._getNextCursor(data, start + 1, value.length);
            }
            start++;
          }
          // Validate current pressed key
          var currentGroup = data.groups[start];
          if (currentGroup && currentGroup.isValid) {
            if (cls.KeyboardHelper.isChar(keyString)) { // char is fully managed by picture behvior
              if (currentGroup.isValid(keyString)) {
                // Place cursor to new permitted position
                var char = this._applyShift(controller, keyString);
                input.value = (value.substr(0, start) + char + value.substr(start + 1));
                input.setCursorPosition(cursor.start, cursor.end);
                pictureWidget._editingTime = Date.now();
                pictureWidget.setEditing(pictureWidget.isEditing() || pictureWidget.getValue() !== pictureWidget._oldValue);
              }
              return true;
            } else { // unknown combination, we let browser manage it
              return false;
            }
          }
          // current group is undefined => we reached end of the picture mask. key flaged as processed to prevent default
          return true;
        },

        /**
         * Manage backspace key. Erase previous key if allowed to.
         * @param controller
         * @param data
         * @returns {boolean}
         * @private
         */
        _onPictureBackspace: function(controller, data) {
          var pictureWidget = controller.getWidget();
          var input = pictureWidget.getInputElement();
          var start = input.selectionStart;
          var end = input.selectionEnd;

          var manyselected = end - start > 1;

          var cursor = this._getPreviousCursor(data, start);
          if (cursor || manyselected) {
            var value = input.value;

            // Correctly remove many char at the same time
            if (manyselected) {
              this._removeManyChars(data, input);
            } else {
              input.value = (value.substr(0, cursor.start) + ' ' + value.substr(cursor.start + 1));
              input.setCursorPosition(cursor.start, cursor.start + 1);
              pictureWidget._editingTime = Date.now();
              pictureWidget.setEditing(pictureWidget.isEditing() || pictureWidget.getValue() !== pictureWidget._oldValue);
            }
          }
          return true;
        },

        /**
         * Manage delete key. Remove current key if allowed to. Otherwise move to next editable char
         * @param controller
         * @param data
         * @returns {boolean}
         * @private
         */
        _onPictureDelete: function(controller, data) {
          var pictureWidget = controller.getWidget();
          var input = pictureWidget.getInputElement();
          var start = input.selectionStart;
          var end = input.selectionEnd;

          var value = input.value;
          var cursor = {
            start: start,
            end: start + 1
          };
          var manyselected = end - start > 1;
          if (manyselected) {
            this._removeManyChars(data, input);
          } else {
            if (start < value.length) {
              if (data.groups[start].isEditable) {
                input.value = (value.substr(0, start) + ' ' + value.substr(start + 1));
              } else {
                cursor = this._getNextCursor(data, start, value.length);
              }
              input.setCursorPosition(cursor.start, cursor.end);
              pictureWidget._editingTime = Date.now();
              pictureWidget.setEditing(pictureWidget.isEditing() || pictureWidget.getValue() !== pictureWidget._oldValue);
            }
          }
          return true;
        },

        /**
         * Manange paste of value. Try to insert each char of the copied value into the PICTURE field
         * @param controller
         * @param data
         * @param e
         * @private
         */
        _onPicturePaste: function(controller, data, e) { // paste
          var pictureWidget = controller.getWidget();
          var input = pictureWidget.getInputElement();
          var pastedText = null;
          // Get pasted value
          if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
          } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData('text/plain');
          }

          // Build new value till no conflict is met. when one conflict is met, take mask value for all remaining length.
          var newValue = "";
          var j = 0;
          var decoratorNode = controller.getNodeBindings().decorator;
          var mask = decoratorNode.attribute('picture');
          var pastedTextLength = pastedText.length;
          // Get cursor positions
          var start = input.selectionStart;

          // loop length will depend of parsedText length. If parsedText length is higher than mask (data.groups), we take mask length
          var length = pastedTextLength;
          var i = start;
          while (j < length) { // loop on each pastedText char from starting cursor position
            if (i === data.groups.length) { // end of editable zone
              break;
            }
            var group = data.groups[i];
            if (!group.isEditable) { // separator are kept intact --> copy them into new value
              var separator = mask[i];
              newValue += separator;
              if (separator === pastedText[j]) { // if current pasted char == current group seperator, we will not analyse it afterward
                j++;
              }
            } else { // current group is editable, check if current pasted char is valid
              var char = pastedText[j];
              if (group.isValid && group.isValid(char)) {
                // if previously no conflict met and current char is valid, we add it to new value
                char = this._applyShift(controller, char);
                newValue += char;
                j++;
              } else { // char is not valid, take mask value (whitespace since it's not a separator)
                break;
              }
            }
            i++;
          }

          var existingValue = input.value;

          // Set input new value
          input.value = existingValue.substring(0, start) + newValue + existingValue.substring(start + newValue.length);
          input.setCursorPosition(i, i + 1);
          pictureWidget._editingTime = Date.now();
          pictureWidget.setEditing(pictureWidget.isEditing() || pictureWidget.getValue() !== pictureWidget._oldValue);

          event.preventCancelableDefault();
        },

        /**
         * Prevent drag/drop of selection over the PICTURE mask
         * @param event
         * @private
         */
        _onDragStart: function(event) {
          event.preventCancelableDefault();
        },

        /**
         * Remove all selected chars from PICTURE mask
         * @param data
         * @param input
         * @private
         */
        _removeManyChars: function(data, input) {
          var value = input.value;
          var start = input.selectionStart;
          var end = input.selectionEnd;

          var resultArray = value.split("");
          var tmpStart = start;

          while (data.groups.length > tmpStart && tmpStart !== end) {
            if (data.groups[tmpStart].isEditable) {
              resultArray[tmpStart] = " ";
            }
            tmpStart++;
          }
          var jumpStart = 0;
          var jumpStop = 0;

          // Set the cursor correctly
          while (data.groups[start + jumpStart] && !data.groups[start + jumpStart].isEditable) {
            jumpStart++;
          }
          while (data.groups[end + jumpStop - 1] && !data.groups[end + jumpStop - 1].isEditable) {
            jumpStop++;
          }
          input.value = resultArray.join("");
          input.setCursorPosition(start + jumpStart, end - jumpStop);
        },

        /**
         * Get previous editing position
         * @param data
         * @param ind
         * @returns {*}
         * @private
         */
        _getPreviousCursor: function(data, ind) {
          if (ind === 0) {
            return null;
          }
          var start = ind;
          var jump = false;
          while (start > 0 && !data.groups[start - 1].isEditable) {
            jump = true;
            start--;
          }
          return {
            start: start - 1,
            jump: jump
          };
        },

        /**
         * Get next editing position
         * @param data
         * @param ind
         * @param length
         * @returns {{start: *, end: *, jump: boolean}}
         * @private
         */
        _getNextCursor: function(data, ind, length) {
          var start = ind + 1;
          var jump = false;
          while (data.groups.length > start && !data.groups[start].isEditable) {
            jump = true;
            start++;
          }
          var end = start;
          if (start < length) {
            end = start + 1;
          }
          return {
            start: start,
            end: end,
            jump: jump
          };
        },

        /**
         * Parse the PICTURE letter and get a corresponding group rule
         * @param type
         * @returns {{}}
         * @private
         */
        _createGroup: function(type) {
          var group = {};
          switch (type) {
            case 'A': // Alpha numeric
              group.isEditable = true;
              group.isValid = cls.KeyboardHelper.isLetter;
              break;
            case '#': // Numeric only
              group.isEditable = true;
              group.isValid = cls.KeyboardHelper.isNumeric;
              break;
            case 'X': // All
              group.isEditable = true;
              group.isValid = cls.KeyboardHelper.isChar;
              break;
            default: // Mask separator
              group.isEditable = false;
              group.isValid = null;
              group.separator = type;
          }
          return group;
        },

        /**
         * Apply shift attribute (if set) over the char
         * @param controller
         * @param char
         * @returns {*}
         * @private
         */
        _applyShift: function(controller, char) {
          var decoratorNode = controller.getNodeBindings().decorator;
          var shiftAttr = decoratorNode.attribute('shift');
          if (shiftAttr !== "none") {
            switch (shiftAttr) {
              case 'up':
                char = char.toUpperCase();
                break;
              case 'down':
                char = char.toLowerCase();
                break;
            }
          }
          return char;
        }

      };
    });
  });
