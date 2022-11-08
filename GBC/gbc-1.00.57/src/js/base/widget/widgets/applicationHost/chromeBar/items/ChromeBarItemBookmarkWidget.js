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

modulum('ChromeBarItemBookmarkWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Bookmark button in ChromeBar
     * @class ChromeBarItemBookmarkWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemBookmarkWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemBookmarkWidget.prototype */ {
        __name: "ChromeBarItemBookmarkWidget",
        __templateName: "ChromeBarItemWidget",

        /** @type boolean */
        _activated: false,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.bookmark'));
          this.setTitle(i18next.t('gwc.main.chromebar.bookmarkAlt'));
          this.setImage("zmdi-bookmark-outline");
          if (gbc.SessionService.getCurrent()) {
            var bookmark = context.BookmarkService.getBookmark(gbc.SessionService.getCurrent().getAppId());
            this.setActivated(Boolean(bookmark));
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          var url = context.UrlService.currentUrl();
          this.setActivated(!this._activated);
          context.BookmarkService.switchBookmark(gbc.SessionService.getCurrent().getAppId(), url.toString());
          return false;
        },

        /**
         *
         * @param activated
         */
        setActivated: function(activated) {
          this._activated = activated;
          var i = this._element.getElementsByTagName("i")[0];
          i.toggleClass("zmdi-bookmark", Boolean(activated))
            .toggleClass("zmdi-bookmark-outline", !activated);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemBookmark', cls.ChromeBarItemBookmarkWidget);
  });
