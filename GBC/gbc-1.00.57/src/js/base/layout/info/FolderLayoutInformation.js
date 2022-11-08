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

modulum('FolderLayoutInformation', ['EventListener', 'LayoutInformation'],
  function(context, cls) {
    /**
     * Folder layout information
     * This is an advanced class, be careful while using it
     * @class FolderLayoutInformation
     * @memberOf classes
     * @extends classes.LayoutInformation
     * @publicdoc Base
     */
    cls.FolderLayoutInformation = context.oo.Class(cls.LayoutInformation, function($super) {
      return /** @lends classes.FolderLayoutInformation.prototype */ {
        __name: "FolderLayoutInformation",

        /** @type {number} */
        _titlesContainerDeltaWidth: 0,
        /** @type {number} */
        _titlesContainerDeltaHeight: 0,

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
          this._titlesContainerDeltaWidth = 0;
          this._titlesContainerDeltaHeight = 0;
        },

        /**
         * get the difference between folder width and titles container width
         * @returns {number}
         */
        getTitlesContainerDeltaWidth: function() {
          return this._titlesContainerDeltaWidth;
        },
        /**
         * set the difference between folder width and titles container width
         * @param {number} titlesContainerDeltaWidth the width
         */
        setTitlesContainerDeltaWidth: function(titlesContainerDeltaWidth) {
          this._titlesContainerDeltaWidth = titlesContainerDeltaWidth;
        },

        /**
         * get the difference between folder height and titles container height
         * @returns {number}
         */
        getTitlesContainerDeltaHeight: function() {
          return this._titlesContainerDeltaHeight;
        },
        /**
         * get the difference between folder height and titles container height
         * @param {number} titlesContainerDeltaHeight the height
         */
        setTitlesContainerDeltaHeight: function(titlesContainerDeltaHeight) {
          this._titlesContainerDeltaHeight = titlesContainerDeltaHeight;
        }
      };
    });
  });
