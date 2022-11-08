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
    {name: `${name}-100`, value: `change-color($${name}, $alpha: 1)`, aliases: aliases.map(n => `${n}-100`)},
    {name: `${name}-87`, value: `change-color($${name}, $alpha: 0.87)`, aliases: aliases.map(n => `${n}-87`)},
    {name: `${name}-54`, value: `change-color($${name}, $alpha: 0.54)`, aliases: aliases.map(n => `${n}-54`)},
    {name: `${name}-26`, value: `change-color($${name}, $alpha: 0.26)`, aliases: aliases.map(n => `${n}-26`)},
    {name: `${name}-12`, value: `change-color($${name}, $alpha: 0.12)`, aliases: aliases.map(n => `${n}-12`)},
    {name: `${name}-0`, value: `change-color($${name}, $alpha: 0)`, aliases: aliases.map(n => `${n}-0`)}
  ];
};

module.exports = produce;