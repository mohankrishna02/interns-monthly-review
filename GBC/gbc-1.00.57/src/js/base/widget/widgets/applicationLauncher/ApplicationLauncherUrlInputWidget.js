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

modulum('ApplicationLauncherUrlInputWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationLauncherUrlInputWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationLauncherUrlInputWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationLauncherUrlInputWidget.prototype */ {
        __name: "ApplicationLauncherUrlInputWidget",

        /**
         * @type HTMLElement
         */
        _buttonElement: null,
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._inputElement = this._element.getElementsByTagName("input")[0];
          this._buttonElement = this._element.getElementsByTagName("button")[0];
          this._buttonElement.on("click.ApplicationLauncherUrlInputWidget", this.launchUrl.bind(this));
          this._inputElement.on("keydown.ApplicationLauncherUrlInputWidget", function(evt) {
            var key = cls.KeyboardApplicationService.keymap[evt.which];
            if (key === "enter") { // enter key
              this.launchUrl();
            }
          }.bind(this));
          this._inputElement.on("keyup.ApplicationLauncherUrlInputWidget", this._updateButton.bind(this));
          this._inputElement.on("mouseover.ApplicationLauncherUrlInputWidget", this._updateButton.bind(this));

        },
        destroy: function() {
          this._buttonElement.off("click.ApplicationLauncherUrlInputWidget");
          this._inputElement.off("keydown.ApplicationLauncherUrlInputWidget");
          this._inputElement.off("keyup.ApplicationLauncherUrlInputWidget");
          this._inputElement.off("mouseover.ApplicationLauncherUrlInputWidget");
        },
        _updateButton: function() {
          if (this._inputElement.value) {
            this._buttonElement.removeAttribute("disabled");
            this._buttonElement.removeClass("disabled");
          } else {
            this._buttonElement.setAttribute("disabled", "disabled");
            this._buttonElement.addClass("disabled");
          }
        },
        launchUrl: function() {
          var value = this._inputElement.value;
          context.UrlService.goTo(value);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationLauncherUrlInput', cls.ApplicationLauncherUrlInputWidget);
  });
