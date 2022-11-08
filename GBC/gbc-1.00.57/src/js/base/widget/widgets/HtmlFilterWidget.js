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

modulum('HtmlFilterWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     *  Widget used to filter html document values
     * @class HtmlFilterWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.HtmlFilterWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.HtmlFilterWidget.prototype */ {
        __name: "HtmlFilterWidget",

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._options = {
            filterScript: true,
            filterStyle: true,
            filterHead: true
          };

        },

        /**
         * Sanitize HTML
         * @param {string} html to sanitize
         * @return {string} - the html string corresponding to the body content only
         */
        filterHtml: function(html) {
          var filtered = html;
          try {
            // load html into iframe
            var iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
            filtered = iframe.contentDocument.body.innerHTML;
            document.body.removeChild(iframe);
          } catch (ex) {
            filtered = "HTML cannot be sanitized";
          }
          return filtered;
        }

      };
    });
    cls.WidgetFactory.registerBuilder('HtmlFilterWidget', cls.HtmlFilterWidget);

  });
