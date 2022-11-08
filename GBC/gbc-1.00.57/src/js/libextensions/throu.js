/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

(function(window) {
  var empty = [];
  var noop = function() {};
  var defaultChildrenSelector = function(item) {
    return item && item.children || empty;
  };

  /**
   * @class
   * @param {Object} data data
   */
  var Throu = function(data) {
    this._data = data;
    this._childrenSelector = defaultChildrenSelector;
    this._passes = [];
    this._beforePass = noop;
    this._afterPass = noop;
  };
  Throu.prototype = {
    setChildrenSelector: function(selector) {
      this._childrenSelector = selector;
    },
    unique: function(unique) {
      this._passes.push({
        pass: unique,
        unique: true
      });
    },
    pass: function(pass, childrenFirst, childrenSelector) {
      this._passes.push({
        pass: pass,
        childrenFirst: childrenFirst,
        childrenSelector: childrenSelector
      });
    },
    passIf: function(condition, pass, childrenFirst, childrenSelector) {
      this._passes.push({
        condition: condition,
        pass: pass,
        childrenFirst: childrenFirst,
        childrenSelector: childrenSelector
      });
    },
    beforePass: function(cb) {
      this._beforePass = cb;
    },
    afterPass: function(cb) {
      this._afterPass = cb;
    },
    run: function() {
      for (var p = 0; p < this._passes.length; p++) {
        var pass = this._passes[p];
        this._beforePass(p);
        if (!pass.condition || pass.condition()) {
          if (pass.unique) {
            pass.pass();
          } else {
            if (!pass.childrenFirst) {
              this._runPass(pass.pass, this._data, null, pass.childrenSelector);
            } else {
              this._runPassReverse(pass.pass, this._data, null, pass.childrenSelector);
            }
          }
        }
        this._afterPass(p);
      }
    },
    destroy: function() {
      this._data = null;
      this._passes.length = 0;
      this._childrenSelector = null;
    },
    _runPass: function(pass, item, parent, childrenSelector) {
      pass(item, parent);
      var children = (childrenSelector || this._childrenSelector)(item) || [];
      for (var i = 0; i < children.length; i++) {
        this._runPass(pass, children[i], item);
      }
    },
    _runPassReverse: function(pass, item, parent, childrenSelector) {
      var children = (childrenSelector || this._childrenSelector)(item) || [];
      for (var i = 0; i < children.length; i++) {
        this._runPassReverse(pass, children[i], item);
      }
      pass(item, parent);
    }
  };

  /**
   * @class
   * @param {Object} data data
   */
  var ThrouFlat = function(data) {
    this._data = data;
    this._childrenSelector = defaultChildrenSelector;
    this._flattened = [];
    this._passes = [];
    this._beforePass = noop;
    this._afterPass = noop;
    this._refreshFlattened();
  };
  ThrouFlat.prototype = {
    setChildrenSelector: function(selector) {
      this._childrenSelector = selector;
      this._refreshFlattened();
    },
    _runFlatten: function(parent, flat) {
      var children = this._childrenSelector(parent);
      for (var i = 0; i < children.length; i++) {
        flat.push({
          item: children[i],
          parent: parent
        });
        this._runFlatten(children[i], flat);
      }
    },
    _refreshFlattened: function() {
      this._flattened.length = 0;
      this._flattened.push({
        item: this._data,
        parent: null
      });
      this._runFlatten(this._data, this._flattened);
    },
    pass: function(pass, childrenFirst) {
      this._passes.push({
        pass: pass,
        childrenFirst: childrenFirst
      });
    },
    beforePass: function(cb) {
      this._beforePass = cb;
    },
    afterPass: function(cb) {
      this._afterPass = cb;
    },
    run: function() {
      for (var p = 0; p < this._passes.length; p++) {
        var pass = this._passes[p];
        this._beforePass(p);
        var l = this._flattened.length;
        for (var i = 0; i < l; i++) {
          var item = this._flattened[!pass.childrenFirst ? i : (l - i - 1)];
          pass.pass(item.item, item.parent);
        }
        this._afterPass(p);
      }
    },
    destroy: function() {
      this._data = null;
      this._flattened.length = 0;
      this._passes.length = 0;
      this._childrenSelector = null;
    }
  };

  window.Throu = Throu;
  window.ThrouFlat = ThrouFlat;
})(window);
