var filters = require( './src/filters' ),
    filterList = filters.list;

function setupFilter ( filterName, selector, options ) {
    var el = document.querySelector( selector ),
        effect = filters[ filterName ]( options ),
        css = document.createElement( 'style' ),
        div = document.createElement( 'div' ),
        filter = 'url(#' + effect.id + ');';

    div.setAttribute( 'style', 'height:0!important;width:0!important;overflow:hidden!important;position:absolute;' );
    css.setAttribute( 'type', 'text/css' );
    css.innerText = selector + '{ -moz-filter: ' + filter + ' -webkit-filter: ' + filter + ' filter: ' + filter + ' }';
    div.innerHTML = effect.html;
    div.appendChild( css );
    el.parentNode.insertBefore( div, el );
}

var filtered = {};

filterList.forEach( function( filter ) {
    filtered[ filter ] = setupFilter.bind( null, filter );
} );

module.exports = window.filtered = filtered;