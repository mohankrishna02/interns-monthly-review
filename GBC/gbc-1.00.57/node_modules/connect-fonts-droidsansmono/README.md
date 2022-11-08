# connect-fonts-droidsansmono

Droid Sans Mono fontpack for [connect-fonts](https://github.com/shane-tomlinson/connect-fonts).

## Usage

1. Include [connect-fonts](https://github.com/shane-tomlinson/connect-fonts) in a node module.
```js
const font_middleware = require("connect-fonts");
```

2. Include the font packs that you want to serve.
```js
const font_pack  = require("connect-fonts-droidsansmono");
```

3. Add a middleware by calling the `setup` function.
```js
    app.use(font_middleware.setup({
      fonts: [ font_pack ],
      allow_origin: "https://exampledomain.com"
    }));
```

4. Add a link tag to include the font CSS.
```html
<link href="/droidsansmono/fonts.css" type="text/css" rel="stylesheet"/ >
```


Available fonts:
* droidsansmono

Locale-optimised font sets can be served by specifying the locale in the fonts.css URL.
```html
<link href="/latin/droidsansmono/fonts.css" type="text/css" rel="stylesheet"/ >
```

Available subsets:
* latin

5. Set your CSS up to use the new font by using the "Droid Sans Mono" font-family.
```
    body {
      font-family: 'Droid Sans Mono', 'sans-serif', 'serif';
    }
```

## Font Info
Droid Sans Mono

* Description: Droid Sans is a humanist sans serif typeface designed for user interfaces and electronic communication.
* Copyright: Digitized data copyright © 2007, Google Corporation.
* Trademark: Droid is a trademark of Google and may be registered in certain jurisdictions.
* Designer URL: http://www.ascendercorp.com/typedesigners.html 
* Vendor: Ascender Corporation
* Vendor URL: http://www.ascendercorp.com/

## Development Info
* Homepage: https://github.com/shane-tomlinson/connect-fonts-droidsansmono
* Repo: https://github.com/shane-tomlinson/connect-fonts-droidsansmono.git
* Bugs: https://github.com/shane-tomlinson/connect-fonts-droidsansmono/issues

## Author
* Shane Tomlinson
* shane@shanetomlinson.com
* stomlinson@mozilla.com
* set117@yahoo.com
* https://shanetomlinson.com
* https://github.com/shane-tomlinson
* @shane_tomlinson


## License

Software: Licenced under version 2.0 of the MPL

  https://www.mozilla.org/MPL/

Fonts: Licensed under version 2.0 of the Apache

  http://www.apache.org/licenses/LICENSE-2.0

