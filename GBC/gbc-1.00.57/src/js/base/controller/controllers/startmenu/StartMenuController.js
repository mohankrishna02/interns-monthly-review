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

modulum('StartMenuController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class StartMenuController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.StartMenuController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.StartMenuController.prototype */ {
        __name: "StartMenuController",

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING
          this._addBehavior(cls.TextVMBehavior);

          // 4st behaviors
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.BackgroundColorVMBehavior);
        },

        _getWidgetType: function(kind) {
          var type;
          if (!kind) {
            var windowNode = this.getAnchorNode().getApplication().getVMWindow();
            if (windowNode) {
              kind = windowNode.getStyleAttribute("startMenuPosition");
            }
          }
          switch (kind) {
            case "poptree":
              // poptree isn't implemented, using tree instead
              /* falls through */
            case "tree":
              type = 'StartMenu';
              break;
            case "menu":
              type = 'TopMenu';
              break;
          }
          return type;
        },

        attachUI: function() {
          var session = this.getAnchorNode().getApplication().getSession();
          var uiWidget = this.getAnchorNode().getAncestor('UserInterface').getController().getWidget();
          // _widgetKind is probably obsolete but is kept as a security
          if (this._widgetType === "StartMenu" || this._widgetKind === "poptree" || this._widgetKind === "tree") {
            session.manageStartMenu(this.getAnchorNode(), this.getWidget());
          } else if (this._widgetType === "TopMenu" || this._widgetKind === "menu") {
            uiWidget.addTopMenu(this.getWidget(), 0, uiWidget);
          }
        },

        _detachWidgetRecursive: function(node) {
          var children = node.getChildren();
          for (var c = 0; c < children.length; c++) {
            this._detachWidgetRecursive(children[c]);
          }
          node.getController()._detachWidget();
        },

        _attachWidgetRecursive: function(node) {
          node.getController()._attachWidget();
          var children = node.getChildren();
          for (var c = 0; c < children.length; c++) {
            this._attachWidgetRecursive(children[c]);
          }
        },

        _createWidgetRecursive: function(node, kind) {
          var currentController = node.getController();
          var type = currentController._getWidgetType(kind);
          currentController._widget = currentController._createWidget(type === "TopMenu" ? "StartMenuTopMenu" : type);
          var children = node.getChildren();
          for (var c = 0; c < children.length; c++) {
            this._createWidgetRecursive(children[c], kind);
          }
        },

        _detachUIRecursive: function(node) {
          var children = node.getChildren();
          for (var c = 0; c < children.length; c++) {
            this._detachUIRecursive(children[c]);
          }
          node.getController().detachUI();
        },

        _attachUIRecursive: function(node) {
          node.getController().attachUI();
          var children = node.getChildren();
          for (var c = 0; c < children.length; c++) {
            this._attachUIRecursive(children[c]);
          }
        },

        changeWidgetKind: function(kind) {
          if (kind !== this._widgetKind) {
            this._widgetKind = kind;
            this._widgetType = this._getWidgetType(kind);
            var anchor = this.getAnchorNode();
            this._detachWidgetRecursive(anchor);
            this._detachUIRecursive(anchor);
            this._createWidgetRecursive(anchor, kind);
            this._attachUIRecursive(anchor);
            this._attachWidgetRecursive(anchor);
            anchor.applyBehaviors(null, true, true);
            return true;
          }
          return false;
        }
      };
    });
    cls.ControllerFactory.register("StartMenu", cls.StartMenuController);

  });
