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

modulum('WidgetFactory', ['Factory', 'LogService'],

  /**
   * @typedef {Object} WidgetFactoryId
   * @property {?string} parentIdentifier
   * @property {?string} parentStyle
   * @property {Object|?string} parentAttributes
   * @property {?string} identifier
   * @property {?string} style
   * @property {Object|?string} attributes
   * @property {number} weight
   * @property {number} attributesWeight
   * @property {number} parentAttributesWeight
   * @property {number} weight
   * @property {number} timestamp
   * @property {?Function} builder
   */

  function(context, cls) {
    /**
     * @namespace classes.WidgetFactory
     */
    cls.WidgetFactory = context.oo.StaticClass(function() {
      return /** @lends classes.WidgetFactory */ {

        /**
         * @const
         * @private
         */
        _selectorRegExp: /^\s*(?:([a-zA-Z]+)(?:\.([a-zA-Z0-9_-]+))?((?:\[[a-zA-Z0-9_-]+=[a-zA-Z0-9_\s-]+])+)?\s+)?([a-zA-Z]+)(?:\.([a-zA-Z0-9_-]+))?((?:\[[a-zA-Z0-9_-]+=[a-zA-Z0-9_\s-]+])+)?\s*$/,
        _selectorAttributesRegExp: /(?:\[([a-zA-Z0-9_-]+)=([a-zA-Z0-9_\s-]+)])/g,

        /**
         * @type {Object.<string, WidgetFactoryId>}
         * @private
         */
        _fabrics: {},

        /**
         * @type {Object.<string, WidgetFactoryId>}
         * @private
         */
        _themeFabrics: {},

        /**
         *
         * @param {string} selector Selector matcher as "[parentNode[.parentStyle]] id[.style]"
         * @param {Function} constructor constructor of the widget
         */
        registerBuilder: function(selector, constructor) {
          this._register(this._sanitizeId(selector), constructor);
        },

        /**
         * parse the fabric selector
         * @param {string} selector the selector
         * @private
         * @returns {WidgetFactoryId} the parsed id
         */
        _sanitizeId: function(selector) {
          var result = {
            parentIdentifier: "",
            parentStyle: "",
            parentAttributes: "",
            identifier: "",
            style: "",
            attributes: "",
            weight: 0,
            attributesWeight: 0,
            parentAttributesWeight: 0,
            timestamp: Date.now(),
            builder: null
          };
          var exec = this._selectorRegExp.exec(selector);
          if (exec) {
            var _attrs, curr, i = 0;
            result.parentIdentifier = exec[1] || "";
            result.parentStyle = exec[2] || "";
            result.parentAttributes = exec[3] || "";
            if (result.parentAttributes) {
              i = 0;
              _attrs = result.parentAttributes;
              result.parentAttributes = {};
              /*jshint -W084 */
              while (curr = this._selectorAttributesRegExp.exec(_attrs)) {
                result.parentAttributes[curr[1]] = curr[2];
                i++;
              }
            }
            result.parentAttributesWeight = i;
            result.identifier = exec[4];
            result.style = exec[5] || "";
            result.attributes = exec[6] || "";
            if (result.attributes) {
              i = 0;
              _attrs = result.attributes;
              result.attributes = {};
              while (curr = this._selectorAttributesRegExp.exec(_attrs)) {
                result.attributes[curr[1]] = curr[2];
                i++;
              }
            }
            result.attributesWeight = i;
            result.weight = (result.parentIdentifier ? 4 : 0) + (result.parentStyle ? 2 : 0) + (result.style ? 1 : 0);
          } else {
            context.LogService.warn("WidgetFactory - Trying to register widget with wrong selector: '" + selector + "'");
          }
          return result;
        },

        /**
         * register a widget fabric
         * @private
         * @param {WidgetFactoryId} id the fabric id
         * @param {Function?} constructor constructor of the widget
         * @param {boolean} [_fromTheme] internal param - true if register comes from a theme
         */
        _register: function(id, constructor, _fromTheme) {
          var fabrics = this._fabrics;
          if (_fromTheme) {
            fabrics = this._themeFabrics;
          }
          if (id.identifier) {
            id.builder = constructor;
            var store = (fabrics[id.identifier] = fabrics[id.identifier] || []);
            store.push(id);
            store.sort(this._compareFabrics);
          }
        },

        _compareFabrics: function(a, b) {
          return (b.weight - a.weight) ||
            (b.parentAttributesWeight - a.parentAttributesWeight) ||
            (b.attributesWeight - a.attributesWeight) ||
            (b.timestamp - a.timestamp);
        },

        /**
         * @deprecated Use registerBuilder instead.
         * @param {string} id
         * @param {string|?Function} style style of the widget
         * @param {?Function} constructor constructor of the widget
         */
        register: function(id, style, constructor) {
          if (!constructor) {
            constructor = style;
            style = "";
          }
          this.registerBuilder(id + (style ? ("." + style) : ""), constructor);
        },

        /**
         *
         * @deprecated
         * @param {string} id
         * @param {string} [styles]
         * @returns {classes.WidgetBase}
         */
        create: function(id, styles, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          var result = null;
          if (this._fabrics[id]) {
            if (!styles) {
              result = this._fabrics[id].filter(function(f) {
                return !f.weight && !f.attributesWeight && !f.parentAttributesWeight;
              })[0];
            } else {
              var pos = 0,
                fabrics = this._fabrics[id].filter(function(f) {
                  return f.weight <= 1 && !f.attributesWeight && !f.parentAttributesWeight;
                });
              while (!result && (pos < fabrics.length)) {
                var fabric = fabrics[pos];
                if (!fabric.style || styles.trim().split(cls.NodeBase.stylesSeparatorRegExp).indexOf(fabric.style)) {
                  result = fabric;
                }
                pos++;
              }
            }
          }
          if (result && result.builder) {
            var Fabric = result.builder;
            result = new Fabric(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          }
          return result;
        },
        /**
         *
         * @param {string} id
         * @param {?*} [builderParameters]
         * @param {classes.NodeBase|classes.WidgetBase} [contextInstance]
         * @return {?classes.WidgetBase}
         */
        createWidget: function(id, builderParameters, contextInstance) {
          var result = null;
          var Fabric = this._findFabric(id, builderParameters, contextInstance);
          var ThemeFabric = this._findFabric(id, builderParameters, contextInstance, true);
          if (ThemeFabric && (!Fabric || this._compareFabrics(Fabric, ThemeFabric) >= 0)) {
            Fabric = ThemeFabric;
          }
          if (Fabric) {
            Fabric = Fabric.builder;
            result = new Fabric(builderParameters);
          }
          return result;
        },
        /**
         *
         * @param {string} id
         * @param {?*} [builderParameters]
         * @param {classes.NodeBase|classes.WidgetBase} [contextInstance]
         * @param {Boolean} [_fromTheme]
         * @return {?WidgetFactoryId}
         * @private
         */
        _findFabric: function(id, builderParameters, contextInstance, _fromTheme) {
          var fabrics = this._fabrics;
          if (_fromTheme) {
            fabrics = this._themeFabrics;
          }
          var result = null;
          if (fabrics[id]) {
            if (!contextInstance) {
              result = fabrics[id].filter(function(f) {
                return !f.weight && !f.attributesWeight && !f.parentAttributesWeight;
              })[0];
            } else {
              var pos = 0;
              while (!result && (pos < fabrics[id].length)) {
                if (this._matchFabric(fabrics[id][pos], builderParameters, contextInstance)) {
                  result = fabrics[id][pos];
                }
                pos++;
              }
            }
          }
          return result;
        },
        /**
         *
         * @param {WidgetFactoryId} fabric
         * @param {?*} [builderParameters]
         * @param {classes.NodeBase|classes.WidgetBase} [contextInstance]
         * @returns {boolean}
         * @private
         */
        _matchFabric: function(fabric, builderParameters, contextInstance) {
          var result = !fabric.parentIdentifier,
            contextInstanceLocal = contextInstance;
          if (fabric.parentIdentifier) {
            if (contextInstance && contextInstance.isInstanceOf && contextInstance.isInstanceOf(cls.NodeBase)) {
              result = contextInstance.getAncestorWithStyle(fabric.parentIdentifier, fabric.parentStyle);
            } else if (builderParameters &&
              typeof builderParameters.appHash === "number" &&
              typeof builderParameters.auiTag === "number") {
              var app = context.SessionService.getCurrent().getApplicationByHash(builderParameters.appHash);
              result = app && app.model.getNode(builderParameters.auiTag);
              contextInstanceLocal = result;
              result = result.getAncestorWithStyle(fabric.parentIdentifier, fabric.parentStyle);
            }
          }
          result = result && (!fabric.parentAttributesWeight || (result !== true && this._matchAttributes(fabric.parentAttributes,
            result._initialStyleAttributes)));
          result = result && (!fabric.style || (contextInstanceLocal._vmStyles.indexOf(fabric.style) >= 0));
          result = result && (!fabric.attributesWeight || this._matchAttributes(fabric.attributes, contextInstanceLocal
            ._initialStyleAttributes));
          return result;
        },

        _matchAttributes: function(neededAttributes, nodeAttributes) {
          var result = true,
            keys = Object.keys(neededAttributes),
            i = 0,
            len = keys.length;

          while (result && i < len) {
            result = neededAttributes[keys[i]] === nodeAttributes[keys[i]];
            i++;
          }
          return result;
        },

        /**
         * set theme overrides
         * @param {Object<string, string>} overrides theme overrides definitions
         */
        registerThemeOverrides: function(overrides) {
          this._themeFabrics = {};
          var i = 0,
            keys = overrides && Object.keys(overrides) || [],
            len = keys.length;
          for (; i < len; i++) {
            var selector = keys[i],
              constructor = null;
            if (/^cls\./.test(overrides[selector])) {
              constructor = context.classes[overrides[selector].replace(/^cls\./, "")];
            }
            this._register(this._sanitizeId(selector), constructor);
          }
        }
      };
    });
  });
