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

modulum('SessionLogPromptWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class SessionLogPromptWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.SessionLogPromptWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.SessionLogPromptWidget.prototype */ {
        __name: "SessionLogPromptWidget",

        /** @type Element */
        _button: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._button = this._element.getElementsByClassName("mt-button")[0];
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._button = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (domEvent.target === this._button || domEvent.target.parent("mt-button") === this._button) {
            this.emit(context.constants.widgetEvents.click);
          }
          return true;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('SessionLogPrompt', cls.SessionLogPromptWidget);
  });
