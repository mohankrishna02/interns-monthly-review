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

modulum('TraditionalScreenWidget', ['WidgetGridLayoutBase'],
  function(context, cls) {

    /**
     * Base class for widget group.
     * @class TraditionalScreenWidget
     * @memberOf classes
     * @extends classes.WidgetGridLayoutBase
     */
    cls.TraditionalScreenWidget = context.oo.Class(cls.WidgetGridLayoutBase, function($super) {
      return /** @lends classes.TraditionalScreenWidget.prototype */ {
        __name: "TraditionalScreenWidget",

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.TraditionalLayoutEngine(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TraditionalScreen', cls.TraditionalScreenWidget);
  });
