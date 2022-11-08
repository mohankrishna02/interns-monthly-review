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

modulum('ControllerGroup', ['EventListener'],
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class ControllerGroup
     * @memberOf classes
     * @extends classes.EventListener
     */
    cls.ControllerGroup = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.ControllerGroup.prototype */ {
        __name: "ControllerGroup",
        /**
         * @type {classes.NodeBase}
         */
        _anchorNode: null,
        /**
         * @type {classes.ControllerBase[]}
         */
        _controllers: null,

        /**
         * @param {classes.NodeBase} anchorNode bindings
         */
        constructor: function(anchorNode) {
          $super.constructor.call(this);
          this._anchorNode = anchorNode;
          this._controllers = [];
        },

        addController: function(controller) {
          this._controllers.push(controller);
        },

        getControllers: function() {
          return this._controllers;
        },

        /**
         * Applies all behaviors of sub-controllers
         */
        applyBehaviors: function(treeModificationTrack, force) {
          for (var i = 0; i < this._controllers.length; ++i) {
            this._controllers[i].applyBehaviors(treeModificationTrack, force);
          }
        },

        destroy: function() {
          for (var i = 0; i < this._controllers.length; ++i) {
            this._controllers[i].destroy();
          }
        },
        /**
         * Get the anchor node
         * @returns {classes.NodeBase}
         */
        getAnchorNode: function() {
          return this._anchorNode;
        },

        getWidget: function() {
          if (this._controllers.length) {
            return this._controllers[this._controllers.length - 1].getWidget();
          } else {
            return null;
          }
        },

        setStyleBasedBehaviorsDirty: function(noUsageCheck, noRecurse) {
          for (var i = 0; i < this._controllers.length; ++i) {
            this._controllers[i].setStyleBasedBehaviorsDirty(noUsageCheck, noRecurse);
          }
        },

        ensureVisible: function() {}
      };
    });
  }
);
