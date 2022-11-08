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

modulum('ButtonRequestFocusUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class ButtonRequestFocusUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.ButtonRequestFocusUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.ButtonRequestFocusUIBehavior.prototype */ {
        __name: "ButtonRequestFocusUIBehavior",

        /**
         *
         * @protected
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.focusListener = widget.when(context.constants.widgetEvents.click, this._onRequestFocus.bind(this, controller));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.focusListener) {
            data.focusListener();
            data.focusListener = null;
          }
        },
        /**
         *
         * @param controller
         * @param {Object} event - DOM event
         * @param src
         * @param domEvent
         * @private
         */
        _onRequestFocus: function(controller, event, src, domEvent) {
          if (controller && controller.scrollGridLineController) {
            controller.scrollGridLineController._onClick();
            if (domEvent && domEvent.stopPropagation) {
              domEvent.stopPropagation();
            }
          }
        }
      };
    });
  });
