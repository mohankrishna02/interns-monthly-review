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

modulum('CanvasWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class CanvasWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.CanvasWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.CanvasWidget.prototype */ {
        __name: "CanvasWidget",

        _svgElement: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this._layoutEngine._shouldFillHeight = true;
          this._layoutInformation.getSizePolicyConfig()._defaultMode = 'fixed';
          this._layoutInformation.getSizePolicyConfig().setMode('fixed');
          this._layoutInformation.forcedMinimalHeight = 20;
          this._layoutInformation.forceMinimalMeasuredHeight = true;
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          this._svgElement.setAttribute("class", "gbc-label-text-container gbc_" + this.__name);
          this._svgElement.setAttribute("preserveAspectRatio", "none");
          this._svgElement.setAttribute("viewBox", "0 0 1000 1000");
          this._svgElement.setAttribute("width", "100%");
          this._svgElement.setAttribute("height", "100%");
          this._svgElement.setAttribute("overflow", "hidden");
          this._containerElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
          this._containerElement.setAttribute("class", "containerElement");
          this._containerElement.setAttribute("transform", "matrix(1 0 0 -1 0 1000)");
          this._svgElement.appendChild(this._containerElement);
          this._element.appendChild(this._svgElement);
        },

        /**
         * @inheritDoc
         */
        manageMouseRightClick: function(domEvent) {
          domEvent.preventCancelableDefault();
          return false;
        },

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {},

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._svgElement = null;
          $super.destroy.call(this);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Canvas', cls.CanvasWidget);
  }
);
