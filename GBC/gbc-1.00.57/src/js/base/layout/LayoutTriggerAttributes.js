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

modulum("LayoutTriggerAttributes",
  function(context, cls) {

    /**
     * Nodes which imply a relayout. Used in 'add' and 'remove' command type
     * @type {Object}
     */
    var nodesWhichRelayout = {
      "Button": true,
      "HLine": true,
      "Label": true,
      "Image": true,
      "Message": true,
      "Folder": true,
      "Form": true,
      "Group": true,
      "Grid": true,
      "HBox": true,
      "Screen": true,
      "Stack": true,
      "VBox": true,
      "Window": true,
      "ScrollArea": true,
      "ScrollGrid": true,
      "UserInterface": true,
      "Action": true,
      "Dialog": true,
      "Menu": true,
      "MenuAction": true,
      "Table": true,
      "FormField": true,
      "Matrix": true,
      "Item": true
    };

    /**
     * Nodes which imply a relayout. Used in 'add' and 'remove' command type
     * @type {Object}
     */
    var attributesWhichRelayout = {
      height: true,
      hidden: true,
      minHeight: true,
      minWidth: true,
      pageSize: true, // relayout should be done only for ScrollGrid
      sample: true,
      sizePolicy: true,
      splitter: true,
      width: true,
      windowStyle: true,
      size: true // relayout should be done only for Table
    };

    /**
     * Enum of all VM attributes which imply relayout
     * @namespace classes.LayoutTriggerAttributes
     */
    cls.LayoutTriggerAttributes = {
      "add": nodesWhichRelayout,
      "remove": nodesWhichRelayout,
      "update": attributesWhichRelayout
    };
    Object.freeze(cls.LayoutTriggerAttributes);
  });
