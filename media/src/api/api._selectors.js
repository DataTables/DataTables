


var _pluck = function ( a, prop, prop2 ) {
	var out = [];
	var i=0, ien=a.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if ( prop2 !== undefined ) {
		for ( ; i<ien ; i++ ) {
			out.push( a[i][ prop ][ prop2 ] );
		}
	}
	else {
		for ( ; i<ien ; i++ ) {
			out.push( a[i][ prop ] );
		}
	}

	return out;
};

// Basically the same as _pluck, but rather than looping over `a` we use `order`
// as the indexes to pick from `a`
var _pluck_order = function ( a, order, prop, prop2 )
{
	var out = [];
	var i=0, ien=order.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if ( prop2 !== undefined ) {
		for ( ; i<ien ; i++ ) {
			out.push( a[ order[i] ][ prop ][ prop2 ] );
		}
	}
	else {
		for ( ; i<ien ; i++ ) {
			out.push( a[ order[i] ][ prop ] );
		}
	}

	return out;
};


var _intVal = function ( s ) {
	var integer = parseInt( s, 10 );
	return !isNaN(integer) && isFinite(s) ? integer : null;
};

var _selector_run = function ( selector, select )
{
	var
		out = [], res,
		a, i, ien, j, jen;

	if ( ! $.isArray( selector ) ) {
		selector = [ selector ];
	}

	for ( i=0, ien=selector.length ; i<ien ; i++ ) {
		a = selector[i].split ?
			selector[i].split(',') :
			[ selector[i] ];

		for ( j=0, jen=a.length ; j<jen ; j++ ) {
			res = select( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );

			if ( res && res.length ) {
				out.push.apply( out, res );
			}
		}
	}

	return out;
};

var _selector_opts = function ( opts )
{
	if ( ! opts ) {
		opts = {};
	}

	return {
		filter: opts.filter || 'none',
		order:  opts.order  || 'current',
		page:   opts.page   || 'all'
	};
};

var _range = function ( len )
{
	var out = [];

	for ( var i=0 ; i<len ; i++ ) {
		out.push( i );
	}

	return out;
};



var _selector_first = function ( inst )
{
	// Reduce the API instance to the first item found
	for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
		if ( inst[i].length > 0 ) {
			// Assign the first element to the first item in the instance
			// and truncate the instance and context
			inst[0] = inst[i][0];
			inst.length = 1;
			inst.context = [ inst.context[i] ];

			return inst;
		}
	}

	// Not found - return an empty instance
	inst.length = 0;
	return inst;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Tables
 */

/**
 * Selector for HTML tables. Apply the given selector to the give array of
 * DataTables settings objects.
 *
 * @param {string|integer} [selector] jQuery selector string or integer
 * @param  {array} Array of DataTables settings objects to be filtered
 * @return {array}
 * @ignore
 */
var _table_selector = function ( selector, a )
{
	// Integer is used to pick out a table by index
	if ( typeof selector === 'number' ) {
		return [ a[ selector ] ];
	}

	// Perform a jQuery selector on the table nodes
	var nodes = $.map( a, function (el, i) {
		return el.nTable;
	} );

	return $(nodes)
		.filter( selector )
		.map( function (i) {
			// Need to translate back from the table node to the settings
			var idx = $.inArray( this, nodes );
			return a[ idx ];
		} )
		.toArray();
};



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Rows
 *
 * {}          - no selector - use all available rows
 * {integer}   - row aoData index
 * {node}      - TR node
 * {string}    - jQuery selector to apply to the TR elements
 * {array}     - jQuery array of nodes, or simply an array of TR nodes
 *
 */


