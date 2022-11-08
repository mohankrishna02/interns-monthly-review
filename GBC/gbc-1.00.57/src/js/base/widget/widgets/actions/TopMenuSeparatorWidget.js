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

modulum('TopMenuSeparatorWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TopMenuSeparator widget.
     * @class TopMenuSeparatorWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc Widgets
     */
    cls.TopMenuSeparatorWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.TopMenuSeparatorWidget.prototype */ {
        __name: 'TopMenuSeparatorWidget',

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._parentWidget && this._parentWidget.isInstanceOf(cls.DropDownWidget)) {
            this._parentWidget.getParentWidget().removeChildWidget(this);
          }
          $super.destroy.call(this);
        },

        isEnabled: function() {
          return false;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TopMenuSeparator', cls.TopMenuSeparatorWidget);
  });
