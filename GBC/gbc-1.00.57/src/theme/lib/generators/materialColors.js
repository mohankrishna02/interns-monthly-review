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

const produce = (name, aliases) => {
  aliases = aliases || [];
  return [
    {name: `${name}-50`, value: `material-palette($${name}, "50")`, aliases: aliases.map(n => `${n}-50`)},
    {name: `${name}-100`, value: `material-palette($${name}, "100")`, aliases: aliases.map(n => `${n}-100`)},
    {name: `${name}-200`, value: `material-palette($${name}, "200")`, aliases: aliases.map(n => `${n}-200`)},
    {name: `${name}-300`, value: `material-palette($${name}, "300")`, aliases: aliases.map(n => `${n}-300`)},
    {name: `${name}-400`, value: `material-palette($${name}, "400")`, aliases: aliases.map(n => `${n}-400`)},
    {name: `${name}-500`, value: `$${name}`, aliases: aliases.map(n => `${n}-500`)},
    {name: `${name}-600`, value: `material-palette($${name}, "600")`, aliases: aliases.map(n => `${n}-600`)},
    {name: `${name}-700`, value: `material-palette($${name}, "700")`, aliases: aliases.map(n => `${n}-700`)},
    {name: `${name}-800`, value: `material-palette($${name}, "800")`, aliases: aliases.map(n => `${n}-800`)},
    {name: `${name}-900`, value: `material-palette($${name}, "900")`, aliases: aliases.map(n => `${n}-900`)},
    {name: `${name}-a100`, value: `material-palette($${name}, "a100")`, aliases: aliases.map(n => `${n}-a100`)},
    {name: `${name}-a200`, value: `material-palette($${name}, "a200")`, aliases: aliases.map(n => `${n}-a200`)},
    {name: `${name}-a400`, value: `material-palette($${name}, "a400")`, aliases: aliases.map(n => `${n}-a400`)},
    {name: `${name}-a700`, value: `material-palette($${name}, "a700")`, aliases: aliases.map(n => `${n}-a700`)}
  ];
};

module.exports = produce;
