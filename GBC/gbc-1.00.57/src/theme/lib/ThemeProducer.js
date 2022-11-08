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
const
  ThemeDefinitionReader = require("./ThemeDefinitionReader"),
  b64 = require("js-base64").Base64,
  _varName = /\$([a-z0-9_-]+)/ig;

class ThemeProducer {
  static get varName() {return _varName;}
  constructor(baseDefinitionFile){
    this.baseDefinition = new ThemeDefinitionReader(baseDefinitionFile).Definitions;
    this._flattenedVariables = [];
    this._overrides = [];
  }

  static getValue(val, fallback, deprecated){
    if (typeof val === "string") {
      return val || '""';
    }
    if (typeof val === "boolean" || typeof val === "number") {
      return val;
    }
    if (typeof val === "object") {
      return `"b64(${b64.toBase64(JSON.stringify(val))})"`;
    }
    if(fallback) {
      if (typeof fallback === "string") {
        return fallback || '""';
      }
    }
    if(deprecated) {
      return false;
    }
    if(typeof fallback === "undefined") {
      return false;
    }
    return fallback;
  }
  _getVariable(name){
    return this._flattenedVariables.find(v=>v.name===name || v.aliases && v.aliases.indexOf(name) >= 0);
  }
  _getVariableValue(name){
    let variable = this._getVariable(name);
    return variable ? ThemeProducer.getValue(variable.value, variable.defaultValue) : null;
  }
  _reduceValue(val){
    let variable = this._getVariable(val), value = this._getVariableValue(val);
    return variable ? this._reduceValues(variable, value) : `$${val}`;
  }
  _reduceValues(variable, val){
    if(!val && val !== false && val !== 0){
      console.error(`cannot reduce ${variable} value`);
      return val;
    }
    return val.replace ? val.replace(ThemeProducer.varName, (match, name)=>this._reduceValue(name)) : val;
  }
  _expand(def){
    let result = [], colors;
    if (def){
      switch (def.generator){
        case "material-color":
          result.push(def);
          colors = require("./generators/materialColors")(
            def.name,
            def.aliases,
            this._reduceValues(def.name, ThemeProducer.getValue(def.value, def.defaultValue))
          ).map(x=>Object.assign({}, def, x));
          result.push(...colors);
          break;
        case "material-text-color":
          result.push(def);
          colors = require("./generators/materialTextColors")(
            def.name,
            def.aliases,
            this._reduceValues(def.name, ThemeProducer.getValue(def.value, def.defaultValue))
          ).map(x=>Object.assign({}, def, x));
          result.push(...colors);
          break;
        default:
          result.push(def);
      }
    }
    return result;
  }
  _flattenThemeDefinitions(defs, arr) {
    return (defs || []).reduce((prev, next) => {
      prev.push(...this._expand(next));
      if(next.contents) {
        this._flattenThemeDefinitions(next.contents, prev);
      }
      return prev;
    }, arr || []);
  }
  _readDefinitions() {
    return this._flattenThemeDefinitions(this.baseDefinition).filter(x => x.type !== "group");
  }
  setOverrides(...overrides){
    this._overrides = overrides;
  }

  prepare(){
    this._flattenedVariables = this._readDefinitions();
  }

  analyze(filePath, contents, grunt) {
    let fileKeys = Object.keys(contents),
      aliasedDefinitions = this._flattenedVariables.filter(def => def.aliases && def.aliases.length),
      deprecatedAliases = [], undefinedVars = [];
    for (let definition of aliasedDefinitions) {
      for (let alias of definition.aliases) {
        if (fileKeys.indexOf(alias) >= 0) {
          deprecatedAliases.push({alias, name: definition.name});
          fileKeys.splice(fileKeys.indexOf(alias), 1);
        }
      }
    }
    for (let key of fileKeys){
      if(!this._flattenedVariables.find(v=>v.name===key)){
        undefinedVars.push(key);
      }
    }
    if (deprecatedAliases.length|| undefinedVars.length) {
      grunt.log.writeln(`In file ${filePath} :`);
      for (let alias of deprecatedAliases) {
        grunt.log.warn(`  Usage of '${alias.alias}' is deprecated. Use '${alias.name}' instead.`);
      }
      grunt.log.writeln(`  These theme variables are set but not defined in GBC base theme definition: `, grunt.log.wordlist(undefinedVars));
    }
  }

  produce(){
    for(let override of this._overrides){
      for(let name in override){
        let variable = this._getVariable(name);
        if (variable){
          variable.value = override[name];
        } else {
          this._flattenedVariables.push({name, value: override[name]});
        }
      }
    }
    let vars = {};
    for (let {name, value, defaultValue, deprecated} of this._flattenedVariables){
      let val = ThemeProducer.getValue(value, defaultValue, deprecated);
      if(Array.isArray(val)){
        vars[name] = val.map(v=>{
          let reduced = this._reduceValues(name, v);
          return (typeof reduced ==="string") ? `"${reduced}"` : reduced;
        }).join(" ") || "\"\"";
      } else {
        vars[name] = this._reduceValues(name, val);
      }
    }
    for (let {name, aliases} of this._flattenedVariables){
      if(aliases){
        aliases.forEach(alias=>vars[alias] = this._reduceValues(name, `$${name}`));
      }
    }
    return vars;
  }
}
module.exports =  ThemeProducer;