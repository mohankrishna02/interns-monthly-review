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

modulum('ApplicationHostMenuRuntimeWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuRuntimeWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuRuntimeWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuRuntimeWidget.prototype */ {
        __name: "ApplicationHostMenuRuntimeWidget",
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.querySelector('a').title = i18next.t("gwc.app.busy");
        },
        _initLayout: function() {
          // no layout
        },
        setIdle: function() {
          this.removeClass("processing");
        },
        setProcessing: function() {
          this.addClass("processing");
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostMenuRuntime', cls.ApplicationHostMenuRuntimeWidget);
  });
