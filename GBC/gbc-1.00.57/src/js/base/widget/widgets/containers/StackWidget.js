/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('StackWidget', ['StackLayoutWidgetBase'],
  function(context, cls) {

    /**
     * Base class for widget group.
     * @class StackWidget
     * @memberOf classes
     * @extends classes.StackLayoutWidgetBase
     */
    cls.StackWidget = context.oo.Class(cls.StackLayoutWidgetBase, function($super) {
      return /** @lends classes.StackWidget.prototype */ {
        __name: "StackWidget"
      };
    });
    cls.WidgetFactory.registerBuilder('Stack', cls.StackWidget);
  });
