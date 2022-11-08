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

modulum('MonitorDebugTreeItemWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class MonitorDebugTreeItemWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.MonitorDebugTreeItemWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.MonitorDebugTreeItemWidget.prototype */ {
        __name: "MonitorDebugTreeItemWidget",
        _container: null,
        _label: null,
        _idRef: null,
        _idRefNumber: null,
        _collapsed: false,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._container = this._element.child("description");
          this._label = this._container.child("label");
          this._idRef = this._container.child("idRef");
          this._container
            .on("click.MonitorDebugTreeItemWidget", this._onClick.bind(this))
            .on("dblclick.MonitorDebugTreeItemWidget", this._onDoubleClick.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._container
            .off("click.MonitorDebugTreeItemWidget")
            .off("dblclick.MonitorDebugTreeItemWidget");
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _onClick: function() {
          this.emit(gbc.constants.widgetEvents.click);
          event.stopPropagation();
        },

        /**
         * @inheritDoc
         */
        _onDoubleClick: function(event) {
          this._toggleCollapsed();
          event.stopPropagation();
        },

        /**
         * Define the label of the item in the tree view
         * @param {string} label - text to display
         */
        setLabel: function(label) {
          this._label.textContent = label;
        },

        /**
         * Define the VM idRef of the item in the tree view
         * @param {string} idRef - idRef to set
         */
        setIdRef: function(idRef) {
          this._idRefNumber = idRef;
          this._idRef.textContent = idRef;
        },

        /**
         * Get the VM idRef of the item
         * @return {null}
         */
        getIdRef: function() {
          return this._idRefNumber;
        },

        /**
         * Define the color of the icon
         * @param {string} color - CSS compliant color
         */
        setIconColor: function(color) {
          this.setStyle('>.description>.icon', {
            "background-color": color
          });
        },

        /**
         * Expand / collapse a tree part
         * @param {boolean} collapsed - true if collapsed, false otherwise
         */
        setCollapsed: function(collapsed) {
          this._toggleCollapsed(Boolean(collapsed));
        },

        /**
         * Expand / collapse a tree part
         * @param {boolean} collapsed - true if collapsed, false otherwise
         * @private
         */
        _toggleCollapsed: function(collapsed) {
          if (collapsed === true) {
            if (!this._collapsed) {
              this._collapsed = true;
              this._containerElement.remove();
            }
          } else if (collapsed === false) {
            if (this._collapsed) {
              this._collapsed = false;
              this._element.appendChild(this._containerElement);
            }
          } else {
            this._collapsed = !this._collapsed;
            if (this._collapsed) {
              this._containerElement.remove();
            } else {
              this._element.appendChild(this._containerElement);
            }
          }
          this._element.toggleClass("collapsed", Boolean(this._collapsed));
        },

        /**
         * Set item as highlighted
         * @param {boolean} highlighted - true if highlighted, false otherwise
         */
        setHighlighted: function(highlighted) {
          this._element.toggleClass("highlighted", highlighted);
          if (highlighted) {
            var p = this.getParentWidget();
            while (p instanceof cls.MonitorDebugTreeItemWidget) {
              p.setCollapsed(false);
              p = p.getParentWidget();
            }
          }
        },

        setFocused: function(focused) {
          this._element.toggleClass("vmFocusedNode", focused);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('MonitorDebugTreeItem', cls.MonitorDebugTreeItemWidget);
  });
