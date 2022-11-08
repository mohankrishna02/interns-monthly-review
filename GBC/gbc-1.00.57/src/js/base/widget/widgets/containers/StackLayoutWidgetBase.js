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

modulum('StackLayoutWidgetBase', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class StackLayoutWidgetBase
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.StackLayoutWidgetBase = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.StackLayoutWidgetBase.prototype */ {
        __name: "StackLayoutWidgetBase",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._element.addClass("g_StackLayoutEngine");
        },

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.StackLayoutEngine(this);
        },

        _addChildWidgetToDom: function(widget, position) {
          var widgetHost = document.createElement('div');
          widgetHost.addClass('g_StackElement');
          widget.getLayoutInformation().setHostElement(widgetHost);
          var stackLabel = cls.WidgetFactory.createWidget("StackLabel", this.getBuildParameters());
          widgetHost.appendChild(stackLabel._element);
          widget.getLayoutInformation()._stackLabel = stackLabel;
          widgetHost.appendChild(widget._element);
          this.getLayoutEngine().registerChild(widget, position);
          widgetHost.insertAt(position, this._containerElement);
        },

        _removeChildWidgetFromDom: function(widget) {
          this.getLayoutEngine().unregisterChild(widget);
          var info = widget.getLayoutInformation(),
            host = info && info.getHostElement(),
            label = info && info._stackLabel;
          if (label) {
            label.destroy();
            info._stackLabel = null;
          }
          if (host && host.parentNode === this._containerElement) {
            widget._element.remove();
            host.remove();
            host = null;
          }
        },

        setStackLabelText: function(widget, text) {
          var info = widget.getLayoutInformation(),
            label = info && info._stackLabel;
          if (label) {
            label.setText(text);
          }
        }
      };
    });
  });
