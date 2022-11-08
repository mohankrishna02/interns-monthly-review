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

(
  function(context) {
    /**
     *
     * @type {HTMLElement}
     * @private
     */
    context.__testhostelement = null;
    if (context.gbc.unitTestMode) {
      if (!context.__testhostelement) {
        context.__testhostelement = document.createElement("div");
        context.__testhostelement.setAttribute("class", "unittesthost");

        context.__testhostelement.style.position = "absolute";
        context.__testhostelement.style.top = "-1000px";
        context.__testhostelement.style.left = "-1000px";
        context.__testhostelement.style.width = "600px";
        context.__testhostelement.style.height = "600px";
        context.__testhostelement.style.zIndex = 55;

        document.body.appendChild(context.__testhostelement);
      }
      /**
       * @memberOf gbc
       * @private
       */
      context.gbc.__unitTestingCloseCurrentSession = function() {
        var session = context.gbc.SessionService && context.gbc.SessionService.getCurrent();
        if (session) {
          var apps = session.getApplications().slice(),
            appsLen = apps.length;
          for (var i = 0; i < appsLen; i++) {
            if (apps[i]) {
              apps[i].stop();
              apps[i].destroy();
            }
          }
          var app = session && session.getCurrentApplication();
          while (app) {
            var currentApp = app;
            try {
              app.stop();
              app.destroy();
            } catch (e) {}
            app = session && session.getCurrentApplication();
            app = currentApp !== app && app;
          }
          context.gbc.SessionService.getCurrent().destroy(true);
        }
        if (!window.gbc.__unitTestingModeActivated) {
          window.gbc.__unitTestingModeActivated = true;
          window.gbc.__unitTestingModeActivated = true;
          window.__desactivateEndingPopup = true;
          window.gbc.showExitWarning = function() {};
        }
      };
      /**
       * @memberOf Window
       * @param {classes.NodeBase} node
       * @param attrs
       * @param noApply
       */
      context.testUpdateAttributes = function(node, attrs, noApply) {
        if (node) {
          context.styler.bufferize();
          var mods = [];
          mods[node._id] = true;
          node.updateAttributes(attrs);
          if (!noApply) {
            var treeModificationTrack = new context.gbc.classes.TreeModificationTracker();
            (node._id === 0 ? node : node.getAncestor("UserInterface")).applyBehaviors(treeModificationTrack, true, true);
          }
          context.styler.flush();
        }
      };
    }
  })(window);
