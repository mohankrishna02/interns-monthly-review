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

modulum('ApplicationLauncherWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationLauncherWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationLauncherWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ApplicationLauncherWidget.prototype */ {
        __name: "ApplicationLauncherWidget",
        _startLogPlayer: null,
        _urlInput: null,
        _history: null,
        _bookmark: null,

        /** @type {classes.ChromeBarWidget} **/
        _chromeBar: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          if (!context.HostService.isLogPlayerRequested()) {
            this._urlInput = cls.WidgetFactory.createWidget('ApplicationLauncherUrlInput', this.getBuildParameters());
            this._element.prependChild(this._urlInput.getElement());
            this._startLogPlayer = cls.WidgetFactory.createWidget('ApplicationLauncherStartLogPlayer', this.getBuildParameters());
            this._element.prependChild(this._startLogPlayer.getElement());
            this._history = cls.WidgetFactory.createWidget('ApplicationLauncherHistory', this.getBuildParameters());
            this.addChildWidget(this._history);
            this._bookmark = cls.WidgetFactory.createWidget('ApplicationLauncherBookmark', this.getBuildParameters());
            this.addChildWidget(this._bookmark);
          }

          if (!gbc.ThemeService.getValue("theme-legacy-topbar")) {
            var chromeBarOpt = this.getBuildParameters();
            chromeBarOpt.lightmode = true;
            this._chromeBar = cls.WidgetFactory.createWidget("ChromeBar", chromeBarOpt);
            this._element.prependChild(this._chromeBar.getElement());
            this._chromeBar.setLightMode(true);
          }
        },
        destroy: function() {
          this._urlInput.destroy();
          this._urlInput = null;
          this._history.destroy();
          this._history = null;
          this._bookmark.destroy();
          this._bookmark = null;
          $super.destroy.call(this);
        },
        getHistory: function() {
          return this._history;
        },
        setHidden: function(hidden) {
          $super.setHidden.call(this, hidden);
          if (this.getParentWidget()) {
            this.getParentWidget().enableSidebar(hidden);
          }
        },
        /**
         * @inheritDoc
         * @param {classes.ApplicationHostWidget} widget
         * @param {Object=} options - possible options
         * @param {boolean=} options.noLayoutInvalidation - won't affect parent layout
         */
        setParentWidget: function(widget, options) {
          $super.setParentWidget.call(this, widget, options);
          widget.enableSidebar(!this.isVisible());
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationLauncher', cls.ApplicationLauncherWidget);
  });
