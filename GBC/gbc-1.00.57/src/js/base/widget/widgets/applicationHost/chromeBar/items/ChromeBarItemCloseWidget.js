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

modulum('ChromeBarItemCloseWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Close Button in ChromeBar
     * @class ChromeBarItemCloseWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemCloseWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemCloseWidget.prototype */ {
        __name: "ChromeBarItemCloseWidget",
        __templateName: "ChromeBarItemWidget",

        _active: false,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.close'));
          this.setTitle(i18next.t('gwc.main.chromebar.close'));
          this.setImage("zmdi-close-circle");
          $super.setHidden.call(this, true);
        },

        /**
         *
         * @param {Boolean} active
         * @param {classes.WindowWidget} windowWidget
         */
        setActive: function(active, windowWidget) {
          this._currentLinkedWindow = windowWidget;
          this._active = active;
          if (!this._destroyed) {
            if (!context.__wrapper.isNative() && this._element) {
              this._element.toggleClass("gbc_Invisible", !active);
            } else {
              this._element.addClass("gbc_Invisible");
            }
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (this._active && this.isVisible() && this._currentLinkedWindow.isClosable()) {
            this.close();
          }
          return $super.manageMouseClick.call(this, domEvent);
        },

        /**
         * Emit the close
         */
        close: function() {
          if (!this._processing && this._currentLinkedWindow) {
            //this.emit(context.constants.widgetEvents.click);
            this._currentLinkedWindow._emitClose();
          }

        },

        /**
         * Attach a callback when button is clicked
         * @param hook
         * @return {*|Function}
         */
        onClick: function(hook) {
          return this.when(context.constants.widgetEvents.click, hook);

        },

        /**
         * Set the current linked window
         * @param {classes.WindowWidget} window - to link to the close button
         */
        setLinkedWindow: function(window) {
          this._currentLinkedWindow = window;
        },

        /**
         * Defines if the widget should be hidden or not
         * @param {boolean} hidden true if the widget is hidden, false otherwise
         * @param {?classes.WindowWidget} windowWidget - get info on the window widget to hide or not if tabbed mode
         * @publicdoc
         */
        setHidden: function(hidden, windowWidget) {
          if (!(windowWidget && windowWidget._tabbedContainerWidget)) {
            $super.setHidden.call(this, hidden);
          }
        },

        /**
         *
         * @param processing
         * @private
         */
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
    cls.WidgetFactory.registerBuilder('ChromeBarItemClose', cls.ChromeBarItemCloseWidget);
  });
