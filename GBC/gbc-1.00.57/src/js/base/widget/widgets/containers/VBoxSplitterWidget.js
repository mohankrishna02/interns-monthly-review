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

modulum('VBoxSplitterWidget', ['SplitterWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Splitter widget.
     * @class VBoxSplitterWidget
     * @memberOf classes
     * @extends classes.SplitterWidget
     */
    cls.VBoxSplitterWidget = context.oo.Class(cls.SplitterWidget, function($super) {
      return /** @lends classes.VBoxSplitterWidget.prototype */ {
        __name: "VBoxSplitterWidget",
        __templateName: "SplitterWidget",
        _initElement: function() {
          $super._initElement.call(this);
          this._element.addClass("gbc_SplitterWidget");
        },
        _initLayout: function() {
          $super._initLayout.call(this);
          this._layoutInformation.setMaximal(cls.Size.maximal, 8);
        },
        _onDragOver: function(evt) {
          $super._onDragOver.call(this, evt);
          this._pagePosition = evt.pageY;
        },
        _updateResizerDrag: function(evt) {
          this._pagePosition = evt.pageY;
          this._resizerDragPosition = evt.pageY;
        },

        // Touch only
        _onTouchStart: function(evt) {
          this._splitStartPos = evt.touches[0].clientY;
          $super._onTouchStart.call(this, evt);
        },

        _onTouchMove: function(evt) {
          this._pagePosition = evt.touches[0].clientY;
          $super._onTouchMove.call(this, evt);
        },

      };
    });
    cls.WidgetFactory.registerBuilder('VBoxSplitter', cls.VBoxSplitterWidget);
  });
