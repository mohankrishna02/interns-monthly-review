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

modulum('MonitorDebugTreeWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class MonitorDebugTreeWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.MonitorDebugTreeWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.MonitorDebugTreeWidget.prototype */ {
        __name: "MonitorDebugTreeWidget",
        _nodeDebug: null,
        _layoutInfo: null,
        _vmFocusedWidgetId: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._nodeDebug = this._element.getElementsByClassName('nodeDebug')[0];
          this._layoutInfo = this._element.getElementsByClassName('layoutInfo')[0];
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._nodeDebug.innerHTML = "";
          this._layoutInfo.innerHTML = "";
          $super.destroy.call(this);
        },

        /**
         * Set the content of the right part of the debugger (AUI attributes)
         * @param content
         */
        setNodeDebugContent: function(content) {
          this._nodeDebug.innerHTML = "";
          this._nodeDebug.appendChild(content);
        },

        /**
         * Set the content of the layout part of the debugger (AUI layout attributes)
         * @param content
         */
        setLayoutInfoContent: function(content) {
          this._layoutInfo.innerHTML = "";
          this._layoutInfo.appendChild(content);
        },

        /**
         * Set the selected item in the debugger
         * @param {number} id - id of the selected widget
         * @param {Array} items - children of the item
         * @return {*}
         */
        setSelectedItem: function(id, items) {
          var matchingItem = null;
          if (items === undefined) {
            matchingItem = this.setSelectedItem(id, this.getChildren());
            if (matchingItem) {
              var view = this._element.child('part');
              var itemRect = matchingItem._container.getBoundingClientRect();
              var viewRect = view.getBoundingClientRect();
              if (itemRect.bottom > viewRect.height || itemRect.top < 0) {
                view.scrollTop += itemRect.top - viewRect.height / 2;
              }
            }
          } else {
            for (var i = 0; i < items.length; ++i) {
              var item = items[i];
              var match = item.getIdRef() === id;
              item.setHighlighted(match);
              item.setFocused(item.getIdRef() === this._vmFocusedWidgetId);
              var childMatchingItem = this.setSelectedItem(id, item.getChildren());
              if (match) {
                matchingItem = item;
              } else if (!matchingItem) {
                matchingItem = childMatchingItem;
              }
            }
          }
          return matchingItem;
        },

        /**
         * Highlight the VM focused Widget
         * @param {number} id - id of the focused widget
         */
        setVMFocusedWidget: function(id) {
          this._vmFocusedWidgetId = id;
          console.log("setVMFocusedWidget");
        }

      };
    });
    cls.WidgetFactory.registerBuilder('MonitorDebugTree', cls.MonitorDebugTreeWidget);
  });
