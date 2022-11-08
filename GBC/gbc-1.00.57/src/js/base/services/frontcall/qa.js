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

modulum('FrontCallService.modules.qa', ['FrontCallService'],
  function(context, cls) {
    context.FrontCallService.modules.qa = {

      startqa: function() {
        gbc.qaMode = true;
        return [''];
      },
      getattribute: function(id, name) {
        var element = document.querySelector('[data-aui-id="' + JSON.parse(id).id + '"]');

        if (element) {
          switch (name) {
            case "width":
              return [element.getBoundingClientRect().width];
            case "height":
              return [element.getBoundingClientRect().height];
            case "text":
              var textHolder = element.querySelector(".gbc-label-text-container") ||
                element.querySelector(".gbc_dataContentPlaceholder") || element;
              return [(textHolder.value || textHolder.textContent).trim()];
            case "image":
              var img = element.querySelector("img");
              var cssBg = window.getComputedStyle(element).backgroundImage;
              var urlRegex = /url\("(.*)"\)/.exec(cssBg);
              var url = (urlRegex && urlRegex.length >= 1) ? urlRegex[1] : "";
              return [(img && img.attributes.src.value) ? img.attributes.src.value : url];
            default:
              console.log("getAttribute not supported property:", name);
          }
        }
        console.log("getAttribute", id, name);

        return [''];
      }
    };
  }
);
