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

modulum('DebugAuiController',
  function(context, cls) {

    /**
     * @class DebugAuiController
     * @memberOf classes
     */
    cls.DebugAuiController = context.oo.Class(function() {
      return /** @lends classes.DebugAuiController.prototype */ {
        __name: "DebugAuiController",
        $static: {
          defaultTreeViewItemTemplate: {
            color: "#000000",
            collapsed: false
          },
          highlightAui: 'highlightAui'
        },
        /** @type {classes.MonitorDebugTreeWidget} */
        _treeWidget: null,
        _nodeWidget: null,
        _layoutWidget: null,
        /** @type classes.NodeBase */
        _lastRootNode: null,
        auiSerial: null,
        _currentSelectedNode: null,

        /**
         * Initializer of the controller
         */
        constructor: function() {
          this._treeWidget = cls.WidgetFactory.createWidget("MonitorDebugTree", {
            appHash: gbc.systemAppId
          });
        },

        /**
         * Destroy the controller properly
         */
        destroy: function() {
          if (this._layoutWidget) {
            this._layoutWidget.destroy();
          }
          if (this._nodeWidget) {
            this._nodeWidget.destroy();
          }
          this._treeWidget.destroy();
          this._treeWidget = null;
        },

        /**
         * Get the Debug widget
         * @return {classes.MonitorDebugTreeWidget|null}
         */
        getWidget: function() {
          return this._treeWidget;
        },

        /**
         * Create the node info widget
         * @param {number} id of the node
         * @return {*|HTMLElement}
         */
        _createNodeInfo: function(id) {
          this._nodeWidget = cls.WidgetFactory.createWidget("MonitorDebugNodeInfo", {
            appHash: gbc.systemAppId
          });
          this._displayProperties(this._nodeWidget.getPropertiesContainer(), id);
          return this._nodeWidget.getElement();
        },

        /**
         * Create the layout info widget
         * @param id
         * @return {*|HTMLElement}
         * @private
         */
        _createLayoutInfo: function(id) {
          this._layoutWidget = cls.WidgetFactory.createWidget("MonitorDebugLayoutInfo", {
            appHash: gbc.systemAppId
          });
          this._displayLayout(this._layoutWidget, id);
          return this._layoutWidget.getElement();
        },

        /**
         * Create the sub tree item of a given node
         * @param node
         * @return {*|classes.WidgetBase}
         * @private
         */
        _createSub: function(node) {
          var widget = cls.WidgetFactory.createWidget("MonitorDebugTreeItem", {
            appHash: gbc.systemAppId
          });
          var label = node._tag;
          if (node.attribute("name")) {
            label += " (" + node.attribute("name") + ")";
          } else if (node.attribute("value")) {
            var value = node.attribute("value");
            label += " (" + (value.length > 16 ? value.substr(0, 16) + "\u2026" : value) + ")";
          }
          widget.setLabel(label);
          widget.setIdRef(node._id);
          widget.setIconColor((context.constants.debugInfo.auiTreeNodeInfo[node._tag] || cls.DebugAuiController
              .defaultTreeViewItemTemplate)
            .color);
          widget.setCollapsed((context.constants.debugInfo.auiTreeNodeInfo[node._tag] || cls.DebugAuiController
              .defaultTreeViewItemTemplate)
            .collapsed);
          widget.when(gbc.constants.widgetEvents.click, this.showNode.bind(this, node));
          return widget;
        },

        /**
         * Show the node in the tree and in the app
         * @param node
         * @param forceHighlight
         */
        showNode: function(node, forceHighlight) {
          forceHighlight = typeof forceHighlight !== "undefined" ? forceHighlight : false;
          this._currentSelectedNode = node;
          if (forceHighlight) {
            var event = document.createEvent('CustomEvent');
            event.initEvent(cls.DebugAuiController.highlightAui, true, false);
            event.auiNodeId = node._id;
            window.dispatchEvent(event);
          }
          this._treeWidget.setSelectedItem(node._id);
          this._treeWidget.setNodeDebugContent(this._createNodeInfo(node._id));
          this._treeWidget.setLayoutInfoContent(this._createLayoutInfo(node._id));
        },

        /**
         * Update the AUI debugger
         * @param {classes.NodeBase} node - node
         */
        refreshDebugAui: function(node) {
          context.styler.bufferize();
          if (node && node.getApplication()) {
            this.auiSerial = node.getApplication().getNode(0).auiSerial;
            this._lastRootNode = node;
            this._treeWidget.setVMFocusedWidget(node.attribute("focus"));

            var subs = function(w, children) {
              for (var i = 0; i < children.length; i++) {
                var widget = this._createSub(children[i]);
                w.addChildWidget(widget);
                subs(widget, children[i].getChildren());
              }
            }.bind(this);
            var rootWidget = this._createSub(node);
            subs(rootWidget, node.getChildren());

            this._treeWidget.empty();
            this._treeWidget.addChildWidget(rootWidget);
            context.styler.flush();
            if (this._currentSelectedNode) {
              this.showNode(this._currentSelectedNode, false);
            }
          } else {
            this._treeWidget.empty();
            if (this._nodeWidget) {
              this._nodeWidget.destroy();
            }
            if (this._layoutWidget) {
              this._layoutWidget.destroy();
            }
          }
        },

        /**
         * Display the layout informations of the widget
         * @param {classes.MonitorDebugLayoutInfoWidget} widget - widget concerned
         * @param {number} refId - IdRef of the linked node
         */
        _displayLayout: function(widget, refId) {
          var app = this._lastRootNode.getApplication();
          var omNode = app.getNode(refId);
          if (omNode) {
            var w = omNode.getController() && omNode.getController().getWidget();
            var layoutInfo = w && w.getLayoutInformation();
            if (layoutInfo) {
              widget.setLayoutEngineName(w.getLayoutEngine() && w.getLayoutEngine().__name);
              widget.setPosX(layoutInfo ? layoutInfo.getGridX() : "???");
              widget.setPosY(layoutInfo ? layoutInfo.getGridY() : "???");
              widget.setGridWidth(layoutInfo ? layoutInfo.getGridWidth() : "???");
              widget.setGridHeight(layoutInfo ? layoutInfo.getGridHeight() : "???");
              widget.setWidth(layoutInfo ? layoutInfo.getPreferred().getWidth() : "???");
              widget.setHeight(layoutInfo ? layoutInfo.getPreferred().getHeight() : "???");
              widget.setMeasuredHasSize(layoutInfo ? layoutInfo.getMeasured().hasSize() : "???");
              widget.setMeasuredWidth(layoutInfo ? layoutInfo.getMeasured().getWidth() : "???");
              widget.setMeasuredHeight(layoutInfo ? layoutInfo.getMeasured().getHeight() : "???");
              widget.setMinimalHasSize(layoutInfo ? layoutInfo.getMinimal().hasSize() : "???");
              widget.setMinimalWidth(layoutInfo ? layoutInfo.getMinimal().getWidth() : "???");
              widget.setMinimalHeight(layoutInfo ? layoutInfo.getMinimal().getHeight() : "???");
              widget.setMaximalHasSize(layoutInfo ? layoutInfo.getMaximal().hasSize() : "???");
              widget.setMaximalWidth(layoutInfo ? layoutInfo.getMaximal().getWidth() : "???");
              widget.setMaximalHeight(layoutInfo ? layoutInfo.getMaximal().getHeight() : "???");
              widget.setAvailableHasSize(layoutInfo ? layoutInfo.getAvailable().hasSize() : "???");
              widget.setAvailableWidth(layoutInfo ? layoutInfo.getAvailable().getWidth() : "???");
              widget.setAvailableHeight(layoutInfo ? layoutInfo.getAvailable().getHeight() : "???");
              widget.setAllocatedHasSize(layoutInfo ? layoutInfo.getAllocated().hasSize() : "???");
              widget.setAllocatedWidth(layoutInfo ? layoutInfo.getAllocated().getWidth() : "???");
              widget.setAllocatedHeight(layoutInfo ? layoutInfo.getAllocated().getHeight() : "???");
              widget.setPreferredHasSize(layoutInfo ? layoutInfo.getPreferred().hasSize() : "???");
              widget.setPreferredWidth(layoutInfo ? layoutInfo.getPreferred().getWidth() : "???");
              widget.setPreferredHeight(layoutInfo ? layoutInfo.getPreferred().getHeight() : "???");
              widget.setDecoratingHasSize(layoutInfo ? layoutInfo.getDecorating().hasSize() : "???");
              widget.setDecoratingWidth(layoutInfo ? layoutInfo.getDecorating().getWidth() : "???");
              widget.setDecoratingHeight(layoutInfo ? layoutInfo.getDecorating().getHeight() : "???");
              widget.setDecoratingoffsetHasSize(layoutInfo ? layoutInfo.getDecoratingOffset().hasSize() : "???");
              widget.setDecoratingoffsetWidth(layoutInfo ? layoutInfo.getDecoratingOffset().getWidth() : "???");
              widget.setDecoratingoffsetHeight(layoutInfo ? layoutInfo.getDecoratingOffset().getHeight() : "???");
              widget.setStretchX(layoutInfo ? layoutInfo.getStretched().getX(true) : "???");
              widget.setStretchY(layoutInfo ? layoutInfo.getStretched().getY(true) : "???");
              widget.setChildrenStretchX(layoutInfo ? layoutInfo.isChildrenXStretched() : "???");
              widget.setChildrenStretchY(layoutInfo ? layoutInfo.isChildrenYStretched() : "???");
              widget.setInvalidatedMeasure(layoutInfo ? w._layoutEngine._invalidatedMeasure : "???");
              widget.setInvalidatedAllocatedSpace(layoutInfo ? w._layoutEngine._invalidatedAllocatedSpace : "???");
            } else {
              widget.setNoLayout();
            }
          }
        },

        /**
         * Display the properties of the node
         * @param propertyContainer
         * @param refId
         * @private
         */
        _displayProperties: function(propertyContainer, refId) {
          var app = this._lastRootNode.getApplication();
          var omNode = app && app.getNode(refId);
          if (omNode) {
            var values = {};
            var categories = {};
            context.constants.nodeAttributes[omNode._tag].forEach(function(property) {
              values[property] = null;
              var cat = categories[context.constants.debugInfo.attributeCategory[property]] || [];
              cat.push(property);
              categories[context.constants.debugInfo.attributeCategory[property]] = cat.sort();
            });
            Object.keys(omNode._attributes).forEach(function(key) {
              values[key] = omNode._attributes[key];
            });

            var cats = document.createDocumentFragment();

            Object.keys(categories).sort().forEach(function(category) {
              var hidden = Boolean(gbc.DebugService.auiview['.cat_' + category]);
              var cat = document.createElement("tr"),
                catText = document.createElement("td");
              cat.setAttribute("onclick", "gbc.DebugService.catClicked('" + category + "');");
              catText.setAttribute("colspan", "5");
              catText.addClass("category");
              catText.textContent = category;
              cat.appendChild(catText);
              cats.appendChild(cat);

              var pties = categories[category],
                len = pties.length,
                i = 0;
              for (; i < len; i++) {
                var property = pties[i],
                  defaultValue = cls.NodeHelper.getAttributeDefaultValue(omNode.tag, property);
                var pty = document.createElement("tr"),
                  info = document.createElement("td");
                pty.addClasses("property", "cat_" + category);
                if (omNode._attributesSetByVM[property]) {
                  pty.addClass("changed");
                }
                if (hidden) {
                  pty.addClass("hidden");
                }
                info.textContent = "&nbsp;";
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = property;
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = (values[property] === null) ? defaultValue : values[property];
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = property === "value" ? values[property] : ("" + values[property]).replace(new RegExp("\\s",
                  "g"), "_");
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = defaultValue;
                pty.appendChild(info);

                cats.appendChild(pty);
              }
            });

            propertyContainer.empty();
            propertyContainer.appendChild(cats);
          }
        }
      };
    });
  });
