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

modulum('TabbedApplicationCloseWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class TabbedApplicationCloseWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.TabbedApplicationCloseWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.TabbedApplicationCloseWidget.prototype */ {
        __name: "TabbedApplicationCloseWidget",
        _activated: false,
        _processing: false,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (!this._processing) {
            this.emit(context.constants.widgetEvents.click);
          }
          return false;
        },

        setActive: function(active) {
          this._active = active;
          this._element.toggleClass("gbc-disabled", !active);
        },

        setHidden: function(hidden) {
          this._element.toggleClass("gbc-hidden", Boolean(hidden));
        },

        onClick: function(hook) {
          return this.when(context.constants.widgetEvents.click, hook);
        },

        _setProcessingStyle: function(processing) {
          this._processing = Boolean(processing);
          if (this._element) {
            if (processing) {
              this._element.setAttribute("processing", "processing");
            } else {
              this._element.removeAttribute("processing");
            }
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TabbedApplicationClose', cls.TabbedApplicationCloseWidget);
  });
