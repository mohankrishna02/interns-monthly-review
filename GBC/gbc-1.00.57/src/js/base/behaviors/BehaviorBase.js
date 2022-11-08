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

modulum('BehaviorBase', ['EventListener'],
  /**
   * @namespace Behaviors
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base class for all behaviors
     * @class BehaviorBase
     * @memberOf classes
     */
    cls.BehaviorBase = context.oo.Class(function($super) {
      return /** @lends classes.BehaviorBase.prototype */ {
        __name: "BehaviorBase",
        /**
         * List of watched attributes
         * @type {Object}
         * @protected
         */
        _watchedAttributes: null,
        /**
         * List of watched style attributes
         * @type {string[]}
         * @protected
         */
        usedStyleAttributes: null,
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function() {
          this.watchedBindings = this.watchedAttributes && Object.keys(this.watchedAttributes);
          this.watchedBindingsCount = this.watchedBindings && this.watchedBindings.length;
        },
        //TODO see if this return value is used somewhere
        /**
         * Applies the behavior on the widget
         * @param {classes.ControllerBase} controller The controller to apply the behavior
         * @param {*} data data to pass to the behavior
         * @return {boolean} bool
         */
        apply: function(controller, data) {
          data.dirty = false;
          return this._apply(controller, data);
        },
        /**
         * internal method to be overriden in behaviors
         * @protected
         * @param {classes.ControllerBase} controller The controller to apply the behavior
         * @param {*} data data to pass to the behavior
         * @return {boolean} bool
         */
        _apply: function(controller, data) {
          context.LogService.error("Behavior " + this.__name + " must override apply()");
          return false;
        },
        /**
         * Attaches the needed observers to the AUI tree.
         * This is the top level implementation. Checks that the behavior isn't already attached
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        attach: function(controller, data) {
          this.detach(controller, data);
          this._attach(controller, data);
        },

        /**
         * Attaches the needed observers to the AUI tree
         * @protected
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        _attach: function(controller, data) {},
        /**
         * Detached all AUI tree observers*
         * This is the top level implementation. Checks that the behavior is attached
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        detach: function(controller, data) {
          this._detach(controller, data);
        },
        /**
         * Detached all AUI tree observers
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        _detach: function(controller, data) {},
        /**
         * Attaches the needed observers Widget.
         * This is the top level implementation. Checks that the behavior isn't already attached
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        attachWidget: function(controller, data) {
          this.detachWidget(controller, data);
          this._attachWidget(controller, data);
        },
        /**
         * Attaches the needed observers to Widget
         * @protected
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        _attachWidget: function(controller, data) {},
        /**
         * Detached all Widget observers*
         * This is the top level implementation. Checks that the behavior is attached
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        detachWidget: function(controller, data) {
          this._detachWidget(controller, data);
        },
        /**
         * Detached all Widget observers
         * @protected
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        _detachWidget: function(controller, data) {},
        /**
         * Attach the behavior to the controller
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        firstAttach: function(controller, data) {
          this.attach(controller, data);
          this.attachWidget(controller, data);
        },
        /**
         * get a list of pair node/attribute names
         * @return {Object} the watched attributes
         * @protected
         */
        _getWatchedAttributes: function() {
          return this._watchedAttributes;
        },
        /**
         * test if the behavior can apply to the controller
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
         * @return {boolean} true if behavior can apply to the controller
         */
        canApply: function(controller, data, treeModificationTrack) {
          if (data.dirty) {
            return true;
          }

          if (this.watchedAttributes) {
            var len = this.watchedBindingsCount;
            for (var i = 0; i < len; ++i) {
              var nodeBinding = this.watchedBindings[i];
              var node = controller._nodeBindings[nodeBinding];
              if (node) {
                if (treeModificationTrack.isNodeCreated(node)) {
                  return true;
                }
                var modifiedAttributes = treeModificationTrack.getChangedAttributes(node._id);
                var nodeWatchedAttributes = this.watchedAttributes[nodeBinding],
                  attrLen = nodeWatchedAttributes.length;
                for (var j = 0; j < attrLen; ++j) {
                  if (modifiedAttributes[nodeWatchedAttributes[j]]) {
                    return true;
                  }
                }
              }
            }
          }

          var watched = this._getWatchedAttributes();
          if (watched) {
            var xi = 0,
              xlen = watched.length;

            for (; xi < xlen; xi++) {
              var current = watched[xi];
              if (!current.node) {
                continue;
              }
              if (treeModificationTrack.isNodeCreated(current.node._id)) {
                return true;
              }
              if (treeModificationTrack.isNodeAttributeChanged(current.node._id, current.attribute)) {
                return true;
              }
            }
          }
          return false;
        },
        /**
         * Cleans up the behavior
         * @param {classes.ControllerBase} controller the controller
         * @param {*} data the data
         */
        cleanup: function(controller, data) {
          this.detachWidget(controller, data);
          this.detach(controller, data);
        }
      };
    });
  });
