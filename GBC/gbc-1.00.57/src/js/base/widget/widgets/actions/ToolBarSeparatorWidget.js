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

modulum('ToolBarSeparatorWidget', ['ColoredWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * ToolBarSeparator widget.
     * @class ToolBarSeparatorWidget
     * @memberOf classes
     * @extends classes.ColoredWidgetBase
     * @publicdoc
     */
    cls.ToolBarSeparatorWidget = context.oo.Class(cls.ColoredWidgetBase, function($super) {
      return /** @lends classes.ToolBarSeparatorWidget.prototype */ {
        __name: 'ToolBarSeparatorWidget'
      };
    });
    cls.WidgetFactory.registerBuilder('ToolBarSeparator', cls.ToolBarSeparatorWidget);
  });
