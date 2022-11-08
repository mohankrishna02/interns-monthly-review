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

modulum('CurrentTitleVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class CurrentTitleVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CurrentTitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CurrentTitleVMBehavior.prototype */ {
        __name: "CurrentTitleVMBehavior",

        watchedAttributes: {
          ui: ['currentWindow'],
          anchor: ['name', 'text', 'image']
        },

        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          if (anchorNode.getApplication() === anchorNode.getApplication().getSession().getCurrentApplication() ||
            anchorNode.getApplication() === anchorNode.getApplication().getSession().getTabbedContainerModeHostApplication() ||
            anchorNode.getApplication().getSession().isInTabbedContainerMode()) {
            var userInterfaceNode = anchorNode.getApplication().getNode(0);
            var uititle = userInterfaceNode.isAttributeSetByVM("text") ? userInterfaceNode.attribute("text") : userInterfaceNode.attribute(
              "name");
            var uiimage = userInterfaceNode.isAttributeSetByVM("image") ? userInterfaceNode.attribute('image') : null;
            var windowNode = anchorNode.getTag() === "Window" ? anchorNode : anchorNode.getAncestor("Window");
            windowNode = windowNode || userInterfaceNode.getFirstChildWithId(userInterfaceNode.attribute("currentWindow"));
            if (windowNode) {
              var title = null;
              var image = null;

              var formNode = windowNode.getFirstChild("Form");
              var menuNode = windowNode.getLastChild("Menu");
              // look for image
              if (windowNode.isAttributeSetByVM("image")) {
                image = windowNode.attribute("image");
              }
              if (formNode && formNode.isAttributeSetByVM("image")) {
                image = formNode.attribute("image");
              } else {
                if (menuNode && menuNode.isAttributeSetByVM("image")) {
                  image = menuNode.attribute("image");
                }
              }

              // look for text / name
              if (formNode ||
                (menuNode && (menuNode.attribute("style") === "winmsg" || menuNode.attribute("style") === "dialog"))
              ) {
                if (windowNode.isAttributeSetByVM("text")) {
                  title = windowNode.attribute("text");
                } else if (windowNode.isAttributeSetByVM("name")) {
                  title = windowNode.attribute("name");
                }
              } else {
                if (menuNode) {
                  if (menuNode.isAttributeSetByVM("text") && menuNode.attribute("text")) {
                    title = menuNode.attribute("text");
                  } else if (windowNode.isAttributeSetByVM("text") && windowNode.attribute("text")) {
                    title = windowNode.attribute("text");
                  } else if (userInterfaceNode.isAttributeSetByVM("text") && userInterfaceNode.attribute("text")) {
                    title = userInterfaceNode.attribute("text");
                  } else if (menuNode.isAttributeSetByVM("name") && menuNode.attribute("name")) {
                    title = menuNode.attribute("name");
                  } else if (windowNode.isAttributeSetByVM("name") && windowNode.attribute("name")) {
                    title = windowNode.attribute("name");
                  } else if (userInterfaceNode.isAttributeSetByVM("name") && userInterfaceNode.attribute("name")) {
                    title = userInterfaceNode.attribute("name");
                  }
                }
              }

              var windowWidget = windowNode.getController().getWidget();
              if (title) {
                if (windowWidget.setText) {
                  windowWidget.setText(title);
                }
              }

              var windowType = windowNode.getStyleAttribute('windowType');
              if (context.HostService.getCurrentWindow() === windowWidget && windowType !== 'modal') {
                var tabbedPage = windowNode.getApplication().getUI().getWidget()._tabbedPage;
                if (tabbedPage) {
                  if (!windowWidget.isModal) {
                    tabbedPage.setText(title);
                    // this is typical rule which enforces to manage title icon directly here and not in widgets
                    tabbedPage.setImage(context.__wrapper.wrapResourcePath(image ? image : uiimage));
                  }
                } else {
                  context.HostService.setCurrentTitle(title);
                  // this is typical rule which enforces to manage title icon directly here and not in widgets
                  context.HostService.setCurrentIcon(context.__wrapper.wrapResourcePath(image ? image : uiimage));
                }
              }
            } else {
              var userInterfaceWidget = userInterfaceNode.getController().getWidget();
              if (userInterfaceWidget.setText) {
                userInterfaceWidget.setText(uititle);
              }
              if (userInterfaceWidget.setImage) {
                userInterfaceWidget.setImage(uiimage);
              }
              if (uiimage) {
                context.HostService.setCurrentIcon(context.__wrapper.wrapResourcePath(uiimage), true);
              } else {
                context.HostService.setCurrentIcon("", true);
              }
            }
          }
        }
      };
    });
  });
