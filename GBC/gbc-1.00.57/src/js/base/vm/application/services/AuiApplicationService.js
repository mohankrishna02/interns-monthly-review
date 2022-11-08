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

modulum('AuiApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * AUI tree model store
     * @class AuiApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.AuiApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.AuiApplicationService.prototype */ {
        __name: "AuiApplicationService",
        nodeHash: null,
        // logs
        contents: null,
        file: null,

        /**
         * @param {classes.VMApplication} app the owner application
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
          this.nodeHash = [];
          this.contents = ["LOGVERSION=2"];
        },

        /**
         * Clears the model
         */
        stop: function() {
          this.nodeHash.length = 0;
        },

        /**
         * Destroys the service
         */
        destroy: function() {
          this.nodeHash.length = 0;
          this.contents.length = 0;
          $super.destroy.call(this);
        },

        /**
         * Get a node object
         * @param {number|String} id - id of the Node to get
         * @returns {classes.NodeBase} Node Object
         */
        getNode: function(id) {
          if (Object.isNumber(id)) {
            return this.nodeHash[id];
          }
          if (Object.isString(id)) {
            return this.nodeHash[parseInt(id, 10)];
          }
          return null;
        },

        getNodesFrom: function(id, currentBag) {
          var result = currentBag || [];
          var localRoot = Object.isNumber(id) ? this.getNode(id || 0) : id;
          if (localRoot) {
            result.push(localRoot);
            for (var i = 0; i < localRoot.children.length; i++) {
              this.getNodesFrom(localRoot.children[i], result);
            }
          }
          if (!currentBag) {
            return result;
          } else {
            return null;
          }
        },

        /**
         * Add a node to the model
         * @param {number} id node idRef
         * @param {classes.NodeBase} node AUI tree node
         */
        addNode: function(id, node) {
          this.nodeHash[id] = node;
        },

        /**
         * Searches the nodes with the corresponding attribute and value
         * @param {string} attr attribute name
         * @param {string} value attribute value
         * @return {classes.NodeBase[]} the found node or null
         */
        getNodeByAttribute: function(attr, value) {
          return this.nodeHash.find(function(node) {
            return node ? node.attribute(attr) === value : false;
          });
        },

        /**
         * Searches the nodes with the corresponding tag
         * @param {string} tag node tag
         * @return {classes.NodeBase} the found nodes
         */
        getNodesByTag: function(tag) {
          return this.nodeHash.filter(function(node) {
            return node ? node.getTag() === tag : false;
          });
        },

        /**
         * Removes the node from the store
         * @param {number} id node idRef
         */
        removeNode: function(id) {
          this.nodeHash[id] = null;
        },

        /**
         * Creates and adds a node subtree to the store
         * @param {*} omCommand parsed VM command
         * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
         * @return {classes.NodeBase} root of the created subtree
         */
        commandAdd: function(omCommand, treeModificationTrack) {
          var parentNode = (omCommand.node.id === 0) ? null : this.getNode(omCommand.parent);
          var partRootNode = null;
          if (this._application) {
            partRootNode = gbc.classes.NodeFactory.createRecursive(parentNode, omCommand.node, this._application,
              treeModificationTrack);
          }
          return partRootNode;
        },

        /**
         * Update nodes attributes
         * @param {*} omCommand parsed VM command
         * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
         * @return {boolean} true if a relayout is required, false otherwise
         */
        commandUpdate: function(omCommand, treeModificationTrack) {
          var needRelayout = false,
            node = this.getNode(omCommand.id),
            attrsKeys = Object.keys(omCommand.attributes);
          if (omCommand.attributes && attrsKeys.length) {
            if (!treeModificationTrack.isNodeCreated(omCommand.id)) {
              var i = 0,
                len = attrsKeys.length;
              for (; i < len; i++) {
                var attr = attrsKeys[i];
                needRelayout = needRelayout || Boolean(cls.LayoutTriggerAttributes[omCommand.type][attr]);
                treeModificationTrack.attributeChanged(omCommand.id, attr);
              }
            }
          }
          node.updateAttributes(omCommand.attributes);
          return needRelayout;
        },

        /**
         * Handles VM node removal order
         * @param {number} omNode node idRef
         */
        remove: function(omNode) {
          var nodeToRemove = omNode || this._application && this._application.uiNode();
          if (nodeToRemove) {
            nodeToRemove.destroy();
          }
        },

        logFireEvent: function(eventContents) {

          // NOTE used to generate VM log (disabled temporally)

          var logItem = "" + this._application.applicationHash + ":FE:0:" + eventContents;

          /* if (context.$app._dvmLogger !== this) {
           context.$app._dvmLogger.contents.push(logItem);
           } else {
           this.contents.push(logItem);
           }*/
        },

        logDvm: function(dvmContents) {

          // NOTE used to generate VM log (disabled temporally)

          var logItem = "" + this._application.applicationHash + ":DVM:0:" + dvmContents;
          /* if (context.$app._dvmLogger !== this) {
           context.$app._dvmLogger.contents.push(logItem);
           } else {
           this.contents.push(logItem);
           }*/
        },

        linkDownload: function() {
          var data = new Blob([this.contents.join("\n")], {
            type: "text/plain"
          });

          if (this.file !== null) {
            window.URL.revokeObjectURL(this.file);
          }
          this.file = window.URL.createObjectURL(data);
          this._application.getSession().getWidget().getEndWidget().setAuiLogUrl(this._application.info().session, this.file);
        }
      };
    });
    cls.ApplicationServiceFactory.register("Model", cls.AuiApplicationService);
  });
