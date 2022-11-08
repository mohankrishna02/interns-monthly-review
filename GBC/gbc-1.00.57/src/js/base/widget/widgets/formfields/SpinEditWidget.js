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

modulum('SpinEditWidget', ['SpinEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * SpinEdit widget.
     * @class SpinEditWidget
     * @memberOf classes
     * @extends classes.SpinEditWidgetBase
     * @publicdoc Widgets
     */
    cls.SpinEditWidget = context.oo.Class(cls.SpinEditWidgetBase, function($super) {
      return /** @lends classes.SpinEditWidget.prototype */ {
        __name: 'SpinEditWidget',

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          if (this.isEnabled()) {
            if (keyString === "home" && this.getMin() !== null) {
              return false; // don't process this key it will be processed in manageKeyDown function
            } else if (keyString === "end" && this.getMax() !== null) {
              return false; // don't process this key it will be processed in manageKeyDown function
            }
          }

          return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
        },

        /**
         * @inheritDoc
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isEnabled() && !this.isReadOnly()) {

            keyProcessed = true;
            var updateValue = 0;
            switch (keyString) {
              case "down":
                updateValue = -1;
                break;
              case "pagedown":
                updateValue = -10;
                break;
              case "up":
                updateValue = 1;
                break;
              case "pageup":
                updateValue = 10;
                break;
              case "home":
                var min = this.getMin();
                if (min !== null) {
                  this.setEditing(this._oldValue !== min);
                  this.setValue(min);
                  this.emit(context.constants.widgetEvents.change, false);
                }
                break;
              case "end":
                var max = this.getMax();
                if (max !== null) {
                  this.setEditing(this._oldValue !== max);
                  this.setValue(max);
                  this.emit(context.constants.widgetEvents.change, false);
                }
                break;
              default:
                keyProcessed = this._processKey(domKeyEvent, keyString);
            }

            if (updateValue !== 0) {
              this._updateValue(updateValue);
              this.emit(context.constants.widgetEvents.change, false);
            }
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.manageKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

      };
    });
    cls.WidgetFactory.registerBuilder('SpinEdit', cls.SpinEditWidget);
  });
