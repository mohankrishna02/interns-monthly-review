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

modulum('ApplicationHostMenuRunInGdcWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuRunInGdcWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuRunInGdcWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuRunInGdcWidget.prototype */ {
        __name: "ApplicationHostMenuRunInGdcWidget",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          context.DebugService.unregisterDebugUi(this);
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          var name = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
          var shortcut = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<fjs configVersion="2" product="Genero Desktop Client">\n' +
            ' <Shortcuts>\n' +
            '  <Shortcut ' +
            'name="' + name + '" ' +
            'authenticationMode="standard" ' +
            'type="http" ' +
            'proxyType="monitor" ' +
            'url="' + window.location.href + '" ' +
            '/>\n' +
            ' </Shortcuts>\n' +
            '</fjs>';

          var shortcutFile = new Blob([shortcut], {
            type: "application/genero-gdc"
          });
          //for microsoft IE
          var fileName = name + ".gdc";
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(shortcutFile, fileName);
          } else { //other browsers
            var a = document.createElement("a");
            a.style.display = "none";
            // firefox needs to have element in DOM
            document.body.appendChild(a);
            a.href = window.URL.createObjectURL(shortcutFile);
            a.download = fileName;
            a.click();
            document.body.removeChild(a);
          }

          return false;
        },

        activate: function(active) {
          this._element.toggleClass("debugActivated", active);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostMenuRunInGdc', cls.ApplicationHostMenuRunInGdcWidget);
  });
