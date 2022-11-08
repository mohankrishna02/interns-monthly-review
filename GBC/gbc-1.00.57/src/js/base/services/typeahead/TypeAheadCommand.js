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

modulum('TypeAheadCommand',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead commands base class.
     * @class TypeAheadCommand
     * @memberOf classes
     */
    cls.TypeAheadCommand = context.oo.Class(function() {
      return /** @lends classes.TypeAheadCommand.prototype */ {
        __name: "TypeAheadCommand",

        /**
         * Flag for augmentedFace
         * @type {boolean}
         */
        __virtual: true,

        /**
         * owning application
         * @type {classes.VMApplication}
         */
        _app: null,
        /**
         * command timestamp
         * @type {number}
         * */
        _time: 0,
        /**
         * linked AUI node
         * @type classes.NodeBase
         */
        _node: null,

        /**
         * @constructs
         * @param {classes.VMApplication} app owner
         * @param {classes.NodeBase} node linked AUI node
         */
        constructor: function(app, node) {
          this._app = app;
          this._time = Date.now();
          this._node = node;
        },

        /**
         * Returns if command can be executed.
         * @returns {boolean} true if command can be executed
         */
        canBeExecuted: function() {
          return true;
        },

        /**
         * Execute command
         * @returns {{processed: boolean, vmEvents: classes.VMEventBase[]}} object which contains a boolean to know if the command did something and an array containing the events to send to the VM
         */
        execute: function() {
          return {
            processed: false,
            vmEvents: []
          };
        },

        /**
         * Check if a command is valid and can be executed
         * For example a command on destroyed node is invalid
         * @returns {boolean} true if the command is valid, false otherwise
         */
        checkIntegrity: function() {
          var ok = true;
          if (this._node) {
            // check that the node is not destroyed
            ok = (this._node._destroyed === false);
          }
          return ok;
        },

        /**
         * test if the request has been accepted by the VM
         * @returns {boolean} true if the request has been accepted by the VM, false otherwise
         */
        validate: function() {
          return true;
        },

        /**
         * Rollback command
         */
        rollback: function() {
          this._app.getUI().getWidget().flash();
          context.LogService.typeahead.warn("Rollback command", this);
        },

        /**
         * merges with an other command
         * @param {classes.TypeAheadCommand} command the command to merge with
         * @returns {boolean} true if merged successfully
         */
        merge: function(command) {
          return false;
        },

        /**
         * test if this command needs to be sent to the VM before sending another one,
         * @returns {boolean} true if this command needs to be sent to the VM before sending another one, false otherwise
         */
        needsVmSync: function() {
          return false;
        },

        /**
         * Returns if result of command is predictable (or if we need to wait VM answer)
         * @returns {boolean} true if this command is predictable, false otherwise
         */
        isPredictable: function() {
          return true;
        },

        /**
         * Returns if only one command of this type must be added to typeahead queue
         * @return {boolean} true if command must be unique in typeahead queue
         */
        isUnique: function() {
          return false;
        },

        /**
         * get the linked AUI node
         * @returns {classes.NodeBase} the node associated to command
         */
        getNode: function() {
          return this._node;
        },

        /**
         * get the command timestamp
         * @returns {number} the command creation time
         */
        getTime: function() {
          return this._time;
        }
      };
    });
  }
);
