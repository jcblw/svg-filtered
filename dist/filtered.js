(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    css.innerHTML = selector + '{ -moz-filter: ' + filter + ' -webkit-filter: ' + filter + ' filter: ' + filter + ' }';
    div.innerHTML = effect.html;
    div.appendChild( css );
    el.parentNode.insertBefore( div, el );
}

var filtered = {};

filterList.forEach( function( filter ) {
    filtered[ filter ] = setupFilter.bind( null, filter );
} );

module.exports = window.filtered = filtered;
},{"./src/filters":4}],2:[function(require,module,exports){

module.exports = require( './src/svg' );
},{"./src/svg":3}],3:[function(require,module,exports){
/*
    tag - a list of tags that gets split into an array
*/

var tags = 'a,altGlyph,altGlyphDef,altGlyphItem,animate,animateColor,animateMotion,animateTransform,circle,clipPath,color-profile,cursor,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,font,font-face,font-face-format,font-face-name,font-face-src,font-face-uri,foreignObject,g,glyph,glyphRef,hkern,image,line,linearGradient,marker,mask,metadata,missing-glyph,mpath,path,pattern,polygon,polyline,radialGradient,rect,script,set,stop,style,svg,switch,symbol,text,textPath,title,tref,tspan,use,view,vkern'.split(',');

/*
    s4 & guid - makes a unique idenifier for elements
*/

function s4( ) {
    return Math.floor( ( 1 + Math.random( ) ) * 0x10000 )
        .toString( 16 )
        .substring( 1 );
}

function guid( ) {
    return s4( ) + s4( ) + '-' + s4( ) + '-' + s4( ) + '-' +
        s4( ) + '-' + s4( ) + s4( ) + s4( );
}

/*
    objToStyle - compiles { key: value } to key:value;
*/

function objToStyles( styles ) {
    var ret = '';
    for ( var prop in styles ) {
        ret += prop + ':' + styles[ prop ] + ';';
    }
    return ret;
}

/*
    objToAttribute - compiles { key: value } to key="value"
*/

function objToAttributes( attributes ) {
    var ret = '',
        value;
    for( var attr in attributes ) {
        value = attr === 'style' ? objToStyles( attributes[ attr ] ) : attributes[ attr ];
        ret += attr + '="' + value + '" ';
    }
    return ret;
}

/*
    mapElementsToHTML - to be use with arr.map with run toHTML of each element
*/

function mapElementsToHTML( elem ) {
    return elem.toHTML();
}

/*
    getElementIndex - get the index of the element in an array
*/

function getElementIndex( elem, arr ) {
    var index = -1;
    arr.forEach( function( _elem, _index ) {
        if ( elem.guid === _elem.guid ) {
            index = _index;
        }
    } );
    return index;
}

/*
    tag - creates an element
*/

// might be best to turn this into a instance
function tag( tagName, _attributes ) {
    var ns = tagName === 'svg' ? 'xmlns="http://www.w3.org/2000/svg" ' : ' ',
        children = [],
        attributes = Object.create( _attributes || {} ),
        styles = {};


    /*
        _elem is the element object
    */

    var _elem = {
        guid: guid(),
        parentNode: null,
        children: children,
        insertBefore: function ( elem, refElem ) {
            var index = getElementIndex( refElem, _elem.children );
            _elem.children.splice( index, 0, elem );
        },
        removeChild: function ( elem ) {
            var index = getElementIndex( elem, children );
            if ( index === -1 ) {
                return;
            }
            children.splice( index, 1 );
        },
        appendChild: function ( elem ) {
            _elem.removeChild( elem ); // remove any old instances
            elem.parentNode = _elem;
            children.push( elem );
        },
        toHTML: function ( ) {
            return '<' + 
                tagName + 
                ' ' + 
                ns + 
                objToAttributes( attributes || {} ) + 
                '>' + 
                children.map( mapElementsToHTML ).join('') +
                '</' +
                tagName +
                '>';
        },
        getAttribute: function( key ) {
            return attributes[ key ];
        },
        setAttribute: function( key, value ) {
            attributes[ key ] = value;
        },
        get attributes ( ) {
            return attributes;
        },
        get outerHTML () {
            return _elem.toHTML();
        },
        get innerHTML () {
            return children.map( mapElementsToHTML ).join('');
        },
        set innerText ( value ) {
            children.length = 0; // empty array
            children.push({
                // this need to be a better solution
                toHTML: function(){
                    return value;
                }
            })
        }
    };

    return _elem;
}

/*
    runs and returns an object with all the tagNames eg. vsvg.style()
*/

module.exports = ( function() {
    var methods = {};
    tags.forEach( function( tagName ) {
        methods[ tagName ] = tag.bind( null, tagName );
    } );
    return methods;
}( ) );
},{}],4:[function(require,module,exports){
var vsvg = require( 'vsvg' );


// returns svg filter
var filters = {
    colorFlood: function( options ) {
        var svg = vsvg.svg({
                height: 0
            }),
            defs = vsvg.defs(),
            filter = vsvg.filter({
                class: 'colorFlood',
                x: '0%',
                y: '0%',
                width: '100%',
                height: '100%'
            }),
            feFlood = vsvg.feFlood({
                'flood-color': options.color,
                result: 'A'
            }),
            feColorMatrix = vsvg.feColorMatrix({
                type: 'matrix',
                in: 'SourceGraphic',
                result: 'B',
                values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0'
            }),
            feMerge = vsvg.feMerge({}),
            feMergeNode0 = vsvg.feMergeNode({
                in: 'A'
            }),
            feMergeNode1 = vsvg.feMergeNode({
                in: 'B'
            }),
            id;

        filter.appendChild( feFlood );
        filter.appendChild( feColorMatrix );
        filter.appendChild( feMerge );
        feMerge.appendChild( feMergeNode0 );
        feMerge.appendChild( feMergeNode1 );
        defs.appendChild( filter );
        svg.appendChild( defs );
        svg.setAttribute( 'version', '1.1' );
        id = 'filter-' + filter.guid;
        filter.setAttribute( 'id', id );

        return {
            id: id,
            html: svg.toHTML()
        };
    },
    blur: function( options ) {
        var svg = vsvg.svg({
                height: 0
            }),
            defs = vsvg.defs(),
            filter = vsvg.filter(),
            feGaussianBlur = vsvg.feGaussianBlur({
                stdDeviation: options.deviation || 4
            }),
            id;

        filter.appendChild( feGaussianBlur );
        defs.appendChild( filter );
        svg.appendChild( defs );
        svg.setAttribute( 'version', '1.1' );
        id = 'filter-' + filter.guid;
        filter.setAttribute( 'id', id );

        return {
            id: id,
            html: svg.toHTML()
        };
    },
    inverse: function() {
        var svg = vsvg.svg({
                height: 0
            }),
            _invert = {
                type: 'table',
                tableValues: '1 0'
            },
            defs = vsvg.defs(),
            filter = vsvg.filter(),
            feComponentTransfer = vsvg.feComponentTransfer(),
            feFuncR = vsvg.feFuncR( _invert ),
            feFuncG = vsvg.feFuncG( _invert ),
            feFuncB = vsvg.feFuncB( _invert ),
            id;
        
        feComponentTransfer.appendChild( feFuncR );
        feComponentTransfer.appendChild( feFuncG );
        feComponentTransfer.appendChild( feFuncB );
        filter.appendChild( feComponentTransfer );
        defs.appendChild( filter );
        svg.appendChild( defs );
        svg.setAttribute( 'version', '1.1' );
        id = 'filter-' + filter.guid;
        filter.setAttribute( 'id', id );

        return {
            id: id,
            html: svg.toHTML()
        };
    },
};

filters.list = Object.keys( filters );

module.exports = filters;
},{"vsvg":2}]},{},[1]);
