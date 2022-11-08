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

modulum('TopMenuWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TopMenu widget.
     * @class TopMenuWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.TopMenuWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TopMenuWidget.prototype */ {
        __name: 'TopMenuWidget',

        /**
         * Priority of this menu
         * @param {number} order the priority of this menu
         * @publicdoc
         */
        setOrder: function(order) {
          this.setStyle({
            order: order
          });
        },

        /**
         * Get priority of this menu
         * @returns {number} priority of this menu
         * @publicdoc
         */
        getOrder: function() {
          return this.getStyle('order');
        },

        /**
         * Get previous topmenugroup located at same level that refMenu
         * @param {classes.TopMenuGroupWidget} refMenu - topmenugroup used as search criteria
         * @returns {classes.TopMenuGroupWidget} returns previous topmenugroup
         * @publicdoc
         */
        getPreviousMenu: function(refMenu) {
          return this.getChildren()[this.getIndexOfChild(refMenu) - 1];
        },

        /**
         * Get next topmenugroup located at same level that refMenu
         * @param {classes.TopMenuGroupWidget} refMenu - topmenugroup used as search criteria
         * @returns {classes.TopMenuGroupWidget} returns next topmenugroup
         * @publicdoc
         */
        getNextMenu: function(refMenu) {
          return this.getChildren()[this.getIndexOfChild(refMenu) + 1];
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TopMenu', cls.TopMenuWidget);
  });
