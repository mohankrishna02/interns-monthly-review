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

modulum('TraditionalWindowWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Base class for widgets.
     * @class TraditionalWindowWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.TraditionalWindowWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TraditionalWindowWidget.prototype */ {
        __name: "TraditionalWindowWidget",

        constructor: function(opts) {
          $super.constructor.call(this, opts);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('TraditionalWindow', cls.TraditionalWindowWidget);
  });
