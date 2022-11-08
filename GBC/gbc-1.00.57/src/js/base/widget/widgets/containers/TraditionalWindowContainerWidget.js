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

modulum('TraditionalWindowContainerWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Base class for widgets.
     * @class TraditionalWindowContainerWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.TraditionalWindowContainerWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TraditionalWindowContainerWidget.prototype */ {
        __name: "TraditionalWindowContainerWidget",

        constructor: function(opts) {
          $super.constructor.call(this, opts);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TraditionalWindowContainer', cls.TraditionalWindowContainerWidget);
  });
