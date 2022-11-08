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

modulum('TabbedContainerLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class TabbedContainerLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.TabbedContainerLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.TabbedContainerLayoutEngine.prototype */ {
        __name: "TabbedContainerLayoutEngine",

        /**
         * @inheritDoc
         */
        DOMMeasure: function() {
          $super.DOMMeasure.call(this);
          if (this._widget.getTabsTitlesHostElement) {
            var info = this._getLayoutInfo(),
              container = this._widget.getTabsTitlesHostElement().getBoundingClientRect();
            info.setTitlesContainerDeltaWidth(info.getRawMeasure().getWidth() - container.width);
            info.setTitlesContainerDeltaHeight(info.getRawMeasure().getHeight() - container.height);
          }
        }
      };
    });
  });
