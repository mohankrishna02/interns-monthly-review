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

modulum('WaitingWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class WaitingWidget, used for direct connection
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.WaitingWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.WaitingWidget.prototype */ {
        __name: "WaitingWidget"
      };
    });
    cls.WidgetFactory.registerBuilder('Waiting', cls.WaitingWidget);
  });
