/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FormLayoutInformation', ['LayoutInformation'],
  function(context, cls) {
    /**
     * @class FormLayoutInformation
     * @memberOf classes
     * @extends classes.LayoutInformation
     */
    cls.FormLayoutInformation = context.oo.Class(cls.LayoutInformation, function($super) {
      return /** @lends classes.FormLayoutInformation.prototype */ {
        __name: "FormLayoutInformation",
        /**
         * Min size hint (minWidth, minHeight)
         * @type {classes.Size}
         */
        _minSizeHint: null,

        /** @type {Number} */
        _toolbarAllocatedWidth: 0,

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        constructor: function(widget) {
          this._minSizeHint = new cls.Size();
          $super.constructor.call(this, widget);
        },

        /**
         * @inheritDoc
         */
        reset: function(soft) {
          $super.reset.call(this, soft);
          this._minSizeHint.reset();
        },

        /**
         *
         * @returns {classes.Size}
         */
        getMinSizeHint: function() {
          return this._minSizeHint;
        },

        /**
         *
         * @param {number} width
         * @param {number} height
         */
        setMinSizeHint: function(width, height) {
          this._minSizeHint.setWidth(width);
          this._minSizeHint.setHeight(height);
        },

        /**
         * Set width allocated for toolbar
         * @param {Number} width - width of the allocated space
         */
        setToolbarAllocatedWidth: function(width) {
          this._toolbarAllocatedWidth = width;
        },

        /**
         * Get width allocated for toolbar
         * @return {number}
         */
        getToolbarAllocatedWidth: function() {
          return this._toolbarAllocatedWidth;
        }
      };
    });
  });
