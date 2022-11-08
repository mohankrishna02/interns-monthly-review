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

modulum('TraditionalLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {

    /**
     * @class TraditionalLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.TraditionalLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.TraditionalLayoutEngine.prototype */ {
        __name: "TraditionalLayoutEngine",

        _children: null,

        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._children = [];
        },

        /**
         * @inheritDoc
         */
        registerChild: function(widget) {
          this._children.push(widget);
          var li = widget.getLayoutInformation();
          li.className = 'tgl_' + widget.getUniqueIdentifier();
          li.styleRules = {};
          li.styleRulesContent = {};
          li.styleRules['.' + li.className] = li.styleRulesContent;
        },

        /**
         * @inheritDoc
         */
        unregisterChild: function(widget) {
          this._children.remove(widget);
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var heightpadding = parseFloat(context.ThemeService.getValue("theme-field-height-ratio"));
          var fieldheight = parseFloat(context.ThemeService.getValue("theme-field-default-height"));
          for (var i = 0; i < this._children.length; ++i) {
            var child = this._children[i];
            var layoutInfo = child.getLayoutInformation();
            if (layoutInfo) {
              var left = layoutInfo.getGridX();
              var top = (layoutInfo.getGridY()) * (fieldheight + 2 * heightpadding) + heightpadding;
              var width = layoutInfo.getGridWidth();
              var height = layoutInfo.getGridHeight() * fieldheight;
              var li = child.getLayoutInformation();
              li.getHostElement().toggleClass(li.className, true);
              var letterSpacing = context.ThemeService.getValue("theme-traditional-mode-letter-spacing");
              li.styleRulesContent.left = 'calc(' + left + 'ch + ' + left + ' * ' + letterSpacing + ')';
              li.styleRulesContent.top = top + 'px';
              li.styleRulesContent.width = 'calc(' + width + 'ch + ' + width + ' * ' + letterSpacing + ')';
              li.styleRulesContent.height = height + 'px';
              context.styler.appendStyleSheet(li.styleRules, "traditionalGridLayout_" + child.getUniqueIdentifier(), true, this
                .getLayoutSheetId());
            }
          }
        },

        /**
         * @inheritDoc
         */
        getRenderableChildren: function() {
          return [];
        }
      };
    });
  });
