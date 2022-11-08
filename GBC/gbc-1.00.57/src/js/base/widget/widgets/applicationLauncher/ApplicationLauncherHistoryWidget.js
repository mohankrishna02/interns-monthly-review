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

modulum('ApplicationLauncherHistoryWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationLauncherHistoryWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationLauncherHistoryWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ApplicationLauncherHistoryWidget.prototype */ {
        __name: "ApplicationLauncherHistoryWidget",

        _currentHistory: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._currentHistory = [];
          this._element.getElementsByClassName("removeHistory")[0].on("click.ApplicationLauncherHistoryWidget", function() {
            context.HistoryService.clearHistory();
          });
          this.refresh();
          context.HistoryService.onRefreshed(this.refresh.bind(this));
        },
        refresh: function() {

          var history = context.HistoryService.getHistory();
          var diff = history.length - this._currentHistory.length;

          //detect if new history seems different, if so we rebuild the whole history
          //if (this._currentHistory.length > 0 && history.length > 0 && diff > -1) {

          //  if (this._currentHistory[this._currentHistory.length - 1].date !== history[history.length - 1].date) {
          while (this._children.length) {
            this._children.pop().destroy();
          }
          this._currentHistory.length = 0;
          //  }
          //}
          var i = 0;
          if (this._currentHistory.length === 0) {
            for (i = 0; i < history.length; i++) {
              this._addHistoryItem(history[i]);
            }
          } else {
            // loop to add only new item
            for (i = diff - 1; i > -1; i--) {
              this._addHistoryItem(history[i], {
                position: 0
              });
            }
          }
        },

        /**
         *
         * @param historyItem {Object}
         * @param {Object=} options - possible options
         * @param {boolean=} options.noDOMInsert - won't add child to DOM
         * @param {number=} options.position - insert position
         * @param {string=} options.tag - context tag
         * @param {string=} options.mode - context mode : null|"replace"
         * @private
         */
        _addHistoryItem: function(historyItem, options) {

          var opts = this.getBuildParameters();
          opts.history = historyItem;

          var item = cls.WidgetFactory.createWidget('ApplicationLauncherHistoryItem', opts);
          this.addChildWidget(item, options);
          this._currentHistory.push(historyItem);
        },

        destroy: function() {
          this._element.getElementsByClassName("removeHistory")[0].off("click.ApplicationLauncherHistoryWidget");
          for (var i = this.getChildren().length - 1; i > -1; i--) {
            var currentChildren = this.getChildren()[i];
            currentChildren.destroy();
            currentChildren = null;
          }
          this._currentHistory.length = 0;
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationLauncherHistory', cls.ApplicationLauncherHistoryWidget);
  });
