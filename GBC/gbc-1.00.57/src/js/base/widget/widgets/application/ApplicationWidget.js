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

modulum('ApplicationWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Main container widget for an application
     * @class ApplicationWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.ApplicationWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ApplicationWidget.prototype */ {
        __name: "ApplicationWidget",
        _waiter: null,
        /**
         * @type {classes.SessionSidebarApplicationItemWidget}
         */
        _sidebarWidget: null,
        /**
         * the contextmenu widget
         * @type {classes.ContextMenuWidget}
         */
        _contextMenu: null,
        _handlers: null,
        _uiWidget: null,

        /** @type {Array} */
        _domAttributesMutationBuffer: null,

        /** @type {Array} */
        _afterDomMutationBuffer: null,

        /** @type {boolean} */
        _isBuffering: false,

        /** @type {boolean} */
        _isDomMutating: false,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          opts.appWidget = this;
          $super.constructor.call(this, opts);
          this._domAttributesMutationBuffer = [];
          this._afterDomMutationBuffer = [];
          this._handlers = [];
          this._sidebarWidget = cls.WidgetFactory.createWidget("SessionSidebarApplicationItem", this.getBuildParameters());
          this._sidebarWidget.setApplicationWidget(this);
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._handlers) {
            for (var i = 0; i < this._handlers.length; i++) {
              this._handlers[i]();
            }
            this._handlers.length = 0;
          }
          this._sidebarWidget.destroy();
          this._sidebarWidget = null;
          if (this._waiter) {
            this._waiter.destroy();
            this._waiter = null;
          }
          context.styler.removeStyleSheet(this._appHash);

          if (this._contextMenu) {
            this._contextMenu.destroy();
            this._contextMenu = null;
          }

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._waiter = cls.WidgetFactory.createWidget("Waiting", this.getBuildParameters());
          this._element.appendChild(this._waiter.getElement());

          this._contextMenu = cls.WidgetFactory.createWidget("ContextMenu", this.getBuildParameters());
          this._contextMenu.setParentWidget(this);
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;
          if (this.getContextMenu() && this.getContextMenu().isVisible()) {
            switch (keyString) {
              case "space":
                var currentChild = this.getContextMenu().getCurrentChildren();
                if (currentChild._onClick) { // TODO review this
                  currentChild._onClick(null);
                } else {
                  this.getContextMenu()._onClick(null, this.getCurrentChildren());
                }
                keyProcessed = true;
                break;
              default:
                break;
            }
            if (!keyProcessed) {
              keyProcessed = this.getContextMenu().managePriorityKeyDown(keyString, domKeyEvent, repeat);
            }
          }
          return keyProcessed;
        },

        /**
         * Show context menu and show it
         * @param evt
         * @param widget
         */
        showContextMenu: function(evt, widget) {

          var vmFocusWidget = this._uiWidget ? this._uiWidget.getVMFocusedWidget() : null;

          this._contextMenu.setColor(this.getColor());
          this._contextMenu.setBackgroundColor(this.getBackgroundColor());

          evt.preventCancelableDefault();
          evt.stopImmediatePropagation();
          evt.stopPropagation();

          this._contextMenu.x = evt.clientX;
          this._contextMenu.y = evt.clientY;

          if (this._contextMenu.isVisible()) {
            this._contextMenu.hide(); // hide it before display it, to be sure it is in the correct position
          }

          // if widget is not focusable or focused widget and widget from where contextmenu is called is the same we can directly show contextMenu
          if (!widget.isFocusable() || !widget.isEnabled() || vmFocusWidget === widget || vmFocusWidget === widget
            .getParentWidget()) {
            // Extra actions defines by widgets in buildExtraContextMenuActions function
            this._contextMenu.removeAndDestroyActions(true);
            widget.buildExtraContextMenuActions(this._contextMenu);
            // if the contextMenu has visible action, try to show it
            if (this._contextMenu.hasVisibleAction()) {
              this._contextMenu.show();
            }
          } else {
            // once VM gave focus to widget, show the contextMenu
            context.SessionService.getCurrent().getCurrentApplication().focus.when(context.constants.widgetEvents.focusRestored,
              function() {
                // Extra actions defines by widgets in buildExtraContextMenuActions function
                this._contextMenu.removeAndDestroyActions(true);
                var newVmFocusWidget = this._uiWidget ? this._uiWidget.getVMFocusedWidget() : null;
                if (newVmFocusWidget === widget) {
                  newVmFocusWidget.buildExtraContextMenuActions(this._contextMenu);
                }
                if (this._contextMenu.hasVisibleAction()) {
                  this._contextMenu.show();
                }
              }.bind(this), true); // true : execute only once
          }
        },

        /**
         * Returns contextMenu widget
         * @returns {classes.ContextMenuWidget} contextMenu widget
         */
        getContextMenu: function() {
          return this._contextMenu;
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         * @param {Object=} options - possible options
         * @param {boolean=} options.noDOMInsert - won't add child to DOM
         * @param {number=} options.position - insert position
         * @param {string=} options.tag - context tag
         * @param {string=} options.mode - context mode : null|"replace"
         */
        addChildWidget: function(widget, options) {
          this._uiWidget = widget;
          $super.addChildWidget.call(this, widget, options);
        },
        /**
         * Set application hash
         * @param {string} applicationHash
         */
        setApplicationHash: function(applicationHash) {
          this._appHash = applicationHash;
        },
        /**
         * Hide waiter
         */
        hideWaiter: function() {
          this._waiter.getElement().remove();
        },
        /**
         * Return sidebar widget
         * @returns {classes.SessionSidebarApplicationItemWidget}
         */
        getSidebarWidget: function() {
          return this._sidebarWidget;
        },
        /**
         * Activate application
         */
        activate: function() {
          this.emit(context.constants.widgetEvents.activate);
          if (this._uiWidget) {
            this._uiWidget.emit(context.constants.widgetEvents.activate);
          }
        },
        /**
         * Bind an handler executed when application is activated
         * @param {Hook} hook
         * @returns {HandleRegistration} return handler reference
         */
        onActivate: function(hook) {
          this._handlers.push(this.when(context.constants.widgetEvents.activate, hook));
          return this._handlers[this._handlers.length - 1];
        },
        /**
         * Disable application
         */
        disable: function() {
          this.emit(context.constants.widgetEvents.disable);
          if (this._uiWidget) {
            this._uiWidget.emit(context.constants.widgetEvents.disable);
          }
        },
        /**
         * Emit a request to relayout application
         */
        layoutRequest: function() {
          this.emit(context.constants.widgetEvents.layoutRequest);
        },
        /**
         * Bind an handler executed when layout is requested
         * @param hook
         * @returns {Function} return handler reference
         */
        onLayoutRequest: function(hook) {
          this._handlers.push(this.when(context.constants.widgetEvents.layoutRequest, hook));
          return this._handlers[this._handlers.length - 1];
        },

        /**
         * @inheritDoc
         */
        flash: function() {
          this.addClass("flash");
          this._registerTimeout(function() {
            this.removeClass("flash");
          }.bind(this), 50);
        },

        /**
         * register function to run when not buffering. Executed directly if not buffering.
         * @param {Function} fn function to run when not buffering
         * @param {classes.WidgetBase} ctx a widget context - used to check is this context is destroyed or not when executing
         * @returns {boolean} whether or not the function zas buffered
         */
        domAttributesMutationBuffer: function(fn, ctx) {
          if (this._isBuffering) {
            this._domAttributesMutationBuffer.push([fn, ctx]);
            return true;
          }
          return false;
        },

        /**
         * register function to run when not buffering. Executed directly if not buffering.
         * @param {Function} fn function to run when not buffering
         * @param {classes.WidgetBase} context a widget context - used to check is this context is destroyed or not when executing
         * @returns {boolean} whether or not the function zas buffered
         */
        afterDomMutationBuffer: function(fn, context) {
          if (this._isBuffering || this._isDomMutating) {
            this._afterDomMutationBuffer.push([fn, context]);
            return true;
          }
          return false;
        },

        /**
         * Set buffering state
         * @param {boolean} buffering the new buffering state
         */
        bufferizeDom: function(buffering) {
          if (buffering) {
            this._isBuffering = true;
          } else {
            this._isDomMutating = true;
            this._isBuffering = false;
            var domAttributesMutationBuffer = this._domAttributesMutationBuffer;
            this._domAttributesMutationBuffer = [];
            var afterDomMutationBuffer = this._afterDomMutationBuffer;
            this._afterDomMutationBuffer = [];
            domAttributesMutationBuffer.forEach(function(item) {
              if (!item[1] || !item[1].isDestroyed()) {
                item[0]();
              }
            });
            this._registerAnimationFrame(function(afterDomMutationBuffer) {
              context.styler.bufferize();
              afterDomMutationBuffer.forEach(function(item) {
                if (!item[1] || !item[1].isDestroyed()) {
                  item[0]();
                }
              });
              context.styler.flush();
            }.bind(this, afterDomMutationBuffer));
            this._isDomMutating = false;
          }
        },

        /**
         * @inheritDoc
         */
        hasChildWebComponent: function() {
          return (Boolean(this._uiWidget) && this._uiWidget.hasChildWebComponent()) ||
            $super.hasChildWebComponent.call(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Application', cls.ApplicationWidget);
  });
