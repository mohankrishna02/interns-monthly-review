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

modulum('PageLayoutInformation', ['EventListener', 'LayoutInformation'],
  function(context, cls) {
    /**
     * Page layout information
     * This is an advanced class, be careful while using it
     * @class PageLayoutInformation
     * @memberOf classes
     * @extends classes.LayoutInformation
     * @publicdoc Base
     */
    cls.PageLayoutInformation = context.oo.Class(cls.LayoutInformation, function($super) {
      return /** @lends classes.PageLayoutInformation.prototype */ {
        __name: "PageLayoutInformation",

        /** @type {number} */
        _titleMeasureWidth: 0,
        /** @type {number} */
        _titleMeasureHeight: 0,

        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
        },
        /**
         * @inheritDoc
         */
        reset: function(soft) {
          $super.reset.call(this, soft);
          this._titleMeasureWidth = 0;
          this._titleMeasureHeight = 0;
        },

        /**
         * get the page title width
         * @returns {number}
         */
        getTitleMeasureWidth: function() {
          return this._titleMeasureWidth;
        },

        /**
         * set the page title width
         * @param titleMeasureWidth
         */
        setTitleMeasureWidth: function(titleMeasureWidth) {
          this._titleMeasureWidth = titleMeasureWidth;
        },

        /**
         * get the page title height
         * @returns {number}
         */
        getTitleMeasureHeight: function() {
          return this._titleMeasureHeight;
        },

        /**
         * set the page title height
         * @param titleMeasureHeight
         */
        setTitleMeasureHeight: function(titleMeasureHeight) {
          this._titleMeasureHeight = titleMeasureHeight;
        }
      };
    });
  });
