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

modulum('BoxWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Box Widget
     * @publicdoc Widgets
     * @class BoxWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.BoxWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.BoxWidget.prototype */ {
        __name: "BoxWidget",
        _canSplit: null,
        _splitters: null,
        _splitterIdentifier: null,
        _ignoreStoredSettings: false,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          this._splitters = [];
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._splitters) {
            for (var i = this._splitters.length - 1; i > -1; i--) {
              var currentChildren = this._splitters[i].widget;
              currentChildren.destroy();
              currentChildren = null;
            }
            this._splitters.length = 0;
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          if (!(widget instanceof cls.SplitterWidget)) {
            options = options || {
              position: ((this._children.length || -1) + 1) / 2
            };
            if (Object.isNumber(options.position)) {
              options.position = options.position * 2;
            }
            if (options.position) {
              var splitter = this._createSplitter();
              splitter.activateSplitter(this._canSplit);
              var onSplit = splitter.when(context.constants.widgetEvents.splitter, this._onSplit.bind(this));
              var onSplitStart = splitter.when(context.constants.widgetEvents.splitterStart, this._onSplitStart.bind(this));
              var onSplitEnd = splitter.when(context.constants.widgetEvents.splitterEnd, this._onSplitEnd.bind(this));
              this.addChildWidget(splitter, {
                position: options.position - 1
              });
              this._splitters.splice(options.position / 2, 0, {
                widget: splitter,
                onSplit: onSplit,
                onSplitStart: onSplitStart,
                onSplitEnd: onSplitEnd
              });
            }
          }
          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * Create a splitter widget
         * @return {classes.SplitterWidget} the created splitter widget
         * @protected
         */
        _createSplitter: function() {
          return null;
        },

        /**
         * _onSplit
         * @param {classes.Event} event the event
         * @param {classes.EventListener} sender the sender
         * @param {*} delta the delta value
         * @private
         */
        _onSplit: function(event, sender, delta) {
          this._layoutEngine.splitting(delta);
          this.emit(context.constants.widgetEvents.splitter);
        },

        /**
         * _onSplitStart
         * @param {classes.Event} event the event
         * @param {classes.EventListener} sender the sender
         * @private
         */
        _onSplitStart: function(event, sender) {
          this._layoutEngine.startSplitting((this._children.indexOf(sender) - 1) / 2);
        },

        /**
         * _onSplitEnd
         * @param {classes.Event} event the event
         * @param {classes.EventListener} sender the sender
         * @private
         */
        _onSplitEnd: function(event, sender) {
          this._layoutEngine.stopSplitting();
          if (!this._ignoreStoredSettings) {
            context.StoredSettingsService.setSplitter(this._splitterIdentifier.formName,
              this._splitterIdentifier.id, this._layoutEngine._referenceSplitHints);
          }
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          if (!(widget instanceof cls.SplitterWidget)) {
            var pos = this._children.indexOf(widget) - 1;
            if (pos > 0) {
              this._children[pos].destroy();
            }
          } else {
            var item = this._splitters.find(function(splitter) {
              return splitter.widget === widget;
            });
            if (item) {
              item.onSplit();
              item.onSplitStart();
              item.onSplitEnd();
              this._splitters.remove(item);
            }
          }
          $super.removeChildWidget.call(this, widget);
        },

        /**
         * @inheritDoc
         */
        _addChildWidgetToDom: function(widget, position) {
          this.getLayoutEngine().registerChild(widget, position);
          var widgetHost = document.createElement('div');
          widgetHost.addClass('g_BoxElement');
          widget.getLayoutInformation().setHostElement(widgetHost);
          widgetHost.appendChild(widget._element);
          widgetHost.insertAt(position, this._containerElement);
        },

        /**
         * @inheritDoc
         */
        _removeChildWidgetFromDom: function(widget) {
          this.getLayoutEngine().unregisterChild(widget);
          var info = widget.getLayoutInformation(),
            host = info && info.getHostElement();
          if (host && host.parentNode === this._containerElement) {
            widget._element.remove();
            host.remove();
            host = null;
          }
        },

        /**
         * getIndexOfChild
         * @param {classes.WidgetBase} widget the widget
         * @return {number} the index
         */
        getIndexOfChild: function(widget) {
          var rawIndex = this._children.indexOf(widget);
          return rawIndex / (widget instanceof cls.SplitterWidget ? 1 : 2);
        },

        /**
         * ignoreStoredSettings
         * @param {boolean} ignore ignore stored settings
         */
        ignoreStoredSettings: function(ignore) {
          this._ignoreStoredSettings = Boolean(ignore);
        },

        /**
         * Initialize splitter layout engine hints
         */
        initSplitterLayoutEngine: function() {
          if (!this._ignoreStoredSettings) {
            if (this._layoutEngine.initSplitHints) {
              this._layoutEngine.initSplitHints(context.StoredSettingsService.getSplitter(
                this._splitterIdentifier.formName, this._splitterIdentifier.id));
            }
          }
        },

        /**
         * switchSplitters
         * @param {boolean} canSplit can split
         * @param {*} splitterId splitter id
         */
        switchSplitters: function(canSplit, splitterId) {
          if (this._canSplit !== canSplit) {
            this._splitterIdentifier = splitterId;

            this.initSplitterLayoutEngine();

            this._canSplit = canSplit;
            for (var i = 0; i < this._splitters.length; i++) {
              this._splitters[i].widget.activateSplitter(this._canSplit);
            }
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Box', cls.BoxWidget);
  });
