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

modulum('StartMenuWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * StartMenu widget.
     * @class StartMenuWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.StartMenuWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.StartMenuWidget.prototype */ {
        __name: 'StartMenuWidget',
        /**
         * Element that hold the text
         * @type Element
         */
        _textElement: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._textElement = this._element.getElementsByClassName('gbc_StartMenuText')[0];
        },

        /**
         * Set the text of the group
         * @param {string} text
         */
        setText: function(text) {
          this._setElementAttribute('title', text, "_textElement");
          this._setTextContent(text, "_textElement");
        },

        /**
         * Get the text of the group
         * @return {string}
         */
        getText: function() {
          return this._textElement.textContent;
        },
        setProcessing: function(isProcessing) {
          if (this.getElement()) {
            if (isProcessing) {
              this.getElement().setAttribute("processing", "processing");
            } else {
              this.getElement().removeAttribute("processing");
            }
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('StartMenu', cls.StartMenuWidget);
  });
