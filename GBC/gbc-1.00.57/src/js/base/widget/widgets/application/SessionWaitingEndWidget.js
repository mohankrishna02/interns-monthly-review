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

modulum('SessionWaitingEndWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class SessionWaitingEndWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.SessionWaitingEndWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.SessionWaitingEndWidget.prototype */ {
        __name: "SessionWaitingEndWidget",

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.querySelector(".mt-card-header-pic img").src = context.ThemeService.getResource("img/wheel.gif");
        },

        _initLayout: function() {
          // no layout
        },

        setHeader: function(message) {
          this._element.getElementsByClassName("mt-card-header-text")[0].innerHTML = message;
        },
        setMessage: function(message) {
          var messageElt = this._element.getElementsByClassName("message")[0];
          messageElt.removeClass("hidden");
          messageElt.innerHTML = message;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('SessionWaitingEnd', cls.SessionWaitingEndWidget);
  });
