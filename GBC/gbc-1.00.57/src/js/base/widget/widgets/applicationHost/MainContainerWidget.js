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

modulum('MainContainerWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class MainContainerWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.MainContainerWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.MainContainerWidget.prototype */ {
        __name: "MainContainerWidget",

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        _initLayout: function() {
          // no layout
        }
      };
    });
    cls.WidgetFactory.registerBuilder('MainContainer', cls.MainContainerWidget);
  });
