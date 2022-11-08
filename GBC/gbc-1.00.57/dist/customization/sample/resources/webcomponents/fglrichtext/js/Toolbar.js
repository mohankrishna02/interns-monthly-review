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
 * Toolbar class to access functionality of the toolbar
 */
var Toolbar = Class({
  constructor: function(options) {
    this.selector = (options && options.selector)? options.selector:"#toolbar";
    this.element = null;
    this.module = null;
    this._richtext = null;
  },

  /**
   * Bind the given quill module to the instance of toolbar
   * @param quillModule
   */
  bindQuillModule: function (quillModule) {
    this.module = quillModule;
    this._undoRedoBindings();

    this.addCustomPicker("lineheight", {
      label: '<i class="fa fa-align-justify"></i><i class="fa fa-arrows-v"></i>',
      chooseItem: function (itemVal, quill) {}
    });
  },

  /**
   * Bind the richtext instance to the toolbar
   * @param richtext
   */
  bindRichtext: function (richtext) {
    this._richtext = richtext;
  },

  /**
   * Get the toolbar Element
   * @return {null|*}
   */
  getElement: function(){
    this.element = document.querySelector(".ql-toolbar");
    return this.element;
  },

  /**
   * Change state of the toolbar
   * @param {boolean} enabled - true will make the toolbar usable, false will disable it
   */
  enable: function(enabled){
    var tbElem = this.getElement();
    if(enabled && tbElem && tbElem.hasClass("disabled")){
      tbElem.classList.remove("disabled");
    }
    else if(!enabled){
      tbElem.classList.add("disabled");
    }
  },

  /**
   * Update the font-size list with the new 'normal size'
   * @param {number} size - font size in px
   */
  updateFontSizeList: function(size){
    var selected = this.element.querySelector('select#fontsizeselect option[selected]');
    if(selected){
      selected.removeAttribute("selected");
    }
    var toSelect = this.element.querySelector('select#fontsizeselect option[value="'+size+'px"]');
    if(toSelect){
      toSelect.setAttribute("selected","");
    }
    var fontSizeSelectedLabel = this.element.querySelector('#fontsizeselect .ql-picker-label');
    if(fontSizeSelectedLabel) {
      fontSizeSelectedLabel.setAttribute("data-label", size.toString() );
      fontSizeSelectedLabel.setAttribute("data-value", size + 'px');
    }
  },

  /**
   * Select the right fontFamily in the list
   * @param {String} fontFamily - name of the font family
   */
  selectFontFamily: function(fontFamily){
    var currentItem = this.element.querySelector('.ql-font .ql-picker-options .ql-selected');
    var newSelectedItem = this.element.querySelector('.ql-font .ql-picker-options [data-value="'+fontFamily.toLowerCase()+'"]');

    if(newSelectedItem) {
      currentItem.classList.remove("ql-selected");
      newSelectedItem.classList.add("ql-selected");
    }
    var label = this.element.querySelector('.ql-font .ql-picker-label');
    label.setAttribute("data-value",fontFamily.toLowerCase());

    var selectFont = this.element.querySelector('select.ql-font option[value="'+fontFamily.toLowerCase()+'"]');
    var selectFontselected = this.element.querySelector('select.ql-font option[selected]');
    selectFontselected.removeAttribute("selected");
    selectFont.setAttribute("selected","");
  },

  /**
   * Defines the items of the toolbar
   * @param {Array} items - array of strings describing all available items
   */
  setItems: function(items){
    var tbItem = null;
    var tbCustomItem = null;
    var selector = "";

    // Hide all tb elements first
    var visible = document.querySelectorAll('.visible');
    for(var v=0;v<visible.length;v++){
      visible[v].classList.remove("visible");
    }

    // Show selected items
    items.forEach(function (t) {
      // Get quill equivalent of genero toolbar items
      var itemName = generoToolbarsAccepted[t];
      var items = itemName? itemName.split(";"):[];
      for(var i=0; i<items.length;i++){
        selector = ".ql-" + items[i];
        tbCustomItem = document.querySelector(".custom-"+items[i]);
        tbItem = tbCustomItem || document.querySelector(selector);
        if (tbItem) {
          tbItem.classList.add("visible");
          tbItem.parentElement.classList.add("visible");
        }
      }
    });

    if(items.indexOf("emoji")>=0){
      // Open the picker, and place it correctly
      this.addCustomButton("emoji",function (evt) {
        this._richtext.getEditor().container.querySelector(".textarea-emoji-control").click();
        var picker = this._richtext.getEditor().container.querySelector("#textarea-emoji");
        var pickerleft =  evt.clientX - (picker.clientWidth /2);
        pickerleft = pickerleft>=0? pickerleft:0;
        if(pickerleft< (this._richtext.getEditor().container.clientWidth - picker.clientWidth)){
          picker.style.left = pickerleft+ "px";
        }
        this._richtext.getEditor().container.querySelector("#tab-panel").classList.add("native");
        this._richtext.getEditor().container.querySelector("#textarea-emoji");
      });
    }
  },

  /**
   * Change visibility of the toolbar
   * @param {boolean} visibility - true to make it visible, false otherwise
   */
  show: function(visibility){
    var tbElem = this.getElement();
    if(visibility && tbElem && tbElem.hasClass("hidden")){
      tbElem.classList.remove("hidden");
    }
    else if(!visibility){
      tbElem.classList.add("hidden");
    }
  },

  /**
   * Handler to call to define undo and redo actions
   * @private
   */
  _undoRedoBindings: function () {
    var undoButton = document.querySelector("#toolbar .ql-undo");
    var redoButton = document.querySelector("#toolbar .ql-redo");

    var _refreshButtons = function () {
      var stack = this.module.quill.history.stack;
      undoButton.classList.remove("disabled");
      redoButton.classList.remove("disabled");

      if(stack.undo.length<=0){
        undoButton.classList.add("disabled");
      }
      if(stack.redo.length<=0){
        redoButton.classList.add("disabled");
      }
    }.bind(this);

    undoButton.addEventListener("click",function () {
      this.module.quill.history.undo();
      _refreshButtons();
    }.bind(this));

    redoButton.addEventListener("click",function () {
      this.module.quill.history.redo();
      _refreshButtons();
    }.bind(this));

    this.module.quill.on('text-change', _refreshButtons.bind(this));
  },

  /**
   * Clear history of the Editor (mostly when server sent new data)
   */
  historyClear: function(){
    window.requestAnimationFrame(function () {
      this.module.quill.history.clear();
      document.querySelector("#toolbar .ql-undo").classList.add("disabled");
      document.querySelector("#toolbar .ql-redo").classList.add("disabled");
    }.bind(this));
  },

  /**
   * Use this method to add a custom button to the toolbar
   * @param {string} name - button name
   * @param {function} f - callback once click on the button
   */
  addCustomButton: function (name,f) {
    var buttonElem = this.getElement().querySelector(".ql-"+name);
    buttonElem.addEventListener('click', f.bind(this));
  },

  /**
   * Use this method to add a custom picker to the toolbar
   * @param {string} name - button name
   * @param {object} o - callback once click on the button
   */
  addCustomPicker: function (name,o) {
    var pickerElem = this.getElement().querySelector(".ql-"+name);
    // Set the label if any
    if(o.label) {
      pickerElem.querySelector(".ql-picker-label").innerHTML = o.label;
    }
    else {
      pickerElem.querySelector(".ql-picker-label").innerText = name;
    }
    var quill = this.module.quill;

    var _itemClicked = function(){
      var value = this.getAttribute("data-value");
      o.chooseItem(value, quill);
    };

    // Set item labels
    var options =  pickerElem.querySelectorAll(".ql-picker-item");
    for(var i=0; i<options.length; i++){
      options[i].innerText = options[i].getAttribute("data-label");
      options[i].addEventListener('click', _itemClicked);
    }
  },


  /**
   * Define tooltips of toolbar item
   * @param {Object} items
   */
  setTooltips: function (items) {
    var keys = Object.keys(items);
    var elem = null;
    keys.forEach(function (tbItem) {
      elem = document.querySelector('[data-item="'+tbItem+'"]');
       if(elem){
         elem.setAttribute("title", items[tbItem]);
       }
    });
  },

  /**
   * Set Link label
   * @param {Object} labels - Json obj with all necessary info
   */
  setLinkLabel: function(labels) {
    var defaultLabels = {
      "save":"Save",
      "label":"Enter link",
      "edit":"Edit link",
      "visit":"Visit link",
      "remove":"Remove"
    };
    defaultLabels = window.copyObject(defaultLabels, labels);

    // Remove any style element if any
    var styleElem =document.getElementById("styleLink");
    if(styleElem){
      document.body.removeChild(styleElem);
    }
    //need to create dynamic style
    var style = document.createElement("style");
    style.setAttribute("id","styleLink");
    style.innerHTML = '.ql-snow .ql-tooltip[data-mode=link]::before { content: "'+defaultLabels.label+'";}'+
        '.ql-snow .ql-tooltip.ql-editing a.ql-action::after { content: "'+defaultLabels.save+'"}' +
        '.ql-snow .ql-tooltip a.ql-action::after { content: "'+defaultLabels.edit+'"}'+
    '.ql-snow .ql-tooltip::before { content: "'+defaultLabels.visit+':";}'+
    '.ql-snow .ql-tooltip a.ql-remove::before { content: "'+defaultLabels.remove+'"};';
    document.body.appendChild(style);
  },

  /**
   * Define labels for line-spacing property
   * @param {Object} labels - Json obj with all necessary info
   */
  setLineSpacingLabel: function(labels) {
    var defaultLabels = {
      "small": "Small",
      "normal": "Normal",
      "large":" Large",
      "huge": "Huge"
    };
    defaultLabels = window.copyObject(defaultLabels, labels);
    var labelKeys = Object.keys(defaultLabels);
    var items = document.querySelectorAll('.ql-lineheight .ql-picker-item[data-label]');

    var item = null;
    for(var i=0;i< items.length;i++){
      item = items[i];
      if(labelKeys.indexOf(item.getAttribute("data-label").toLowerCase())>=0) {
        item.innerText = defaultLabels[item.getAttribute("data-label").toLowerCase()];
      }
    }
  },

  /**
   * Define labels for Heading
   * @param {Object} labels - Json obj with all necessary info
   */
  setFormatSelectLabel: function (labels) {
    // Get selected Format
    var selectedFormat = document.querySelector("select.ql-header option[selected]");
    document.querySelector(".ql-header .ql-picker-label").removeAttribute("data-label");
    document.querySelector
    (".ql-header .ql-picker-label").removeAttribute("data-value");
    if(selectedFormat){
      var pickerLabel = document.querySelector('.ql-header .ql-picker-label');
      pickerLabel.setAttribute("data-label", labels.heading + " " + pickerLabel.getAttribute("data-value") );
    }
    var items = document.querySelectorAll('.ql-header .ql-picker-item');

    var headingIndex = 1;
    for(var i=0; i<items.length; i++){
      if(items[i].getAttribute("data-value").length>0) {
        items[i].setAttribute("data-label", labels.heading + " " + headingIndex);
      }
      headingIndex++;
    }
    if(selectedFormat){
      document.querySelector(".ql-header .ql-picker-label").setAttribute("data-label", selectedFormat.innerText);
    }
  },
});

// if the same genero item design multiple things, use ';'
var generoToolbarsAccepted = {
  "aligncenter" : "align[value='center']",
  "alignjustify" : "align[value='justify']",
  "alignleft" : "align[value='']",
  "alignnone": "align[value='']",
  "alignright": "align[value='right']",
  "bold": "bold",
  "bullist": "list[value='bullet']",
  //"code": "code-block",
  "color": "color;background",
  "emoji": "emoji",
  "fontselect": "font",
  "fontsizeselect": "size",
  "formatselect": "header",
  "image": "image",
  "indent": "indent[value='+1']",
  "insert": "link",
  "italic": "italic",
  "numlist": "list[value='ordered']",
  "outdent": "indent[value='-1']",
  "redo": "redo",
  "removeformat": "clean",
  "strikethrough": "strike",
  "styleselect": "styleselect",
  //"table",
  "underline": "underline",
  "undo": "undo",
  "linespacing": "lineheight"
};
