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

modulum('TypeAheadGroup', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Group of commands
     * @class TypeAheadGroup
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadGroup = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadGroup.prototype */ {
        __name: "TypeAheadGroup",

        /** @type {classes.TypeAheadCommand[]} */
        _commands: null,

        /** @function */
        _executionFunc: null,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.TypeAheadCommand[]} commands - list of command
         * @param {function} func - execution function, if func() return true all commands are executed else nothing is done
         */
        constructor: function(app, commands, func) {
          $super.constructor.call(this, app, null);
          this._commands = commands;
          this._executionFunc = func;
        },

        /**
         * Add a command in the group.
         * Last command added is used to know if all commands of the group can be executed
         * @param {classes.TypeAheadCommand} cmd - command to be added
         */
        addCommand: function(cmd) {
          if (!this._commands) {
            this._commands = [];
          }
          this._commands.push(cmd);

          this._executionFunc = cmd.canBeExecuted.bind(cmd);
        },

        /**
         * @inheritDoc
         */
        checkIntegrity: function() {
          // if one command of the group is false all the group must be rejected
          for (var i = 0; i < this._commands.length; i++) {
            var cmd = this._commands[i];
            if (cmd.checkIntegrity() === false) {
              return false;
            }
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        isPredictable: function() {
          // if one command of the group is false all the group is not predicatble
          for (var i = 0; i < this._commands.length; i++) {
            var cmd = this._commands[i];
            if (cmd.isPredictable() === false) {
              return false;
            }
          }
          return true;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          if (this._executionFunc && this._executionFunc()) {

            while (this._commands.length !== 0) {
              var cmd = this._commands.shift();
              this._app.typeahead._addCommand(cmd);
            }

            return {
              processed: true,
              vmEvents: []
            };
          } else {
            return {
              processed: false,
              vmEvents: []
            };
          }
        }
      };
    });
  }
);
