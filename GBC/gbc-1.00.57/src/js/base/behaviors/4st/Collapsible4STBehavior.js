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

modulum('Collapsible4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class Collapsible4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.Collapsible4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.Collapsible4STBehavior.prototype */ {
        __name: "Collapsible4STBehavior",

        usedStyleAttributes: ["collapsible", "initiallyCollapsed"],

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller.getWidget()) {
            data.toggleClickHandler = controller.getWidget().when(
              context.constants.widgetEvents.toggleClick,
              this._onToggleClick.bind(this, controller, data)
            );
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.toggleClickHandler) {
            data.toggleClickHandler();
            data.toggleClickHandler = null;
          }
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller && controller.getAnchorNode(),
            widget = controller.getWidget();
          var storedSettingsGroupId = this._getIdentifier(controller);
          widget.setGroupIdentifier(storedSettingsGroupId);
          if (node && widget && widget.setCollapsible) {
            var isCollapsible = this.isSAYesLike(node.getStyleAttribute("collapsible")),
              initiallyCollapsedAttr = node.getStyleAttribute("initiallyCollapsed"),
              initiallyCollapsed = this.isSAYesLike(initiallyCollapsedAttr);
            widget.setCollapsible(isCollapsible);

            if (initiallyCollapsedAttr === "always") {
              widget.setCollapsed(true);
            } else if (initiallyCollapsedAttr === "never") {
              widget.setCollapsed(false);
            } else {
              var storedCollapsedState = context.StoredSettingsService
                .getGroupCollapsedState(storedSettingsGroupId.formName, storedSettingsGroupId.id);
              if (typeof storedCollapsedState === "boolean") {
                widget.setCollapsed(storedCollapsedState);
              } else if (initiallyCollapsed && !data.initiallyCollapsed) {
                data.initiallyCollapsed = true;
                widget.setCollapsed(true);
              }
            }
          }
        },
        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {*} data
         * @private
         */
        _onToggleClick: function(controller, data) {
          var node = controller && controller.getAnchorNode(),
            app = node && node.getApplication();
          if (app) {
            app.layout.refreshLayout();
          }
        },

        /**
         * Get an unique id for a Group
         * @param controller
         * @returns {{formName:string, id:string}} identifier of the Group
         * @private
         */
        _getIdentifier: function(controller) {
          var identifier = [];
          var bindings = controller.getNodeBindings();
          var anchor = bindings.anchor;
          var parentNode = anchor.getParentNode();
          var siblings = null;
          var formName = "";

          // Goes up in AUI tree to get position of each splitter in VBox, HBox and Grid
          while (parentNode !== null) {
            if (["Group"].indexOf(anchor.getTag()) >= 0) {
              siblings = parentNode.getDescendants(anchor.getTag());
              identifier.push(anchor.getTag() + siblings.indexOf(anchor));
            } else if (anchor.getTag() === "Form") {
              formName = anchor.attribute("name");
            }

            anchor = parentNode;
            parentNode = anchor.getParentNode();
          }
          return {
            formName: formName,
            id: identifier.reverse().join("_")
          };
        }

      };
    });
  });
