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
let tinycolor = require("tinycolor2");
const baseLight = tinycolor('#ffffff');
const colormultiply = (c1, c2) => {
  let a = tinycolor(c1).toRgb(), b = tinycolor(c2).toRgb();
  return tinycolor({
    r: Math.floor(a.r * b.r / 255),
    g: Math.floor(a.g * b.g / 255),
    b: Math.floor(a.b * b.b / 255),
    a: a.a * b.a
  });
};
const produce = (name, aliases, base) => {
  let baseDark = colormultiply(base, base);
  aliases = aliases || [];
  return [
    {name: `${name}-50`, value: tinycolor.mix(baseLight, base, 12).toHexString(), aliases: aliases.map(n => `${n}-50`)},
    {name: `${name}-100`, value: tinycolor.mix(baseLight, base, 30).toHexString(), aliases: aliases.map(n => `${n}-100`)},
    {name: `${name}-200`, value: tinycolor.mix(baseLight, base, 50).toHexString(), aliases: aliases.map(n => `${n}-200`)},
    {name: `${name}-300`, value: tinycolor.mix(baseLight, base, 70).toHexString(), aliases: aliases.map(n => `${n}-300`)},
    {name: `${name}-400`, value: tinycolor.mix(baseLight, base, 85).toHexString(), aliases: aliases.map(n => `${n}-400`)},
    {name: `${name}-500`, value: tinycolor.mix(baseLight, base, 100).toHexString(), aliases: aliases.map(n => `${n}-500`)},
    {name: `${name}-600`, value: tinycolor.mix(baseDark, base, 87).toHexString(), aliases: aliases.map(n => `${n}-600`)},
    {name: `${name}-700`, value: tinycolor.mix(baseDark, base, 70).toHexString(), aliases: aliases.map(n => `${n}-700`)},
    {name: `${name}-800`, value: tinycolor.mix(baseDark, base, 54).toHexString(), aliases: aliases.map(n => `${n}-800`)},
    {name: `${name}-900`, value: tinycolor.mix(baseDark, base, 25).toHexString(), aliases: aliases.map(n => `${n}-900`)},
    {
      name: `${name}-a100`,
      value: tinycolor.mix(baseDark, null, 15).saturate(80).lighten(65).toHexString(),
      aliases: aliases.map(n => `${n}-a100`)
    },
    {
      name: `${name}-a200`,
      value: tinycolor.mix(baseDark, null, 15).saturate(80).lighten(55).toHexString(),
      aliases: aliases.map(n => `${n}-a200`)
    },
    {
      name: `${name}-a400`,
      value: tinycolor.mix(baseDark, null, 15).saturate(100).lighten(45).toHexString(),
      aliases: aliases.map(n => `${n}-a400`)
    },
    {
      name: `${name}-a700`,
      value: tinycolor.mix(baseDark, null, 15).saturate(100).lighten(40).toHexString(),
      aliases: aliases.map(n => `${n}-a700`)
    }
  ];
};

module.exports = produce;