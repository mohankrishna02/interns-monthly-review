/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('SessionEndRedirectWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Widget displayed at the end of a session
     * @class SessionEndRedirectWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.SessionEndRedirectWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.SessionEndRedirectWidget.prototype */ {
        __name: "SessionEndRedirectWidget",

        _initLayout: function() {
          // no layout
        }
      };
    });
    cls.WidgetFactory.registerBuilder('SessionEndRedirect', cls.SessionEndRedirectWidget);
  });
