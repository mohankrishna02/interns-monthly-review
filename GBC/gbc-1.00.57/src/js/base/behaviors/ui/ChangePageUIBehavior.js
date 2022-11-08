/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ChangePageUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class ChangePageUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.ChangePageUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.ChangePageUIBehavior.prototype */ {
        /** @type {string} */
        __name: "ChangePageUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.changeHandle = widget.when(context.constants.widgetEvents.change, this._pageChanged.bind(this, controller, data));
            data.requestFocusHandle = widget.when(context.constants.widgetEvents.requestFocus, this._requestFocus.bind(this,
              controller, data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.changeHandle) {
            data.changeHandle();
            data.changeHandle = null;
          }
          if (data.requestFocusHandle) {
            data.requestFocusHandle();
            data.requestFocusHandle = null;
          }
        },

        /**
         * Page changed
         * @param controller
         * @param data
         * @param evt
         * @param folder
         * @param page
         * @param {boolean=} executeAction - true if we need to execute action on page change, false otherwise
         * @private
         */

        _pageChanged: function(controller, data, evt, folder, page, executeAction) {
          var node = controller.getAnchorNode();
          var app = node.getApplication();

          app.getUI().getWidget().getLayoutInformation().invalidateMeasure();
          app.layout.refreshLayout();
          // If not specified, execute action
          executeAction = typeof executeAction !== "undefined" ? executeAction : true;
          if (app && app.action && executeAction) {
            var currentPageWidget = node.getWidget().getCurrentPage();
            var options = {};
            if (currentPageWidget) {
              app.action.execute(currentPageWidget._auiTag, null, options);
            }
          }
        },

        /**
         * If current focused node is child of previous page, request focus on first focusable widget of the current page
         * @private
         */
        _requestFocus: function(controller, data) {
          var node = controller.getAnchorNode();
          var folderWidget = controller.getWidget();
          var focusedWidget = null;
          var focusedNode = node.getApplication().getFocusedVMNodeAndValue(true);
          if (focusedNode) {
            focusedWidget = focusedNode.getController().getWidget();
          }
          if (!focusedWidget || focusedWidget.isChildOf(folderWidget)) {
            var pageIndex = folderWidget.getCurrentPage() ? folderWidget.getCurrentPage().getPageIndex() : -1;
            if (pageIndex >= 0 && pageIndex < node.getChildren().length) {
              var pageNode = node.getChildren()[pageIndex];

              var pageHasActiveAction = pageNode.attribute("actionActive") !== 0 && pageNode.isAttributeSetByVM("actionIdRef");

              //1. When no action is associated to a folder page,
              //   the front-end can choose to set the focus to the next focusable element (here inside a sub-page).
              //2. When an action is associated to a folder page,
              //   it's typically in the hands of the program to decide what to do,
              //   and the front-end should not overwrite this.
              if (!pageHasActiveAction) {
                // request focus on the first active widget
                var firstActiveNode = this._getFirstFocusableField(pageNode);
                if (firstActiveNode) {
                  if (firstActiveNode.getCurrentValueNode && firstActiveNode.getCurrentValueNode(false)) {
                    firstActiveNode = firstActiveNode.getCurrentValueNode(false);
                  }
                  var firstActiveController = firstActiveNode.getController();
                  if (firstActiveController) {
                    var firstActiveWidget = firstActiveController.getWidget();
                    if (firstActiveWidget) {
                      if (firstActiveNode.isInTable()) {
                        // if we land in a table, this one should ask the VM rather than the field
                        firstActiveWidget.getTableWidgetBase().emit(context.constants.widgetEvents.requestFocus);
                      } else {
                        firstActiveWidget.emit(context.constants.widgetEvents.requestFocus);
                      }
                    }
                  }
                }
              }
            }
          }
        },

        /**
         *
         * @param node
         * @return {*}
         * @private
         */
        _getFirstFocusableField: function(node) {
          if (['FormField', 'Table', 'Matrix', 'Button'].indexOf(node.getTag()) !== -1 &&
            node.attribute("active") !== 0 &&
            (!node.isAttributeSetByVM("tabIndex") || node.attribute("tabIndex") !== 0)) {
            return node;
          }
          var nodeChildren = node.getChildren();
          for (var i = 0; i < nodeChildren.length; ++i) {
            var focusableNode = this._getFirstFocusableField(nodeChildren[i]);
            if (focusableNode) {
              return focusableNode;
            }
          }
          return null;
        }
      };
    });
  });
