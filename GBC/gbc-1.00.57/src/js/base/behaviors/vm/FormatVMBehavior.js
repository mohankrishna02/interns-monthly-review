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

modulum('FormatVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Manage both DBDATE and Format attribute. If a Format attribute is specified it replaces DBDATE format
     * @class FormatVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FormatVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.FormatVMBehavior.prototype */ {
        __name: "FormatVMBehavior",

        watchedAttributes: {
          decorator: ['format']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFormat) {
            var decoratorNode = controller.getNodeBindings().decorator;
            if (decoratorNode.isAttributeSetByVM('format') && decoratorNode.attribute('format')) {
              // BDL format convention has uppercase equivalent in web conventions
              // except for day abbreviation which has to stay lowercase
              var format = decoratorNode.attribute('format').toUpperCase();
              // day abbreviation exception
              format = format.replace(/(DDD)/g, "ddd");
              widget.setFormat(format);
            } else {
              var uiWidget = widget.getUserInterfaceWidget();
              if (uiWidget) {
                var dbDate = uiWidget.getDbDateFormat();
                var tradionalFormat = cls.DateTimeHelper.parseDbDateFormat(dbDate);
                widget.setFormat(tradionalFormat);
              }
            }
          }
        }
      };
    });
  });
