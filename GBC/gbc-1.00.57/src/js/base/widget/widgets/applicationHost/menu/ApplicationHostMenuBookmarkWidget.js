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

modulum('ApplicationHostMenuBookmarkWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuBookmarkWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuBookmarkWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuBookmarkWidget.prototype */ {
        __name: "ApplicationHostMenuBookmarkWidget",

        /** @type boolean */
        _activated: false,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
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

        setActivated: function(activated) {
          this._activated = activated;
          var i = this._element.getElementsByTagName("i")[0];
          i.toggleClass("zmdi-bookmark", Boolean(activated))
            .toggleClass("zmdi-bookmark-outline", !activated);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationBookmarkHostMenu', cls.ApplicationHostMenuBookmarkWidget);
  });
