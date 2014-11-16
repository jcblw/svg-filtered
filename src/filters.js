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