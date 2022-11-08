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

modulum('OnDataUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class OnDataUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.OnDataUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.OnDataUIBehavior.prototype */ {
        /** @type {string} */
        __name: "OnDataUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.dataHandle = controller.getWidget().when(cls.WebComponentWidget.dataEvent, this._onData.bind(this, controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.dataHandle) {
            data.dataHandle();
            data.dataHandle = null;

          }
        },

        /**
         * On data widget event
         * @private
         */
        _onData: function(controller, data, event, widget, eventData) {
          if (widget._flushValue !== eventData) {
            widget._flushValue = eventData;
          }
        }
      };
    });
  });
