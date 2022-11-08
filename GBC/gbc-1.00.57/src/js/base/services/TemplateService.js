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

modulum('TemplateService', ['InitService'],
  function(context, cls) {

    /**
     * @namespace gbc.TemplateService
     */
    context.TemplateService = context.oo.StaticClass( /** @lends gbc.TemplateService */ {
      __name: "TemplateService",
      _compiled: {},
      _rendered: {},
      init: function() {
        var templateKeys = Object.keys(window.gbcTemplates);
        for (var i = 0; i < templateKeys.length; i++) {
          var templateId = templateKeys[i];
          if (window.gbcTemplates.hasOwnProperty(templateId)) {
            this.registerRawTemplate(templateId, window.gbcTemplates[templateId]);
          }
        }
      },
      /**
       * Registers a new template (string) with the given id.
       * @param id the template id
       * @param template the template text
       */
      registerRawTemplate: function(id, template) {
        if (this._compiled[id]) {
          context.LogService.error("templateService.registerRawTemplate: template id already exists : " + id);
          return;
        }
        this._compiled[id] = template;
      },
      /**
       * Renders a node depending on the given template id.
       * @param templateId the template id to use for rendering
       * @returns string a string of the compiled template given the node and the template id
       */
      renderAs: function(templateId) {
        if (this._compiled.hasOwnProperty(templateId)) {
          return this._compiled[templateId];
        } else {
          return "";
        }
      },
      /**
       * Renders a node depending on the given template id.
       * @param templateId the template id to use for rendering
       * @param ascendance
       * @returns {Node} the compiled template given the node and the template id
       */
      renderDOM: function(templateId, ascendance) {
        if (this._rendered[templateId]) {
          return this._rendered[templateId].cloneNode(true);
        }

        var div = document.createElement('div');
        div.insertAdjacentHTML("beforeend", this.renderAs(templateId));
        var result = div.firstChild;
        var elements = div.querySelectorAll("*"),
          len = elements.length,
          attrNames = ascendance ? ascendance.map(function(item) {
            return "__" + item;
          }) : ["__" + templateId],
          alen = attrNames.length;
        for (var i = 0; i < len; i++) {
          for (var j = 0; j < alen; j++) {
            elements.item(i).setAttribute(attrNames[j], "");
          }
        }
        this._rendered[templateId] = result;
        return result.cloneNode(true);
      }

    });
    context.InitService.register(context.TemplateService);
  });
