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

modulum('ChromeBarItemRunInGDCWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button in chromeBar to open the app in GDC
     * @class ChromeBarItemRunInGDCWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemRunInGDCWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemRunInGDCWidget.prototype */ {
        __name: "ChromeBarItemRunInGDCWidget",
        __templateName: "ChromeBarItemWidget",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.runInGDC'));
          this.setTitle(i18next.t('gwc.main.chromebar.runInGDC'));
          this.setImage("zmdi-play");
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

          return $super.manageMouseClick.call(this, domEvent);
        },

        /**
         * Called by Debug service to tell UI that it's ready
         * @param active
         */
        activate: function(active) {
          this._element.toggleClass("debugActivated", active);
        },

        /**
         * @inheritDoc
         */
        isHidden: function() {
          // If debug mode is not active, this item is supposed to be hidden
          return !gbc.DebugService.isActive() ? true : $super.isHidden.call(this);
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemRunInGDC', cls.ChromeBarItemRunInGDCWidget);
  });
