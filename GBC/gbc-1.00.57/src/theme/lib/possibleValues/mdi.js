/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

const fs = require("fs"), path = require("path");
module.exports = function(definition){
  let mdiFile = fs.readFileSync(path.resolve(__dirname, "../../../../node_modules/@mdi/font/scss/_variables.scss"), "utf8"),
    mdiJson = mdiFile
      .replace(/[\s\S]*\$mdi-icons: \(/, "{")
      .replace(/:\s*(\w+)/g, ':"$1"')
      .replace(");", "}");
  definition.possibleValues = Object.keys(JSON.parse(mdiJson));
};