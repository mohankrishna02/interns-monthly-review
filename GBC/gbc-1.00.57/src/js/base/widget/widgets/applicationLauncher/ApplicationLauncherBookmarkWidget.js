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

modulum('ApplicationLauncherBookmarkWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationLauncherBookmarkWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationLauncherBookmarkWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ApplicationLauncherBookmarkWidget.prototype */ {
        __name: "ApplicationLauncherBookmarkWidget",
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.refresh();
          context.BookmarkService.onRefreshed(this.refresh.bind(this));
        },
        refresh: function() {
          while (this._children.length) {
            this._children.pop().destroy();
          }
          var bookmark = context.BookmarkService.getBookmarks();
          for (var i = 0; i < bookmark.length; i++) {
            var opts = this.getBuildParameters();
            opts.bookmark = bookmark[i];
            var item = cls.WidgetFactory.createWidget('ApplicationLauncherBookmarkItem', opts);
            this.addChildWidget(item);
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationLauncherBookmark', cls.ApplicationLauncherBookmarkWidget);
  });
