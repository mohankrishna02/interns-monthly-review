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

modulum('DVMApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * Application Service to manage DVM interactions for an application
     *
     * @class DVMApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.DVMApplicationService = context.oo.Class(cls.ApplicationServiceBase,
      function($super) {
        return /** @lends classes.DVMApplicationService.prototype */ {

          __name: "DVMApplicationService",
          /** Indicator to know if DVM is idle or not */
          idle: true,
          _managingOrders: false,
          processed: false,
          /**
           * @constructs
           * @param app
           */
          constructor: function(app) {
            $super.constructor.call(this, app);
          },

          destroy: function() {
            $super.destroy.call(this);
          },

          updateProcessingStatus: function() {
            var menu = this._getMenu("runtimeStatus");
            if (menu) {
              if (this.idle) {
                menu.setIdle();
                this._application.getUI().getWidget().removeClass("processing");
              } else {
                menu.setProcessing();
                this._application.getUI().getWidget().addClass("processing");
              }
            }
          },

          setIdle: function(isIdle) {
            this.idle = isIdle;
            if (!this.processed && this.idle) {
              this.processed = true;
            }
            this.updateProcessingStatus();
            this.emit(context.constants.baseEvents.idleChanged);

          },
          onOrdersManaged: function(hook, once) {
            return this.when(context.constants.baseEvents.ordersManaged, hook, once);
          },
          afterManagingCurrentOrders: function(hook) {
            if (this._managingOrders) {
              this.when(context.constants.baseEvents.ordersManaged, hook, true);
            } else {
              hook();
            }
          },
          onIdleChanged: function(hook) {
            return this.when(context.constants.baseEvents.idleChanged, hook);
          },

          manageAuiOrders: function(data, callback) {
            this._managingOrders = true;

            var treeModificationTrack = new cls.TreeModificationTracker(),
              nodesWithDom = [];
            var vmMessages = cls.AuiProtocolReader.translate(data);
            context.styler.bufferize();
            this._application.getUI().getWidget().bufferizeDom(true);
            var needLayout = false;
            var hasAddedRemovedNodes = false;
            var initialOrder = vmMessages.length && vmMessages[0] && vmMessages[0].id === 0 && vmMessages[0];
            // 1. readOrder : create nodes
            while (vmMessages.length) {
              if (this._application) {
                var order = vmMessages.shift();
                if (order.type !== "om") {
                  throw "Received auiTree bad format : " + order;
                }
                var result = this.manageAuiOrder(order, treeModificationTrack, nodesWithDom);
                needLayout = needLayout || result.needLayout;
                hasAddedRemovedNodes = hasAddedRemovedNodes || result.hasAddedRemovedNodes;
                if (vmMessages.length !== 0 && treeModificationTrack.isNodeAttributeChanged(0, 'runtimeStatus')) {
                  // We don't apply behaviors before reading all VM orders
                  // except for runtimeStatus which must be managed immediately
                  // to handle the transitive 'childstart' status
                  var runtimeStatusTracker = new cls.TreeModificationTracker();
                  runtimeStatusTracker.attributeChanged(0, 'runtimeStatus');
                  this._application.getNode(0).applyBehaviors(runtimeStatusTracker);
                }
              }
            }

            var callbackDone = false;
            var rootNode = this._application && this._application.getNode(0);

            if (rootNode) {
              treeModificationTrack.attributeChanged(0, "runtimeStatus");

              var runtimeStatus = rootNode.attribute('runtimeStatus');
              if (runtimeStatus === "childstart" || runtimeStatus === "processing") {
                callbackDone = true;
                if (callback) {
                  callback();
                }
              }

              if (initialOrder) {
                treeModificationTrack.attributeChanged(0, "focus");
              }

              var nodes = this._application.model.nodeHash;
              var node = null;
              for (var i = 0; i < nodes.length; ++i) {
                node = nodes[i];
                if (node) {
                  node.resetActivePseudoSelectors();
                }
              }

              // 2. update styles
              if (this._application.styleListsChanged || this._application.styleAttributesChanged.length || hasAddedRemovedNodes) {
                rootNode.updateApplicableStyles(true, this._application.styleListsChanged,
                  this._application.styleAttributesChanged, treeModificationTrack);
                this._application.usedStyleAttributes = {};
                var styleLists = rootNode.getChildren('StyleList');
                for (i = 0; i < styleLists.length; i++) {
                  var styles = styleLists[i].getChildren();
                  for (var j = 0; j < styles.length; ++j) {
                    var styleAttributes = styles[j].getChildren();
                    for (var k = 0; k < styleAttributes.length; ++k) {
                      this._application.usedStyleAttributes[styleAttributes[k].attribute('name')] = true;
                    }
                  }
                }
                for (i = 0; i < nodes.length; ++i) {
                  node = nodes[i];
                  if (node) {
                    node.resetPseudoSelectorsUsedInSubTree();
                  }
                }
                for (i = 0; i < nodes.length; ++i) {
                  node = nodes[i];
                  if (node) {
                    node.updatePseudoSelectorsUsedInSubTree();
                  }
                }
                treeModificationTrack.forEach(function(mods, idRef) {
                  if (mods.created && !mods.removed) {
                    var node = this._application.getNode(idRef);
                    if (node) {
                      node.setInitialStyleAttributes();
                    }
                  }
                }.bind(this));
              }

              // 3. create controllers + widgets
              this._createControllers(treeModificationTrack);
              this._notifyUpdatedAttributes(treeModificationTrack);

              if (this._application.styleListsChanged || this._application.styleAttributesChanged.length || hasAddedRemovedNodes) {
                for (i = 0; i < nodes.length; ++i) {
                  node = nodes[i];
                  if (node) {
                    var controller = node.getController();
                    if (controller) {
                      controller.setStyleBasedBehaviorsDirty(true, true);
                    }
                  }
                }
              }

              this._application.styleListsChanged = false;
              this._application.styleAttributesChanged = [];

              var stillDirty = true;
              // 4. Apply behaviors
              while (stillDirty) {
                stillDirty = rootNode.applyBehaviors(treeModificationTrack, true);
              }

              // 5. Add root widget to DOM
              for (i = 0; i < nodesWithDom.length; i++) {
                if (!nodesWithDom[i].getParentNode()) {
                  if (nodesWithDom[i].getController()) {
                    this._application.attachRootWidget(nodesWithDom[i].getController().getWidget());
                  }
                }
              }
            }
            this._application.getUI().getWidget().bufferizeDom(false);
            context.styler.flush();
            if (this._application) {
              this._application.layout.refreshLayout();
            }
            if (!callbackDone) {
              if (callback) {
                callback();
              }
            }
            if (this._application) {
              var isCurrentApp = context.SessionService.getCurrent().getCurrentApplication() === this._application;
              this._application.typeahead.validateLastCommand(isCurrentApp);
            }
            this._managingOrders = false;
            this.emit(context.constants.baseEvents.ordersManaged, data);
          },

          manageAuiOrder: function(order, treeModificationTrack, nodesWithDom) {
            var result = {
              needLayout: false,
              hasAddedRemovedNodes: false
            };
            var node;
            var i;
            for (var index = 0; index < order.operations.length; index++) {
              var cmd = order.operations[index];
              switch (cmd.type) {
                case "update":
                  result.needLayout = this._application.model.commandUpdate(cmd, treeModificationTrack) || result.needLayout;
                  this._application.getNode(0).auiSerial = order.id;
                  break;
                case "add":
                  node = this._application.model.commandAdd(cmd, treeModificationTrack);
                  if (node) {
                    nodesWithDom.push(node);
                    result.needLayout = result.needLayout || Boolean(cls.LayoutTriggerAttributes[cmd.type][node._tag]);
                    result.hasAddedRemovedNodes = true;
                  }
                  if (this._application) {
                    this._application.getNode(0).auiSerial = order.id;
                  }
                  break;
                case "remove":
                  node = null;
                  for (i = 0; i < nodesWithDom.length; ++i) {
                    if (nodesWithDom[i].getId() === cmd.id) {
                      nodesWithDom.splice(i, 1);
                      break;
                    }
                  }
                  treeModificationTrack.nodeRemoved(cmd.id);
                  var toDestroy = this._application.getNode(cmd.id);
                  if (toDestroy) {
                    // detach from DOM first and then destroy recursively
                    if (toDestroy.getController()) {
                      var widget = toDestroy.getController().getWidget();
                      if (widget) {
                        widget.detach();
                      }
                    }
                    toDestroy.destroy();
                  }
                  if (cmd.id === 0) {
                    this._application.setEnding();
                  } else {
                    this._application.getNode(0).auiSerial = order.id;
                  }
                  result.needLayout = result.needLayout || Boolean(cls.LayoutTriggerAttributes[cmd.type][toDestroy._tag]);
                  result.hasAddedRemovedNodes = true;
                  break;
                default:
                  node = null;
                  context.LogService.error("dvm.manageAuiOrder: Invalid command (" + cmd.type + ")");
              }
            }

            return result;
          },

          /**
           * Call update attributes callback for modified attributes
           * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
           * @private
           */
          _notifyUpdatedAttributes: function(treeModificationTrack) {
            treeModificationTrack.forEach(function(mods, nodeId) {
              var node = this._application.getNode(nodeId);
              if (node) {
                var attrs = Object.keys(mods.updatedAttributes);
                for (var i = 0; i < attrs.length; ++i) {
                  var attr = attrs[i];
                  var eventName = cls.NodeBase.attributeChangedEventName(attr);
                  if (node.hasEventListeners(eventName)) {
                    var oldValue = node.previousAttribute(attr);
                    var newValue = node.attribute(attr);
                    node.emit(eventName, {
                      node: node,
                      attr: attr,
                      old: oldValue,
                      new: newValue,
                      changed: newValue !== oldValue
                    });
                  }
                }
              }
            }.bind(this));
          },

          /**
           * Create controllers for created nodes
           * @param {classes.TreeModificationTracker} treeModificationTrack tree modifications log
           * @private
           */
          _createControllers: function(treeModificationTrack) {
            treeModificationTrack.forEach(function(mods, nodeId) {
              if (mods.createdSubTreeRoot) {
                var node = this._application.getNode(nodeId);
                if (node && !node._destroyed) {
                  node.createController();
                  node.attachUI();
                }
              }
            }.bind(this));
          },

          _getMenu: function(name) {
            var sessionWidget = this._application.getSession().getWidget();
            var menu = null;
            if (!gbc.ThemeService.getValue("theme-legacy-topbar")) {
              var uiWidget = this._application.getUI().getWidget().getUserInterfaceWidget();
              if (uiWidget) {
                menu = uiWidget.getChromeBarWidget();
                return menu ? menu.getGbcMenuItem(name) : false;
              } else {
                return false;
              }
            } else {
              var applicationHostWidget = sessionWidget.getParentWidget();
              menu = applicationHostWidget._menu;
              return name ? menu["_" + name] : menu;
            }
          }
        };
      });
    cls.ApplicationServiceFactory.register("Dvm", cls.DVMApplicationService);
  });
