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

modulum('VBoxWidget', ['BoxWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * VBox widget
     * @publicdoc Widgets
     * @class VBoxWidget
     * @memberOf classes
     * @extends classes.BoxWidget
     */
    cls.VBoxWidget = context.oo.Class(cls.BoxWidget, function($super) {
      return /** @lends classes.VBoxWidget.prototype */ {
        __name: "VBoxWidget",
        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._element.addClass("g_VBoxLayoutEngine");
        },
        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.VBoxLayoutEngine(this);
        },
        /**
         * @inheritDoc
         */
        _createSplitter: function() {
          return cls.WidgetFactory.createWidget("VBoxSplitter", this.getBuildParameters());
        }
      };
    });
    cls.WidgetFactory.registerBuilder('VBox', cls.VBoxWidget);
    cls.WidgetFactory.registerBuilder('HBox[customWidget=vbox]', cls.VBoxWidget);
  });
