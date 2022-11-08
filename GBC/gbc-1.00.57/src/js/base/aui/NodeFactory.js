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
/**
 * @typedef {Object} nodeInfo
 * @property {string} type
 * @property {number} id
 * @property {Object.<string, *>} attributes
 * @property {nodeInfo[]} children
 */

modulum('NodeFactory', ['Factory', 'StandardNode'],

  function(context, cls) {
    /**
     * @namespace classes.NodeFactory
     */
    cls.NodeFactory = context.oo.StaticClass(function() {
      /**
       *
       * @type {classes.Factory<classes.NodeBase>}
       */
      var factory = new cls.Factory("Node", cls.StandardNode);
      return /** @lends classes.NodeFactory */ {
        /**
         *
         * @param {string} type
         * @param {Function} constructor
         */
        register: function(type, constructor) {
          factory.register(type, constructor);
        },
        /**
         *
         * @param {string} type
         */
        unregister: function(type) {
          factory.unregister(type);
        },
        /**
         *
         * @param {string} type
         * @returns {classes.NodeBase}
         */
        create: function(type, arg1, arg2, arg3, arg4, arg5) {
          return factory.create(type, arg1, arg2, arg3, arg4, arg5);
        },
        /**
         * Create recursively all model nodes for the given nodeInfo
         * @param {classes.NodeBase} parent parent node
         * @param {nodeInfo} nodeInfo node information
         * @param {classes.VMApplication=} app owner application
         * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
         * @returns {classes.NodeBase[]} created nodes
         */
        createRecursive: function(parent, nodeInfo, app, treeModificationTrack) {
          return this._createRecursive(parent, nodeInfo, app, treeModificationTrack, true);
        },
        /**
         * Create recursively all model nodes for the given nodeInfo
         * Internal implementation
         * @param {classes.NodeBase} parent parent node
         * @param {nodeInfo} nodeInfo node information
         * @param {classes.VMApplication=} app owner application
         * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
         * @param {boolean} isSubTreeRoot true if the node to create is a subtree root
         * @returns {classes.NodeBase[]} created nodes
         * @private
         */
        _createRecursive: function(parent, nodeInfo, app, treeModificationTrack, isSubTreeRoot) {
          if (!app.ended) {
            var current = factory.create.call(factory, nodeInfo.type, parent, nodeInfo, app);
            treeModificationTrack.nodeCreated(current._id, isSubTreeRoot);
            if (nodeInfo.children && Array.isArray(nodeInfo.children)) {
              for (var i = 0; i < nodeInfo.children.length; i++) {
                this._createRecursive(current, nodeInfo.children[i], app, treeModificationTrack);
              }
            }
            current.childrenCreated();
            return current;
          }
          return null;
        }
      };
    });
  });
