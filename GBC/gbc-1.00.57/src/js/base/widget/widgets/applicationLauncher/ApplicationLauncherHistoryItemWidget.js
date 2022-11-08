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

modulum('ApplicationLauncherHistoryItemWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationLauncherHistoryItemWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationLauncherHistoryItemWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationLauncherHistoryItemWidget.prototype */ {
        __name: "ApplicationLauncherHistoryItemWidget",
        constructor: function(opts) {
          var historyItem = (opts || {}).history;
          $super.constructor.call(this, opts);
          this._element.getElementsByClassName("title")[0].textContent = historyItem.name;
          this._element.getElementsByClassName("link")[0].textContent = historyItem.url;
          this._element.getElementsByClassName("desc")[0].on("click.ApplicationLauncherHistoryItemWidget", function() {
            var data = context.HistoryService.getHistory(String(historyItem.name));
            if (data) {
              context.UrlService.goTo(data.url);
            }
          });
          this._element.getElementsByClassName("logs")[0].on("click.ApplicationLauncherHistoryItemWidget", function() {
            //TODO : pop logs
          });
          this._element.getElementsByClassName("delete")[0].on("click.ApplicationLauncherHistoryItemWidget", function() {
            context.HistoryService.removeHistory(String(historyItem.name));
          });
        },
        destroy: function() {
          this._element.getElementsByClassName("desc")[0].off("click.ApplicationLauncherHistoryItemWidget");
          this._element.getElementsByClassName("logs")[0].off("click.ApplicationLauncherHistoryItemWidget");
          this._element.getElementsByClassName("delete")[0].off("click.ApplicationLauncherHistoryItemWidget");
          if (this._element) {
            this._element.remove();
          }
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationLauncherHistoryItem', cls.ApplicationLauncherHistoryItemWidget);
  });
