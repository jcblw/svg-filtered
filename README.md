# SVG Filtered

Filter html elements by using svg filters on them.

![filterify](https://raw.githubusercontent.com/jcblw/svg-filtered/master/test/before-after.png)

## Installation

    $ npm install svg-filtered

Also you can just use the file `dist/filtered.js` and it will export out a global filtered variable.

## Usage

`filtered[ {name-of-filter} ]( selector[, options ]);`

```html
<img class="inversed-image" src="/cat.gif" alt="cats foo" />
<script src="path-to/filtered.js"></script>
<script>
    filtered.inverse( '.inversed-image' );
</script>
```

Right now there is only three filters ( more coming soon ), or help build one its easy!

- inverse
- blur - you can set the `deviation`
- colorFlood - you can set the `color` to use

This works with [browserify](http://browserify.org)

```
var filtered = require( 'filtered' );

filtered.colorFlood( '.color-me', {
    color: 'tomato'
});
```
