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

modulum('SessionSidebarWindowItemWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class SessionSidebarWindowItemWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.SessionSidebarWindowItemWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.SessionSidebarWindowItemWidget.prototype */ {
        __name: "SessionSidebarWindowItemWidget",

        /** @type {Element} */
        _windowNameElement: null,
        /** @type {classes.ImageWidget} */
        _windowIconImage: null,
        /** @type {classes.WindowWidget} */
        _windowWidget: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._windowNameElement = this._element.getElementsByClassName("windowName")[0];
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          var ui = this._windowWidget.getUserInterfaceWidget();

          var appWidget = ui.getParentWidget();
          appWidget.getParentWidget().setCurrentWidget(appWidget);
          ui._syncCurrentWindow();

          this.setActiveWindow(this._windowWidget);
          ui.setCurrentWindowId(this._windowWidget._auiTag);

          if (gbc.StoredSettingsService.isSideBarVisible()) {
            this.getParentWidget().closeSidebar();
          }
          return false;
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._windowWidget = null;
          this._windowNameElement = null;
          if (this._windowIconImage) {
            this._windowIconImage.destroy();
            this._windowIconImage = null;
          }

          $super.destroy.call(this);
        },

        /**
         * Set window's name
         * @param {String} name - window's name
         * @publicdoc
         */
        setWindowName: function(name) {
          this._windowNameElement.textContent = name;
          this._windowNameElement.setAttribute("title", name);
        },

        /**
         * Get window's name
         * @return {string} window's name
         * @publicdoc
         */
        getWindowName: function() {
          return this._windowNameElement.textContent;
        },

        /**
         * Change the image icon
         * @param {String} image - image path
         * @publicdoc
         */
        setWindowIcon: function(image) {
          if (!this._windowIconImage) {
            this._windowIconImage = cls.WidgetFactory.createWidget("ImageWidget", this.getBuildParameters());
            this._element.getElementsByClassName("windowIcon")[0].prependChild(this._windowIconImage.getElement());
          }
          this._windowIconImage.setHidden(true);
          if (image && image !== "") {
            this._windowIconImage.setSrc(image);
            this._windowIconImage.setHidden(false);
          }
        },

        /**
         * Set the corresponding window widget
         * @param {classes.WindowWidget} widget - window
         */
        setWindowWidget: function(widget) {
          this._windowWidget = widget;
        },

        /**
         * TODO doc, is it useful to have setActiveWindow & setCurrent ?
         */
        setCurrent: function() {
          if (!this.getParentWidget() || !this.getParentWidget().getParentWidget()) {
            return;
          }
          var sessionSidebar = this.getParentWidget().getParentWidget().getParentWidget();
          var apps = sessionSidebar.getChildren();
          for (var a = 0; a < apps.length; a++) {
            var sidebarAppItem = apps[a];
            var wins = sidebarAppItem.getChildren();
            for (var w = 0; w < wins.length; w++) {
              var sidebarWinItem = wins[w];
              sidebarWinItem._element.toggleClass('activeWindow', sidebarWinItem === this.getParentWidget());
              this.setActiveWindow(this._windowWidget);
            }
          }
        },

        /**
         * TODO doc, is it useful to have setActiveWindow & setCurrent ?
         * @param win
         */
        setActiveWindow: function(win) {
          var sessionSidebar = this.getParentWidget().getParentWidget().getParentWidget();
          var apps = sessionSidebar.getChildren();
          for (var a = 0; a < apps.length; a++) {
            var sidebarAppItem = apps[a];
            var wins = sidebarAppItem.getChildren();
            for (var w = 0; w < wins.length; w++) {
              var sidebarWinItem = wins[w];
              sidebarWinItem._element.toggleClass('activeWindow', sidebarWinItem === this.getParentWidget());
              var subs = sidebarWinItem.getChildren();
              for (var s = 0; s < subs.length; s++) {
                var sidebarSubWinItem = subs[s];
                sidebarSubWinItem._element.toggleClass('visibleWindow', sidebarSubWinItem._windowWidget === win);
              }
            }
          }
        },

        /**
         * Returns if window is the current one
         * @return {boolean} - true if window is current
         * @publicdoc
         */
        isCurrent: function() {
          return this._element.hasClass('activeWindow');
        },

        /**
         * Set window froze or not
         * @param {boolean} frozen - true if window is frozen
         */
        setFrozen: function(frozen) {
          this._element.toggleClass("frozenWindow", Boolean(frozen));
        }
      };
    });
    cls.WidgetFactory.registerBuilder('SessionSidebarWindowItem', cls.SessionSidebarWindowItemWidget);
  });
