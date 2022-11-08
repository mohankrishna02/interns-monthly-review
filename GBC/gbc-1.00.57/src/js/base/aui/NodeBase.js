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
modulum('NodeBase', ['EventListener'],
  function(context, cls) {
    /**
     * Memory implementation of an AUI Node.
     *
     * Reflects the state of the AUI node in the DVM.
     *
     * @class NodeBase
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.NodeBase = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.NodeBase.prototype */ {
        $static: /** @lends classes.NodeBase */ {
          stylesSeparatorRegExp: /\s+/,
          /**
           * @type {Object.<string, string>}
           */
          __attributeChangedEventNames: {},
          __attributeChangedPrefixEventName: "g_attributeChanged",
          /**
           *
           * @param {string} attrName
           * @return {*}
           */
          attributeChangedEventName: function(attrName) {
            if (!this.__attributeChangedEventNames[attrName]) {
              this.__attributeChangedEventNames[attrName] = this.__attributeChangedPrefixEventName + attrName;
            }
            return this.__attributeChangedEventNames[attrName];
          },
          notInheritedAttributes: ["backgroundColor", "border"]
        },
        __name: "NodeBase",
        /**
         * parent node in aui tree
         * @type {classes.NodeBase}
         */
        _parent: null,
        _parentInfo: null,
        /**
         * aui id
         * @type {?number}
         */
        _id: null,
        /**
         * children nodes
         * @type {classes.NodeBase[]}
         */
        _children: null,
        /**
         * linked controller
         * @type {classes.ControllerBase}
         */
        _controller: null,
        /**
         * owning application
         * @type {classes.VMApplication}
         */
        _application: null,
        /**
         * node tag name
         * @type {?string}
         */
        _tag: null,
        /**
         * node's attribute set
         * @type {Object.<string, *>}
         * */
        _attributes: null,
        /**
         * flag set of vm provided attributes
         * @type {Object.<string, boolean>}
         * */
        _attributesSetByVM: null,
        /**
         * list of styles applied by the vm
         * @type {string[]}
         */
        _vmStyles: null,
        /**
         * node's attribute values set that where set previously
         * @type {Object.<string, *>}
         */
        _previousAttributes: null,
        /**
         * list
         * @type {Object[]}
         */
        _stylesByPseudoSelectors: null,
        /**
         * list
         * @type {string[]}
         */
        _activePseudoSelectors: null,
        /**
         * list
         * @type {Object}
         */
        _pseudoSelectorsUsedInSubTree: null,
        /**
         * flag
         * @type {boolean}
         */
        _canEmitNodeMutation: false,
        /**
         * list
         * @type {Object.<string, *>}
         */
        _initialStyleAttributes: null,
        /**
         * @constructs
         * @param {classes.NodeBase} parent parent node
         * @param {string|nodeInfo} tag tag name (WINDOW, GROUP, MENU, etc...) or an object containing type, id, attributes
         * @param {?number|classes.VMApplication} id id
         * @param {Object=} attributes attributes list
         * @param {classes.VMApplication} app application
         */
        constructor: function(parent, tag, id, attributes, app) {
          $super.constructor.call(this);

          this._pseudoSelectorsUsedInSubTree = {};

          if (tag && tag.attributes) {
            app = id;
            attributes = tag.attributes;
            id = tag.id;
            tag = tag.type;
          }
          this._parent = parent;
          this._id = id;
          this._application = app;
          this._children = [];
          this._tag = tag;

          this._parentInfo = {
            inMatrix: Boolean(this.getAncestor("Matrix")),
            inScrollGrid: Boolean(this.getAncestor("ScrollGrid")),
            inTable: Boolean(this.getAncestor("TableColumn")),
            inStack: Boolean(this.getAncestor("Stack"))
          };

          this._attributes = {};
          this._vmStyles = [];
          this._initialStyleAttributes = {};
          this._attributesSetByVM = {};
          this._previousAttributes = {};
          // Set the default attributes
          var nodeAttributes = cls.NodeHelper.getDefaultAttributes(tag);
          for (var i = 0; i < nodeAttributes.length; i++) {
            cls.NodeHelper.setAttributeDefaultValue(this, nodeAttributes[i]);
          }
          // Set the attributes with VM info
          var attributesToSet = Object.keys(attributes);
          for (var a = 0; a < attributesToSet.length; a++) {
            var attributeName = attributesToSet[a];
            this._attributesSetByVM[attributeName] = true;
            this._attributes[attributeName] = attributes[attributeName];
            if (attributeName === "style") {
              var styles = attributes[attributeName] && attributes[attributeName].trim();
              if (styles) {
                this._vmStyles = styles.split(cls.NodeBase.stylesSeparatorRegExp);
              }
            }
          }

          // Attaching the node to its parent children list
          if (parent !== null) {
            var valueIndex = parent.addChildNode(this);
            if (this._parentInfo.inTable) {
              this._parentInfo.inFirstTableRow = (valueIndex === 0);
            }
          }

          // Registering the node in the global hash
          if (this._application) {
            this._application.model.addNode(id, this);
          }
          if (this._parent && (context.ThemeService.getValue("aui-mutation-watch") || this._canEmitNodeMutation)) {
            this._parent._emitNodeCreated(this);
          }
        },
        /**
         * Destroy a node (and remove all its references)
         */
        destroy: function() {
          // destroy children first
          while (this._children.length > 0) {
            this._children[this._children.length - 1].destroy();
          }
          if (this._parent) {
            this._parent._emitNodeDestroyed(this);
          }
          // Remove node from the parent children list
          if (this._id !== 0) {
            this._parent.removeChildNode(this);
          }
          this.destroyController();
          if (this._application) {
            this._application.model.removeNode(this._id);
            this._application = null;
          }
          this._children = null;
          this._parent = null;

          this._stylesByPseudoSelectors = null;
          this._activePseudoSelectors = null;
          this._pseudoSelectorsUsedInSubTree = null;
          this._initialStyleAttributes = null;
          this._vmStyles = null;

          this._attributesSetByVM = null;
          this._attributes = null;
          this._previousAttributes = null;

          $super.destroy.call(this);
        },

        _emitNodeCreated: function(node) {
          this.emit(context.constants.baseEvents.nodeCreated, node);
          if (this._parent) {
            this._parent._emitNodeCreated(node);
          }
        },
        _emitNodeDestroyed: function(node) {
          this.emit(context.constants.baseEvents.nodeDestroyed, node);
          if (this._parent) {
            this._parent._emitNodeDestroyed(node);
          }
        },

        /**
         * tag name of this node
         * @returns {string} tag name of this node
         */
        getTag: function() {
          return this._tag;
        },

        /**
         * add child node
         * @param {classes.NodeBase} node node to add
         * @return {number} index of newly added element
         */
        addChildNode: function(node) {
          var index = this._children.length;
          this._children.push(node);
          return index;
        },
        /**
         * remove child node
         * @param {classes.NodeBase} node node to remove
         */
        removeChildNode: function(node) {
          this._children.splice(this._children.indexOf(node), 1);
        },
        /**
         * get parent node
         * @returns {classes.NodeBase} the parent node
         * @publicdoc
         */
        getParentNode: function() {
          return this._parent;
        },
        /**
         * get children (direct only)
         * @param {string=} tag if provided, returns only child nodes of the given type.
         * @returns {classes.NodeBase[]} list of matching children
         * @publicdoc
         */
        getChildren: function(tag) {
          if (tag) {
            var result = [];
            var length = this._children.length;
            for (var i = 0; i < length; ++i) {
              var child = this._children[i];
              if (child._tag === tag) {
                result.push(child);
              }
            }
            return result;
          }
          return this._children.slice();
        },
        /**
         * Get the raw list of children. Be aware this list could change while
         * it is passed through. If you are not sure, prefer getChildren that clones the list
         * @returns {classes.NodeBase[]}
         */
        getRawChildren: function() {
          return this._children;
        },
        /**
         * get first direct child
         * @param {string=} tag if provided, returns only a child node of the given type.
         * @returns {classes.NodeBase} the node found
         */
        getFirstChild: function(tag) {
          if (tag) {
            var length = this._children.length;
            for (var i = 0; i < length; ++i) {
              var child = this._children[i];
              if (child._tag === tag) {
                return child;
              }
            }
          } else if (this._children.length) {
            return this._children[0];
          }
          return null;
        },
        /**
         * get the last child
         * @param {string=} tag if provided, returns only a child node of the given type.
         * @returns {classes.NodeBase} the last child
         */
        getLastChild: function(tag) {
          if (tag) {
            var length = this._children.length;
            for (var i = length - 1; i > -1; i--) {
              var child = this._children[i];
              if (child._tag === tag) {
                return child;
              }
            }
          } else if (!this._children.isEmpty()) {
            return this._children[this._children.length - 1];
          }
          return null;
        },
        /**
         * Usage:
         *  - getChildrenWithAttribute("TagName", "attributeName", "attributeValue");
         *  - getChildrenWithAttribute("attributeName", "attributeValue");
         *  - getChildrenWithAttribute("attributeName");
         * @param {?string} tag node tag name
         * @param {string} attributeName searched attribute name
         * @param {?string} attributeValue searched attribute value
         * @returns {classes.NodeBase[]} List of matching nodes
         */
        getChildrenWithAttribute: function(tag, attributeName, attributeValue) {
          if (!attributeName) {
            attributeName = tag;
            tag = null;
          }
          var result = [];
          var length = this._children.length;
          for (var i = 0; i < length; ++i) {
            var child = this._children[i];
            if (!tag || child._tag === tag) {
              if (child.isAttributePresent(attributeName)) {
                var value = child.attribute(attributeName);
                if (typeof attributeValue === "undefined" || attributeValue === value) {
                  result.push(child);
                }
              }
            }
          }
          return result;
        },
        /**
         * Usage:
         *  - getFirstChildWithAttribute("TagName", "attributeName", "attributeValue");
         *  - getFirstChildWithAttribute("attributeName", "attributeValue");
         *  - getFirstChildWithAttribute("attributeName");
         * @param {?string=} tag node tag name
         * @param {string} attributeName searched attribute name
         * @param {?string=} attributeValue searched attribute value
         * @returns {classes.NodeBase} first matching node or null
         */
        getFirstChildWithAttribute: function(tag, attributeName, attributeValue) {
          if (!attributeName) {
            attributeName = tag;
            tag = null;
          }
          var length = this._children.length;
          for (var i = 0; i < length; ++i) {
            var child = this._children[i];
            if (!tag || child._tag === tag) {
              if (child.isAttributePresent(attributeName)) {
                var value = child.attribute(attributeName);
                if (typeof attributeValue === "undefined" || attributeValue === value) {
                  return child;
                }
              }
            }
          }
          return null;
        },
        /**
         * get first child with id
         * @param {number} id - node id
         * @returns {classes.NodeBase} first matching node or null
         */
        getFirstChildWithId: function(id) {
          if (this._children) {
            var length = this._children.length;
            for (var i = 0; i < length; ++i) {
              var child = this._children[i];
              if (child._id === id) {
                return child;
              }
            }
          }
          return null;
        },
        /**
         * Will return the first ancestor that has this tag, null otherwise.
         * @param {string} tag name of the ancestor node
         * @returns {classes.NodeBase} a node if found, null otherwise
         */
        getAncestor: function(tag) {
          var result = this._parent;
          while (result && result._tag !== tag) {
            result = result._parent;
          }
          return result;
        },
        /**
         * Will return the first ancestor that has this tag and potential style, null otherwise.
         * @param {string} tag name of the ancestor node
         * @param {string} style name of the ancestor node style to match
         * @returns {classes.NodeBase} a node if found, null otherwise
         */
        getAncestorWithStyle: function(tag, style) {
          var found = false,
            result = this;
          while (!found) {
            result = result._parent;
            found = !result ||
              result._tag === tag &&
              (!style || result._vmStyles.indexOf(style) >= 0);
          }
          return result;
        },
        /**
         * get all descendants of tag type
         * @param {string} tag tag name of the descendants
         * @returns {classes.NodeBase[]} list of descendants matching the given tag
         * @public
         */
        getDescendants: function(tag) {
          return this._getDescendants(tag);
        },

        /**
         * get all descendants of tag type (recursion)
         * @param {string} tag tag name of the descendants
         * @param {classes.NodeBase[]} [result] optional array to populate. (For internal use only)
         * @returns {classes.NodeBase[]} list of descendants matching the given tag
         * @private
         */
        _getDescendants: function(tag, result) {
          if (result === undefined) {
            result = [];
          } else if (tag === this._tag || tag === null) {
            // Matching tags should only be added for children
            result.push(this);
          }
          var length = this._children.length;
          for (var i = 0; i < length; ++i) {
            var child = this._children[i];
            child._getDescendants(tag, result);
          }
          return result;
        },

        /**
         * get first index of tag
         * @param {string=} tag tag name of the siblings to consider
         * @returns {number} The index of this node in its parent's children array
         */
        getIndex: function(tag) {
          var siblings = this._parent._children;
          var length = siblings.length;
          var index = 0;
          for (var i = 0; i < length; ++i) {
            var sibling = siblings[i];
            if (sibling === this) {
              break;
            }
            if (!tag || sibling._tag === tag) {
              ++index;
            }
          }
          return index;
        },

        /**
         * Will get the previous Sibling node
         * @param {?string|string[]} tag optional tag name to limit result by name
         * @returns {?classes.NodeBase} next Sibling if exists
         */
        getPreviousSibling: function(tag) {
          var children = this.getParentNode().getChildren();
          var initialIndex = children.indexOf(this);
          var index = -1;
          if (tag) {
            if (!Array.isArray(tag)) {
              tag = [tag];
            }
            for (var i = initialIndex - 1; i >= 0; i--) {
              var child = children[i];
              if (tag.indexOf(child._tag) !== -1) {
                index = i;
                break;
              }
            }
          } else {
            index = initialIndex - 1;
          }
          if (index < 0) {
            return null;
          }
          return children[index];
        },

        /**
         * Will get the next Sibling node
         * @param {?string|string[]} tag optional tag name to limit result by name
         * @returns {?classes.NodeBase} next Sibling if exists
         */
        getNextSibling: function(tag) {
          var children = this.getParentNode().getChildren(),
            len = children.length;
          var initialIndex = children.indexOf(this);
          var index = len;
          if (tag) {
            if (!Array.isArray(tag)) {
              tag = [tag];
            }
            for (var i = initialIndex + 1; i < len; i++) {
              var child = children[i];
              if (tag.indexOf(child._tag) !== -1) {
                index = i;
                break;
              }
            }
          } else {
            index = initialIndex + 1;
          }
          if (index >= len) {
            return null;
          }
          return children[index];
        },
        /**
         * Get descendant with attribute
         * @param {?string} tag tag name
         * @param {string} attributeName attribute name
         * @param {*} [attributeValue] the value to find
         * @returns {classes.NodeBase} matching nodes
         */
        findNodeWithAttribute: function(tag, attributeName, attributeValue) {
          var tagged = this.getDescendants(tag);
          for (var i = 0; i < tagged.length; i++) {
            var child = tagged[i];
            if (child.isAttributePresent(attributeName)) {
              var value = child.attribute(attributeName);
              if (typeof attributeValue === "undefined" || attributeValue === value) {
                return child;
              }
            }
          }
          return null;
        },

        /**
         * Execute callback for this node and each descendant
         * @param {function} callback function to call
         */
        forThisAndEachDescendant: function(callback) {
          callback(this);
          for (var i = 0; i < this._children.length; ++i) {
            this._children[i].forThisAndEachDescendant(callback);
          }
        },

        /**
         *get owning application
         * @returns {classes.VMApplication} owning application
         * @publicdoc
         */
        getApplication: function() {
          return this._application;
        },
        /**
         * update attribute values
         * @param {Object.<string, *>} attributes new values
         */
        updateAttributes: function(attributes) {
          var attributesToSet = Object.keys(attributes);
          for (var a = 0; a < attributesToSet.length; a++) {
            var attributeName = attributesToSet[a];
            this._attributesSetByVM[attributeName] = true;
            this._previousAttributes[attributeName] = this._attributes[attributeName];
            this._attributes[attributeName] = attributes[attributeName];
            if (attributeName === "style") {
              var styles = attributes[attributeName] && attributes[attributeName].trim();
              this._vmStyles = styles ? styles.split(cls.NodeBase.stylesSeparatorRegExp) : [];
            }
          }
        },
        /**
         * get attribute value
         * @param {string} attributeName attribute name
         * @returns {*} attribute value
         * @publicdoc
         */
        attribute: function(attributeName) {
          return this._attributes[attributeName];
        },
        /**
         * get attribute previous value
         * @param {string} attributeName attribute name
         * @returns {*} attribute previous value
         */
        previousAttribute: function(attributeName) {
          return this._previousAttributes[attributeName];
        },

        /**
         * set by vm info
         * @param {string} attributeName name of the attribute
         * @returns {boolean} true if the attribute has been set by the VM, false otherwise
         */
        isAttributeSetByVM: function(attributeName) {
          return this._attributesSetByVM.hasOwnProperty(attributeName);
        },
        /**
         * attribute existence
         * @param {string} attributeName name of the attribute
         * @returns {boolean} true if the attribute exists
         */
        isAttributePresent: function(attributeName) {
          return this._attributes.hasOwnProperty(attributeName);
        },
        /**
         * attach hook when attribute changes
         * @param {string} attributeName attribute name
         * @param {function} handler the hook
         * @returns {HandleRegistration} the handler to release the hook
         * @publicdoc
         */
        onAttributeChanged: function(attributeName, handler) {
          return this.when(cls.NodeBase.attributeChangedEventName(attributeName), this._onAttributeChanged.bind(null, handler));
        },
        /**
         * hook wrapper
         * @param {function} handler the hook
         * @param {classes.Event} event the event
         * @param {classes.NodeBase} node the src node
         * @param {*} data data bag
         * @private
         */
        _onAttributeChanged: function(handler, event, node, data) {
          handler(event, node, data);
        },

        /**
         * find whether or not this node is in the given list (or one of its parents)
         * @param list the list to check
         * @param lookIfAParentIs look for parents as well
         * @returns {boolean}
         */
        containedInList: function(list, lookIfAParentIs) {
          if (list && list.length) {
            if (list.indexOf(this) >= 0) {
              return true;
            }
            if (lookIfAParentIs) {
              var parent = this.getParentNode();
              while (parent) {
                if (list.indexOf(parent) >= 0) {
                  return true;
                }
                parent = parent.getParentNode();
              }
            }
          }
          return false;
        },

        /**
         * update applicable styles
         * @param {boolean} [recursive] do it recursively
         * @param {boolean} [stylesChanged] if done recursively, did the 4st styles changed?
         * @param {Array} [styleAttributesChanged] if done recursively, list of nodes which changed style attribute
         * @param {classes.TreeModificationTracker} [treeModificationTrack] if done recursively, need information about node tree changes
         */
        updateApplicableStyles: function(recursive, stylesChanged, styleAttributesChanged, treeModificationTrack) {
          var i, ui = this.getApplication().uiNode();
          if (!recursive || stylesChanged ||
            this.containedInList(styleAttributesChanged, true) ||
            treeModificationTrack.isNodeCreated(this._id) ||
            treeModificationTrack.attributeChanged(this._id, "style")) {
            var matchingAttributesByPseudoSelectors = {};
            var styleLists = ui.getChildren('StyleList');
            for (i = 0; i < styleLists.length; i++) {
              var styleList = styleLists[i];
              styleList.populateMatchingStyles(matchingAttributesByPseudoSelectors, this);
            }
            this._stylesByPseudoSelectors = [];
            var pseudoSelectorKeys = Object.keys(matchingAttributesByPseudoSelectors);
            for (i = 0; i < pseudoSelectorKeys.length; i++) {
              var pseudoSelectorKey = pseudoSelectorKeys[i];
              var styleAttributes = matchingAttributesByPseudoSelectors[pseudoSelectorKey];
              var styles = {};
              var styleAttributeKeys = Object.keys(styleAttributes);
              for (var k = 0; k < styleAttributeKeys.length; k++) {
                var styleAttributeName = styleAttributeKeys[k];
                styles[styleAttributeName] = styleAttributes[styleAttributeName];
              }
              this._stylesByPseudoSelectors.push({
                pseudoSelector: styleAttributes[styleAttributeKeys[0]].getParentNode().getPseudoSelectors(),
                styles: styles
              });
            }
            // Sort by pseudo-selector priority
            this._stylesByPseudoSelectors.sort(this._pseudoSelectorPrioritySorter);
          }
          if (recursive) {
            for (i = 0; i < this._children.length; ++i) {
              this._children[i].updateApplicableStyles(true, stylesChanged, styleAttributesChanged, treeModificationTrack);
            }
          }
        },
        resetActivePseudoSelectors: function() {
          this._activePseudoSelectors = null;
        },
        resetPseudoSelectorsUsedInSubTree: function() {
          this._pseudoSelectorsUsedInSubTree = {};
        },
        updatePseudoSelectorsUsedInSubTree: function(recursive) {
          var pseudoSelectors = {},
            i;
          if (this._stylesByPseudoSelectors) {
            for (i = 0; i < this._stylesByPseudoSelectors.length; ++i) {
              var entry = this._stylesByPseudoSelectors[i];
              for (var j = 0; j < entry.pseudoSelector.length; ++j) {
                pseudoSelectors[entry.pseudoSelector[j]] = true;
              }
            }
          }
          pseudoSelectors = Object.keys(pseudoSelectors);
          for (i = 0; i < pseudoSelectors.length; ++i) {
            var pseudoSelector = pseudoSelectors[i];
            var p = this;
            while (p !== null) {
              if (!p._pseudoSelectorsUsedInSubTree[pseudoSelector]) {
                p._pseudoSelectorsUsedInSubTree[pseudoSelector] = true;
                p = p._parent;
              } else {
                break;
              }
            }
          }

          if (recursive) {
            for (i = 0; i < this._children.length; ++i) {
              this._children[i].updatePseudoSelectorsUsedInSubTree(true);
            }
          }
        },

        setInitialStyleAttributes: function() {
          var initialStyles = this._stylesByPseudoSelectors.filter(function(item) {
            return !item.pseudoSelector.length;
          })[0];
          if (initialStyles) {
            var keys = Object.keys(initialStyles.styles),
              len = keys.length;
            for (var i = 0; i < len; i++) {
              this._initialStyleAttributes[keys[i]] = initialStyles.styles[keys[i]]._attributes.value;
            }
          }
        },

        _pseudoSelectorPrioritySorter: function(pss1, pss2) {
          var firstStyleAttr1 = pss1.styles[Object.keys(pss1.styles)[0]];
          var firstStyleAttr2 = pss2.styles[Object.keys(pss2.styles)[0]];
          var pss1Weight = firstStyleAttr1.getParentNode().getWeight();
          var pss2Weight = firstStyleAttr2.getParentNode().getWeight();
          if (pss1Weight === pss2Weight) {
            pss1Weight = firstStyleAttr1.getParentNode().getPseudoSelectorWeight();
            pss2Weight = firstStyleAttr2.getParentNode().getPseudoSelectorWeight();
          }
          return pss2Weight - pss1Weight;
        },
        /**
         * return the value of the specified style attribute for the current node
         * @param {string} styleAttr the style attribute
         * @param {?string[]} [forcedPseudoSelectors] activate pseudo selectors
         * @returns {string} the style
         */
        getStyleAttribute: function(styleAttr, forcedPseudoSelectors) {
          return this._getStyleAttributeImpl(styleAttr, forcedPseudoSelectors);
        },

        /**
         * return the value of the specified style attribute for the current node
         * This is the implementation method which computes the style.
         * The public getStyleAttribute method invokes this method directly or forwards it
         * to the appropriate node depending on the context (FormFieldNode, ValueNode)
         * @param {string} styleAttr the style attribute
         * @param {?string[]} forcedPseudoSelectors activate pseudo selectors
         * @returns {?string} the style
         */
        _getStyleAttributeImpl: function(styleAttr, forcedPseudoSelectors) {
          if (!this._application.usedStyleAttributes[styleAttr]) {
            return null;
          }
          var pseudoSelectors = forcedPseudoSelectors;
          if (!pseudoSelectors) {
            if (!this._activePseudoSelectors) {
              this._activePseudoSelectors = this._computePseudoSelectors();
            }
            pseudoSelectors = this._activePseudoSelectors;
          }
          var matchingStyleAttribute = null;
          var pseudoSelectorCheck = function(ps) {
            return pseudoSelectors.indexOf(ps) !== -1;
          };
          if (this._stylesByPseudoSelectors) {
            for (var i = 0; i < this._stylesByPseudoSelectors.length; ++i) {
              var pseudoSelectorStyle = this._stylesByPseudoSelectors[i];
              // dict lookup first, as it is faster
              var styleAttribute = pseudoSelectorStyle.styles[styleAttr];
              if (styleAttribute !== undefined) {
                var matches = pseudoSelectorStyle.pseudoSelector.every(pseudoSelectorCheck);
                if (matches) {
                  matchingStyleAttribute = styleAttribute;
                  break;
                }
              }
            }
          }
          if (matchingStyleAttribute) {
            return matchingStyleAttribute.attribute('value');
            // do not look in parent for formfield or action buttons having a not inherited attribute
          } else if (
            this.getTag() !== "FormField" &&
            this.getTag() !== "TopMenu" &&
            this.getTag() !== "ToolBar" &&
            this.getTag() !== "TopMenuGroup" &&
            this.getTag() !== "TopMenuCommand" &&
            this.getTag() !== "ToolBarItem" &&
            this.getTag() !== "Button" &&
            this.getTag() !== "MenuAction" &&
            this.getTag() !== "Action" || !cls.NodeBase.notInheritedAttributes.contains(
              styleAttr)) {
            var parent = this.getParentNode();
            if (parent) {
              return parent._getStyleAttributeImpl(styleAttr, pseudoSelectors);
            }
          }
          return null;
        },
        /**
         * compute pseudo selectors
         * @returns {Array} computed pseudo selectors
         * @protected
         */
        _computePseudoSelectors: function() {
          var focusedNodeIdRef = this.getApplication().uiNode().attribute('focus');
          var pseudoSelectors = this._populatePseudoSelectors({
            __dialogTypeDefined: false,
            __activeDefined: false
          }, focusedNodeIdRef);
          var availableSelectors = [];
          var keys = Object.keys(pseudoSelectors);
          for (var i = 0; i < keys.length; i++) {
            var ps = keys[i];
            if (pseudoSelectors[ps]) {
              availableSelectors.push(ps);
            }
          }
          return availableSelectors;
        },

        /**
         * populate pseudo selectors
         * @param {?Object.<string, boolean>=} pseudoSelectors a dictionnary which will be populated. Keys are the active pseudo-selectors
         * @param {number} focusedNodeIdRef the idref of the focused node. Passed as parameter to avoid tree lookups.
         * @returns {Object} returns the pseudoSelectors parameter
         * @private
         */
        _populatePseudoSelectors: function(pseudoSelectors, focusedNodeIdRef) {
          if (focusedNodeIdRef === 0) {
            return pseudoSelectors; // no need to compute for userinterface node
          }
          var dialogType = this.attribute('dialogType');
          if (focusedNodeIdRef === this._id &&
            (dialogType && (dialogType === 'Display' || dialogType === 'DisplayArray') || this._tag !== 'Table' && this._tag !==
              'Matrix') && !Object.isBoolean(pseudoSelectors.focus)) {
            // Table and Matrix focus is ignored as the real focused item is their current element
            pseudoSelectors.focus = true;
          }
          var active = this.attribute('active');
          // active will be undefined if the current node doesn't have this attribute
          if (active !== undefined) {
            if (!pseudoSelectors.__dialogTypeDefined) {
              if (active || (this.attribute('noEntry') && this._tag === 'TableColumn')) {
                if (dialogType) {
                  pseudoSelectors.__dialogTypeDefined = true;
                  if (dialogType === 'Display' || dialogType === 'DisplayArray') {
                    pseudoSelectors.display = true;
                    pseudoSelectors.input = false;
                    pseudoSelectors.query = false;
                  } else if (dialogType === 'Input' || dialogType === 'InputArray') {
                    pseudoSelectors.display = false;
                    pseudoSelectors.input = true;
                    pseudoSelectors.query = false;
                  } else if (dialogType === 'Construct') {
                    pseudoSelectors.display = false;
                    pseudoSelectors.input = false;
                    pseudoSelectors.query = true;
                  }
                }
              } else {
                pseudoSelectors.__dialogTypeDefined = true;
                pseudoSelectors.display = false;
                pseudoSelectors.input = false;
                pseudoSelectors.query = false;
              }
            }
            if (!pseudoSelectors.__activeDefined) {
              pseudoSelectors.__activeDefined = true;
              if (active) {
                pseudoSelectors.active = true;
              } else {
                pseudoSelectors.inactive = true;
              }
            }
          }

          if (this._parent) {
            return this._parent._populatePseudoSelectors(pseudoSelectors, focusedNodeIdRef);
          }
          return pseudoSelectors;
        },

        /**
         * Override this method when no controller should automatically be created for this node, neither for the
         * node itself nor for its children
         * This method is called in createController()
         * @return {boolean} true if this node and its children controllers' are allowed to be created automatically
         */
        autoCreateController: function() {
          if (this._parent) {
            return this._parent.autoCreateChildrenControllers();
          } else {
            return true;
          }
        },

        /**
         * Override this method when no controller should automatically be created for the children of this node.
         * The node itself will have a controller created.
         * @return {boolean} true if this node's children controllers' are allowed to be created automatically
         */
        autoCreateChildrenControllers: function() {
          if (this._parent) {
            return this._parent.autoCreateChildrenControllers();
          } else {
            return true;
          }
        },

        /**
         * create controllers recursively
         * @param {number[]} [_queue] aui id queue
         * @param {boolean} [force] force controller creation
         */
        createController: function(_queue, force) {
          if (force || this.autoCreateController()) {
            var queue = _queue || [];
            if (!this._controller) {
              queue.push(this._id);
              this._createChildrenControllers(queue);
            }
            if (!_queue) {
              for (var i = 0; i < queue.length; i++) {
                var node = this._application.model.getNode(queue[i]);
                node._controller = node._createController();
                node.emit(context.constants.baseEvents.controllerCreated);
              }
            }
          }
        },
        /**
         * attach hook when controller created
         * @param {Hook} hook event hook
         * @return {HandleRegistration} a handle to unregister the hook
         */
        whenControllerCreated: function(hook) {
          return this.when(context.constants.baseEvents.controllerCreated, hook);
        },
        /**
         * Applies all behaviors
         * @param {classes.TreeModificationTracker} treeModificationTrack collection of affected nodes
         * @param {boolean} recursive apply behaviors to child nodes as well
         * @param {boolean} force force apply behaviors
         */
        applyBehaviors: function(treeModificationTrack, recursive, force) {
          var stillDirty = false;
          var park = [this];
          if (recursive) {
            while (park.length) {
              var i = park.shift();
              park.unshift.apply(park, i._children);
              if (i._controller) {
                stillDirty = i._controller.applyBehaviors(treeModificationTrack, force) || stillDirty;
              }
            }
          } else {
            if (this._controller) {
              stillDirty = this._controller.applyBehaviors(treeModificationTrack, force) || stillDirty;
            }
          }
          return stillDirty;
        },
        /**
         * creates a controller associated to the node
         * @returns {classes.ControllerBase} the created controller
         * @public
         */
        _createController: function() {
          return null;
        },
        /**
         * create the controllers in child nodes
         * @param {Array<classes.ControllerBase>} _queue traversing array
         * @protected
         */
        _createChildrenControllers: function(_queue) {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i].createController(_queue);
          }
        },
        /**
         * Removes the associated controller
         */
        destroyController: function() {
          if (this._controller) {
            this._controller.destroy();
            this._controller = null;
          }
        },
        /**
         * attaches the node's UI in DOM
         * @returns {HTMLElement} the attached element, if any
         */
        attachUI: function() {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i].attachUI();
          }
          if (this.getController() && this.getController().getWidget()) {
            this.getController().attachUI();
            return this.getController().getWidget().getElement();
          }
          return null;
        },
        /**
         * get the node's controller
         * @returns {classes.ControllerBase} the node's controller
         */
        getController: function() {
          return this._controller;
        },

        /**
         * Gets the node's widget
         * @returns {classes.WidgetBase} the node's widget
         * @publicdoc
         */
        getWidget: function() {
          return this._controller ? this._controller.getWidget() : null;
        },

        /**
         * gets the node's aui id
         * @returns {number} the node's aui id
         */
        getId: function() {
          return this._id;
        },
        onNodeCreated: function(hook, tag) {
          return this.when(context.constants.baseEvents.nodeCreated, this._onNodeCreated.bind(null, tag, hook));
        },
        _onNodeCreated: function(tag, hook, event, src, node) {
          if (!tag || tag === node._tag) {
            hook(event, src, node);
          }
        },
        onNodeRemoved: function(hook, tag) {
          return this.when(context.constants.baseEvents.nodeDestroyed, this._onNodeRemoved.bind(this, tag, hook));
        },
        _onNodeRemoved: function(tag, hook, event, src, node) {
          if (!tag || tag === node._tag) {
            hook(event, src, node);
          }
        },
        /**
         * Once all children are created, emit the corresponding event
         */
        childrenCreated: function() {
          this.emit(context.constants.baseEvents.childrenNodeCreated);
        },

        /**
         * Renders this node as a json object
         * @param {boolean} recursive includes children nodes
         * @return {Object} a json object representing this node
         */
        getJson: function(recursive) {
          if (typeof recursive === "undefined") {
            recursive = false;
          }

          var jsonTree = {
            id: this._id,
            name: this._tag,
            attributes: this._attributes,
            children: recursive ? [] : null
          };

          if (recursive) {
            if (this._children.length > 0) {
              for (var i = 0; i < this._children.length; i++) {
                jsonTree.children.push(this._children[i].getJson(true));
              }
            } else {
              jsonTree.children = false;
            }
          }

          return this._id === 0 ? [jsonTree] : jsonTree;
        },

        isInTable: function() {
          return Boolean(this._parentInfo && this._parentInfo.inTable);
        },

        isInMatrix: function() {
          return Boolean(this._parentInfo && this._parentInfo.inMatrix);
        },

        isInScrollGrid: function() {
          return Boolean(this._parentInfo && this._parentInfo.inScrollGrid);
        },

        isInFirstTableRow: function() {
          return Boolean(this._parentInfo && this._parentInfo.inFirstTableRow);
        },

        isInStack: function() {
          return Boolean(this._parentInfo && this._parentInfo.inStack);
        }
      };
    });
  });
