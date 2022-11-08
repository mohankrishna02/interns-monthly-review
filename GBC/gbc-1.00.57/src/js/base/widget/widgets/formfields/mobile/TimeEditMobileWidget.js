/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('TimeEditMobileWidget', ['TimeEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TimeEdit Mobile widget.
     * @class TimeEditMobileWidget
     * @memberOf classes
     * @extends classes.TimeEditWidgetBase
     * @publicdoc Widgets
     */
    cls.TimeEditMobileWidget = context.oo.Class(cls.TimeEditWidgetBase, function($super) {
      return /** @lends classes.TimeEditMobileWidget.prototype */ {
        __name: 'TimeEditMobileWidget',

        /**
         * @type {Node}
         */
        _pickerLabel: null,
        _pickerIcon: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this._pickerIcon = this._element.getElementsByClassName('widget-decoration')[0];

          this._inputElement = this._element.getElementsByTagName('input')[0];
          this.setValue('00:00:00');

          this._inputElement.on("change.TimeEditMobileWidget", function(event) {
            var val = this._inputElement.value;
            // IOS doesn't support seconds in their native input type='time' browser implementation
            // https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/InputTypes.html
            if (window.isIOS() && this._useSeconds) {
              val += ":00";
            }
            this._inputElement.setAttribute("data-time", val);
            this.emit(context.constants.widgetEvents.change);
          }.bind(this));
          this._element.on('touchstart.TimeEditMobileWidget', this._onRequestFocus.bind(this));

          // Trick to open picker when touching icon
          this._inputElement.setAttribute("id", this.getRootClassName() + "_input");
          this._pickerLabel = this._element.getElementsByTagName("label")[0];
          this._pickerLabel.setAttribute("for", this.getRootClassName() + "_input");
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          var target = domEvent.target;
          if (target.isElementOrChildOf(this._inputElement) || target.isElementOrChildOf(this._pickerIcon)) {
            this._onRequestFocus(domEvent); // request focus
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._element.off('touchstart.TimeEditMobileWidget');
          this._inputElement.off('change.TimeEditMobileWidget');
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        setDisplayFormat: function(format) {
          $super.setDisplayFormat.call(this, format);
          this._updateFormat();
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          if (this.getValue() !== value) {
            // first set accuracy on native widgets before the value to avoid seconds being always displayed (issue under android)
            this._setTimeAccuracy(value);
            if (fromVM) {
              this._updateFormat();
            }
            $super.setValue.call(this, value, fromVM);
            this._inputElement.setAttribute("data-time", value);
          }
        },

        /**
         * Add/remove seconds accuracy from input time picker
         * @private
         */
        _updateFormat: function() {
          if (this._useSeconds) {
            this._inputElement.setAttribute("step", "1");
          } else {
            this._inputElement.removeAttribute("step");
          }
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          return this._inputElement.getAttribute("data-time");
        }
      };
    });
  });
