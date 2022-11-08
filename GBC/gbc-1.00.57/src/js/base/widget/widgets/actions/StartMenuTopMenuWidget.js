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

modulum('StartMenuTopMenuWidget', ['TopMenuWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * StartMenuTopMenu widget.
     * @class StartMenuTopMenuWidget
     * @memberOf classes
     * @extends classes.TopMenuWidget
     */
    cls.StartMenuTopMenuWidget = context.oo.Class(cls.TopMenuWidget, function($super) {
      return /** @lends classes.StartMenuTopMenuWidget.prototype */ {
        __name: 'StartMenuTopMenuWidget',
        __templateName: 'TopMenuWidget'
      };
    });
    cls.WidgetFactory.registerBuilder('StartMenuTopMenu', cls.StartMenuTopMenuWidget);
  });
