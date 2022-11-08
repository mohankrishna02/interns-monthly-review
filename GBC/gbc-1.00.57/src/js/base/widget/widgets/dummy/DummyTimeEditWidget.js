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

modulum('DummyTimeEditWidget', ['TimeEditWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TimeEdit widget.
     * @class DummyTimeEditWidget
     * @memberOf classes
     * @extends classes.TimeEditWidget
     */
    cls.DummyTimeEditWidget = context.oo.Class(cls.TimeEditWidget, function($super) {
      return /** @lends classes.DummyTimeEditWidget.prototype */ {
        __name: "DummyTimeEditWidget",
        __templateName: "TimeEditWidget",

        /**
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled() && !this.isReadOnly()) {

            keyProcessed = true;
            switch (keyString) {
              case "down":
                this._updateCurrentGroup();
                this._decrease();
                this.emit(context.constants.widgetEvents.change, false, true);
                break;
              case "up":
                this._updateCurrentGroup();
                this._increase();
                this.emit(context.constants.widgetEvents.change, false, true);
                break;
              case this.getStart():
              case this.getEnd():
                this._updateCurrentGroup();
                keyProcessed = false; // let the default behavior, just update current group
                break;
              case "ctrl+" + this.getEnd():
                //Update current group of time being selected
                this._moveGroup(1);
                this._updateSelection();
                break;
              case "ctrl+" + this.getStart():
                this._moveGroup(-1);
                this._updateSelection();
                break;
              default:
                keyProcessed = this._processKey(domKeyEvent, keyString);
            }
          }

          return keyProcessed;
        },

        /**
         * @inheritDoc
         */
        _processKey: function(event, keyString) {

        },

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle("input", {
            "text-align": this.getStart()
          });
        },
        _onClick: function(event) {
          this._onRequestFocus(event); // request focus
        },

        /**
         * Sets cursor positions
         * @param {number} cursor - start cursor position
         * @param {number} cursor2 - end cursor position
         * @publicdoc
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          }
          if (cursor2 && cursor2 < 0) {
            cursor2 = this.getValue() && this.getValue().length || 0;
          }
          this._currentCursors.start = cursor;
          this._currentCursors.end = cursor2;

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
        }

      };
    });
    cls.WidgetFactory.registerBuilder('DummyTimeEdit', cls.DummyTimeEditWidget);
  });
