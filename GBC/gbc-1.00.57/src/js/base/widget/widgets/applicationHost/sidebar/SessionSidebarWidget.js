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

modulum('SessionSidebarWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class SessionSidebarWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.SessionSidebarWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.SessionSidebarWidget.prototype */ {
        __name: "SessionSidebarWidget",

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        _initLayout: function() {
          // no layout
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        _addChildWidgetToDom: function(widget) {
          var itemHost = document.createElement('li');
          itemHost.addClass('mt-action');
          widget.getLayoutInformation().setHostElement(itemHost);
          this._containerElement.appendChild(itemHost);
          itemHost.appendChild(widget._element);
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        _removeChildWidgetFromDom: function(widget) {
          if (widget) {
            var info = widget.getLayoutInformation(),
              host = info && info.getHostElement();
            if (host && host.parentNode === this._containerElement) {
              widget._element.remove();
              host.remove();
              host = null;
            }
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('SessionSidebar', cls.SessionSidebarWidget);
  });
