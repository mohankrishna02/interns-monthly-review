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

modulum('ActionNode', ['StandardNode', 'NodeFactory'],
  function(context, cls) {
    /**
     * Action node (AUI)
     * @class ActionNode
     * @memberOf classes
     * @extends classes.StandardNode
     */
    cls.ActionNode = context.oo.Class(cls.StandardNode, function($super) {
      return /** @lends classes.ActionNode.prototype */ {

        $static: /** @lends classes.ActionNode */ {
          /**
           * Return true if actionName correspond to a field navigation action
           * @param {string} actionName - name of the action
           * @returns {boolean} true if action is field navigation
           */
          isFieldNavigationAction: function(actionName) {
            return ['nextfield', 'prevfield'].indexOf(actionName) > -1;
          },

          /**
           * Return true if actionName correspond to a table/matrix navigation action
           * @param {string} actionName - name of the action
           * @returns {boolean} true if action is table navigation
           */
          isTableNavigationAction: function(actionName) {
            return ['nextrow', 'prevrow',
              'firstrow', 'lastrow',
              'nextpage', 'prevpage'
            ].indexOf(actionName) > -1;
          },

          /**
           * Returns required accelerator for some specific actions (required by VM)
           * @param {string} actionName - name of the action
           * @returns {string} required accelerator or null
           */
          getRequiredAccelerator: function(actionName) {
            var requiredAccelerator = null;
            if (actionName === 'nextfield') {
              requiredAccelerator = "tab";
            } else if (actionName === 'prevfield') {
              requiredAccelerator = "shift-tab";
            }
            return requiredAccelerator;
          }
        },

        /**
         * Send action event to VM.
         */
        execute: function() {
          var actionService = this.getApplication().getActionApplicationService();
          actionService.execute(this._id);
        }
      };
    });
    cls.NodeFactory.register("Action", cls.ActionNode);
  });
