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

var _VMFocus = false;

/**
 * Genero API definition,
 */

var onICHostReady = function (version) {
  if(version !== "debug" && version !== "standalone"){
    // Remove logging in normal mode
    window.console.log = function () {};
    window.console.warn = function () {};
    window.console.debug = function () {};
  }

  // Create richtext Object with spellchecker
  var richtext = new Richtext();
  window.richtext = richtext;

  // If you wish to use the standalone mode, call onICHostReady("standalone") from your browser console
  if(version === "standalone"){
    window.gICAPI = {
      SetFocus: function() { console.log("gICAPI.setFocus()");},
      SetData: function(dataStr) { console.log("gICAPI.setData(\""+dataStr+"\")");},
      Action: function(actionName) { console.log("gICAPI.action(\""+actionName+"\")");},
      version: '1.0' // Legacy, but mostly not used
    };
    window.richtext.enable(true);
    window.richtext.displayToolBar(true);
    window.richtext.enableToolBar(true);
    window.richtext.setToolbarItems("aligncenter alignjustify alignleft alignnone alignright bold bullist code linespacing color fontselect fontsizeselect formatselect indent insert image italic numlist outdent redo removeformat strikethrough styleselect underline undo");
  }

  /**
   * Genero gICAPI onProperty
   * Called when a property is created/updated
   * @param {string|object} property : mostlikely String or json formatted property dict
   */
	gICAPI.onProperty = function(property) {
    console.log("[FglRichtext] : ("+richtext.__id+") gICAPI.onProperty");
    var jsonProperty = {};
    try {
      jsonProperty = JSON.parse(property);
    }
    catch (e) {
      jsonProperty = property;
    }

    // Toolbar case
    if (jsonProperty.toolbar) {
      if(["show","hide"].indexOf(jsonProperty.toolbar)>=0){
        // Handle toolbar show / hide
        richtext.displayToolBar(jsonProperty.toolbar !== "hide");
      }
      else {
        // Handle toolbar items
        richtext.setToolbarItems(jsonProperty.toolbar);
        richtext.displayToolBar(true);
      }
    }

    // Cursor case : not used, since VM doesn't handle it
    if(jsonProperty.cursors){
      var cursors = {
        start: jsonProperty.cursors.cursor ,
        end: jsonProperty.cursors.cursor2
      };
      richtext.setSelection(cursors.start, cursors.end);
    }

    // notEditable case : could be boolean or "0" / "1"
    if(jsonProperty.noteditable){
      var notEditable = jsonProperty.noteditable;
      // Convert value into real boolean before calling richtext api
      notEditable = notEditable === "0"? false : !!notEditable;
      richtext.setEditable(!notEditable);
    }

    // SpellChecker case
    if (jsonProperty.spellcheck) {
      richtext.setSpellChecker(jsonProperty.spellcheck);
    }

    // Autoflush case
    // jshint ignore:start
    if (jsonProperty.autoflush) {
      richtext.setAutoFlush(jsonProperty.autoflush, jsonProperty.autoflush_interval || 10); // default interval is set to 10s
    }

    // Setting the default font
    if (jsonProperty.font_family) {
      richtext.setFontFamily(jsonProperty.font_family);
    }
    // Setting the default font size
    if (jsonProperty.font_size) {
      richtext.setFontSize(jsonProperty.font_size);
    }

    // Setting the toolbar labels
    if (jsonProperty.labels_toolbar_tooltips) {
      richtext.setToolbarLabel("tooltips", JSON.parse(jsonProperty.labels_toolbar_tooltips));
    }
    if (jsonProperty.labels_toolbar_link) {
      richtext.setToolbarLabel("link", JSON.parse(jsonProperty.labels_toolbar_link));
    }
    if (jsonProperty.labels_toolbar_linespacing){
      richtext.setToolbarLabel("lineSpacing", JSON.parse(jsonProperty.labels_toolbar_linespacing));
    }
    if (jsonProperty.labels_toolbar_formatselect){
      richtext.setToolbarLabel("formatSelect", JSON.parse(jsonProperty.labels_toolbar_formatselect));
    }


    // jshint ignore:end
  };

  /**
   * Genero gICAPI onFocus
   * Called when the VM focus/blur the webcomponent widget
   * @param polarity
   */
	gICAPI.onFocus = function(polarity) {
    _VMFocus = polarity;
    console.log("[FglRichtext] : ("+richtext.__id+") gICAPI.onFocus : ",polarity);
    if(polarity /*&& !richtext.hasFocus()*/) {
      richtext.focus();
    }
	};

  /**
   * Genero gICAPI onData
   * Called when a the VM set the data of the webcomponent
   * @param data
   */
	gICAPI.onData = function (data) {
	  console.log("[FglRichtext] : ("+richtext.__id+") gICAPI.onData");
	  richtext.setServerData(data);
	  if(data !== richtext.getHtml()) {
      //empty editor first
      richtext.setHtmlContent(data);
      richtext.getToolBar().historyClear();
    }
	};

  /**
   * Genero gICAPI onStateChanged
   * Called when the form displayType changed
   * @param strParams {string}
   */
	gICAPI.onStateChanged = function(strParams) {
    console.log("[FglRichtext] : ("+richtext.__id+") gICAPI.onStateChanged");
    var params = JSON.parse(strParams);
    richtext.enable(!!params.active);
	};

  /**
   * Genero gICAPI onFlushData
   * Called when the VM request a data update
   */
  gICAPI.onFlushData = function() {
    console.log("[FglRichtext] : ("+richtext.__id+") gICAPI.onFlushData");
    var html = richtext.getHtml();
    gICAPI.SetData(html);
  };

  // When the user click/type in the editor, request focus to the VM
  richtext.getEditor().on('selection-change', function (range, oldRange, source) {
    console.log("[FglRichtext] : ("+richtext.__id+") on Editor focused");
    if(!_VMFocus){
      gICAPI.SetFocus();
    }
  });

  // Use the editing property to prevent VM to erase currently typed text
  richtext.getEditor().on('editor-change', function (evt, oldD,newD, source) {
    richtext.setEditing(source !== "api"); // not editing if the source is not a user
    if(!richtext._editable && evt === "text-change" && !richtext._rollbackInProgress){
      richtext.rollback();
    }
  });

  // When the user click in the editor, request focus to the VM
  var body = document.querySelector("body");
  body.on('mousedown', function () {
    console.log("[FglRichtext] : ("+richtext.__id+") on body clicked");
    if(!_VMFocus){
      gICAPI.SetFocus();
    }
  });

};
