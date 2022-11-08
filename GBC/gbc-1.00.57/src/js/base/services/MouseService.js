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

modulum('MouseService', ['InitService'],
  function(context, cls) {

    /**
     * @namespace gbc.MouseService
     */
    context.MouseService = context.oo.StaticClass( /** @lends gbc.MouseService */ {
      __name: "MouseService",

      /**
       *  Init mouse service
       */
      init: function() {
        document.body.on("click.MouseService", this._onClick.bind(this));
        document.body.on("contextmenu.MouseService", this._onRightClick.bind(this));
        document.body.on("dblclick.MouseService", this._onDblClick.bind(this));
      },

      /**
       * Click handler bound on body element. Catch all click events and propagate it to the corresponding widget.
       * @param event
       * @private
       */
      _onClick: function(event) {
        // onClick can raise during a GBC reload. In that case just ignore it.
        if (!context.LogService.mouse) {
          return;
        }
        context.LogService.mouse.log("onClick event : ", event);

        var targetElement = event.target;

        // if overlay is visible, we hide displayed dropdowns and prevent default click events behaviors
        if (cls.DropDownWidget.hasAnyVisible() && !cls.DropDownWidget.isChildOfDropDown(targetElement)) {
          cls.DropDownWidget.hideAll();
          return false;
        }

        // search widget from dom event
        var widget = gbc.WidgetService.getWidgetFromElement(targetElement);

        // if a widget is found
        if (widget) {

          var rect = null;
          if ((!event.clientX || event.clientX < 0) && (!event.clientY || event.clientY < 0)) {
            rect = event.target.getBoundingClientRect();
            context.WidgetService.cursorX = rect.left;
            context.WidgetService.cursorY = rect.top;
          } else {
            context.WidgetService.cursorX = event.clientX;
            context.WidgetService.cursorY = event.clientY;
          }

          if (widget.isInTable()) {
            widget.emit(context.constants.widgetEvents.tableClick, event);
          }

          var bubbles = widget.manageMouseClick(event);

          // bubble event to parent *DOM* widget
          if (bubbles) {
            var widgetElement = targetElement.elementOrParent("gbc_WidgetBase");
            var parentWidgetElement = widgetElement.parent("gbc_WidgetBase");
            while (parentWidgetElement && bubbles) {
              var parentWidget = gbc.WidgetService.getWidgetFromElement(parentWidgetElement);
              if (parentWidget) {
                if (parentWidget.isInTable()) {
                  parentWidget.emit(context.constants.widgetEvents.tableClick, event);
                }
                bubbles = parentWidget.manageMouseClick(event);
              }
              parentWidgetElement = parentWidgetElement.parent("gbc_WidgetBase");
            }
          }
        }
      },

      /**
       * Click handler bound on body element. Catch all rightclick events and propagate it to the corresponding widget.
       * @param event
       * @private
       */
      _onRightClick: function(event) {
        context.LogService.mouse.log("onRightClick event : ", event);

        var targetElement = event.target;

        // if overlay is visible, we hide displayed dropdowns and prevent default click events behaviors
        if (cls.DropDownWidget.hasAnyVisible() && !cls.DropDownWidget.isChildOfDropDown(targetElement)) {
          cls.DropDownWidget.hideAll();
          event.preventCancelableDefault();
          return false;
        }

        // search widget from dom event
        var widget = gbc.WidgetService.getWidgetFromElement(targetElement);

        // if a widget is found
        if (widget) {

          var bubbles = widget.manageMouseRightClick(event);

          // bubble event to parent *DOM* widget
          if (bubbles) {
            var widgetElement = targetElement.elementOrParent("gbc_WidgetBase");
            var parentWidgetElement = widgetElement.parent("gbc_WidgetBase");
            while (parentWidgetElement && bubbles) {
              var parentWidget = gbc.WidgetService.getWidgetFromElement(parentWidgetElement);
              if (parentWidget) {
                bubbles = parentWidget.manageMouseRightClick(event);
              }
              parentWidgetElement = parentWidgetElement.parent("gbc_WidgetBase");
            }
          }
        }
      },

      /**
       * Click handler bound on body element. Catch all dblclick events and propagate it to the corresponding widget.
       * @param event
       * @private
       */
      _onDblClick: function(event) {
        context.LogService.mouse.log("onDblClick event : ", event);

        var targetElement = event.target;

        // search widget from dom event
        var widget = gbc.WidgetService.getWidgetFromElement(targetElement);

        // if a widget is found
        if (widget) {

          var bubbles = widget.manageMouseDblClick(event);

          // bubble event to parent *DOM* widget
          if (bubbles) {
            var widgetElement = targetElement.elementOrParent("gbc_WidgetBase");
            var parentWidgetElement = widgetElement.parent("gbc_WidgetBase");
            while (parentWidgetElement && bubbles) {
              var parentWidget = gbc.WidgetService.getWidgetFromElement(parentWidgetElement);
              if (parentWidget) {
                bubbles = parentWidget.manageMouseDblClick(event);
              }
              parentWidgetElement = parentWidgetElement.parent("gbc_WidgetBase");
            }
          }
        }
      }

    });
    context.InitService.register(context.MouseService);
  });
