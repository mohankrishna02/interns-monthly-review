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

modulum('ProductInformationWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ProductInformationWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ProductInformationWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ProductInformationWidget.prototype */ {
        __name: "ProductInformationWidget",

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);

          var versionElement = this._element.getElementsByClassName("field_version")[0];
          versionElement.textContent = context.version;

          var buildElement = this._element.getElementsByClassName("field_build")[0];
          buildElement.textContent = context.build + (context.dirtyFlag || "");

          if (context.tag === "dev-snapshot") {
            var tagElement = this._element.getElementsByClassName("field_tag")[0];
            tagElement.textContent = "(dev-snapshot)";
          }

          var logoElement = this._element.getElementsByClassName("field_logo")[0];
          logoElement.setAttribute("src", context.ThemeService.getResource("img/logo.png"));
          logoElement.setAttribute("alt", "Genero Browser Client");
        },

        _initLayout: function() {
          // no layout
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ProductInformation', cls.ProductInformationWidget);
  });
