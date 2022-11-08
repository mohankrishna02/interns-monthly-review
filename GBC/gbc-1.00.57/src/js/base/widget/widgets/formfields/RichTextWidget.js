/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('RichTextWidget', ['WebComponentWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TextEdit widget.
     * @class RichTextWidget
     * @memberOf classes
     * @extends classes.WebComponentWidget
     */
    cls.RichTextWidget = context.oo.Class(cls.WebComponentWidget, function($super) {
      return /** @lends classes.RichTextWidget.prototype */ {
        __name: 'RichTextWidget',
        /**
         * @type {?string}
         */
        _richtextPath: null,

        _richTextProperties: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          this._richtextPath = context.ThemeService.getResource("webcomponents/fglrichtext/fglrichtext.html");
          $super.constructor.call(this, opts);
          this._richTextProperties = {
            toolbar: true,
          };
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          // Use this line if gbc should use the FGL richtext editor (only for 3.10)
          // this._richtextPath = gbc.WebComponentService.getWebcomponentUrl() + '/fglrichtext/fglrichtext.html';
          this.setWebComponentType('api');
          this.setUrl(this._richtextPath);
        },

        /**
         * Display the toolbar or not
         * @param {boolean|string} show
         */
        showEditToolBox: function(show) {
          this._richTextProperties.toolbar = show !== 'hide';
          this._onReadyExecute(function() {
            this._toICAPI('onProperty', {
              'toolbar': show
            });
          }.bind(this));

          this._toICAPI('onProperty', {
            'toolbar': show
          });
        },

        /**
         * Defines the toolbar items
         * @param {string} items - string representing items
         */
        setToolbarItems: function(items) {
          this._onReadyExecute(function() {
            this._toICAPI('onProperty', {
              'toolbar': items
            });
          }.bind(this));

          this._toICAPI('onProperty', {
            'toolbar': items
          });
        },

        /**
         * @inheritDoc
         */
        _onReady: function() {
          $super._onReady.call(this);
          this._iframeElement.removeClass('hidden');
          //Load Spellchecker and create a default toolbar
          this._onReadyExecute(function() {
            var tb = this._richTextProperties.toolbar ?
              'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | fontsizeselect' :
              'hide';
            this._toICAPI('onProperty', {
              'toolbar': tb,
              'spellcheck': 'browser'
            });
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        setReadOnly: function(readonly) {
          $super.setReadOnly.call(this, readonly);

          this._onReadyExecute(function() {
            this._toICAPI('onStateChanged', JSON.stringify({
              'active': readonly,
            }));
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          // Enable or disable Editor
          this._onReadyExecute(function() {
            this._toICAPI('onStateChanged', JSON.stringify({
              'active': enabled ? 1 : 0,
            }));
          }.bind(this));
        },

        /**
         * NotEditable allows cursor moving, but not a value change
         * @param {boolean} notEditable - true to set the edit part as read-only
         */
        setNotEditable: function(notEditable) {
          this._notEditable = notEditable;
          this._onReadyExecute(function() {
            // Note that noteditable key is in lowercase since properties sent by VM are always in lowercase
            this._toICAPI('onProperty', JSON.stringify({
              'noteditable': notEditable,
            }));
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          if (value === '') {
            value = null;
          }
          this._value = value;
          if (this._isReady && this.value !== this._flushValue) {
            this._toICAPI('onData', this._value ? this._value : '');
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyData.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          this._onReadyExecute(function() {
            if (this._iframeElement !== document.activeElement) {
              this._toICAPI('onFocus', true);
            }
          }.bind(this));
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * Force webcomponent to get data
         */
        flushWebcomponentData: function() {
          this._toICAPI('onFlushData');
        },

      };
    });
    cls.WidgetFactory.registerBuilder('RichText', cls.RichTextWidget);
  });
