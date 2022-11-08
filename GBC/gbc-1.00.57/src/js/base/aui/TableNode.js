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

modulum('TableNode', ['StandardNode', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class TableNode
     * @memberOf classes
     * @extends classes.StandardNode
     */
    cls.TableNode = context.oo.Class(cls.StandardNode, function($super) {
      return /** @lends classes.TableNode.prototype */ {

        /** @type boolean */
        _isTree: false,

        /**
         * @inheritDoc
         */
        setInitialStyleAttributes: function() {
          $super.setInitialStyleAttributes.call(this);
          var defaultWidget = context.ThemeService.getValue("theme-table-default-widget");

          if (defaultWidget && !this._isTree) {
            if (defaultWidget.toLowerCase() === "listview" && typeof(this._initialStyleAttributes.tableType) === "undefined") {
              // if there theme default is listview and there is no tableType 4ST defined
              this._initialStyleAttributes.tableType = "listView";
            }
          }
        },

        /**
         * @inheritDoc
         */
        autoCreateChildrenControllers: function() {
          // Tables as ListViews have their custom line controllers in ListViewPageSizeVMBehavior
          return !this.isListView();
        },

        /**
         * @inheritDoc
         */
        updateAttributes: function(attributes) {
          $super.updateAttributes.call(this, attributes);
          if (attributes.bufferSize !== undefined) {
            var treeInfo = this.getFirstChild('TreeInfo');
            if (treeInfo) {
              treeInfo.applyBehaviors(null, true, true);
            }
          }
        },

        /**
         * Return if table is a tree view.
         * @return {boolean} true if it is a tree
         */
        isTreeView: function() {
          return this._isTree;
        },

        /**
         * Return if table is a listview.
         * @return {boolean} true if it is a listview
         */
        isListView: function() {
          return (this._initialStyleAttributes.tableType === "listView");
        },

        getCurrentRowValueIndex: function() {
          return this.attribute('currentRow') - this.attribute('offset');
        },

        /**
         * Will get current value node in table
         * @param {boolean} inputModeOnly - return value node only if is node is in INPUT mode
         * @returns {*}
         */
        getCurrentValueNode: function(inputModeOnly) {
          var dialogType = this.attribute('dialogType');
          var isInputMode = (dialogType === "Input" || dialogType === "InputArray" || dialogType === "Construct");
          if (!inputModeOnly || isInputMode) {
            var valueIndex = this.getCurrentRowValueIndex();
            var columnNodes = this.getChildren('TableColumn');
            if (!this.isAttributeSetByVM('currentColumn')) {
              return null; // if attribute is not specified by VM consider that there is no current value
            }
            var currentColumn = this.attribute('currentColumn');
            if (currentColumn < columnNodes.length) {
              var columnNode = columnNodes[currentColumn];
              var valueListNode = columnNode.getFirstChild('ValueList');
              if (valueListNode) {
                var valueNodes = valueListNode.getChildren();
                if (valueIndex >= 0 && valueIndex < valueNodes.length) {
                  return valueNodes[valueIndex];
                }
              }
            }
          }
          return null;
        }
      };
    });
    cls.NodeFactory.register("Table", cls.TableNode);
  });
