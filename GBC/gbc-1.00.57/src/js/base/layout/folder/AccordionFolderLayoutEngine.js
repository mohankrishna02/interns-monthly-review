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

modulum('AccordionFolderLayoutEngine', ['FolderLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class AccordionFolderLayoutEngine
     * @memberOf classes
     * @extends classes.FolderLayoutEngine
     */
    cls.AccordionFolderLayoutEngine = context.oo.Class(cls.FolderLayoutEngine, function($super) {
      return /** @lends classes.AccordionFolderLayoutEngine.prototype */ {
        __name: "AccordionFolderLayoutEngine",

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          var decorationHeight = 0;
          var decorationWidth = 0;
          var pageDecorationHeight = 0;
          var pageDecorationWidth = 0;
          var visiblePageCount = this._widget.getVisiblePageCount();
          if (visiblePageCount > 0) {
            var pageWithDecorationElement = this._widget.getElement().child("gbc_AccordionElement");
            var pageWithoutDecorationElement = pageWithDecorationElement.child("gbc_AccordionPage");

            var oneTitleHeight = pageWithDecorationElement.clientHeight - pageWithoutDecorationElement.clientHeight;
            decorationHeight = visiblePageCount * oneTitleHeight;
            decorationWidth = pageWithDecorationElement.clientWidth - pageWithoutDecorationElement.clientWidth;

            var pageMargin = parseInt(context.ThemeService.getValue("gbc-AccordionFolderWidget-page-margin"), 10);

            pageDecorationWidth = pageMargin * 2;
            pageDecorationHeight = pageMargin * 2;
          }

          this._getLayoutInfo().setDecorating(
            this._widget.getElement().clientWidth - this._widget.getContainerElement().clientWidth + decorationWidth +
            pageDecorationWidth,
            this._widget.getElement().clientHeight - this._widget.getContainerElement().clientHeight + decorationHeight +
            pageDecorationHeight
          );

          for (var i = 0; i < this._widget._children.length; ++i) {
            var child = this._widget._children[i];
            child.getLayoutInformation().setDecorating(
              pageDecorationWidth,
              pageDecorationHeight
            );
          }
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          $super.prepareApplyLayout.call(this);

          var visiblePageCount = this._widget.getVisiblePageCount();
          var pageHeight = 0;

          if (visiblePageCount > 0) {
            // fix height of current page (this is necessary for css animation (transition on height))
            pageHeight = this._widget.getCurrentPage().getLayoutInformation().getAvailable().getHeight();
            pageHeight = pageHeight + this._widget.getCurrentPage().getLayoutInformation().getDecorating().getHeight();
          }

          this._widget.setStyle({
            selector: ".gbc_AccordionPage.currentPage",
            appliesOnRoot: false
          }, {
            "height": pageHeight + "px"
          });
        },
      };
    });
  });
