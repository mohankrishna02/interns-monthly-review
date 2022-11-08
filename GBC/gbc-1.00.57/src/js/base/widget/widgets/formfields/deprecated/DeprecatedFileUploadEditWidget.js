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

modulum('DeprecatedFileUploadEditWidget', ['EditWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DeprecatedFileUploadEdit widget.
     * @class DeprecatedFileUploadEditWidget
     * @memberOf classes
     * @extends classes.EditWidget
     */
    cls.DeprecatedFileUploadEditWidget = context.oo.Class(cls.EditWidget, function($super) {
      return /** @lends classes.DeprecatedFileUploadEditWidget.prototype */ {
        __name: "DeprecatedFileUploadEditWidget",
        __templateName: "EditWidget",
        _initElement: function() {
          $super._initElement.call(this);
          this.setEnabled();
          $super.setValue.call(this, "DEPRECATED: The style='FileUpload' is not supported by GBC. Please use fgl_getfile().");
        },
        setValue: function() {

        },
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, false);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Edit.FileUpload', cls.DeprecatedFileUploadEditWidget);
  });
