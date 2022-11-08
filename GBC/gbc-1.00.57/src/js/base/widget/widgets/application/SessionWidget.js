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

modulum('SessionWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class SessionWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.SessionWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.SessionWidget.prototype */ {
        __name: "SessionWidget",
        _waiter: null,
        _sidebarWidget: null,
        /** @type {classes.SessionEndWidget} */
        _endWidget: null,
        /** @type {classes.SessionEndRedirectWidget} */
        _endRedirectWidget: null,
        /** @type {classes.SessionWaitingEndWidget} */
        _waitingEndWidget: null,
        __zIndex: 0,
        _currentWidget: null,
        _currentWidgetStack: null,
        _tabbedContainerWidget: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          this._currentWidgetStack = [];
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._tabbedContainerWidget) {
            this._tabbedContainerWidget.destroy();
            this._tabbedContainerWidget = null;
          }
          if (this._endRedirectWidget) {
            this._endRedirectWidget.destroy();
            this._endRedirectWidget = null;
          }
          if (this._endWidget) {
            this._endWidget.destroy();
            this._endWidget = null;
          }
          if (this._waitingEndWidget) {
            this._waitingEndWidget.destroy();
            this._waitingEndWidget = null;
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._endWidget = cls.WidgetFactory.createWidget('SessionEnd', this.getBuildParameters());
          this._endWidget.setHidden(true);
          this._element.appendChild(this._endWidget.getElement());
          this._endRedirectWidget = cls.WidgetFactory.createWidget('SessionEndRedirect', this.getBuildParameters());
          this._endRedirectWidget.setHidden(true);
          this._element.appendChild(this._endRedirectWidget.getElement());
          this._waitingEndWidget = cls.WidgetFactory.createWidget('SessionWaitingEnd', this.getBuildParameters());
          this._waitingEndWidget.setHidden(true);
          this._element.appendChild(this._waitingEndWidget.getElement());
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         * @param widget
         * @param options
         */
        addChildWidget: function(widget, options) {
          options = options || {};
          options.noDOMInsert = (options.noDOMInsert !== false);
          $super.addChildWidget.call(this, widget, options);
          if (widget instanceof cls.ApplicationWidget) {
            this.getSidebarWidget().addChildWidget(widget.getSidebarWidget());
          }
        },

        _getNextApplication: function(previousWidget) {
          var nextApp = null;
          if (this._currentWidgetStack.length) {
            nextApp = this._currentWidgetStack[this._currentWidgetStack.length - 1];
            if (nextApp === previousWidget && this._currentWidgetStack.length > 1) {
              nextApp = this._currentWidgetStack[this._currentWidgetStack.length - 2];
            }
          }
          return nextApp;
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          var displayedWidget = null;
          if (widget instanceof cls.ApplicationWidget) {

            this._currentWidgetStack.remove(widget);

            var sidebar = widget.getSidebarWidget();
            if (sidebar) {
              this.getSidebarWidget().removeChildWidget(sidebar);
            }
          }
          $super.removeChildWidget.call(this, widget);
        },

        /**
         *
         * @param {classes.ApplicationWidget} widget
         */
        setCurrentWidget: function(widget) {
          if (this._currentWidget !== widget && (!this._tabbedContainerHostWidget || this._tabbedContainerHostWidget !== widget)) {
            if (widget) {
              var isBuffering = context.styler.isBuffering();
              if (!isBuffering) {
                context.styler.bufferize();
              }
              var previousWidget = this.getCurrentWidget();

              if (this._tabbedContainerWidget) {
                if (previousWidget) {
                  previousWidget.disable();
                }
                this._tabbedContainerWidget.setCurrentPage(widget._tabbedPage);
              } else {
                // Magical stuff to keep webcomponent in dom to preserve context
                if ((previousWidget && previousWidget.hasChildWebComponent()) || (widget && widget.hasChildWebComponent())) {
                  if (previousWidget && previousWidget.getElement() && previousWidget.hasChildWebComponent()) {
                    previousWidget.addClass("gbc_out_of_view");
                  }
                  if (widget && !widget.hasChildWebComponent() && this.getContainerElement()) {
                    this.getContainerElement().appendChild(widget.getElement());
                  }
                  if (widget && widget.hasChildWebComponent()) {
                    if (previousWidget && !previousWidget.hasChildWebComponent() &&
                      this.getContainerElement() && previousWidget.getElement()) {
                      this.getContainerElement().removeChild(previousWidget.getElement());
                    }
                    widget.removeClass("gbc_out_of_view");
                  }
                } else if (previousWidget && previousWidget.getElement()) {
                  previousWidget.disable();
                  if (this.getContainerElement()) {
                    this.getContainerElement().replaceChild(widget.getElement(), previousWidget.getElement());
                  }
                } else {
                  if (this.getContainerElement()) {
                    this.getContainerElement().appendChild(widget.getElement());
                  }
                }
              }
              if (!this._currentWidgetStack.contains(widget)) {
                this._currentWidgetStack.push(widget);
              }
              widget.activate();
              if (!isBuffering) {
                context.styler.flush();
              }
            }
            this._currentWidget = widget;
          }
        },
        getCurrentWidget: function() {
          return this._currentWidget;
        },
        getSidebarWidget: function() {
          return this._sidebarWidget;
        },
        setSidebarWidget: function(widget) {
          this._sidebarWidget = widget;
        },
        showWaitingEnd: function() {
          this._waitingEndWidget.setHidden(false);
        },
        showEnd: function() {
          this._waitingEndWidget.setHidden(true);
          this._endWidget.setHidden(false);
          context.HostService.setCurrentTitle();
          context.HostService.setCurrentIcon();
        },
        showRedirectEnd: function() {
          this._waitingEndWidget.setHidden(true);
          this._endRedirectWidget.setHidden(false);
          context.HostService.setCurrentTitle();
          context.HostService.setCurrentIcon();
        },
        getEndWidget: function() {
          return this._endWidget;
        },
        getWaitingEndWidget: function() {
          return this._waitingEndWidget;
        },

        setTabbedContainer: function(tabbedContainerWidget) {
          this._tabbedContainerWidget = tabbedContainerWidget;
        },

        setTabbedContainerHost: function(widget) {
          this._tabbedContainerHostWidget = widget;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Session', cls.SessionWidget);
  });
