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

modulum('ListViewPageSizeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ListViewPageSizeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ListViewPageSizeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ListViewPageSizeVMBehavior.prototype */ {
        __name: "ListViewPageSizeVMBehavior",

        watchedAttributes: {
          anchor: ['bufferSize', 'pageSize', 'size', 'dialogType']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var tableNode = controller.getAnchorNode();

          if (this._checkListViewSupport(controller, data)) {
            var bufferSize = tableNode.attribute('bufferSize');
            var tableColumns = tableNode.getChildren("TableColumn");
            var listViewWidget = controller.getWidget();
            var lineIndex;
            for (lineIndex = 0; lineIndex < bufferSize; ++lineIndex) {

              var rowWidget = cls.WidgetFactory.createWidget("ListViewRow", listViewWidget.getBuildParameters());
              listViewWidget.addChildWidget(rowWidget);

              // Add widgets for first column
              if (tableColumns.length > 0) {
                this._createControllersAndWidgets(tableColumns[0], lineIndex, listViewWidget, 0);
              }
              // Add widgets for second column
              if (tableColumns.length > 1) {
                this._createControllersAndWidgets(tableColumns[1], lineIndex, listViewWidget, 1);
              }
            }
            listViewWidget.updateHighlight();
          }
        },

        /**
         * Check if list view is supported and close app if it is not the case
         * @param controller
         * @private
         */
        _checkListViewSupport: function(controller, data) {
          var tableNode = controller.getAnchorNode();
          var dialogType = tableNode.attribute('dialogType');
          var isTree = tableNode.isTreeView();

          if (data.animationFrameOffset) {
            window.cancelAnimationFrame(data.animationFrameOffset);
            data.animationFrameOffset = 0;
          }

          var support = (dialogType.startsWith("Display") && !isTree);
          if (!support) {
            data.animationFrameOffset = window.requestAnimationFrame(function() { // let finish the behavior works and close app after
              data.animationFrameOffset = 0;
              var currentApp = gbc.SessionService.getCurrent() && gbc.SessionService.getCurrent().getCurrentApplication();
              if (currentApp) {
                currentApp.close();
                currentApp.stop("ListView widget not supported in INPUT, INPUT ARRAY, CONSTRUCT, TREE");
              }
            }.bind(this));
          }
          return support;
        },

        _createControllersAndWidgets: function(node, lineIndex, listViewWidget, columnIndex) {
          var valueList = node.getFirstChild("ValueList");
          if (valueList) {
            var valueNode = valueList.getChildren()[lineIndex];
            var ctrl = valueNode.getController();

            if (ctrl && ctrl.getWidget()) {
              return; // if the controller and the widget are already created --> nothing to do
            }

            if (!ctrl) {
              ctrl = valueNode._createController();
              valueNode._controller = ctrl;
              ctrl.setAutoCreateWidget(false);
            }

            var widget = ctrl.createWidgetFromType("Label");
            if (widget) {
              var row = listViewWidget.getRows()[lineIndex];
              row.addChildWidget(widget);
              ctrl._attachWidget(); // attach widget to controller for UI behavior
              if (columnIndex === 1) {
                var decorator = ctrl.getNodeBindings().decorator;
                row.setHorizontalLayout(decorator.attribute("justify") === "right");
              }
            }
          }
        },

        /**
         * @inheritDoc
         */
        _detach: function(controller, data) {
          if (data.animationFrameOffset) {
            window.cancelAnimationFrame(data.animationFrameOffset);
            data.animationFrameOffset = 0;
          }
        },
      };
    });
  }
);
