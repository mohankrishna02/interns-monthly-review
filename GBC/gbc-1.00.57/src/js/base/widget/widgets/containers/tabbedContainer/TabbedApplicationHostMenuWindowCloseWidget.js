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

modulum('TabbedApplicationHostMenuWindowCloseWidget', ['ApplicationHostMenuWindowCloseWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class TabbedApplicationHostMenuWindowCloseWidget
     * @memberOf classes
     * @extends classes.ApplicationHostMenuWindowCloseWidget
     */
    cls.TabbedApplicationHostMenuWindowCloseWidget = context.oo.Class(cls.ApplicationHostMenuWindowCloseWidget, function($super) {
      return /** @lends classes.TabbedApplicationHostMenuWindowCloseWidget.prototype */ {
        __name: "TabbedApplicationHostMenuWindowCloseWidget",
        setActive: function(active) {
          this._active = active;
          this._element.toggleClass("gbc-disabled", !active);
        },
        setHidden: function(hidden) {
          this._element.toggleClass("gbc-hidden", Boolean(hidden));
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TabbedApplicationHostWindowCloseMenu', cls.TabbedApplicationHostMenuWindowCloseWidget);
  });
