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

/**
 * Class Richtext to access functionality of Quill's editor
 */
var Richtext = Class({
  constructor: function(options) {
    this.__id = uuid();
    this._editingTimer = null;
    this._editing = false;
    this._editable = true;
    this._globalStyle = {};
    this._keyBoardBindings = null;
    this._notBubbledKeys = ["tab", "shift+tab", "enter", "return"];

    this._toolbar = new Toolbar({selector: "#toolbar"});
    var quillModules = {
      toolbar: this._toolbar.selector,
      // jshint ignore:start
      toolbar_emoji: true,
      textarea_emoji:true
      // jshint ignore:end
    };
    this._parser = new HtmlParser();
    if(options && options.spellcheck){
      quillModules.spellcheck=true;
    }

    quillModules.history = true;

    this._editor = new Quill('#editor', {
      modules: quillModules,
      theme: 'snow'
    });
    this._toolbar.bindQuillModule(this._editor.getModule('toolbar'));
    this._toolbar.bindRichtext(this);

    var keyboard = this._editor.getModule("keyboard");
    this._keyBoardBindings  = window.copyObject({}, keyboard.bindings);

    this.webcomponentProperties = {};
    this._autoFlushInterval = null;

    this._editor.container.setAttribute("uuid",this.__id);

    // Capture all keys, prevent anything but navigation if not editable
    document.querySelector('.ql-editor').on("keydown",function(e){
      var keyString = window.translateKeys(e);

      if(!this._editable) {
        var allowedKeys= ["home", "end", "left", "right", "up", "down", "shift+left", "shift+right", "ctrl+c","meta+c","ctrl+a","meta+a"];
        if (allowedKeys.indexOf(keyString)<0) {
          // block keys
          e.preventDefault();
        }
      }

      // Prevent specified keys to bubble to GBC (i.e: 'Tab')
      if(this._notBubbledKeys.indexOf(keyString)>=0){
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    }.bind(this));

  },

  /**
   * Set the data received from the server side
   * @param {string} data - value set by the server side
   */
  setServerData: function (data) {
    this._serverData = data;
  },

  /**
   * Check if the value type by the user is the same as the server side
   * @return {boolean} - true if data is different, false otherwise
   */
  isDirty:function(){
    return this._serverData !== this.getHtml();
  },


  /**
   * Get the Quill Editor
   */
  getEditor: function(){
    return this._editor;
  },

  /**
   * Get Html content of the editor
   * @return {String} html content
   */
  getHtml: function() {
    var delta = this._editor.getContents();
    delta = this.addGlobalStyle(delta);
    delta = this._cleanDelta(delta);
    var qdc = new window.QuillDeltaToHtmlConverter(delta.ops, window.opts_ || {});
    return qdc.convert();
  },

  /**
   * Set the content of the editor
   * @param htmlData {String} data to set, html formatted
   * @param force {Boolean} don't check if editing
   */
  setHtmlContent: function(htmlData, force){
    if(!this._editing || force) {
      this._editor.setContents();
      this._parser.setHtml(htmlData);
      //this._editor.container.querySelector(".ql-editor").innerHTML = this._parser.parse();
      var parsedData = this._parser.parse();
      // Use this to prevent Quill editor to udate content on Blot mutation
      this._editor.pasteHTML(0, parsedData);
    }
  },

  /**
   * Rollback to server value
   */
  rollback: function () {
    this._rollbackInProgress = true;
      this.setHtmlContent(this._serverData, true);
      window.setTimeout(function () {
        this._rollbackInProgress = false;
      }.bind(this),50);


  },

  /**
   * Clear the content of the editor
   */
  clearContent: function () {
    this._editor.setContents();
  },

  /**
   * Enable/disable the richtext editor
   * @param enabled {Boolean} true to enable, false otherwise
   */
  enable: function(enabled){
    this._enabled = enabled;
    this._editor.enable(enabled);
    this.enableToolBar(enabled);
  },

  /**
   * Search into the given misspelled words and highlight them in the richtext
   */
  spellCheckThis: function() {
    if(this.serverSpellChecker){
      this.serverSpellChecker.run(this._editor);
    }
  },

  /**
   * Defines if the richtext is editable or not
   * @param {boolean} editable
   */
  setEditable: function(editable){
    this._editable = editable;
    var keyboard = this._editor.getModule("keyboard");

    if(!editable){
      // remove key bindings from quilljs
      keyboard.bindings[13] = []; // Enter
      keyboard.bindings[8] = []; // Backspace
      keyboard.bindings[9] = []; // Tab
      keyboard.bindings[46] = []; //Suppr
    }
    else {
      // Restore keys
      keyboard.bindings = window.copyObject({}, this._keyBoardBindings);
    }
  },

  /**
   * Set a text selection
   * @param start {Number} selection start
   * @param end {Number} selection end
   */
  setSelection: function(start,end){
    this._editor.setSelection(start, end);
  },

  /**
   * Get the current selection
   *
   */
  getSelection: function(){
    return this._editor.getSelection();
  },

  /**
   * Check if editor has focus
   * @return {Boolean} true if has focus, false otherwise
   */
  hasFocus: function(){
    return !!this._editor.hasFocus();
  },

  /**
   * Request visual focus in the editor
   */
  focus: function() {
    try {
      this._editor.focus();
    } catch (e) {
      
    }
  },

  /**
   * Get the toolbar object
   * @return {Toolbar}
   */
  getToolBar: function () {
    return this._toolbar;
  },

  /**
   * Display / hide the toolbar
   * @param visibility {Boolean}
   */
  displayToolBar: function(visibility) {
    this._toolbar.show(visibility);
  },

  /**
   * Enable the toolbar
   * @param enabled {Boolean}
   */
  enableToolBar: function(enabled) {
   this._toolbar.enable(enabled);
  },

  /**
   * Defines the toolbar items
   * @param items {String}
   */
  setToolbarItems: function(items) {
    // clean the property
    this.webcomponentProperties.toolbar = items.replace(new RegExp("/([\s\|])+/", "gm"), " ").replace(/\|/g," ").split(" ");
    this._toolbar.setItems(this.webcomponentProperties.toolbar);
  },

  /**
   * Defines the toolbar tooltips
   * @param labelName {String}
   * @param items {Object}
   */
  setToolbarLabel: function(labelName, items) {
    switch(labelName){
      case "tooltips":
        this._toolbar.setTooltips(items);
        break;
      case "link":
        this._toolbar.setLinkLabel(items);
        break;
      case "lineSpacing":
        this._toolbar.setLineSpacingLabel(items);
        break;
      case "formatSelect":
        this._toolbar.setFormatSelectLabel(items);
        break;
    }
  },

  /**
   * Will set the serverSpellChecker
   * @param {String} enable - spellchecker type : none, browser, server
   */
  setSpellChecker: function (enable) {
    // Type 'browser'
    if(enable !== "none" && enable === "browser"){
      this._editor.container.setAttribute("spellcheck","true");
      this.serverSpellChecker = null;
      this._editor.off('text-change.spellcheck');
    }
    // Type 'server' : Disable native spellchecking (not used for now)
    else if (enable !== "none" && enable === "server") {
      this.serverSpellChecker = this._editor.getModule('spellcheck');
      if(!this.serverSpellChecker){
        console.warn("[FglRichtext]: SpellChecker module not found");
        return false;
      }
      this._editor.container.setAttribute("spellcheck","false");
      this._editor.on('text-change.spellcheck', this.spellCheckThis.bind(this));
    }
    // Type 'none' : disable all spelling options
    else if(enable === "none"){
      this._editor.container.setAttribute("spellcheck","false");
      this.serverSpellChecker = null;
      this._editor.off('text-change.spellcheck');
    }
    else{
      throw new Error("Property '"+enable+"' is not a valid spellcheck definition");
    }
  },

  /**
   * Execute an action every n second
   * @param {string} actionName - 4GL action name
   * @param {number|string} interval - delay between action trigger in second(s)
   */
  setAutoFlush: function(actionName, interval){
    interval = parseInt(interval||10,10); // force integer, set to 10 if undefined
    if(interval === 0 && this._autoFlushInterval){
      window.clearTimeout(this._autoFlushInterval);
    }
    this._autoFlushInterval = window.setInterval(function () {
      // Check if any modification: then send action
      if(this._enabled && this.isDirty()) {
        gICAPI.Action(actionName);
      }
    }.bind(this),interval*1000);
  },


  /**
   * Define the default fontsize of the richtext if not specified
   * @param {number|String} size - font size
   */
  setFontSize: function(size){
    if(typeof (size) === "string"){
      if(size.indexOf("px")<0){
        size = 13;
      }
      else {
        size = parseInt(size,10);
      }
    }

    this._globalStyle.size = size+"px";
    this._editor.root.style.fontSize = size+"px";
    //adjust list of available values
    this._toolbar.updateFontSizeList(size);
  },

  /**
   * Define the default font of the richtext
   * @param {string} font - font family name
   */
  setFontFamily: function(fontFamily){
    this._globalStyle.fontFamily = fontFamily;
    this._editor.root.style.fontFamily = fontFamily;
    this._toolbar.selectFontFamily(fontFamily);
  },

  /**
   * Set the richtext as editing to prevent unwanted value erase
   * @param {boolean} edit
   */
  setEditing: function(edit){
    this._editing = edit;
    if(this._editingTimer){
      window.clearTimeout(this._editingTimer);
    }
    this._editingTimer = window.setTimeout(function () {
      this._editing = false;
    }.bind(this),500);
  },

  /**
   * Add global style to each delta if needed
   * @param delta
   * @return {*}
   */
  addGlobalStyle: function (delta) {
    var globalStyles = Object.keys(this._globalStyle);

    // Each style declared as global should be applied to all delta (if delta does not have it already)
    globalStyles.forEach(function (styleName) {
      delta.forEach(function(d){
         if(d && d.attributes && !d.attributes[styleName] ){
           d.attributes[styleName] = this._globalStyle[styleName];
         }
      }.bind(this));
    }.bind(this));
    return delta;
  },

  /**
   * Clean delta of unecessary items
   * @param delta
   * @return {*}
   * @private
   */
  _cleanDelta: function (delta) {
    if(delta.ops.length > 1 && delta.ops[delta.ops.length-1]){
      var last = delta.ops[delta.ops.length-1];
      if(last.insert && last.insert === "\n" && !last.attributes){
        delta.ops[delta.ops.length-1]="";
      }
    }
    return delta;
  }


});