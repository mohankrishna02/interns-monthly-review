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
const fs = require("fs"), path = require("path"), glob = require("glob");

class ThemeDefinitionReader{
  constructor(baseDefinitionFile) {
    this.definitions = ThemeDefinitionReader._loadDefinitions(baseDefinitionFile);
    ThemeDefinitionReader._prepareDefinitions(this.definitions, 1);
  }
  get Definitions(){
    return this.definitions;
  }

  static _prepareDefinitions(def, level) {
    if(!def) {
      return;
    }
    if(Array.isArray(def)) {
      def.forEach(item => ThemeDefinitionReader._prepareDefinitions(item, level));
      return;
    }
    def._level = level;
    if(def.type === "group") {
      ThemeDefinitionReader._prepareDefinitions(def.contents, level + 1);
      return;
    }

    let match = /array(?:<(.+)>)?/.exec(def.type);
    if(match && match[1]){
      try {
        require("./possibleValues/"+match[1])(def);
      } catch (e){}
    } else {
      try {
        require("./possibleValues/"+def.type)(def);
      } catch (e){}
    }
  }

  static _readJSONSync(file){
    let result = [];
    try {
      let content = fs.readFileSync(file, "utf8");
      try {
        result = JSON.parse(content);
      } catch (e) {
        console.warn("Malformed json file", file);
      }
    } catch(e){
      console.warn("Cannot read file", file);
    }
    return result;
  }
  static _loadDefinitionsPart(contents, baseDefinitionFile){

    if (!contents){return contents;}
    if (Array.isArray(contents)){return contents.map(c=>ThemeDefinitionReader._loadDefinitionsPart(c, baseDefinitionFile));}
    if (!contents.contents){return contents;}
    if (Array.isArray(contents.contents)){contents.contents = contents.contents.map(c=>ThemeDefinitionReader._loadDefinitionsPart(c, baseDefinitionFile));}
    else {
      let dir = path.dirname(baseDefinitionFile), globbing = glob.sync(contents.contents, {cwd:dir});
      contents.contents = globbing.map(f=>ThemeDefinitionReader._loadDefinitions(path.join(dir, f)));
    }

    return contents;
  }

  static _loadDefinitions(baseDefinitionFile){
    let mainFile = path.resolve(__dirname, baseDefinitionFile);
    let contents = ThemeDefinitionReader._readJSONSync(mainFile);
    contents = ThemeDefinitionReader._loadDefinitionsPart(contents, baseDefinitionFile);
    return contents;
  }
}

module.exports = ThemeDefinitionReader;