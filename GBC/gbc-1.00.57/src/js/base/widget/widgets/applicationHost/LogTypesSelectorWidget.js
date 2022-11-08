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

modulum('LogTypesSelectorWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class LogTypesSelectorWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.LogTypesSelectorWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.LogTypesSelectorWidget.prototype */ {
        __name: "LogTypesSelectorWidget",

        /**
         * @type {Array<{name:string, label:string}>}
         */
        _types: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this.setTypes(context.LogService.getTypes());
          this.setCurrentTypes(context.LogService.getActiveLogTypes());
          this._element.on("click", function(evt) {
            if (evt.target.dataset.logtype) {
              this.emit("logtype", evt.target.dataset.logtype);
            }
          }.bind(this));
        },

        /**
         *
         * @param {Array<{name:string, label:string}>} types
         */
        setTypes: function(types) {
          this._types = types;
          this._element.empty();
          for (var i = 0; i < types.length; i++) {
            this._element.innerHTML += '<div data-logtype="' + types[i].name + '" class="active">' + types[i].label + '</div>';
          }
        },
        /**
         *
         * @param {Array<string>} types name of activated loggers
         */
        setCurrentTypes: function(types) {
          var matcher = function(val) {
            return function(i) {
              return i === val;
            };
          };
          for (var i = 0; i < this._types.length; i++) {
            var val = this._types[i].name,
              item = this._element.querySelector('[data-logtype="' + val + '"]');
            if (item) {
              item.toggleClass("active", !types || Boolean(types.find(matcher(val))));
            }
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('LogTypesSelector', cls.LogTypesSelectorWidget);
  });
