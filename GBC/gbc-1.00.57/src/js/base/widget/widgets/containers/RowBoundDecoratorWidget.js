/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('RowBoundDecoratorWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * RowBound decorator.
     * @class RowBoundDecoratorWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc
     */
    cls.RowBoundDecoratorWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.RowBoundDecoratorWidget.prototype */ {
        __name: "RowBoundDecoratorWidget",

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          var rowBoundIconElement = this._element.getElementsByTagName('i')[0];
          var rowBoundContainerWidget = this.getTableWidgetBase();
          if (!rowBoundContainerWidget && this.getParentWidget().isInstanceOf(cls.StretchableScrollGridLineWidget)) {
            rowBoundContainerWidget = this.getParentWidget().getParentWidget();
          }

          if (rowBoundContainerWidget && domEvent.target.isElementOrChildOf(rowBoundIconElement)) {
            // request focus
            if (this.getParentWidget().requestFocus) {
              this.getParentWidget().requestFocus(domEvent);
            }

            // request open rowbound
            var rowBoundWidget = rowBoundContainerWidget.getRowBoundWidget();
            rowBoundWidget.parentElement = rowBoundIconElement;
            rowBoundWidget.reverseX = true;
            rowBoundWidget.emit(context.constants.widgetEvents.contextMenu);
            return false;
          }
          return true;
        },
      };
    });
    cls.WidgetFactory.registerBuilder('RowBoundDecorator', cls.RowBoundDecoratorWidget);
  });
