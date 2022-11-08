/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2019. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

// Authorized font-size (1px -> 100px)
var fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = generateFontSizes(1,100);
Quill.register(fontSizeStyle, true);

// Use this to enable inline style instead of class
var alignStyle = Quill.import('attributors/style/align');
Quill.register(alignStyle, true);

var backgroundStyle = Quill.import('attributors/style/background');
Quill.register(backgroundStyle, true);

var colorStyle = Quill.import('attributors/style/color');
Quill.register(colorStyle, true);

// Adding line height to the possible styles
var Parchment = Quill.import('parchment');
var LineStyle = new Parchment.Attributor.Style('lineheight', 'line-height', {
  scope: Parchment.Scope.INLINE,
  whiteList: ["1","1.42","2","2.5"]
});
Quill.register(LineStyle, true);

// Adding font
var Font = Quill.import('attributors/style/font');
Font.whitelist = ['serif', 'monospace', 'roboto'];
Quill.register(Font, true);