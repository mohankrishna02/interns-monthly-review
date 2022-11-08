/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2019. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

//TODO : enable this for IE11 as well
// Modules import
var Inline = Quill.import('blots/inline');
var Module = Quill.import('core/module');
var Delta = Quill.import('delta');
var Parchment =  Quill.import('parchment');

/**
 * Definition for a spell blot
 * Basically a standard span with few attributes in order to add style
 */
class Spell extends Inline {
  static create(value) {
    var node = super.create(value);
    node.setAttribute('data-spell-id', value);
    node.setAttribute('class', 'ql-spell ql-spell-' + value);
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute('data-spell-id');
  }
}
Spell.blotName = 'spell';
Spell.tagName = 'SPAN';

/**
 * Definition of the serverSpellChecker module
 */
class SpellCheck extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.marks = {};
    this._mispelled = [];
    this._tooltip = null;
    Quill.register(Spell, true);

    this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, delta, oldDelta, source) => {
      if (eventName == Quill.events.TEXT_CHANGE && source === Quill.sources.USER) {
        delta.ops.forEach(function(op) {
          // Remove any text marks before allowing the delta to be sent out to the server
          if (op.attributes && op.attributes.spell) {
            delete op.attributes.spell;
          }
        });
      }
    });
  }

  /**
   * Add mispelled words
   * @param {string|object} words - words or complex object with suggestion
   */
  addMispells(words){
    if(typeof words === "string"){
      this._mispelled.push({
        mispelledWord:words,
        suggest:[]
      });
    }
    else {
      this._mispelled = this._mispelled.concat(words);
    }
  }

  /**
   * Get the list of all mispelled words, with index and length and suggestion if any
   * @param {string} text - text to search in
   * @param {boolean?} caseSensitive - true if the list must return caseSensitive results
   * @return {Array}
   */
  getIndicesOfMispelledWords(text, caseSensitive) {
    var searchStr = "";
    var suggest = [];
    var searchList = this._mispelled;

    var searchStrLen = 0;
    var indices = [];

    // For each known mispelled word
    for(var i=0; i < searchList.length;i++){
      searchStr = searchList[i].mispelledWord;
      searchStrLen = searchStr.length;
      suggest = searchList[i].suggest;

      if (searchStrLen === 0) {
        return [];
      }
      var startIndex = 0, index;
      if (!caseSensitive) {
        text = text.toLowerCase();
        searchStr = searchStr.toLowerCase();
      }
      // search all occurences of word in text
      while ((index = text.indexOf(searchStr+" ", startIndex)) > -1) {
        indices.push({
          word: searchStr,
          suggest: suggest,
          index: index+1,
          length: searchStrLen
        });
        startIndex = index + searchStrLen;
      }
    }
    return indices;
  }

  /**
   * Mark a word as mispelled
   * @param range
   * @return {*}
   */
  mark(range = this.quill.selection.savedRange) {
    if (!range) {
      return;
    }

    var curSelection = this.quill.getSelection();
    var spellId=null;

    var target = this.quill.getContents(range.index,range.length);
    spellId = target && target.ops[0] && target.ops[0].attributes && target.ops[0].attributes.spell;

    if(spellId){
      return spellId;
    }

    spellId = this.generateUuid();
    var delta = new Delta().retain(range.index).retain(range.length, {spell: spellId});

    this.marks[spellId] = true;
    this.quill.updateContents(delta, Quill.sources.SILENT);
    this.quill.setSelection(curSelection);
    var suggests = range.suggest;

    var markElem = this.quill.scroll.domNode.querySelector('.ql-spell-' + spellId);
    if(markElem){
      markElem.addEventListener("click", function(e){
        e.stopImmediatePropagation();
        e.stopPropagation();
        this.suggestionPopup(spellId,suggests);
      }.bind(this));
    }
    // Return the spellId given or generated so the developer has the markId to call clear() with
    return spellId;
  }

  /**
   *
   * @param spellId
   * @return {*}
   */
  find(spellId = null) {
    if (!spellId) {
      return null;
    }

    var markElem = this.quill.scroll.domNode.querySelector('.ql-spell-' + spellId);

    if (!markElem) {
      return null;
    }

    var spellBlot = Parchment.find(markElem);

    if (!spellBlot) {
      return null;
    }

    return {
      index: spellBlot.offset(this.quill.scroll),
      length: spellBlot.length()
    };
  }

  /**
   *
   * @param spellId
   * @return {boolean}
   */
  clear(spellId = null) {
    if (!spellId) {
      return false;
    }

    var curMark = this.find(spellId);

    if (!curMark) {
      return false;
    }

    var curSelection = this.quill.getSelection(),
        delta = new Delta().retain(curMark.index).retain(curMark.length, {mark: false});

    this.quill.updateContents(delta, Quill.sources.SILENT);
    this.quill.setSelection(curSelection);
    delete this.marks[spellId];
  }

  /**
   *
   */
  clearAll() {
    Object.keys(this.marks).forEach(function(spellId) {
      this.clear(spellId);
    }.bind(this));
  }

  /**
   * Generate a unique uid
   * @return {string}
   */
  generateUuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  /**
   * Open a suggestion popup
   * @param spellId
   * @param suggests
   */
  suggestionPopup(spellId,suggests){
    var selection = this.quill.getSelection();
    var cursorPos = this.quill.getBounds(selection.index);
    // Get index + length of the mispelled word
    var spellBlot = this.find(spellId);

    // Create tooltip dom elem if doesnt exist
    var tooltip = document.querySelector(".ql-spellcheck");
    if(!tooltip) {
      tooltip = document.createElement('div');
      tooltip.classList.add("ql-spellcheck");
      tooltip.classList.add("ql-tooltip");
      this.quill.editor.scroll.domNode.parentElement.appendChild(tooltip);
    }

    // Reset tooltip position + concent + visibility
    tooltip.classList.remove("hidden");
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.innerText = "";

    // Fill it
    var suggestElem = null;
    var word = "";
    var delta = null;

    var _suggestClick = function (event) {
      word = event.target.innerText;
      delta = new Delta().retain(spellBlot.index).delete(spellBlot.length).insert(word);
      this.quill.updateContents(delta, Quill.sources.SILENT);
      event.target.off("click.suggested");
      this.closeTooltip();
    };

    for(var i=0; i < suggests.length; i++) {
      suggestElem = document.createElement('span');
      suggestElem.innerText = suggests[i];
      suggestElem.on("click.suggested", _suggestClick.bind(this));
      tooltip.appendChild(suggestElem);
    }
    
    // Position it according to click and stuff
    var shift = 0;
    var left = (cursorPos.left + cursorPos.width/2 - tooltip.offsetWidth/2);
    var top = (cursorPos.top)+50;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    var containerBounds = this.quill.container.getBoundingClientRect();
    var toolTipBounds = tooltip.getBoundingClientRect();
    //Ensure always visible
    if (toolTipBounds.right > containerBounds.right) {
      shift = containerBounds.right - toolTipBounds.right;
      tooltip.style.left = (left + shift - 10) + 'px';
    }
    if (toolTipBounds.left <= containerBounds.left) {
      tooltip.style.left = (containerBounds.left + 3) + 'px';
    }
    if (toolTipBounds.bottom > containerBounds.bottom) {
      tooltip.style.top = (cursorPos.top-10) + 'px';
    }
    this._tooltip = tooltip;
    document.querySelector("body").on("click.tooltip", this.closeTooltip.bind(this));
  }

  /**
   * Close the tooltip and unbind click events
   */
  closeTooltip(){
    this._tooltip.classList.add("hidden");
    document.querySelector("body").off("click.tooltip");
  }

  /**
   * Counting mispelled words according to the list
   */
  countMispells(){
    var text = this.quill.getText();
    var checkedWord = "";
    var regStr="";

    for(var i=0; i<this._mispelled.length;i++){
      checkedWord = this._mispelled[i];
      regStr= regStr? regStr+"|"+checkedWord:""+checkedWord;
    }
    var reg = new RegExp(regStr,"g");
    var count = text.match(reg);
    return count?count.length:0;
  }

  // Get the list of mispelled word positions
  run(editor){
    var misspelled = this.getIndicesOfMispelledWords(editor.getText());
    misspelled.forEach(function (spell) {
      // Mark all the mispelled words
      this.mark({
        index: spell.index,
        length: spell.length,
        suggest: spell.suggest
      });
    }.bind(this));
  }


}
SpellCheck.DEFAULTS = {
  enabled: true
};

Quill.register("modules/spellcheck",SpellCheck);
