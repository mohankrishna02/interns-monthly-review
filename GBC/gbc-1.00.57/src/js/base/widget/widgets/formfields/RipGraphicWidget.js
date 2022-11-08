/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('RipGraphicWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Label widget.
     * @class RipGraphicWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.RipGraphicWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.RipGraphicWidget.prototype */ {
        __name: 'RipGraphicWidget',

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
          }
        },
        setType: function(type) {
          this.addClass(type);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('RipGraphic', cls.RipGraphicWidget);
  });
