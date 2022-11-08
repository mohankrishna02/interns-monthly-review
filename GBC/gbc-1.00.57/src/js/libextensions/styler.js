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

(function(context) {
  var _internal = {
    debug: false,
    styleSheetNamePrefix: "dyncss__",
    _buffered: false,

    createDOM: function(id, contents) {
      if (contents) {
        var cssContent = "<!--\n" + contents + "\n-->",
          styleSheetName = this.styleSheetNamePrefix + id;

        var sheet = document.createElement("style");
        sheet.addClass(styleSheetName);
        this.setCssContents(sheet, cssContent);
        return sheet;
      }
      return null;
    },
    appendDOM: function(sheet) {
      document.head.appendChild(sheet);
    },
    setCssContents: function(styleSheet, cssContent) {
      if (styleSheet) {
        if (styleSheet.styleSheet) {
          styleSheet.styleSheet.cssText = cssContent;
        } else {
          styleSheet.appendChild(document.createTextNode(cssContent));
        }
      }
    },
    contentFromRules: function(styles, builder) {
      if (styles) {
        var localStyles = JSON.parse(styles);
        if (localStyles) {
          var _builder = builder || [];
          var keys = Object.keys(localStyles);
          for (var ruleIndex = 0; ruleIndex < keys.length; ruleIndex++) {
            var rule = keys[ruleIndex],
              ruleStyles = localStyles[rule];
            var items = Object.keys(ruleStyles);
            if (items.length) {
              var added = 0;
              _builder.push(rule, "{");
              for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (ruleStyles[item] || ruleStyles[item] === 0 || ruleStyles[item] === false || ruleStyles[item] === "") {
                  added++;
                  _builder.push(item, ":", ruleStyles[item], ";");
                }
              }
              if (added) {
                _builder.push("}");
              } else {
                _builder.length = _builder.length - 2;
              }
            }
          }
          if (!builder && _builder.length) {
            return _builder.join(this.debug ? "\n" : "");
          }
        }
      }
      return null;
    },
    contentFromRuleSet: function(ruleSet) {
      var builder = [];
      if (ruleSet) {
        ruleSet.forEach(function(rule) {
          this.contentFromRules(rule, builder);
        }, this);
      }
      return builder.length ? builder.join(this.debug ? "\n" : "") : null;
    }
  };

  var DynStyleSheet = context.augmentedFace.Class({
    __name: "styler",
    /**
     * @type Map
     */
    _sections: null,
    _id: null,
    _isStandalone: false,

    /**
     * @type HTMLElement
     */
    _dom: null,
    _oldRaw: null,
    _rawContent: null,
    _dirty: false,
    _toDestroy: false,

    constructor: function(id) {
      this._sections = new Map();
      this._id = id;
      this._isStandalone = Boolean(id);
    },
    destroy: function() {
      if (this._sections) {
        this._sections.clear();
        this._sections = null;
      }
      this._id = null;
      if (this._dom) {
        this._dom.remove();
      }
      this._dom = null;
      this._oldRaw = null;
      this._rawContent = null;
    },
    render: function() {
      if (this._dirty) {
        var old = this._dom;
        this._oldRaw = this._rawContent;
        this._rawContent = this._getContents();
        if (this._oldRaw !== this._rawContent) {
          this._dom = _internal.createDOM(this._id || "default", this._rawContent);

          if (old) {
            old.remove();
          }
          if (this._dom) {
            _internal.appendDOM(this._dom);
          }
        }
        this._dirty = false;
      }
    },
    _getContents: function() {
      return _internal.contentFromRuleSet(this._sections);
    },

    clear: function() {
      if (this._sections) {
        this._sections.clear();
      } else {
        this._sections = new Map();
      }
      this._dirty = true;
    },

    setContents: function(id, rules) {
      var current = this._sections.get(id),
        newrules = JSON.stringify(rules);
      if (current !== newrules) {
        if (newrules === "{}") {
          this._sections.delete(id);
          if (this._sections.size === 0) { // empty style object. flag it to destroy it later during flush
            this._toDestroy = true;
          }
        } else {
          this._sections.set(id, newrules);
          this._toDestroy = false;
        }
        this._dirty = true;
      }
    }
  });

  /**
   * styler
   * ===============
   *
   * provides methods to work with styles
   * @namespace styler
   */
  context.styler = /** @lends styler */ {
    /**
     * @type Map
     */
    _cachedStyles: new Map(),

    appendStyleSheet: function(styles, id, standalone, sheetId) {
      var lid = sheetId || sheetId === 0 ? sheetId : id;
      var cacheKey = standalone ? lid : "__default";
      var cached = this._cachedStyles.get(cacheKey);
      if (!cached) {
        cached = new DynStyleSheet(standalone ? lid : null);
        this._cachedStyles.set(cacheKey, cached);
      }
      cached.setContents(id, styles);
      if (!_internal._buffered) {
        cached.render();
      }
    },

    isBuffering: function() {
      return Boolean(_internal._buffered);
    },

    bufferize: function() {
      _internal._buffered = true;
    },
    flush: function() {
      this._cachedStyles.forEach(function(style, key) {
        if (style) {
          if (style._toDestroy) {
            this._destroyStyleSheet(style, key);
          } else {
            style.render();
          }
        }
      }, this);
      _internal._buffered = false;
    },
    removeStyleSheet: function(key) {
      var style = this._cachedStyles.get(key);
      if (style) {
        this._destroyStyleSheet(style, key);
      }
    },
    _destroyStyleSheet: function(stylesheet, key) {
      stylesheet._toDestroy = false;
      stylesheet.clear();
      stylesheet.render();
      stylesheet.destroy();
      stylesheet = null;
      this._cachedStyles.delete(key);
    }
  };
})(window);
