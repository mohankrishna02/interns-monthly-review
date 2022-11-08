/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

(function(w) {
  var modules = [];
  var resolvedModules = 0;
  var loadedModules = {};
  var injection = [];
  var loadModule = function(module) {
    module.exec.apply(w, injection);
  };
  var resolve = function() {
    var moduleIndex = 0;
    for (;;) {
      if (moduleIndex >= modules.length) {
        break;
      }
      var module = modules[moduleIndex];
      if (module) {
        var dependencyIndex = 0;
        for (;;) {
          if (!module.after || dependencyIndex >= module.after.length) {
            break;
          }
          var dependency = module.after[dependencyIndex];
          if (dependency && loadedModules[dependency]) {
            module.after[dependencyIndex] = null;
            module.dependencyResolved++;
          }
          dependencyIndex++;

        }
        if (module.after.length === module.dependencyResolved) {
          loadedModules[module.id] = true;
          loadModule(module);
          modules[moduleIndex] = null;
          resolvedModules++;
        } else {
          moduleIndex++;
        }
      } else {
        moduleIndex++;
      }
    }
  };
  var error = function() {
    var text = "Modulum.js: Cyclic dependency detected.\n";
    for (var i = 0, j = 0; i < modules.length; i++) {
      if (modules[i]) {
        text += modules[i].id + " depends on [" + modules[i].after.join(", ") + "]\n";
        j++;
        if (j > 10) {
          text += "[...]";
          break;
        }
      }
    }
    window.critical.display(text);
  };
  var checkLoadedDependencies = function(module) {
    var result = true;
    var deps = module.after,
      i = 0,
      len = deps.length;
    for (; i < len; i++) {
      if (deps[i] && !loadedModules[deps[i]]) {
        result = false;
        break;
      } else {
        deps[i] = null;
        module.dependencyResolved++;
      }
    }
    return result;
  };

  /**
   * @typedef {Function} ModulumExec
   * @param {gbc} arg1
   * @param {classes} arg2
   */

  /**
   *
   * @param {string} module module name
   * @param {string[]|ModulumExec} dependencies module dependencies
   * @param {?ModulumExec=} exec module content
   */
  w.modulum = function(module, dependencies, exec) {
    if (!exec) {
      exec = dependencies;
      dependencies = null;
    }
    var mod = {
      id: module,
      after: dependencies,
      exec: exec,
      dependencyResolved: 0
    };
    if (!mod.after || checkLoadedDependencies(mod)) {
      loadedModules[mod.id] = true;
      loadModule(mod);
      modules.push(null);
      resolvedModules++;
    } else {
      modules.push(mod);
    }
  };

  /**
   *
   * @param {gbc} arg1 gbc context
   * @param {classes} arg2 classes context
   */
  w.modulum.inject = function(arg1, arg2) {
    injection = [arg1, arg2];
  };
  w.modulum.assemble = function() {
    var loaded = resolvedModules;
    while (loaded < modules.length) {
      resolve();
      if (loaded === resolvedModules) {
        error();
        throw new Error("cyclic dependencies");
      }
      loaded = resolvedModules;
    }
  };
})(window);
