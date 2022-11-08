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

modulum('ComboBoxLayoutEngine', ['LeafLayoutEngine'],
  function(context, cls) {
    /**
     * @class ComboBoxLayoutEngine
     * @memberOf classes
     * @extends classes.LeafLayoutEngine
     */
    cls.ComboBoxLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      return /** @lends classes.ComboBoxLayoutEngine.prototype */ {
        __name: "ComboBoxLayoutEngine",

        /**
         * @inheritDoc
         */
        prepareDynamicMeasure: function() {
          if (this._dataContentMeasure) {
            if (!this._widget.getLayoutInformation().getCurrentSizePolicy().isFixed()) {
              var children = this._widget.getItems();
              var longestValue = this._textSample;
              for (var i = 0; i < children.length; i++) {
                var value = children[i].text;
                if (value) {
                  if (value.length > longestValue.length) {
                    longestValue = value;
                  }
                }
              }
              this._dataContentMeasure.textContent = longestValue;
            }
          }
        },
      };
    });
  });
