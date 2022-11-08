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

modulum('GridWidget', ['WidgetGridLayoutBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Grid widget.
     * @class GridWidget
     * @memberOf classes
     * @extends classes.WidgetGridLayoutBase
     */
    cls.GridWidget = context.oo.Class(cls.WidgetGridLayoutBase, function($super) {
      return /** @lends classes.GridWidget.prototype */ {
        __name: "GridWidget",
        _scrollWidget: null,
        _pageSize: null,
        _size: null,

        destroy: function() {
          if (this._scrollWidget) {
            this._scrollWidget.destroy();
            this._scrollWidget = null;
          }
          $super.destroy.call(this);
        },

        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          var scrollWidget = this.getScrollWidget();
          if (scrollWidget) {
            scrollWidget.setEnabled(enabled);
          }
        },
      };
    });
    cls.WidgetFactory.registerBuilder('Grid', cls.GridWidget);
  });