var _row_selector_indexes = function ( settings, opts )
{
	var
		i, ien, tmp, a=[],
		displayFiltered = settings.aiDisplay,
		displayMaster = settings.aiDisplayMaster;

	var
		filter = opts.filter,  // none, applied, removed
		order  = opts.order,   // current, index (original - compatibility with 1.9)
		page   = opts.page;    // all, page

	// Current page implies that order=current and fitler=applied, since it is
	// fairly senseless otherwise, regardless of what order and filter actually
	// are
	if ( page == 'current' )
	{
		for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
			a.push( displayFiltered[i] );
		}
	}
	else if ( order == 'current' ) {
		a = filter == 'none' ?
			displayMaster.slice() :                      // no filter
			filter == 'applied' ?
				displayFiltered.slice() :                // applied filter
				$.map( displayMaster, function (el, i) { // removed filter
					return $.inArray( el, displayFiltered ) === -1 ? el : null;
				} );
	}
	else if ( order == 'index' || order == 'original' ) {
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			if ( filter == 'none' ) {
				a.push( i );
			}
			else { // applied | removed
				tmp = $.inArray( i, displayFiltered );

				if ((tmp === -1 && filter == 'removed') ||
					(tmp === 1  && filter == 'applied') )
				{
					a.push( i );
				}
			}
		}
	}

	return a;
};


var _row_selector = function ( settings, selector, opts )
{
	return _selector_run( selector, function ( sel ) {
		var selInt = _intVal( sel );

		// Short cut - selector is a number and no options provided (default is
		// all records, so no need to check if the index is in there, since it
		// must be - dev error if the index doesn't exist).
		if ( selInt !== null && ! opts ) {
			return [ selInt ];
		}

		var rows = _row_selector_indexes( settings, opts );

		if ( ! sel ) {
			// Selector - none
			return rows;
		}
		else if ( selInt && $.inArray( selInt, rows ) !== -1 ) {
			// Selector - integer
			return [ selInt ];
		}

		// Get nodes in the order from the `rows` array (can't use `pluck`) @todo - use pluck_order
		var nodes = [];
		for ( var i=0, ien=rows.length ; i<ien ; i++ ) {
			nodes.push( settings.aoData[ rows[i] ].nTr );
		}

		if ( sel.nodeName ) {
			// Selector - node
			if ( $.inArray( sel, nodes ) !== -1 ) {
				return [ sel._DT_RowIndex ];// sel is a TR node that is in the table
										// and DataTables adds a prop for fast lookup
			}
		}

		// Selector - jQuery selector string, array of nodes or jQuery object/
		// As jQuery's .filter() allows jQuery objects to be passed in filter,
		// it also allows arrays, so this will cope with all three options
		return $(nodes)
			.filter( sel )
			.map( function () {
				return this._DT_RowIndex;
			} )
			.toArray();
	} );
};



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Columns
 *
 * {integer}          - column index
 * "{integer}"        - column index
 * "{integer}:visIdx" - visible column index (i.e. translate to column index)
 * "{string}"         - column name
 * "{string}:jq"      - jQuery selector on column header nodes
 *
 */

// can be an array of these items, comma separated list, or an array of comma
// separated lists

var _re_column_selector = /^(.*):(jq|visIdx)$/;

var _column_selector = function ( settings, selector, opts )
{
	var
		columns = settings.aoColumns,
		names = _pluck( columns, 'sName' ),
		nodes = _pluck( columns, 'nTh' );

	return _selector_run( selector, function ( s ) {
		var selInt = _intVal( s );

		if ( s === '' ) {
			// All columns
			return _range( settings.aoColumns.length );
		}
		else if ( selInt !== null ) {
			// Integer selector
			return [ selInt ];
		}
		else {
			var match = s.match( _re_column_selector );

			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
						// Visible index given, convert to column index
						return [ _fnVisibleToColumnIndex( settings, parseInt( match[1], 10 ) ) ];

					case 'jq':
						// jQuery selector on the TH elements for the columns
						return $( nodes )
							.filter( match[1] )
							.map( function () {
								return $.inArray( this, nodes ); // `nodes` is column index complete and in order
							} )
							.toArray();
				}
			}
			else {
				// match by name. `names` is column index complete and in order
				return $.map( names, function (name, i) {
					return name === s ? i : null;
				} );
			}
		}
	} );
};
