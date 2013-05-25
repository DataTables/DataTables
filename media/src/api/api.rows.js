

(/** @lends <global> */function() {

var _api = DataTable.Api;





/**
 *
 */
_api.register( 'rows()', function ( selector, opts ) {
	// argument shifting
	if ( selector === undefined ) {
		selector = '';
	}
	else if ( $.isPlainObject( selector ) ) {
		opts = selector;
		selector = '';
	}

	opts = _selector_opts( opts );

	var inst = this.iterator( 'table', function ( settings ) {
		return _row_selector( settings, selector, opts );
	} );

	// Want argument shifting here and in _row_selector?
	inst.selector.rows = selector;
	inst.selector.opts = opts;

	return inst;
} );


_api.registerPlural( 'rows().nodes()', 'row().node()' , function () {
	return this.iterator( 'row', function ( settings, row ) {
		// use pluck order on an array rather - rows gives an array, row gives it individually
		return settings.aoData[ row ].nTr || undefined;
	} );
} );


_api.register( 'rows().data()', function ( data ) {
	return this.iterator( true, 'rows', function ( settings, rows ) {
		return _pluck_order( settings.aoData, rows, '_aData' );
	} );
} );


_api.registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
	return this.iterator( 'row', function ( settings, row ) {
		_fnInvalidateRow( settings, row, src );
	} );
} );


_api.registerPlural( 'rows().index()', 'row().index()', function ( src ) {
	return this.iterator( 'row', function ( settings, row ) {
		return row;
	} );
} );


_api.registerPlural( 'rows().remove()', 'row().remove()', function () {
	var that = this;

	return this.iterator( 'row', function ( settings, row, thatIdx ) {
		var data = settings.aoData;

		data.splice( row, 1 );

		// Update the _DT_RowIndex parameter on all rows in the table
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			if ( data[i].nTr !== null ) {
				data[i].nTr._DT_RowIndex = i;
			}
		}

		// Remove the target row from the search array
		var displayIndex = $.inArray( row, settings.aiDisplay );
		settings.asDataSearch.splice( displayIndex, 1 );

		// Delete from the display arrays
		_fnDeleteIndex( settings.aiDisplayMaster, row );
		_fnDeleteIndex( settings.aiDisplay, row );
		_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes

		// Check for an 'overflow' they case for displaying the table
		_fnLengthOverflow( settings );
	} );
} );


_api.register( 'rows.add()', function ( rows ) {
	var newRows = this.iterator( 'table', function ( settings ) {
			var row, i, ien;
			var out = [];

			for ( i=0, ien=rows.length ; i<ien ; i++ ) {
				row = rows[i];

				if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
					out.push( _fnAddTr( settings, row )[0] );
				}
				else {
					out.push( _fnAddData( settings, row ) );
				}
			}

			return out;
		} );

	// Return an Api.rows() extended instance, so rows().nodes() etc can be used
	var modRows = this.rows( -1 );
	modRows.pop();
	modRows.push.apply( modRows, newRows );

	return modRows;
} );





/**
 *
 */
_api.register( 'row()', function ( selector, opts ) {
	return _selector_first( this.rows( selector, opts ) );
} );


_api.register( 'row().data()', function ( data ) {
	var ctx = this.context;

	if ( data === undefined ) {
		// Get
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ]._aData :
			undefined;
	}

	// Set
	ctx[0].aoData[ this[0] ]._aData = data;

	// Automatically invalidate
	_fnInvalidateRow( ctx[0], this[0], 'data' );

	return this;
} );


_api.register( 'row.add()', function ( row ) {
	// Allow a jQuery object to be passed in - only a single row is added from
	// it though - the first element in the set
	if ( row instanceof $ && row.length ) {
		row = row[0];
	}

	var rows = this.iterator( 'table', function ( settings ) {
		if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
			return _fnAddTr( settings, row )[0];
		}
		return _fnAddData( settings, row );
	} );

	// Return an Api.rows() extended instance, with the newly added row selected
	return this.row( rows[0] );
} );



}());

