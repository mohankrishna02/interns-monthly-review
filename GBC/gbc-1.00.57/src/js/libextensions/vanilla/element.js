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
(function() {
  /**
   *
   * @param {string} name
   */
  Element.prototype.getIntAttribute = function(name) {
    var result = parseInt(this.getAttribute(name), 10);
    return Object.isNaN(result) ? null : result;
  };

  var classedEventRE = /([^.]+)+(\..+)?/;

  /**
   *
   * @param {string} type
   * @param {string=} subFilter
   * @param {Function} callback
   */
  Element.prototype.on = function(type, subFilter, callback) {
    this._registeredEvents = this._registeredEvents || {};
    var supportsPassiveEvents = !window.browserInfo.isIE && !window.browserInfo.isEdge;
    var t = classedEventRE.exec(type || ""),
      event = t && t[1],
      passive = (event === "wheel" || event === "touchstart" || event === "touchmove") && supportsPassiveEvents,
      eventClass = t && t[2];
    if (event) {
      var registered = (this._registeredEvents[event] = this._registeredEvents[event] || {
        __default: []
      });
      var cb;
      if (!callback) {
        cb = subFilter;
      } else {
        cb = function(ev) {
          if (!subFilter || this.querySelectorAll(subFilter).contains(ev.target) ||
            this.querySelectorAll(subFilter + " *").contains(ev.target)) {
            callback(ev);
          }
        }.bind(this);
      }
      (registered[eventClass || "__default"] = registered[eventClass || "__default"] || []).push(cb);
      this.addEventListener(event, cb, passive ? {
        passive: true
      } : false);
    }
    return this;
  };

  /**
   *
   * @param {string} type
   */
  Element.prototype.off = function(type) {
    this._registeredEvents = this._registeredEvents || {};
    var t = classedEventRE.exec(type || "") || [],
      event = t[1],
      eventClass = t[2];
    if (event) {
      var registered = this._registeredEvents[event];
      if (eventClass) {
        if (registered && registered[eventClass]) {
          while (registered[eventClass].length) {
            this.removeEventListener(event, registered[eventClass].pop());
          }
        }
      } else {
        var keys = Object.keys(registered);
        for (var i = 0; i < keys.length; i++) {
          while (registered[keys[i]].length) {
            this.removeEventListener(event, registered[keys[i]].pop());
          }
        }
      }
    }
    return this;
  };

  /**
   *
   * @param {Function=} callback
   * @param noScrollContainer
   */
  Element.prototype.domFocus = function(callback, noScrollContainer) {
    var activeElement = document.activeElement;
    var mustPreventScroll = !!(noScrollContainer);
    // We don't want modifier keys to raise focus change and to be recorded
    // if modal system is opened we should not change the focus // TODO have better way to do this
    // if gbc chrome bar filter has focus you should not change it // TODO have better way to do this
    var gbcFilterInputHasFocus = Boolean(activeElement) && activeElement.hasClass("gbc_FilterInput");
    if (gbc.systemModalOpened === false && gbcFilterInputHasFocus === false && this !== activeElement) {
      if (noScrollContainer && !this.setActive) {
        // hack to prevent automatic scrolling when focus()
        // TODO is it still necessary now ? focus has a new option to preventScroll
        var scrollTop = noScrollContainer.scrollTop;
        var scrollLeft = noScrollContainer.scrollLeft;

        this.on("focus.NOScrollFocus", function() {
          noScrollContainer.scrollTop = scrollTop;
          noScrollContainer.scrollLeft = scrollLeft;
          this.off("focus.NOScrollFocus");
        }.bind(this));

        this.focus({
          preventScroll: mustPreventScroll
        });
      } else if (noScrollContainer) {
        try {
          this.setActive(); // IE: setActive gives the focus but don't scroll into view
        } catch (e) {
          this.focus({
            preventScroll: mustPreventScroll
          });
        }
      } else {
        this.focus({
          preventScroll: mustPreventScroll
        });
      }
    }
    if (callback) {
      window.requestAnimationFrame(callback);
    }
  };

  Element.prototype.hasParentOfType = function(nodeName) {
    var el = this;
    while (el.parentNode !== null) {
      el = el.parentNode;
      if (el.nodeName === nodeName) {
        return true;
      }
    }
    return false;
  };

  Element.prototype.setCursorPosition = function(pos, pos2) {
    if (!pos2 || pos2 === 0) {
      pos2 = pos;
    }
    try {
      if (!this.hasParentOfType("#document-fragment")) {
        this.setSelectionRange(pos, pos2);
      }
    } catch (e) {}
  };

  /**
   *
   * @param {HTMLElement} element
   */
  Element.prototype.replaceWith = function(element) {
    this.parentNode.insertBefore(element, this);
    this.remove();
  };

  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  /**
   *
   * @param {HTMLElement} element
   */
  Element.prototype.prependChild = function(element) {
    var refElement = null;
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof SVGElement) {
      refElement = this.childNodes[0];
    } else {
      refElement = this.children[0];
    }
    this.insertBefore(element, refElement);
  };

  /**
   *
   * @param index
   * @param {HTMLElement} parentNode
   */
  Element.prototype.insertAt = function(index, parentNode) {
    var parentChildren = null;
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof SVGElement) {
      parentChildren = parentNode.childNodes;
    } else {
      parentChildren = parentNode.children;
    }

    if (index === 0) {
      if (parentChildren.length) {
        parentNode.prependChild(this);
      } else {
        parentNode.appendChild(this);
      }
    } else {
      var where = Boolean(index) && parentChildren[index];
      if (where) {
        if (where !== this) {
          parentNode.insertBefore(this, where);
        }
      } else {
        parentNode.appendChild(this);
      }
    }
  };
  /**
   *
   * @param {HTMLElement} refNode
   */
  Element.prototype.insertAfter = function(refNode) {
    if (refNode && refNode.parentNode) {
      refNode.parentNode.insertBefore(this, refNode.nextSibling);
    }
  };
  /**
   * Remove all children
   */
  Element.prototype.empty = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  };
  /**
   *
   * @param className
   * @returns {HTMLElement}
   */
  Element.prototype.parent = function(className) {
    // TODO simplify no need to have "found" variable
    var found = false,
      parent = this.parentNode;
    while (!found) {
      if (!parent) {
        found = true;
        break;
      }
      if (parent.nodeType === Node.ELEMENT_NODE && parent.hasClass(className)) {
        found = true;
        break;
      }
      parent = parent.parentNode;
    }
    return parent;
  };

  /**
   * Returns element if it has classname or first parent which has classname
   * @param {string} className
   * @returns {HTMLElement}
   */
  Element.prototype.elementOrParent = function(className) {
    if (this.hasClass(className)) {
      return this;
    } else {
      return this.parent(className);
    }
  };

  /**
   * Returns if current element is the same or is child of a specified element
   * @param {HTMLElement} elem - sepcified element
   * @returns {boolean}
   */
  Element.prototype.isElementOrChildOf = function(elem) {
    var current = this;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE && current === elem) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  };

  /**
   *
   * @returns {boolean}
   */
  Element.prototype.isInDOM = function() {
    var found = false,
      parent = this.parentNode;
    while (!found) {
      if (!parent) {
        break;
      }
      if (parent === window.document.body) {
        found = true;
        break;
      }
      parent = parent.parentNode;
    }
    return found;
  };
  /**
   *
   * @param className
   * @returns {HTMLElement}
   */
  Element.prototype.child = function(className) {
    var children = this.children,
      found = null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].hasClass(className)) {
        found = children[i];
        break;
      }
    }
    return found;
  };

  /**
   *
   * @param tagName
   * @returns {HTMLElement}
   */
  Element.prototype.childTag = function(tagName) {
    var children = this.children,
      found = null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName.toLowerCase() === tagName.toLowerCase()) {
        found = children[i];
        break;
      }
    }
    return found;
  };

  /**
   *
   * @param className
   * @returns {Node[]}
   */
  Element.prototype.allchild = function(className) {
    var children = this.children,
      result = [];
    for (var i = 0; i < children.length; i++) {
      if (children[i].hasClass(className)) {
        result.push(children[i]);
      }
    }
    return result;
  };

  /**
   *
   * @param item
   * @returns {Node[]}
   */
  Element.prototype.childrenExcept = function(item) {
    var children = this.children,
      result = [];
    for (var i = 0; i < children.length; i++) {
      if (children[i] !== item) {
        result.push(children[i]);
      }
    }
    return result;
  };

  /**
   *
   * @param {string} cssClass
   * @returns {boolean}
   */
  Element.prototype.hasClass = function(cssClass) {
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof SVGElement) {
      return (this.getAttribute("class") || "").split(" ").indexOf(cssClass) >= 0;
    } else {
      return this.classList.contains(cssClass);
    }
  };

  /**
   *
   * @param {string} cssClass
   * @returns {HTMLElement}
   */
  Element.prototype.addClass = function(cssClass) {
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof SVGElement) {
      var currentClasses = (this.getAttribute("class") || "").split(" "),
        exists = currentClasses.indexOf(cssClass);
      if (exists >= 0) {
        currentClasses.splice(exists, 1);
      }
      currentClasses.push(cssClass);
      this.setAttribute("class", currentClasses.join(" "));
    } else {
      this.classList.add(cssClass);
    }
    return this;
  };

  /**
   *
   * @returns {HTMLElement}
   */
  Element.prototype.addClasses = function() {
    for (var i = 0; i < arguments.length; ++i) {
      this.classList.add(arguments[i]);
    }
    return this;
  };

  /**
   * Switch between classes
   * @param {string} cssClass1 - class added if switcher is true
   * @param {string|boolean} cssClass2 - class added if switcher is false
   * @param {boolean=} switcher
   * @returns {HTMLElement}
   */
  Element.prototype.toggleClass = function(cssClass1, cssClass2, switcher) {
    if (typeof switcher === "undefined") {
      switcher = cssClass2;
      if (window.browserInfo.isIE) {
        if (switcher) {
          this.classList.add(cssClass1);
        } else {
          this.classList.remove(cssClass1);
        }
      } else {
        if (switcher === true || switcher === false) {
          this.classList.toggle(cssClass1, switcher);
        } else {
          this.classList.toggle(cssClass1);
        }
      }
    } else {
      if (switcher) {
        this.classList.remove(cssClass2);
        this.classList.add(cssClass1);
      } else {
        this.classList.remove(cssClass1);
        this.classList.add(cssClass2);
      }
    }
    return this;
  };

  /**
   *
   * @param {string} cssClass
   * @returns {HTMLElement}
   */
  Element.prototype.removeClass = function(cssClass) {
    this.classList.remove(cssClass);
    return this;
  };

  Element.prototype.index = function() {
    var index = 0;
    var i = 0,
      parent = this.parentNode,
      children = parent.childNodes,
      len = children.length;
    for (; i < len; i++) {
      var item = children[i];
      if (item === this) {
        return index;
      }
      if (item.nodeType === Node.ELEMENT_NODE) {
        index++;
      }
    }
    return -1;
  };

  Element.prototype.selectText = function() {
    var range, selection;
    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(this);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(this);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  Element.prototype.closest = function(className) {
    if (this.hasClass(className)) {
      return this;
    } else {
      return this.parent(className);
    }
  };

  if (!NodeList.prototype.contains) {
    /*jshint -W121 */
    NodeList.prototype.contains = function(element) {
      var i = 0,
        len = this.length;
      for (; i < len; i++) {
        if (this[i] === element) {
          return true;
        }
      }
      return false;
    };
  }

  if (!SVGElement.prototype.getElementsByClassName) {
    SVGElement.prototype.getElementsByClassName = function(cssClass) {
      return this.querySelectorAll(cssClass);
    };
  }

  Element.prototype.emitEvent = function(type) {
    var event = document.createEvent("Event");
    event.initEvent(type, false, true);
    this.dispatchEvent(event);
  };
})();
