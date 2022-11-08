/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TreeModificationTracker', [],
  function(context, cls) {
    /**
     * Records AUI tree modifications
     * @class TreeModificationTracker
     * @memberOf classes
     */
    cls.TreeModificationTracker = context.oo.Class(function($super) {
      return /** @lends classes.TreeModificationTracker.prototype */ {
        __name: "TreeModificationTracker",

        /** @type Map<number,*>*/
        _modifications: null,

        constructor: function() {
          this._modifications = new Map();
        },

        /**
         * Returns the tree modifications for the given node. Creates a new entry if not found
         * @param {number} nodeId node idRef
         * @return {*} the modifications for the given node
         * @private
         */
        _fetch: function(nodeId) {
          var mods = this._modifications.get(nodeId);
          if (!mods) {
            mods = {
              createdSubTreeRoot: false,
              created: false,
              removed: false,
              updatedAttributes: {}
            };
            this._modifications.set(nodeId, mods);
          }
          return mods;
        },

        /**
         * @param {number} nodeId
         * @return {*} the node's modifications or undefined
         */
        get: function(nodeId) {
          return this._modifications.get(nodeId);
        },

        /**
         * Records a node creation
         * @param {number} nodeId node idRef
         * @param subTreeRoot true if this is a VM order sub tree root node
         */
        nodeCreated: function(nodeId, subTreeRoot) {
          var mods = this._fetch(nodeId);
          mods.created = true;
          mods.createdSubTreeRoot = Boolean(subTreeRoot);
        },

        /**
         * @param {number} nodeId node idRef
         * @return {boolean} true if the node has been created
         */
        isNodeCreated: function(nodeId) {
          var mods = this._modifications.get(nodeId);
          return mods ? mods.created : false;
        },

        /**
         * @param {number} nodeId node idRef
         * @return {*} true if the node is a VM sub tree root node
         */
        isNodeCreatedAndSubTreeRoot: function(nodeId) {
          var mods = this._modifications.get(nodeId);
          return mods ? mods.createdSubTreeRoot : false;
        },

        /**
         * Records a removed node
         * @param {number} nodeId node idRef
         */
        nodeRemoved: function(nodeId) {
          this._fetch(nodeId).removed = true;
        },

        /**
         * @param {number} nodeId node idRef
         * @return {boolean} true if the node has been removed
         */
        isNodeRemoved: function(nodeId) {
          var mods = this._modifications.get(nodeId);
          return mods ? mods.removed : false;
        },

        /**
         * Records an attribute modification
         * @param {number} nodeId node idRef
         * @param {string} attributeName name of the attribute
         */
        attributeChanged: function(nodeId, attributeName) {
          this._fetch(nodeId).updatedAttributes[attributeName] = true;
        },

        /**
         * @param {number} nodeId node idRef
         * @return {{string:boolean}} the updated attributes
         */
        getChangedAttributes: function(nodeId) {
          var mods = this._modifications.get(nodeId);
          return mods ? mods.updatedAttributes : {};
        },

        /**
         * @param {number} nodeId node idRef
         * @param attributeName attribute name
         * @return {boolean} true if the attribute value has changed
         */
        isNodeAttributeChanged: function(nodeId, attributeName) {
          var mods = this._modifications.get(nodeId);
          return mods ? mods.updatedAttributes[attributeName] : false;
        },

        /**
         * Iterate over all modifications
         * @param {Function} handler callback with value, keys arguments
         */
        forEach: function(handler) {
          this._modifications.forEach(handler);
        }
      };
    });
  }
);
