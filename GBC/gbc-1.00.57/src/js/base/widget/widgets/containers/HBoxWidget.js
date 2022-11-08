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

modulum('HBoxWidget', ['BoxWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * HBox widget
     * @publicdoc Widgets
     * @class HBoxWidget
     * @memberOf classes
     * @extends classes.BoxWidget
     */
    cls.HBoxWidget = context.oo.Class(cls.BoxWidget, function($super) {
      return /** @lends classes.HBoxWidget.prototype */ {
        __name: "HBoxWidget",
        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._element.addClass("g_HBoxLayoutEngine");
        },
        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.HBoxLayoutEngine(this);
        },
        /**
         * @inheritDoc
         */
        _createSplitter: function() {
          return cls.WidgetFactory.createWidget("HBoxSplitter", this.getBuildParameters());
        }
      };
    });
    cls.WidgetFactory.registerBuilder('HBox', cls.HBoxWidget);
  });
